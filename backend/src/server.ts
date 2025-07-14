import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db_setup } from '../database/setup';
import auth_router from './routes/auth';
import players_router from './routes/players';
import users_router from './routes/users';
import league_router from './routes/leagues'
import draft_picks_router from './routes/draft_picks';
import league_membership_router from './routes/league_membership';
import team_players_router from './routes/team_players';
import teams_router from './routes/teams';

const app = express();
const PORT = 3001;
dotenv.config();

app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.use('/auth', auth_router);
app.use('/players', players_router);
app.use('/users', users_router);
app.use('/leagues', league_router);
app.use('/draft_picks', draft_picks_router);
app.use('/league_membership', league_membership_router);
app.use('/team_players', team_players_router);
app.use('/teams', teams_router);

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
