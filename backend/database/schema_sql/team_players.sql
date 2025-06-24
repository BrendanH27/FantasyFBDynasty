
    CREATE TABLE IF NOT EXISTS team_players (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        team_id INTEGER NOT NULL,
        player_id INTEGER NOT NULL,
        contract_value INTEGER,
        contract_years INTEGER,
        acquired_date TEXT,
        status TEXT,
        draft_pick_id INTEGER,
        FOREIGN KEY (team_id) REFERENCES teams(id),
        FOREIGN KEY (player_id) REFERENCES players(id)
    );
    