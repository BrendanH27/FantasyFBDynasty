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

router.post('/', async (req, res) => {
  const { username, email, password, nickname } = req.body;

  // Missing field (nickname is optional)
  if (!username || !email || !password) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    const db = await getDbConnection();
    const result = await db.run(
      'INSERT INTO users (username, email, password, nickname) VALUES (?, ?, ?, ?)',
      [username, email, password, nickname || null]
    );

    res.status(201).json({ userId: result.lastID });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

export default router;