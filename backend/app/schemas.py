from __future__ import annotations

from pydantic import BaseModel, Field, field_validator, model_validator


class TeamMixRequest(BaseModel):
    names: list[str] = Field(min_length=2)
    team_size: int = Field(ge=1)
    previous_signature: str | None = None

    @field_validator("names")
    @classmethod
    def validate_names(cls, names: list[str]) -> list[str]:
        cleaned_names = [name.strip() for name in names if name and name.strip()]
        if len(cleaned_names) < 2:
            raise ValueError("You must provide at least two valid names")

        lowered_names = [name.casefold() for name in cleaned_names]
        if len(lowered_names) != len(set(lowered_names)):
            raise ValueError("Names must be unique")

        return cleaned_names

    @model_validator(mode="after")
    def validate_team_size(self) -> "TeamMixRequest":
        required_players = self.team_size * 2
        if len(self.names) < required_players:
            raise ValueError("Not enough names for the selected team size")
        return self


class TeamMixResponse(BaseModel):
    team_a: list[str]
    team_b: list[str]
    reserves: list[str]
    signature: str

