import { useEffect, useState } from "react";
import { buildTeams } from "./lib/teamService";

const STORAGE_KEY = "team-mixer-session";

const loadInitialState = () => {
  try {
    const rawState = sessionStorage.getItem(STORAGE_KEY);
    if (!rawState) {
      return {
        players: [],
        teamSize: 1,
        currentMix: null,
        mixSource: "local",
      };
    }

    return JSON.parse(rawState);
  } catch (error) {
    return {
      players: [],
      teamSize: 1,
      currentMix: null,
      mixSource: "local",
    };
  }
};

const App = () => {
  const [playerName, setPlayerName] = useState("");
  const [error, setError] = useState("");
  const [isMixing, setIsMixing] = useState(false);
  const [state, setState] = useState(loadInitialState);

  const { players, teamSize, currentMix, mixSource } = state;

  const maxTeamSize = Math.max(1, Math.floor(players.length / 2));

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const clearSessionState = () => {
      sessionStorage.removeItem(STORAGE_KEY);
    };

    window.addEventListener("beforeunload", clearSessionState);
    return () => window.removeEventListener("beforeunload", clearSessionState);
  }, []);

  useEffect(() => {
    if (teamSize <= maxTeamSize) {
      return;
    }

    setState((currentState) => ({
      ...currentState,
      teamSize: maxTeamSize,
      currentMix: null,
    }));
  }, [maxTeamSize, teamSize]);

  const addPlayer = () => {
    const cleanedName = playerName.trim();
    if (!cleanedName) {
      setError("Escribe un nombre antes de agregar.");
      return;
    }

    const duplicatedPlayer = players.some(
      (registeredPlayer) => registeredPlayer.toLowerCase() === cleanedName.toLowerCase(),
    );

    if (duplicatedPlayer) {
      setError("Ese nombre ya fue cargado.");
      return;
    }

    setState((currentState) => ({
      ...currentState,
      players: [...currentState.players, cleanedName],
      currentMix: null,
    }));
    setPlayerName("");
    setError("");
  };

  const removePlayer = (playerToRemove) => {
    setState((currentState) => ({
      ...currentState,
      players: currentState.players.filter((player) => player !== playerToRemove),
      currentMix: null,
    }));
    setError("");
  };

  const clearAll = () => {
    setState({
      players: [],
      teamSize: 1,
      currentMix: null,
      mixSource: "local",
    });
    setPlayerName("");
    setError("");
  };

  const handleMix = async () => {
    if (players.length < teamSize * 2) {
      setError("No hay suficientes personas para el tamano elegido.");
      return;
    }

    setIsMixing(true);
    setError("");

    try {
      const result = await buildTeams({
        players,
        teamSize,
        previousSignature: currentMix?.signature,
      });

      setState((currentState) => ({
        ...currentState,
        currentMix: result,
        mixSource: result.source,
      }));
    } catch (mixError) {
      setError("No se pudieron armar los equipos.");
    } finally {
      setIsMixing(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    addPlayer();
  };

  return (
    <main className="page-shell">
      <section className="hero-card">
        <div className="hero-copy">
          <span className="eyebrow">React + Python</span>
          <h1>Armador de equipos al azar</h1>
          <p>
            Carga personas, elige cuantas van por equipo y genera dos grupos nuevos cada vez que
            pulses el boton.
          </p>
        </div>
        <div className="hero-note">
          <strong>{players.length}</strong>
          <span>personas cargadas</span>
        </div>
      </section>

      <section className="layout-grid">
        <article className="panel">
          <div className="panel-heading">
            <h2>Personas</h2>
            <button type="button" className="ghost-button" onClick={clearAll} disabled={!players.length}>
              Limpiar todo
            </button>
          </div>

          <form className="add-form" onSubmit={handleSubmit}>
            <input
              type="text"
              value={playerName}
              onChange={(event) => setPlayerName(event.target.value)}
              placeholder="Escribe un nombre"
              aria-label="Nombre de persona"
            />
            <button type="submit">Agregar</button>
          </form>

          {error ? <p className="error-box">{error}</p> : null}

          <ul className="players-list">
            {players.map((player) => (
              <li key={player}>
                <span>{player}</span>
                <button type="button" onClick={() => removePlayer(player)}>
                  Quitar
                </button>
              </li>
            ))}
          </ul>

          {!players.length ? (
            <p className="empty-state">Todavia no cargaste personas.</p>
          ) : null}
        </article>

        <article className="panel">
          <div className="panel-heading">
            <h2>Configuracion</h2>
            <span className="tag">{mixSource === "backend" ? "Backend Python" : "Modo navegador"}</span>
          </div>

          <label className="field-block" htmlFor="team-size">
            Cantidad por equipo
          </label>
          <select
            id="team-size"
            value={teamSize}
            onChange={(event) =>
              setState((currentState) => ({
                ...currentState,
                teamSize: Number(event.target.value),
                currentMix: null,
              }))
            }
          >
            {Array.from({ length: maxTeamSize }, (_, index) => index + 1).map((option) => (
              <option key={option} value={option}>
                {option} por equipo
              </option>
            ))}
          </select>

          <button
            type="button"
            className="mix-button"
            onClick={handleMix}
            disabled={isMixing || players.length < teamSize * 2}
          >
            {isMixing ? "Armando..." : "Armar equipos"}
          </button>

          <p className="helper-text">
            Si existe otra combinacion posible, el siguiente armado evitara repetir la mezcla
            anterior.
          </p>

          <div className="teams-grid">
            <div className="team-card team-a">
              <h3>Equipo A</h3>
              <ul>
                {currentMix?.teamA?.length ? (
                  currentMix.teamA.map((player) => <li key={`a-${player}`}>{player}</li>)
                ) : (
                  <li>Sin sorteo todavia</li>
                )}
              </ul>
            </div>

            <div className="team-card team-b">
              <h3>Equipo B</h3>
              <ul>
                {currentMix?.teamB?.length ? (
                  currentMix.teamB.map((player) => <li key={`b-${player}`}>{player}</li>)
                ) : (
                  <li>Sin sorteo todavia</li>
                )}
              </ul>
            </div>
          </div>

          <div className="reserves-card">
            <h3>Suplentes</h3>
            {currentMix?.reserves?.length ? (
              <ul className="reserves-list">
                {currentMix.reserves.map((player) => (
                  <li key={`reserve-${player}`}>{player}</li>
                ))}
              </ul>
            ) : (
              <p>No hay suplentes en este armado.</p>
            )}
          </div>
        </article>
      </section>
    </main>
  );
};

export default App;
