import express from 'express';
import { getDbConnection } from '../../database/db';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const db = await getDbConnection();
    const users = await db.all('SELECT * FROM users');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users: ', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

export default router;