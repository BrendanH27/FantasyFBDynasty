-- League 1 - Season 2025 Draft Picks (2 rounds, 2 teams)

-- Round 1
INSERT INTO draft_picks (league_id, team_id, season, round, pick_number, original_team_id, used_on_player_id)
VALUES (1, 1, 2025, 1, 1, 1, 889); -- Pick 1 by Team 1 (Round 1, Pick 1)

INSERT INTO draft_picks (league_id, team_id, season, round, pick_number, original_team_id, used_on_player_id)
VALUES (1, 2, 2025, 1, 2, 2, 206); -- Pick 2 by Team 2 (Round 1, Pick 2)

-- Round 2 (snake)
INSERT INTO draft_picks (league_id, team_id, season, round, pick_number, original_team_id, used_on_player_id)
VALUES (1, 2, 2025, 2, 3, 2, 1133); -- Pick 3 by Team 2 (Round 2, Pick 1)

INSERT INTO draft_picks (league_id, team_id, season, round, pick_number, original_team_id, used_on_player_id)
VALUES (1, 1, 2025, 2, 4, 1, 116); -- Pick 4 by Team 1 (Round 2, Pick 2)

-- League 2 has no picks because it's not full
