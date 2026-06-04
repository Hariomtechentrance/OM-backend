import jwt from 'jsonwebtoken';

const blacklist = new Set();

export const blacklistToken = (token) => {
  if (!token) return;
  blacklist.add(token);

  // Prune expired tokens every 500 additions to prevent unbounded growth
  if (blacklist.size % 500 === 0) {
    for (const t of blacklist) {
      try {
        jwt.verify(t, process.env.JWT_SECRET);
      } catch {
        blacklist.delete(t);
      }
    }
  }
};

export const isTokenBlacklisted = (token) => blacklist.has(token);
