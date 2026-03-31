import { InsightCard } from "./InsightCard";
import { Icons } from "@/components/shared/icons";
import type { LifeGoal, UserProfile } from "@/lib/types";

interface InsightsProps {
  goals: LifeGoal[];
  profile: UserProfile;
}

export default function Insights({ goals, profile }: InsightsProps) {
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const savingsRate =
    profile.weeklyIncome > 0
      ? Math.round((profile.weeklySavings / profile.weeklyIncome) * 100)
      : 0;

  return (
    <div id="insights" className="mx-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 scroll-mt-20">
      <InsightCard
        title="Total Saved"
        value={`$${totalSaved.toLocaleString()}`}
        icon={Icons.walletIcon}
      />
      <InsightCard
        title="Savings Rate"
        value={`${savingsRate}%`}
        icon={Icons.trendingUpIcon}
      />
      <InsightCard
        title="Active Goals"
        value={String(goals.length)}
        icon={Icons.targetIcon}
      />
      <InsightCard
        title="Active Streak"
        value={`${profile.streak} days`}
        icon={Icons.flameIcon}
      />
    </div>
  );
}
