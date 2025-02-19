export const TEMPERAMENTS = [
  "Calm",
  "Curious",
  "Playful",
  "Affectionate",
  "Independent",
  "Shy",
  "Dominant",
  "Easygoing",
  "Aggressive",
  "Nervous",
  "Social"
] as const;

export type Temperament = typeof TEMPERAMENTS[number];

export interface Cat {
  id?: number;
  name: string;
  age: number;
  breed: string;
  dateJoined: Date;
  vaccinated: boolean;
  temperament: Temperament[];
  staffInCharge: string,
  isAdopted: boolean,
  adopterId?: number | null
}