import { Staff } from '../types/staff.js';
import { JSONFilePreset } from 'lowdb/node';

const path = './src/db/staff.json';

interface Database {
  staff: Staff[];
}

function getDefaultDB(): Database {
  const defaultDatabase: Database = { staff: [] };
  const defaultStaff: Staff = {
    id: '00000000-0000-0000-0000-000000000000',
    name: 'The',
    lastName: 'Boss',
    age: 30,
    dateJoined: new Date('2021-01-01'),
    role: 'Boss'
  };
  defaultDatabase.staff.push(defaultStaff);
  return defaultDatabase;
}

export class StaffService {
  private static _lock: Promise<void> = Promise.resolve();

  private async withLock<T>(fn: () => Promise<T>): Promise<T> {
    let release: () => void;
    const wait = new Promise<void>(resolve => { release = resolve; });
    const previousLock = StaffService._lock;
    StaffService._lock = previousLock.then(() => wait);
    await previousLock;
    try {
      return await fn();
    } finally {
      release!();
    }
  }

  private async readDB(): Promise<Database> {
    try {
      const db = await JSONFilePreset<Database>(path, getDefaultDB());
      return db.data;
    } catch {
      return getDefaultDB();
    }
  }

  private async writeDB(data: Database): Promise<void> {
    const db = await JSONFilePreset<Database>(path, getDefaultDB());
    db.data = data;
    await db.write();
  }

  async getStaff(id: string | undefined): Promise<Staff | null> {
    return this.withLock(async () => {
      const db = await this.readDB();
      if (id) return db.staff.find(staff => staff.id === id) || null;
      return null;
    });
  }

  async getAllStaff(): Promise<Staff[] | null> {
    return this.withLock(async () => {
      const db = await this.readDB();
      return db.staff;
    });
  }

  async addStaff(staff: Omit<Staff, 'id'>): Promise<Staff> {
    return this.withLock(async () => {
      const db = await this.readDB();
      const newStaff: Staff = {
        ...staff,
        id: crypto.randomUUID(),
        dateJoined: new Date(staff.dateJoined)
      };
      db.staff.push(newStaff);
      await this.writeDB(db);
      return newStaff;
    });
  }

  async removeStaff(id: string): Promise<boolean> {
    return this.withLock(async () => {
      const db = await this.readDB();
      const initialLength = db.staff.length;
      db.staff = db.staff.filter(staff => staff.id !== id);
      if (db.staff.length === initialLength) return false;
      await this.writeDB(db);
      return true;
    });
  }
}
