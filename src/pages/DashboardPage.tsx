import { useState, useRef } from "react";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/features/navigation/Navbar";
import { WelcomeBanner } from "@/components/features/welcomeBanner/welcomeBanner";
import Insights from "@/components/features/insights/Insights";
import Dictionary from "../components/features/dictionary/Dictionary";
import ManifestationSlider from "@/components/features/slider/manifestationSlider";

import { GoalCard } from "@/components/features/goals/GoalCard";
import { AddGoalModal } from "@/components/features/goals/AddGoalModal";
import { getGoals, getUserProfile, addGoal } from "../lib/storage";
import { Button } from "@/components/ui/button";
import type { LifeGoal } from "@/lib/types";
import { toast } from "sonner";

const CARD_WIDTH = 288 + 20;

export default function DashboardPage() {
  const [goals, setGoals] = useState(getGoals());
  const [profile, setProfile] = useState(getUserProfile());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const refreshData = () => {
    setGoals(getGoals());
    setProfile(getUserProfile());
  };

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -CARD_WIDTH : CARD_WIDTH,
      behavior: "smooth",
    });
  };

  const handleAddGoal = (goal: Omit<LifeGoal, "id" | "currentAmount">) => {
    addGoal(goal);
    refreshData();
    toast.success(`"${goal.title}" added! Let's make it happen 🎯`);
  };

  return (
    <>
      <Navbar />
      <WelcomeBanner />

      <Insights goals={goals} profile={profile} />

      <ManifestationSlider />

      <div id="goals" className="py-8 mb-8 mx-8">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-gray-800">Your Life Goals</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {goals.length} active goal{goals.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex items-stretch gap-3">
          <Button onClick={() => scroll("left")} size="icon">
            <ChevronLeft />
          </Button>

          <div
            ref={scrollRef}
            className="flex-1 flex gap-5 overflow-x-auto"
          >
            {goals.map((goal, index) => (
              <div key={goal.id} style={{ width: 288 }}>
                <GoalCard goal={goal} index={index} onUpdate={refreshData} />
              </div>
            ))}

            <motion.div
              onClick={() => setIsModalOpen(true)}
              className="border-dashed border p-6 cursor-pointer"
              style={{ width: 288 }}
            >
              <Plus />
            </motion.div>
          </div>

          <Button onClick={() => scroll("right")} size="icon">
            <ChevronRight />
          </Button>
        </div>
      </div>

      <Dictionary />

      <AddGoalModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddGoal}
        goalCount={goals.length}
      />
    </>
  );
}