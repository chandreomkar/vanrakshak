import { Router } from 'express';
import { db } from '../db.js';

export const authRouter = Router();

// In-memory demo session token map
const sessions = new Map<string, any>();

authRouter.post('/login', (req, res) => {
  const { username, role } = req.body;

  let user: any = null;
  if (role) {
    user = db.prepare('SELECT id, username, name, role, email FROM users WHERE role = ? LIMIT 1').get(role);
  } else if (username) {
    user = db.prepare('SELECT id, username, name, role, email FROM users WHERE username = ? LIMIT 1').get(username);
  }

  if (!user) {
    return res.status(404).json({ error: 'Demo user not found' });
  }

  const token = `demo_token_${user.id}_${Date.now()}`;
  sessions.set(token, user);

  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      email: user.email,
    },
  });
});

authRouter.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    // Default to guest demo mode if unauthenticated
    const guest = db.prepare("SELECT id, username, name, role, email FROM users WHERE role = 'guest' LIMIT 1").get();
    return res.json({ user: guest, authenticated: false, isGuest: true });
  }

  const token = authHeader.replace('Bearer ', '');
  const user = sessions.get(token);

  if (!user) {
    const guest = db.prepare("SELECT id, username, name, role, email FROM users WHERE role = 'guest' LIMIT 1").get();
    return res.json({ user: guest, authenticated: false, isGuest: true });
  }

  res.json({ user, authenticated: true, isGuest: user.role === 'guest' });
});

authRouter.post('/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    sessions.delete(token);
  }
  res.json({ success: true });
});
