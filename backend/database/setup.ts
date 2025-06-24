import { getDbConnection } from './db';
import fs from 'fs/promises';
import path from 'path';
import { dumpPlayersTable } from './testData';

export async function db_setup() {
  const db = await getDbConnection();

  // Drop all tables except internal sqlite tables
  const tables = await db.all(`
    SELECT name FROM sqlite_master 
    WHERE type='table' AND name NOT LIKE 'sqlite_%';
  `);

  for (const { name } of tables) {
    await db.exec(`DROP TABLE IF EXISTS ${name};`);
    console.log(`Dropped table: ${name}`);
  }

  // Setup schema from schema_sql folder
  const schemaDir = path.resolve(__dirname, 'schema_sql');
  const schemaFiles = (await fs.readdir(schemaDir)).filter(f => f.endsWith('.sql'));

  for (const file of schemaFiles) {
    const sql = await fs.readFile(path.join(schemaDir, file), 'utf-8');
    try {
      await db.exec(sql);
      console.log(`Executed schema: ${file}`);
    } catch (err) {
      console.error(`Error executing schema file ${file}:`, err);
    }
  }

  // Setup test data from test_data folder
  const testDataDir = path.resolve(__dirname, 'test_data_sql');
  let testFiles: string[] = [];
  try {
    testFiles = (await fs.readdir(testDataDir)).filter(f => f.endsWith('.sql'));
  } catch (err) {
    console.warn('No test_data folder or test files found, skipping test data import.');
  }

  for (const file of testFiles) {
    const sql = await fs.readFile(path.join(testDataDir, file), 'utf-8');
    try {
      await db.exec(sql);
      console.log(`Executed test data: ${file}`);
    } catch (err) {
      console.error(`Error executing test data file ${file}:`, err);
    }
  }

  console.log('Database setup complete.');
}
