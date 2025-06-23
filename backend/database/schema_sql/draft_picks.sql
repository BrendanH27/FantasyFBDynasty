
    CREATE TABLE IF NOT EXISTS draft_picks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        league_id INTEGER NOT NULL,
        team_id INTEGER NOT NULL,
        season INTEGER NOT NULL,
        round INTEGER NOT NULL,
        original_team_id INTEGER,
        used_on_player_id INTEGER,
        FOREIGN KEY (league_id) REFERENCES leagues(id),
        FOREIGN KEY (team_id) REFERENCES teams(id),
        FOREIGN KEY (original_team_id) REFERENCES teams(id),
        FOREIGN KEY (used_on_player_id) REFERENCES players(id)
    );
    