
    CREATE TABLE IF NOT EXISTS league_memberships (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        league_id INTEGER NOT NULL,
        role TEXT NOT NULL,
        team_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (league_id) REFERENCES leagues(id),
        FOREIGN KEY (team_id) REFERENCES teams(id)
    );
    