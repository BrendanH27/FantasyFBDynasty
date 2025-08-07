import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cookieParser());

export const auth_middleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  
  // const auth_header = req.headers.authorization;
  // if (!auth_header || !auth_header.startsWith('Bearer ')) {
  //   return res.status(401).json({ error: 'Unauthorized' });
  // }

  // const token = auth_header.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = payload; // add user info to request
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};
