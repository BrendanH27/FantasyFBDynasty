import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDbConnection } from '../../database/db';
// import { auth_middleware } from '../middleware/auth_middleware';

const router = express.Router();

router.post('/register', async (req: Request, res: Response) => {
  const { username, email, password, nickname } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    const db = await getDbConnection();
    const existing_username = await db.get('SELECT id FROM users WHERE LOWER(username) = LOWER(?)', [username]);
    if (existing_username) {
      res.status(409).json({ error: 'Username already taken' });
      return;
    }
    const existing_email = await db.get('SELECT id FROM users WHERE LOWER(email) = LOWER(?)', [email]);
    if (existing_email) {
      res.status(409).json({ error: 'Email already taken' });
    }

    // Store hashed password
    const hashed = await bcrypt.hash(password, 12);
    const { lastID } = await db.run(
      'INSERT INTO users (username, email, password, nickname) VALUES (?, ?, ?, ?)',
      [username, email, hashed, nickname],
    );
    res.status(201).json({ user: { id: lastID, username, email } });
    return;
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
    return;
  }
});

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  try {
    const db = await getDbConnection();

    const user = await db.get('SELECT * FROM users WHERE LOWER(email) = LOWER(?)', [email.trim().toLowerCase()]);

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: '2h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username },
    });
    return;
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Failed to log in' });
    return;
  }
});

export default router;