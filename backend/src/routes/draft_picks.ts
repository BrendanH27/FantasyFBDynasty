import express, { Request, Response } from 'express';
import { getDbConnection } from '../../database/db';

const router = express.Router();

// Get all draft picks
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDbConnection();
    const picks = await db.all('SELECT * FROM draft_picks');
    res.status(200).json(picks);
    return;
  } catch (error) {
    console.error('Error fetching draft picks:', error);
    res.status(500).json({ error: 'Failed to fetch draft picks' });
    return;
  }
});

// Get draft picks by league ID
router.get('/league/:league_id', async (req: Request, res: Response): Promise<void> => {
  const { league_id } = req.params;
  try {
    const db = await getDbConnection();
    const picks = await db.all(
      'SELECT * FROM draft_picks WHERE league_id = ? ORDER BY round, pick_number',
      [league_id]
    );
    res.status(200).json(picks);
    return;
  } catch (error) {
    console.error('Error fetching draft picks by league:', error);
    res.status(500).json({ error: 'Failed to fetch draft picks' });
    return;
  }
});

// Get draft picks by team ID
router.get('/team/:team_id', async (req: Request, res: Response): Promise<void> => {
  const { team_id } = req.params;
  try {
    const db = await getDbConnection();
    const picks = await db.all(
      'SELECT * FROM draft_picks WHERE team_id = ? ORDER BY season, round, pick_number',
      [team_id]
    );
    res.status(200).json(picks);
    return;
  } catch (error) {
    console.error('Error fetching draft picks by team:', error);
    res.status(500).json({ error: 'Failed to fetch draft picks' });
    return;
  }
});

// Create a new draft pick
router.post('/', async (req: Request, res: Response): Promise<void> => {
  const {
    league_id,
    team_id,
    season,
    round,
    pick_number,
    original_team_id,
    used_on_player_id
  } = req.body;

  if (!league_id || !team_id || !season || !round || !pick_number) {
    res.status(400).json({ error: 'league_id, team_id, season, round, and pick_number are required' });
    return;
  }

  try {
    const db = await getDbConnection();
    const result = await db.run(
      `INSERT INTO draft_picks (
        league_id, team_id, season, round, pick_number, original_team_id, used_on_player_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        league_id,
        team_id,
        season,
        round,
        pick_number,
        original_team_id || null,
        used_on_player_id || null
      ]
    );

    const newPick = await db.get('SELECT * FROM draft_picks WHERE id = ?', [result.lastID]);
    res.status(201).json(newPick);
    return;
  } catch (error) {
    console.error('Error creating draft pick:', error);
    res.status(500).json({ error: 'Failed to create draft pick' });
    return;
  }
});

// Update a draft pick
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const {
    team_id,
    round,
    pick_number,
    used_on_player_id,
    original_team_id,
    season
  } = req.body;

  try {
    const db = await getDbConnection();
    await db.run(
      `UPDATE draft_picks SET 
        team_id = ?, 
        season = ?, 
        round = ?, 
        pick_number = ?, 
        original_team_id = ?, 
        used_on_player_id = ?
      WHERE id = ?`,
      [
        team_id,
        season,
        round,
        pick_number,
        original_team_id || null,
        used_on_player_id || null,
        id
      ]
    );

    const updatedPick = await db.get('SELECT * FROM draft_picks WHERE id = ?', [id]);
    res.status(200).json(updatedPick);
    return;
  } catch (error) {
    console.error('Error updating draft pick:', error);
    res.status(500).json({ error: 'Failed to update draft pick' });
    return;
  }
});

// Delete a draft pick
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const db = await getDbConnection();
    await db.run('DELETE FROM draft_picks WHERE id = ?', [id]);
    res.status(204).send();
    return;
  } catch (error) {
    console.error('Error deleting draft pick:', error);
    res.status(500).json({ error: 'Failed to delete draft pick' });
    return;
  }
});

export default router;
