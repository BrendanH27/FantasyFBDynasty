import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cookieParser());

export type JwtUser = { userId: number; username: string };

export const auth_middleware = (req: Request & { user?: JwtUser }, res: Response, next: NextFunction): void => {
  const secret = process.env.JWT_ACCESS_SECRET!;
  const bearer = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  const token = bearer || req.cookies?.accessToken;
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const payload = jwt.verify(token, secret) as JwtUser;
    req.user = payload;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired token' });
    return;
  }
};
