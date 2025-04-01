import { JSONFilePreset } from 'lowdb/node';
import { hashPassword } from '../middleware/auth';
import { User } from '../types/user.js';

const path = './src/db/users.json';

interface Database {
  users: User[];
}

export class AuthService {
  private static _lock: Promise<void> = Promise.resolve();

  private async withLock<T>(fn: () => Promise<T>): Promise<T> {
    let release: () => void;
    const wait = new Promise<void>(resolve => { release = resolve; });
    const previousLock = AuthService._lock;
    AuthService._lock = previousLock.then(() => wait);
    await previousLock;
    try {
      return await fn();
    } finally {
      release!();
    }
  }

  private async readDB(): Promise<Database> {
    const defaultData: Database = { users: [] };
    try {
      const db = await JSONFilePreset<Database>(path, defaultData);
      return {
        users: db.data.users ?? []
      };
    } catch {
      return defaultData;
    }
  }

  private async writeDB(data: Database): Promise<void> {
    const defaultData: Database = { users: [] };
    const db = await JSONFilePreset<Database>(path, defaultData);
    db.data = data;
    await db.write();
  }

  async createUser(username: string, password: string): Promise<User> {
    return this.withLock(async () => {
      const db = await this.readDB();
      
      // Check if user already exists
      if (db.users.some(user => user.username === username)) {
        throw new Error('Username already exists');
      }

      const hashedPassword = await hashPassword(password);
      const newUser: User = {
        id: Date.now().toString(),
        username,
        password: hashedPassword,
        createdAt: new Date().toISOString()
      };

      db.users.push(newUser);
      await this.writeDB(db);
      return newUser;
    });
  }

  async findUserByUsername(username: string): Promise<User | undefined> {
    return this.withLock(async () => {
      const db = await this.readDB();
      return db.users.find(user => user.username === username);
    });
  }

  async findUserById(id: string): Promise<User | undefined> {
    return this.withLock(async () => {
      const db = await this.readDB();
      return db.users.find(user => user.id === id);
    });
  }
}