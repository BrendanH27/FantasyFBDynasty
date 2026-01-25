import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import { getDbConnection } from '../../database/db';
import { auth_middleware, JwtUser } from '../middleware/auth_middleware';

dotenv.config({ path: path.resolve(__dirname, '../.env') });
const router = express.Router();

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const isProd = (process.env.NODE_ENV ?? 'development') === 'production';

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error('JWT secrets missing in .env');
}

const ACCESS_MS = 15 * 60 * 1000; // 15 min
const REFRESH_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function signAccess(payload: JwtUser) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });
}
function signRefresh(payload: JwtUser) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '30d' });
}

function setAccessCookie(res: Response, token: String) {
  res.cookie('accessToken', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
    maxAge: ACCESS_MS
  });
}

function setRefreshCookie(res: Response, token: String) {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/auth/refresh',
    maxAge: REFRESH_MS
  });
}

function clearAuthCookies(res: Response) {
  res.clearCookie('accessToken', { path: '/' });
  res.clearCookie('refreshToken', { path: '/auth/refresh' });
}

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
    const payload: JwtUser = { userId: user.id, username: user.username };
    setAccessCookie(res, signAccess(payload));
    setRefreshCookie(res, signRefresh(payload));

    res.status(200).json({ message: 'Login successful', user: { id: user.id, username: user.username, email: user.email } });
    return;
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Failed to log in' });
    return;
  }
});

router.post('/refresh', async (req: Request, res: Response) => {
  const rt = req.cookies?.refreshToken;
  if (!rt) {
    res.status(401).json({ error: 'No refresh token' });
    return;
  }

  try {
    const payload = jwt.verify(rt, REFRESH_SECRET) as JwtUser;
    setAccessCookie(res, signAccess(payload));
    setRefreshCookie(res, signRefresh(payload));
    res.json({ ok: true });
    return;
  } catch {
    clearAuthCookies(res);
    res.status(401).json({ error: 'Invalid refresh token' });
    return;
  }
})

router.post('/logout', (_req: Request, res: Response) => {
  clearAuthCookies(res);
  res.json({ ok: true });
  return;
});

router.get('/me', auth_middleware, async (req: Request & { user?: JwtUser }, res: Response) => {
  const db = await getDbConnection();
  const row = await db.get('SELECT id, username, email, nickname FROM users WHERE id = ?', [req.user!.userId]);
  if (!row) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json({ user: row });
  return;
})

export default router;