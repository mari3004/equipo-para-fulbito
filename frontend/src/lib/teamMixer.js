const buildSignature = (teamA, teamB, reserves) => {
  const normalizedTeams = [
    [...teamA].sort((left, right) => left.localeCompare(right)),
    [...teamB].sort((left, right) => left.localeCompare(right)),
  ]
    .map((team) => team.join("|"))
    .sort((left, right) => left.localeCompare(right));

  const normalizedReserves = [...reserves].sort((left, right) => left.localeCompare(right));

  return `${normalizedTeams.join("||")}##${normalizedReserves.join("|")}`;
};

const shuffle = (players) => {
  const copy = [...players];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
};

export const buildTeamsInBrowser = ({
  players,
  teamSize,
  previousSignature,
  maxAttempts = 40,
}) => {
  if (teamSize < 1) {
    throw new Error("La cantidad por equipo debe ser mayor a cero.");
  }

  if (players.length < teamSize * 2) {
    throw new Error("No hay suficientes personas para armar dos equipos.");
  }

  let lastMix = null;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const shuffled = shuffle(players);
    const requiredPlayers = teamSize * 2;
    const teamA = shuffled.slice(0, teamSize);
    const teamB = shuffled.slice(teamSize, requiredPlayers);
    const reserves = shuffled.slice(requiredPlayers);
    const signature = buildSignature(teamA, teamB, reserves);

    lastMix = { teamA, teamB, reserves, signature };

    if (!previousSignature || signature !== previousSignature) {
      return lastMix;
    }
  }

  return lastMix;
};

