
    CREATE TABLE IF NOT EXISTS leagues (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        available_spots INTEGER,
        settings TEXT,
        commissioner_id INTEGER,
        FOREIGN KEY (commissioner_id) REFERENCES users(id)
    );
    