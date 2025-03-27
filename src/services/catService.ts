import { Cat } from '../types/cat.js';
import { JSONFilePreset } from 'lowdb/node';

const path = './src/db/cats.json';

interface Database {
  lastId: number;
  cats: Cat[];
}

export class CatService {
  private static _lock: Promise<void> = Promise.resolve();

  private async withLock<T>(fn: () => Promise<T>): Promise<T> {
    let release: () => void;
    const wait = new Promise<void>(resolve => { release = resolve; });
    const previousLock = CatService._lock;
    CatService._lock = previousLock.then(() => wait);
    await previousLock;
    try {
      return await fn();
    } finally {
      release!();
    }
  }

  private async readDB(): Promise<Database> {
    const defaultData: Database = { lastId: 0, cats: [] };
    try {
      const db = await JSONFilePreset<Database>(path, defaultData);
      return {
        lastId: db.data.lastId ?? 0,
        cats: db.data.cats ?? []
      };
    } catch {
      return defaultData;
    }
  }

  private async writeDB(data: Database): Promise<void> {
    const defaultData: Database = { lastId: 0, cats: [] };
    const db = await JSONFilePreset<Database>(path, defaultData);
    db.data = data;
    await db.write();
  }

  async getCat(id: string): Promise<Cat | null> {
    return this.withLock(async () => {
      const db = await this.readDB();
      return db.cats.find(cat => cat.id === parseInt(id)) || null;
    });
  }

  async getCatsByStaffId(staffId: string): Promise<Cat[]> {
    return this.withLock(async () => {
      const db = await this.readDB();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return (db.cats.filter(cat => cat.staffInCharge === staffId).map(({ staffInCharge, ...rest }) => rest)) as Cat[];
    });
  }

  async getCatsByAdopterId(adopterId: number): Promise<Cat[]> {
    return this.withLock(async () => {
      const db = await this.readDB();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return (db.cats.filter(cat => cat.adopterId === adopterId).map(({ adopterId, ...rest }) => rest)) as Cat[];
    });
  }

  async getCats(): Promise<Cat[]> {
    return this.withLock(async () => {
      const db = await this.readDB();
      return db.cats;
    });
  }

  async addCat(cat: Omit<Cat, 'id'>): Promise<Cat> {
    return this.withLock(async () => {
      const db = await this.readDB();
      const newCat: Cat = {
        ...cat,
        id: db.lastId + 1,
        dateJoined: new Date(cat.dateJoined)
      };
      db.lastId = Number(newCat.id);
      db.cats.push(newCat);
      await this.writeDB(db);
      return newCat;
    });
  }

  async updateCat(cat: Cat): Promise<Cat | null> {
    return this.withLock(async () => {
      const db = await this.readDB();
      const index = db.cats.findIndex(c => c.id === cat.id);
      if (index === -1) return null;
      db.cats[index] = cat;
      await this.writeDB(db);
      return db.cats[index];
    });
  }

  async removeCat(id: string): Promise<boolean> {
    return this.withLock(async () => {
      const db = await this.readDB();
      const initialLength = db.cats.length;
      db.cats = db.cats.filter(cat => cat.id !== parseInt(id));
      if (db.cats.length === initialLength) return false;
      await this.writeDB(db);
      return true;
    });
  }

  async patchCat(id: string, staffInCharge: string | undefined, adopterId: number | undefined): Promise<Cat | null> {
    return this.withLock(async () => {
      const db = await this.readDB();
      const index = db.cats.findIndex(c => c.id === parseInt(id));
      if (index === -1) return null;
      if (staffInCharge) { db.cats[index].staffInCharge = staffInCharge; }
      if (adopterId) {
        db.cats[index].adopterId = adopterId;
        db.cats[index].isAdopted = true;
      }
      await this.writeDB(db);
      return db.cats[index];
    });
  }
}
