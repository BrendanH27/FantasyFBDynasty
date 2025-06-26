
    CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        league_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        team_id INTEGER,
        target_team_id INTEGER,
        player_id INTEGER,
        draft_pick_id INTEGER,
        description TEXT,
        timestamp TEXT NOT NULL,
        metadata TEXT,
        FOREIGN KEY (league_id) REFERENCES leagues(id),
        FOREIGN KEY (team_id) REFERENCES teams(id),
        FOREIGN KEY (target_team_id) REFERENCES teams(id),
        FOREIGN KEY (player_id) REFERENCES players(id),
        FOREIGN KEY (draft_pick_id) REFERENCES draft_picks(id)
    );
    