import express from 'express';
import { db_setup } from '../database/setup';
import players_router from './routes/players';
import users_router from './routes/users';
import league_router from './routes/leagues'

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/players', players_router);
app.use('/users', users_router);
app.use('/leagues', league_router);

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
