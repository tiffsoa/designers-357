import { useState, useRef } from "react";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import Navbar from "@/components/features/navigation/Navbar";
import { WelcomeBanner } from "@/components/features/welcomeBanner/welcomeBanner";
import Insights from "@/components/features/insights/Insights";
import { GoalCard } from "@/components/features/goals/GoalCard";
import { AddGoalModal } from "@/components/features/goals/AddGoalModal";
import Dictionary from "../components/features/dictionary/Dictionary";
import { getGoals, getUserProfile, addGoal } from "../lib/storage";
import { Button } from "@/components/ui/button";
import type { LifeGoal } from "@/lib/types";
import { toast } from "sonner";

const CARD_WIDTH = 288 + 20; // w-72 + gap-5

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
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        left: scrollRef.current.scrollWidth,
        behavior: "smooth",
      });
    }, 100);
  };

  return (
    <>
      <Navbar />
      <WelcomeBanner />
      <Insights goals={goals} profile={profile} />

      {/* Goals Section */}
      <div className="py-8 mb-8 mx-8">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-gray-800">Your Life Goals</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {goals.length} active goal{goals.length !== 1 ? "s" : ""} — keep
            going!
          </p>
        </div>

        {/* Carousel row: arrow · track · arrow */}
        <div className="flex items-stretch gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("left")}
            className="self-center flex-none rounded-full border-[#bbf7d0] hover:bg-[#bbf7d0] hover:border-[#064e3b]/20 shadow-sm"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </Button>

          {/* Scrollable track */}
          <div
            ref={scrollRef}
            className="flex-1 min-w-0 flex gap-5 overflow-x-auto items-stretch py-2"
            style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" }}
          >
            {goals.map((goal, index) => (
              <div
                key={goal.id}
                style={{ scrollSnapAlign: "start", flexShrink: 0, width: 288 }}
              >
                <GoalCard goal={goal} index={index} onUpdate={refreshData} />
              </div>
            ))}

            {/* Add new goal card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              style={{ scrollSnapAlign: "start", flexShrink: 0, width: 288 }}
              onClick={() => setIsModalOpen(true)}
              className="rounded-xl border-2 border-dashed border-[#bbf7d0] bg-white hover:border-[#064e3b]/25 hover:shadow-md transition-all cursor-pointer group flex flex-col items-center justify-center gap-3 min-h-44 p-6"
            >
              <div className="w-11 h-11 rounded-full bg-[#bbf7d0] group-hover:bg-[#064e3b] flex items-center justify-center transition-colors duration-200">
                <Plus className="w-5 h-5 text-[#064e3b] group-hover:text-white transition-colors duration-200" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-700 group-hover:text-[#064e3b] transition-colors text-sm">
                  Add New Goal
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Start saving for your next dream
                </p>
              </div>
            </motion.div>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("right")}
            className="self-center flex-none rounded-full border-[#bbf7d0] hover:bg-[#bbf7d0] hover:border-[#064e3b]/20 shadow-sm"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
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
