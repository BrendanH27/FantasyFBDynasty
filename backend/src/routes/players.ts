import express, { Request, Response } from 'express';
import { getDbConnection } from '../../database/db';

const router = express.Router();

// Get all players
router.get('/', async (req: Request, res: Response) => {
  try {
    const db = await getDbConnection();
    const players = await db.all('SELECT * FROM players');
    res.json(players);
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
    const players = await db.all('SELECT * FROM players WHERE LOWER(nfl_team) = LOWER(?)', [nfl_team]);
    res.json(players);
  } catch (error) {
    console.error('Error fetching players by team:', error);
    res.status(500).json({ error: 'Failed to fetch players by team' });
  }
});

// Get players by position
router.get('/position/:position', async (req: Request, res: Response) => {
  const { position } = req.params;

  try {
    const db = await getDbConnection();
    const players = await db.all('SELECT * FROM players WHERE LOWER(position) = LOWER(?)', [position]);
    res.json(players);
  } catch (error) {
    console.error('Error fetching players by position:', error);
    res.status(500).json({ error: 'Failed to fetch players by position' });
  }
});

// should probably search for first or last name or both
// Get players by last name 
router.get('/name/:last_name', async (req: Request, res: Response) => {
  const { last_name } = req.params;
  try {
    const db = await getDbConnection();
    const players = await db.all('SELECT * FROM players WHERE LOWER(last_name) = LOWER(?)', [last_name]);
    res.json(players);
  } catch (error) {
    console.error('Error fetching players by last name:', error);
    res.status(500).json({ error: 'Failed to fetch players by last name' });
  }
});

export default router;