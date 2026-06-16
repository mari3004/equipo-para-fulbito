from __future__ import annotations

from dataclasses import dataclass
from random import SystemRandom


_RNG = SystemRandom()


@dataclass(frozen=True)
class TeamMixResult:
    team_a: list[str]
    team_b: list[str]
    reserves: list[str]
    signature: str


def build_mix_signature(team_a: list[str], team_b: list[str], reserves: list[str]) -> str:
    normalized_teams = [
        "|".join(sorted(team_a, key=str.casefold)),
        "|".join(sorted(team_b, key=str.casefold)),
    ]
    normalized_teams.sort(key=str.casefold)
    normalized_reserves = "|".join(sorted(reserves, key=str.casefold))
    return "||".join(normalized_teams) + f"##{normalized_reserves}"


def build_random_teams(
    names: list[str],
    team_size: int,
    previous_signature: str | None = None,
    max_attempts: int = 40,
) -> TeamMixResult:
    if team_size < 1:
        raise ValueError("team_size must be at least 1")

    cleaned_names = [name.strip() for name in names if name and name.strip()]
    required_players = team_size * 2
    if len(cleaned_names) < required_players:
        raise ValueError("Not enough names to build two teams with that size")

    last_result: TeamMixResult | None = None

    for _ in range(max_attempts):
        shuffled = cleaned_names[:]
        _RNG.shuffle(shuffled)

        team_a = shuffled[:team_size]
        team_b = shuffled[team_size:required_players]
        reserves = shuffled[required_players:]
        signature = build_mix_signature(team_a, team_b, reserves)
        last_result = TeamMixResult(
            team_a=team_a,
            team_b=team_b,
            reserves=reserves,
            signature=signature,
        )

        if not previous_signature or signature != previous_signature:
            return last_result

    return last_result or TeamMixResult([], [], [], "")

