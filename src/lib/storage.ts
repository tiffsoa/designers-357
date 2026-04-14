import type { LifeGoal, UserProfile } from "@/lib/types";

const STORAGE_KEYS = {
  GOALS: "visions_goals",
  PROFILE: "visions_profile",
};

export function getWalletBalance(): number {
  const balance = localStorage.getItem("visions_wallet_balance");
  //default starting balance of $5,000
  return balance ? parseFloat(balance) : 5000;
}

export function withdrawMoneyFromGoal(goalId: string, amount: number) {
  const goals = getGoals();
  const goalIndex = goals.findIndex((g) => g.id === goalId);
  if (goalIndex > -1) {
    goals[goalIndex].currentAmount -= amount;
    // Ensure we don't drop below 0
    if (goals[goalIndex].currentAmount < 0) {
      goals[goalIndex].currentAmount = 0;
    }
    localStorage.setItem("visions_goals", JSON.stringify(goals));
  }
}

export function updateWalletBalance(newBalance: number) {
  localStorage.setItem("visions_wallet_balance", newBalance.toString());
}

// Default user profile
const DEFAULT_PROFILE: UserProfile = {
  weeklyIncome: 400,
  weeklySavings: 50,
  plantLevel: 1,
  plantHealth: 75,
  lastWatered: new Date().toISOString(),
  streak: 0,
};

// Default goals
const DEFAULT_GOALS: LifeGoal[] = [
  {
    id: "1",
    title: "Grad Trip to Europe",
    emoji: "✈️",
    targetAmount: 3500,
    currentAmount: 450,
    deadline: "2026-07-15",
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "2",
    title: "First Condo Down Payment",
    emoji: "🏠",
    targetAmount: 25000,
    currentAmount: 2100,
    deadline: "2029-12-31",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "3",
    title: "Emergency Fund",
    emoji: "🛟",
    targetAmount: 5000,
    currentAmount: 1200,
    deadline: "2027-01-01",
    color: "from-lime-500 to-green-500",
  },
];

export const getGoals = (): LifeGoal[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.GOALS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(DEFAULT_GOALS));
    return DEFAULT_GOALS;
  }
  return JSON.parse(stored);
};

export const saveGoals = (goals: LifeGoal[]): void => {
  localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
};

export const getUserProfile = (): UserProfile => {
  const stored = localStorage.getItem(STORAGE_KEYS.PROFILE);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEFAULT_PROFILE));
    return DEFAULT_PROFILE;
  }
  return JSON.parse(stored);
};

export const saveUserProfile = (profile: UserProfile): void => {
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
};

export const addGoal = (goal: Omit<LifeGoal, "id" | "currentAmount">): void => {
  const goals = getGoals();
  const newGoal: LifeGoal = {
    ...goal,
    id: Date.now().toString(),
    currentAmount: 0,
  };
  saveGoals([...goals, newGoal]);
};

export const updateGoal = (goalId: string, updates: Partial<Omit<LifeGoal, "id" | "currentAmount">>): void => {
  const goals = getGoals();
  saveGoals(goals.map((g) => (g.id === goalId ? { ...g, ...updates } : g)));
};

export const deleteGoal = (goalId: string): void => {
  const goals = getGoals();
  saveGoals(goals.filter((g) => g.id !== goalId));
};

export const addMoneyToGoal = (goalId: string, amount: number): void => {
  const goals = getGoals();
  const updated = goals.map((goal) =>
    goal.id === goalId
      ? {
          ...goal,
          currentAmount: Math.min(
            goal.currentAmount + amount,
            goal.targetAmount,
          ),
        }
      : goal,
  );
  saveGoals(updated);

  // Auto-water plant and update streak
  const profile = getUserProfile();
  const newHealth = Math.min(profile.plantHealth + 5, 100);
  const newLevel = Math.floor(newHealth / 25) + 1;

  saveUserProfile({
    ...profile,
    plantHealth: newHealth,
    plantLevel: newLevel,
    lastWatered: new Date().toISOString(),
    streak: profile.streak + 1,
  });
};
