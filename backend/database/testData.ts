import { getDbConnection } from './db';
import fetch from 'node-fetch';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';

const PLAYER_CSV_URL = 'https://github.com/nflverse/nflverse-data/releases/download/players/players.csv';
const LOCAL_CSV = path.join(__dirname, 'temp_players.csv');

// Paremeters for test data
const allowedPositions = new Set(['QB', 'HB', 'WR', 'TE', 'K']);
const maxAge = 45;

async function downloadCsv(url: string, dest: string): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download CSV: ${res.statusText}`);
  const stream = fs.createWriteStream(dest);
  await new Promise<void>((resolve, reject) => {
    res.body.pipe(stream);
    res.body.on('error', (err) => reject(err));
    stream.on('finish', () => resolve());
  });
}

export async function importPlayers(): Promise<void> {
  const db = await getDbConnection();
  await downloadCsv(PLAYER_CSV_URL, LOCAL_CSV);

  const playersToInsert: Array<{
    first_name: string;
    last_name: string;
    nflverse_id: string;
    position: string;
    nfl_team: string;
    age: number | null;
  }> = [];

  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(LOCAL_CSV)
      .pipe(csv())
      .on('data', (row) => {
        try {
          const pos = (row.position || '').toUpperCase();
          const status = (row.status_short_description || '').toUpperCase();
          const team = row.current_team_id;
          const rookieYear = parseInt(row.rookie_year || '0');
          const birthYear = row.birth_date?.split('-')[0];
          const age = birthYear ? (2025 - parseInt(birthYear)) : null;

          // Filter: must have valid status, be a valid position, not too old
          if (!status || !allowedPositions.has(pos) || age === null || age > maxAge) return;

          // Status must be active or recent free agent
          const validStatus = ['ACTIVE', 'UFA', 'FA', 'R/UFA', 'UFA/R'];
          if (!validStatus.includes(status)) return;

          // Player must either be on a team or recently entered the league
          const isOnTeam = !!team;
          const isRecentRookie = rookieYear >= 2022;

          if (!isOnTeam && !isRecentRookie) return;


          const gsis_id = row.gsis_id?.trim();
          if (!gsis_id) {
            console.warn(`Skipping player with missing nflverse_id: ${row.first_name} ${row.last_name}`);
            return;
          }

          playersToInsert.push({
            first_name: row.first_name || '',
            last_name: row.last_name || '',
            nflverse_id: gsis_id,
            position: pos,
            nfl_team: row.team_abbr || '',
            age,
          });
        } catch (err) {
          console.error('Parse error:', err);
        }
      })

      .on('end', () => {
        console.log(`Finished reading CSV. Valid players to insert: ${playersToInsert.length}`);
        resolve();
      })
      .on('error', (err) => reject(err));
  });

  if (playersToInsert.length === 0) {
    console.warn('No players to insert after filtering. Aborting.');
    fs.unlinkSync(LOCAL_CSV);
    return;
  }

  const insert = await db.prepare(`
    INSERT OR IGNORE INTO players (
      first_name,
      last_name,
      nflverse_id,
      position,
      nfl_team,
      age
    ) VALUES (?, ?, ?, ?, ?, ?)
  `);

  let insertedCount = 0;
  const total = playersToInsert.length;

  for (let i = 0; i < total; i++) {
    const player = playersToInsert[i];
    try {
      const result = await insert.run(
        player.first_name,
        player.last_name,
        player.nflverse_id,
        player.position,
        player.nfl_team,
        player.age
      );
      if (result.changes && result.changes > 0) insertedCount++;
    } catch (err) {
      console.error(`Insert error for ${player.first_name} ${player.last_name}:`, err);
    }

    // Print progress on the same line
    process.stdout.write(`\rInserting players: ${i + 1}/${total}`);
  }


  await insert.finalize();
  fs.unlinkSync(LOCAL_CSV);

  console.log(`✅ Imported ${insertedCount} players.`);
}

export async function dumpPlayersTable() {
  const db = await getDbConnection();

  const rows = await db.all(`SELECT * FROM players`);
  if (!rows || rows.length === 0) {
    console.warn('⚠️ No rows found in players table.');
    return;
  }

  let dumpSQL = '';

  rows.forEach(row => {
    const keys = Object.keys(row).join(', ');
    const values = Object.values(row)
      .map(val => {
        if (val === null || val === undefined) return 'NULL';
        if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
        return val;
      })
      .join(', ');
    dumpSQL += `INSERT INTO players (${keys}) VALUES (${values});\n`;
  });


  fs.writeFileSync('players_dump.sql', dumpSQL);
  console.log(`✅ Dumped ${rows.length} player rows to schema_sql/players.sql`);
}