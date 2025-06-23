
    CREATE TABLE IF NOT EXISTS players (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT,
        last_name TEXT,
        nflverse_id TEXT,
        position TEXT,
        nfl_team TEXT,
        age INTEGER
    );
    