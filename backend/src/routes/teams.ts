import express, { Request, Response } from 'express';
import { getDbConnection } from '../../database/db';

const router = express.Router();

// Get all teams
router.get('/', async (req: Request, res: Response) => {
  try {
    const db = await getDbConnection();
    const teams = await db.all('SELECT * FROM teams');
    res.status(200).json(teams);
    return;
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ error: 'Failed to fetch teams' });
    return;
  }
});

// Get a specific team by ID
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const db = await getDbConnection();
    const team = await db.get('SELECT * FROM teams WHERE id = ?', [id]);

    if (!team) {
      res.status(404).json({ error: 'Team not found' });
      return;
    }

    res.status(200).json(team);
    return;
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({ error: 'Failed to fetch team' });
    return;
  }
});

// Get teams by league ID
router.get('/league/:leagueId', async (req: Request, res: Response) => {
  const { leagueId } = req.params;

  try {
    const db = await getDbConnection();
    const teams = await db.all('SELECT * FROM teams WHERE league_id = ?', [leagueId]);
    res.status(200).json(teams);
    return;
  } catch (error) {
    console.error('Error fetching teams by league:', error);
    res.status(500).json({ error: 'Failed to fetch teams for league' });
    return;
  }
});

// Create a new team
router.post('/', async (req: Request, res: Response) => {
  const { league_id, owner_id, location, name, cap_space } = req.body;

  if (!league_id || !owner_id || !name || !location) {
    res.status(400).json({ error: 'league_id, owner_id, location, and name are required' });
    return;
  }

  try {
    const db = await getDbConnection();
    const result = await db.run(
      'INSERT INTO teams (league_id, owner_id, location, name, cap_space) VALUES (?, ?, ?, ?, ?)',
      [league_id, owner_id, location, name, cap_space || 0]
    );

    const newTeam = await db.get('SELECT * FROM teams WHERE id = ?', [result.lastID]);
    res.status(201).json(newTeam);
    return;
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ error: 'Failed to create team' });
    return;
  }
});

// Update a team
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { location, name, cap_space } = req.body;

  try {
    const db = await getDbConnection();
    await db.run(
      'UPDATE teams SET location = ?, name = ?, cap_space = ? WHERE id = ?',
      [location, name, cap_space, id]
    );

    const updatedTeam = await db.get('SELECT * FROM teams WHERE id = ?', [id]);
    res.status(200).json(updatedTeam);
    return;
  } catch (error) {
    console.error('Error updating team:', error);
    res.status(500).json({ error: 'Failed to update team' });
    return;
  }
});

// Delete a team
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const db = await getDbConnection();
    await db.run('DELETE FROM teams WHERE id = ?', [id]);
    res.status(204).send();
    return;
  } catch (error) {
    console.error('Error deleting team:', error);
    res.status(500).json({ error: 'Failed to delete team' });
    return;
  }
});

export default router;
