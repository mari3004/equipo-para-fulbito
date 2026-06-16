import { buildTeamsInBrowser } from "./teamMixer";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

export const buildTeams = async ({ players, teamSize, previousSignature }) => {
  if (!API_URL) {
    return {
      ...buildTeamsInBrowser({ players, teamSize, previousSignature }),
      source: "local",
    };
  }

  try {
    const response = await fetch(`${API_URL}/api/teams/mix`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        names: players,
        team_size: teamSize,
        previous_signature: previousSignature,
      }),
    });

    if (!response.ok) {
      throw new Error("Backend unavailable");
    }

    const payload = await response.json();
    return {
      teamA: payload.team_a,
      teamB: payload.team_b,
      reserves: payload.reserves,
      signature: payload.signature,
      source: "backend",
    };
  } catch (error) {
    return {
      ...buildTeamsInBrowser({ players, teamSize, previousSignature }),
      source: "local",
    };
  }
};

