import { Adopter } from '../types/adopter.js';
import { JSONFilePreset } from 'lowdb/node';

const path = './src/db/adopters.json';


interface Database {
  adopters: Adopter[];
}

export class AdopterService {
  private async readDB(): Promise<Database> {
    const defaultData: Database = { adopters: [] };
    try {
      const db = await JSONFilePreset<Database>(path, defaultData);
      return {
        adopters: db.data.adopters ?? []
      };
    } catch {
      // If the file doesn't exist or is invalid, return default structure
      return defaultData;
    }
  }

  private async writeDB(data: Database): Promise<void> {
    const defaultData: Database = { adopters: [] };
    const db = await JSONFilePreset<Database>(path, defaultData);
    db.data = data;
    db.write();
  }

  async getAdopter(id: number | undefined): Promise<Adopter | null> {
    const db = await this.readDB();
    if (id) { return db.adopters.find(adopter => adopter.id === id) || null; }
    else return null;
  }

  async getAdopters(): Promise<Adopter[]> {
    const db = await this.readDB();
    return db.adopters;
  }

  async addAdopter(adopter: Adopter): Promise<Adopter> {
    const db = await this.readDB();
    const index = db.adopters.length;
    db.adopters.push(adopter);
    await this.writeDB(db);
    return db.adopters[index];
  }

  async updateAdopter(adopter: Adopter): Promise<Adopter | null>{
    const db = await this.readDB();
    const index = db.adopters.findIndex(a => a.id === adopter.id);
    if (index === -1) return null;
    
    db.adopters[index] = adopter;
    await this.writeDB(db);
    return db.adopters[index];
  }

  async removeAdopter(id: number): Promise<boolean> {
    const db = await this.readDB();
    const initialLength = db.adopters.length;
    db.adopters = db.adopters.filter(adopter => adopter.id !== id);

    if (db.adopters.length === initialLength) return false;
    
    await this.writeDB(db);
    return true;
  }
}