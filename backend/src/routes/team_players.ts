import express, { Request, Response } from 'express';
import { getDbConnection } from '../../database/db';

const router = express.Router();

// Get all team-player records
router.get('/', async (_req: Request, res: Response) => {
  try {
    const db = await getDbConnection();
    const teamPlayers = await db.all('SELECT * FROM team_players');
    res.status(200).json(teamPlayers);
    return;
  } catch (error) {
    console.error('Error fetching team players:', error);
    res.status(500).json({ error: 'Failed to fetch team players' });
    return;
  }
});

// Get players by team ID
router.get('/team/:teamId', async (req: Request, res: Response) => {
  const { teamId } = req.params;

  try {
    const db = await getDbConnection();

    const players = await db.all(`
      SELECT 
        tp.id AS team_player_id,
        tp.contract_value,
        tp.contract_years,
        tp.acquired_date,
        tp.status,
        tp.draft_pick_id,
        p.id AS id,
        p.first_name,
        p.last_name,
        p.position,
        p.nfl_team,
        p.age,
        p.nflverse_id
      FROM team_players tp
      JOIN players p ON tp.player_id = p.id
      WHERE tp.team_id = ?
    `, [teamId]);
    res.status(200).json(players);
    return;
  } catch (error) {
    console.error('Error fetching players for team:', error);
    res.status(500).json({ error: 'Failed to fetch players for team' });
    return;
  }
});


// Get teams by player ID
router.get('/player/:player_id', async (req: Request, res: Response) => {
  const { player_id } = req.params;
  try {
    const db = await getDbConnection();
    const teams = await db.all(
      'SELECT * FROM team_players WHERE player_id = ?',
      [player_id]
    );
    res.status(200).json(teams);
    return;
  } catch (error) {
    console.error('Error fetching teams by player:', error);
    res.status(500).json({ error: 'Failed to fetch teams' });
    return;
  }
});

// Add a player to a team
router.post('/', async (req: Request, res: Response) => {
  const {
    team_id,
    player_id,
    contract_value,
    contract_years,
    acquired_date,
    status,
    draft_pick_id
  } = req.body;

  if (!team_id || !player_id) {
    res.status(400).json({ error: 'team_id and player_id are required' });
    return;
  }

  try {
    const db = await getDbConnection();
    const result = await db.run(
      `INSERT INTO team_players (
        team_id, player_id, contract_value, contract_years, acquired_date, status, draft_pick_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        team_id,
        player_id,
        contract_value ?? null,
        contract_years ?? null,
        acquired_date ?? null,
        status ?? null,
        draft_pick_id ?? null
      ]
    );

    const newRecord = await db.get('SELECT * FROM team_players WHERE id = ?', [result.lastID]);
    res.status(201).json(newRecord);
    return;
  } catch (error) {
    console.error('Error adding player to team:', error);
    res.status(500).json({ error: 'Failed to add player to team' });
    return;
  }
});

// Update a team-player record
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    contract_value,
    contract_years,
    acquired_date,
    status,
    draft_pick_id
  } = req.body;

  try {
    const db = await getDbConnection();
    await db.run(
      `UPDATE team_players 
       SET contract_value = ?, contract_years = ?, acquired_date = ?, status = ?, draft_pick_id = ?
       WHERE id = ?`,
      [
        contract_value ?? null,
        contract_years ?? null,
        acquired_date ?? null,
        status ?? null,
        draft_pick_id ?? null,
        id
      ]
    );

    const updated = await db.get('SELECT * FROM team_players WHERE id = ?', [id]);
    res.status(200).json(updated);
    return;
  } catch (error) {
    console.error('Error updating team player:', error);
    res.status(500).json({ error: 'Failed to update team player' });
    return;
  }
});

// Delete a team-player record
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const db = await getDbConnection();
    await db.run('DELETE FROM team_players WHERE id = ?', [id]);
    res.status(204).send();
    return;
  } catch (error) {
    console.error('Error deleting team player:', error);
    res.status(500).json({ error: 'Failed to delete team player' });
    return;
  }
});

export default router;
