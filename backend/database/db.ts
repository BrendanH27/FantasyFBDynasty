import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

// Open the database
export async function getDbConnection() {
  const db = await open({
    filename: path.resolve(__dirname, 'fantasy_db.db'),
    driver: sqlite3.Database,
  });
  return db;
}
