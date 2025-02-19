import { Request, Response, NextFunction } from 'express';

export const basicAuth = (req: Request, res: Response, next: NextFunction) => {
  // Get authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.setHeader('WWW-Authenticate', 'Basic');
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Check if it's Basic auth
  if (!authHeader.startsWith('Basic ')) {
    return res.status(401).json({ error: 'Invalid authentication method' });
  }

  // Get credentials
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
  const [username, password] = credentials.split(':');

  // In a real application, you would validate against a secure user store
  // For this example, we'll use a simple check
  if (username === 'admin' && password === 'password') {
    next();
  } else {
    res.setHeader('WWW-Authenticate', 'Basic');
    res.status(401).json({ error: 'Invalid credentials' });
  }
};