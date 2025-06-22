import express from 'express';
import { getDbConnection } from '../database/db';
import { db_setup } from '../database/setup';

const app = express();
const PORT = 3000;

app.use(express.json());

app.put('/db_setup', async (req, res) => {
  try {
    await db_setup();
    console.log('DB Setup');
    res.sendStatus(200);

  } catch (error) {
    console.error('Error failed to setup db:', error);
    res.status(500).json({ error: 'Failed to setup db' });
  }
});

app.get('/players', async (req, res) => {
  try {
    const db = await getDbConnection();
    const teams = await db.all('SELECT * FROM players');
    res.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
