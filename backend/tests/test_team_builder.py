import unittest

from backend.app.team_builder import build_random_teams


class TeamBuilderTests(unittest.TestCase):
    def test_builds_two_complete_teams_and_reserves(self) -> None:
        result = build_random_teams(
            names=["Ana", "Luis", "Marta", "Pedro", "Sofia"],
            team_size=2,
        )

        self.assertEqual(len(result.team_a), 2)
        self.assertEqual(len(result.team_b), 2)
        self.assertEqual(len(result.reserves), 1)

    def test_avoids_previous_mix_when_another_combination_exists(self) -> None:
        players = ["Ana", "Luis", "Marta", "Pedro"]
        first_mix = build_random_teams(names=players, team_size=2)
        second_mix = build_random_teams(
            names=players,
            team_size=2,
            previous_signature=first_mix.signature,
            max_attempts=200,
        )

        self.assertNotEqual(first_mix.signature, second_mix.signature)

    def test_rejects_invalid_team_size(self) -> None:
        with self.assertRaises(ValueError):
            build_random_teams(names=["Ana", "Luis"], team_size=2)


if __name__ == "__main__":
    unittest.main()

