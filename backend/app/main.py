from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.schemas import TeamMixRequest, TeamMixResponse
from backend.app.team_builder import build_random_teams


app = FastAPI(
    title="Team Mixer API",
    version="1.0.0",
    description="Builds two random teams from a list of names.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/teams/mix", response_model=TeamMixResponse)
def mix_teams(payload: TeamMixRequest) -> TeamMixResponse:
    result = build_random_teams(
        names=payload.names,
        team_size=payload.team_size,
        previous_signature=payload.previous_signature,
    )
    return TeamMixResponse(
        team_a=result.team_a,
        team_b=result.team_b,
        reserves=result.reserves,
        signature=result.signature,
    )

