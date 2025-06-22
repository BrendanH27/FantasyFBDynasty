import { getDbConnection } from './db';
import fetch from 'node-fetch';
import csv from 'csv-parser';
import * as fs from 'fs';
import * as path from 'path';

const season = 2024;
const csvUrl = `https://github.com/nflverse/nflverse-data/releases/download/player_stats/player_stats_${season}.csv`;
const tempCsvPath = path.join(__dirname, `temp_stats_${season}.csv`);

export async function db_setup() {
  const db = await getDbConnection();

  await db.exec(`
    CREATE TABLE IF NOT EXISTS players (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );
  `);

  await db.run(`INSERT INTO players (name) VALUES (?), (?)`, ['Kyle Pitts', 'Tom Brady']);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS fantasy_stats (
      player_id TEXT,
      player_name TEXT,
      team TEXT,
      position TEXT,
      week INTEGER,
      season INTEGER,
      fantasy_points REAL
    );
  `);

  importFantasyStats().catch(console.error);
  console.log('Database setup complete.');
}

async function downloadCsvFile(url: string, dest: string): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch CSV: ${res.statusText}`);
  const fileStream = fs.createWriteStream(dest);
  await new Promise<void>((resolve, reject) => {
    res.body.pipe(fileStream);
    res.body.on("error", (err) => reject(err));
    fileStream.on("finish", () => resolve());
  });
}


async function importFantasyStats(): Promise<void> {
  const db = await getDbConnection();
  await downloadCsvFile(csvUrl, tempCsvPath);

  const insert = await db.prepare(`
    INSERT INTO fantasy_stats (player_id, player_name, team, position, week, season, fantasy_points)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  return new Promise((resolve, reject) => {
    fs.createReadStream(tempCsvPath)
      .pipe(csv())
      .on("data", async (row) => {
        try {
          await insert.run(
            row.gsis_id || row.player_id || null,
            row.player_name,
            row.recent_team,
            row.position,
            parseInt(row.week),
            parseInt(row.season),
            parseFloat(row.fantasy_points || "0")
          );
        } catch (err) {
          console.error("Insert error:", err);
        }
      })
      .on("end", async () => {
        await insert.finalize();
        fs.unlinkSync(tempCsvPath);
        console.log("Fantasy stats imported successfully.");
        resolve();
      })
      .on("error", reject);
  });
}
