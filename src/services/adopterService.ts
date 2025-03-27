import { Adopter } from '../types/adopter.js';
import { JSONFilePreset } from 'lowdb/node';

const path = './src/db/adopters.json';

interface Database {
  lastId: number;
  adopters: Adopter[];
}

export class AdopterService {
  private static _lock: Promise<void> = Promise.resolve();

  private async withLock<T>(fn: () => Promise<T>): Promise<T> {
    let release: () => void;
    const wait = new Promise<void>(resolve => {
      release = resolve;
    });

    const previousLock = AdopterService._lock;
    AdopterService._lock = previousLock.then(() => wait);

    await previousLock;

    try {
      return await fn();
    } finally {
      release!();
    }
  }

  private async readDB(): Promise<Database> {
    const defaultData: Database = { lastId: 0, adopters: [] };
    try {
      const db = await JSONFilePreset<Database>(path, defaultData);
      return {
        lastId: db.data.lastId ?? 0,
        adopters: db.data.adopters ?? []
      };
    } catch {
      return defaultData;
    }
  }

  private async writeDB(data: Database): Promise<void> {
    const defaultData: Database = { lastId: 0, adopters: [] };
    const db = await JSONFilePreset<Database>(path, defaultData);
    db.data = data;
    await db.write();
  }

  async getAdopter(id: number | undefined): Promise<Adopter | null> {
    return this.withLock(async () => {
      const db = await this.readDB();
      if (id) {
        return db.adopters.find(adopter => adopter.id === id) || null;
      }
      return null;
    });
  }

  async getAdopters(): Promise<Adopter[]> {
    return this.withLock(async () => {
      const db = await this.readDB();
      return db.adopters;
    });
  }

  async addAdopter(adopter: Omit<Adopter, 'id'>): Promise<Adopter> {
    return this.withLock(async () => {
      const db = await this.readDB();
      const newAdopter: Adopter = {
        ...adopter,
        id: db.lastId + 1
      };
      db.lastId = Number(newAdopter.id);
      db.adopters.push(newAdopter);
      await this.writeDB(db);
      return newAdopter;
    });
  }

  async updateAdopter(adopter: Adopter): Promise<Adopter | null> {
    return this.withLock(async () => {
      const db = await this.readDB();
      const index = db.adopters.findIndex(a => a.id === adopter.id);
      if (index === -1) return null;
      db.adopters[index] = adopter;
      await this.writeDB(db);
      return db.adopters[index];
    });
  }

  async removeAdopter(id: number): Promise<boolean> {
    return this.withLock(async () => {
      const db = await this.readDB();
      const initialLength = db.adopters.length;
      db.adopters = db.adopters.filter(adopter => adopter.id !== id);
      if (db.adopters.length === initialLength) return false;
      await this.writeDB(db);
      return true;
    });
  }
}
