import express, { Request, Response } from 'express';
import { getDbConnection } from '../../database/db';

const router = express.Router();

// Get all players
router.get('/', async (req: Request, res: Response) => {
  try {
    const db = await getDbConnection();
    const players = await db.all('SELECT * FROM players');
    res.status(200).json(players);
    return;
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ error: 'Failed to fetch teams' });
    return;
  }
});

// Get players by NFL team
router.get('/nfl/:nfl_team', async (req: Request, res: Response) => {
  const { nfl_team } = req.params;

  try {
    const db = await getDbConnection();
    const players = await db.all('SELECT * FROM players WHERE LOWER(nfl_team) = LOWER(?)', [nfl_team]);
    res.status(200).json(players);
    return;
  } catch (error) {
    console.error('Error fetching players by team:', error);
    res.status(500).json({ error: 'Failed to fetch players by team' });
    return;
  }
});

// Get players by position
router.get('/position/:position', async (req: Request, res: Response) => {
  const { position } = req.params;

  try {
    const db = await getDbConnection();
    const players = await db.all('SELECT * FROM players WHERE LOWER(position) = LOWER(?)', [position]);
    res.status(200).json(players);
    return;
  } catch (error) {
    console.error('Error fetching players by position:', error);
    res.status(500).json({ error: 'Failed to fetch players by position' });
    return;
  }
});

// should probably search for first or last name or both
// Get players by name 
router.get('/name/:name', async (req: Request, res: Response) => {
  const { name } = req.params;
  const name_parts = name.trim().split(/\s+/); // Split by whitespace

  try {
    const db = await getDbConnection();

    let query = 'SELECT * FROM players WHERE ';
    const conditions: string[] = [];
    const values: string[] = [];

    // Flexible name search
    for (const part of name_parts) {
      conditions.push('(LOWER(first_name) LIKE LOWER(?) OR LOWER(last_name) LIKE LOWER(?))');
      values.push(`%${part}%`, `%${part}%`);
    }

    query += conditions.join(' OR ');

    const players = await db.all(query, values);
    res.status(200).json(players);
    return;
  } catch (error) {
    console.error('Error fetching players by name:', error);
    res.status(500).json({ error: 'Failed to fetch players by name' });
    return;
  }
});

// Get player by ID
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const db = await getDbConnection();
    const player = await db.get('SELECT * FROM players WHERE id = ?', [id]);

    if (!player) {
      res.status(404).json({ error: 'Player not found' });
      return;
    }

    res.json(player);
  } catch (error) {
    console.error('Error fetching player by ID:', error);
    res.status(500).json({ error: 'Failed to fetch player' });
  }
});


export default router;