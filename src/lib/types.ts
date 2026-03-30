export interface LifeGoal {
  id: string;
  title: string;
  emoji: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  color: string;
}

export interface UserProfile {
  weeklyIncome: number;
  weeklySavings: number;
  plantLevel: number;
  plantHealth: number;
  lastWatered: string;
  streak: number;
}

export interface JargonTerm {
  term: string;
  definition: string;
  example?: string;
}
