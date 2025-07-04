import express, { Request, Response } from 'express';
import { getDbConnection } from '../../database/db';

const router = express.Router();

// Get all leagues
router.get('/', async (req: Request, res: Response) => {
  try {
    const db = await getDbConnection();
    const leagues = await db.all('SELECT * FROM leagues');
    res.status(200).json(leagues);
    return;
  } catch (error) {
    console.error('Error fetching leagues:', error);
    res.status(500).json({ error: 'Failed to fetch leagues' });
    return;
  }
});

// Get a specific league by ID
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const db = await getDbConnection();
    const league = await db.get('SELECT * FROM leagues WHERE id = ?', [id]);

    if (!league) {
      res.status(404).json({ error: 'League not found' });
      return;
    }

    res.status(200).json(league);
    return;
  } catch (error) {
    console.error('Error fetching league:', error);
    res.status(500).json({ error: 'Failed to fetch league' });
    return;
  }
});

// Create a new league
router.post('/', async (req: Request, res: Response) => {
  const { name, available_spots, settings, owner_id } = req.body;

  if (!name || owner_id === undefined) {
    res.status(400).json({ error: 'name and owner_id are required' });
    return;
  }

  try {
    const db = await getDbConnection();
    const result = await db.run(
      'INSERT INTO leagues (name, available_spots, settings, owner_id) VALUES (?, ?, ?, ?)',
      [name, available_spots || 0, JSON.stringify(settings || {}), owner_id]
    );

    const newLeague = await db.get('SELECT * FROM leagues WHERE id = ?', [result.lastID]);
    res.status(201).json(newLeague);
    return;
  } catch (error) {
    console.error('Error creating league:', error);
    res.status(500).json({ error: 'Failed to create league' });
    return;
  }
});

// Update a league
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, available_spots, settings } = req.body;

  try {
    const db = await getDbConnection();
    await db.run(
      'UPDATE leagues SET name = ?, available_spots = ?, settings = ? WHERE id = ?',
      [name, available_spots, JSON.stringify(settings), id]
    );

    const updatedLeague = await db.get('SELECT * FROM leagues WHERE id = ?', [id]);
    res.status(200).json(updatedLeague);
    return;
  } catch (error) {
    console.error('Error updating league:', error);
    res.status(500).json({ error: 'Failed to update league' });
    return;
  }
});

// Delete a league
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const db = await getDbConnection();
    await db.run('DELETE FROM leagues WHERE id = ?', [id]);
    res.status(204).send();
    return;
  } catch (error) {
    console.error('Error deleting league:', error);
    res.status(500).json({ error: 'Failed to delete league' });
    return;
  }
});

export default router;
