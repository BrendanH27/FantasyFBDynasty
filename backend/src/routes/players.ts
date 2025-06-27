import express from 'express';
import { getDbConnection } from '../../database/db';

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const db = await getDbConnection();
    const teams = await db.all('SELECT * FROM players');
    res.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

export default router;