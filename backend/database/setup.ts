import { getDbConnection } from './db';

export async function db_setup() {
  const db = await getDbConnection();

  await db.exec(`
    CREATE TABLE IF NOT EXISTS players (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );
  `);

  await db.run(`INSERT INTO players (name) VALUES (?), (?)`, ['Kyle Pitts', 'Tom Brady']);

  console.log('Database setup complete.');
}

