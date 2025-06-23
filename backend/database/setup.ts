import { getDbConnection } from './db';
import fetch from 'node-fetch';
import csv from 'csv-parser';
import fs from 'fs/promises';
import path from 'path';
import { importPlayers } from './testData';

const season = 2025;
const PLAYER_CSV_URL = 'https://github.com/nflverse/nflverse-data/releases/download/player_info/player_ids.csv';
const LOCAL_CSV = path.join(__dirname, 'temp_players.csv');

export async function db_setup() {
  const db = await getDbConnection();

  //drop all tables
   const tables = await db.all(`
    SELECT name FROM sqlite_master 
    WHERE type='table' AND name NOT LIKE 'sqlite_%';
  `);

  for (const { name } of tables) {
    await db.exec(`DROP TABLE IF EXISTS ${name};`);
    console.log(`Dropped table: ${name}`);
  }

  //setup all tables
  const schemaDir = path.resolve(__dirname, 'schema_sql');
  const files = await fs.readdir(schemaDir);

  const sqlFiles = files.filter(file => file.endsWith('.sql'));

  for (const file of sqlFiles) {
    const filePath = path.join(schemaDir, file);
    const sql = await fs.readFile(filePath, 'utf-8');
    try {
      await db.exec(sql);
      console.log(`Executed ${file}`);
    } catch (err) {
      console.error(`Error executing ${file}:`, err);
    }
  }

 //test data
 await importPlayers();


  console.log('Database setup complete.');
}
