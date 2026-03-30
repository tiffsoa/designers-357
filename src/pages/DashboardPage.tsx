import { useState } from "react";
import Navbar from "@/components/features/navigation/Navbar";
import { WelcomeBanner } from "@/components/features/welcomeBanner/welcomeBanner";
import Insights from "@/components/features/insights/Insights";
import { GoalCard } from "@/components/features/goals/GoalCard";
import Dictionary from "../components/features/dictionary/Dictionary";
import { getGoals, getUserProfile } from "../lib/storage";

export default function DashboardPage() {
  const [goals, setGoals] = useState(getGoals());
  const [, setProfile] = useState(getUserProfile());

  const refreshData = () => {
    setGoals(getGoals());
    setProfile(getUserProfile());
  };

  return (
    <>
      <Navbar />
      <WelcomeBanner />
      <Insights />
      <div className="py-8 mb-8 mx-8 scroll-mt-40">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-4 ">
          Your Life Goals
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal, index) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              index={index}
              onUpdate={refreshData}
            />
          ))}
        </div>
      </div>
      <Dictionary />
    </>
  );
}
