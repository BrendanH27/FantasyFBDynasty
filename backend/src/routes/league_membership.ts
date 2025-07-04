import express, { Request, Response } from 'express';
import { getDbConnection } from '../../database/db';

const router = express.Router();

// Get all memberships
router.get('/', async (_req: Request, res: Response) => {
  try {
    const db = await getDbConnection();
    const memberships = await db.all('SELECT * FROM league_memberships');
    res.status(200).json(memberships);
    return;
  } catch (error) {
    console.error('Error fetching memberships:', error);
    res.status(500).json({ error: 'Failed to fetch memberships' });
    return;
  }
});

// Get memberships by league
router.get('/league/:league_id', async (req: Request, res: Response) => {
  const { league_id } = req.params;
  try {
    const db = await getDbConnection();
    const memberships = await db.all(
      'SELECT * FROM league_memberships WHERE league_id = ?',
      [league_id]
    );
    res.status(200).json(memberships);
    return;
  } catch (error) {
    console.error('Error fetching memberships by league:', error);
    res.status(500).json({ error: 'Failed to fetch memberships' });
    return;
  }
});

// Get memberships by user
router.get('/user/:user_id', async (req: Request, res: Response) => {
  const { user_id } = req.params;
  try {
    const db = await getDbConnection();
    const memberships = await db.all(
      'SELECT * FROM league_memberships WHERE user_id = ?',
      [user_id]
    );
    res.status(200).json(memberships);
    return;
  } catch (error) {
    console.error('Error fetching memberships by user:', error);
    res.status(500).json({ error: 'Failed to fetch memberships' });
    return;
  }
});

// Add a new membership
router.post('/', async (req: Request, res: Response) => {
  const { user_id, league_id, role, team_id } = req.body;

  if (!user_id || !league_id || !role) {
    res.status(400).json({ error: 'user_id, league_id, and role are required' });
    return;
  }

  try {
    const db = await getDbConnection();
    const result = await db.run(
      'INSERT INTO league_memberships (user_id, league_id, role, team_id) VALUES (?, ?, ?, ?)',
      [user_id, league_id, role, team_id || null]
    );
    const newMembership = await db.get(
      'SELECT * FROM league_memberships WHERE id = ?',
      [result.lastID]
    );
    res.status(201).json(newMembership);
    return;
  } catch (error) {
    console.error('Error creating membership:', error);
    res.status(500).json({ error: 'Failed to create membership' });
    return;
  }
});

// Update a membership
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role, team_id } = req.body;

  try {
    const db = await getDbConnection();
    await db.run(
      'UPDATE league_memberships SET role = ?, team_id = ? WHERE id = ?',
      [role, team_id || null, id]
    );
    const updated = await db.get('SELECT * FROM league_memberships WHERE id = ?', [id]);
    res.status(200).json(updated);
    return;
  } catch (error) {
    console.error('Error updating membership:', error);
    res.status(500).json({ error: 'Failed to update membership' });
    return;
  }
});

// Delete a membership
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const db = await getDbConnection();
    await db.run('DELETE FROM league_memberships WHERE id = ?', [id]);
    res.status(204).send();
    return;
  } catch (error) {
    console.error('Error deleting membership:', error);
    res.status(500).json({ error: 'Failed to delete membership' });
    return;
  }
});

export default router;
