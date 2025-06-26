
    CREATE TABLE IF NOT EXISTS teams (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        league_id INTEGER NOT NULL,
        owner_id INTEGER NOT NULL,
        location TEXT,
        name TEXT,
        cap_space INTEGER,
        FOREIGN KEY (league_id) REFERENCES leagues(id),
        FOREIGN KEY (owner_id) REFERENCES users(id)
    );
    