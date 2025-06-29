import express, { Request, Response } from 'express';
import { getDbConnection } from '../../database/db';

const router = express.Router();

// Get all players
router.get('/', async (req: Request, res: Response) => {
  try {
    const db = await getDbConnection();
    const teams = await db.all('SELECT * FROM players');
    res.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

// Get players by NFL team
router.get('/nfl/:nfl_team', async (req: Request, res: Response) => {
  const { nfl_team } = req.params;

  try {
    const db = await getDbConnection();
    const players = await db.all('SELECT * FROM players WHERE nfl_team = ?', [nfl_team]);
    res.json(players);
  } catch (error) {
    console.error('Error fetching players by team:', error);
    res.status(500).json({ error: 'Failed to fetch players by team' });
  }
});

export default router;