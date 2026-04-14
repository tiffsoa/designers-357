import { useState, useRef} from "react";
import { Plus, ChevronLeft, ChevronRight, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/features/navigation/Navbar";
import { WelcomeBanner } from "@/components/features/welcomeBanner/welcomeBanner";
import Insights from "@/components/features/insights/Insights";
import Dictionary from "../components/features/dictionary/Dictionary";
import ManifestationSlider from "@/components/features/slider/manifestationSlider";
import { GrowthGarden } from "@/components/features/plant/GrowthGarden";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { GoalCard } from "@/components/features/goals/GoalCard";
import { AddGoalModal } from "@/components/features/goals/AddGoalModal";
import {
  getGoals,
  getUserProfile,
  addGoal,
  getWalletBalance,
  updateWalletBalance,
} from "../lib/storage";
import { Button } from "@/components/ui/button";
import type { LifeGoal } from "@/lib/types";
import { toast } from "sonner";

const CARD_WIDTH = 288 + 20;

export default function DashboardPage() {
  const [goals, setGoals] = useState(getGoals());
  const [profile, setProfile] = useState(getUserProfile());
  const [walletBalance, setWalletBalance] = useState(getWalletBalance());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [walletDepositAmount, setWalletDepositAmount] = useState("");

  const handleDepositToWallet = () => {
    const val = parseFloat(walletDepositAmount);
    if (isNaN(val) || val <= 0) {
      toast.error("Please enter a valid positive amount.");
      return;
    }
    updateWalletBalance(walletBalance + val);
    setWalletBalance(getWalletBalance()); // Refresh state
    setWalletDepositAmount("");
    setIsWalletModalOpen(false);
    toast.success(`$${val.toLocaleString()} added to your wallet!`);
  };

  const calculatePlantStats = () => {
    const totalTarget = goals.reduce((acc, g) => acc + g.targetAmount, 0);
    const totalCurrent = goals.reduce((acc, g) => acc + g.currentAmount, 0);

    if (totalTarget === 0) return { health: 0, level: 1 };

    const overallProgress = (totalCurrent / totalTarget) * 100;

    // Level 1: 0-25%, Level 2: 26-50%, Level 3: 51-75%, Level 4: 76-100%
    const level = Math.min(4, Math.max(1, Math.ceil(overallProgress / 25)));
    const health = Math.floor(overallProgress);

    return { health, level };
  };

  const plantStats = calculatePlantStats();

  const refreshData = () => {
    setGoals(getGoals());
    setProfile(getUserProfile());
    setWalletBalance(getWalletBalance());
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

      <div className="mx-8 mb-6 flex items-center justify-between bg-primary/10 border border-primary/20 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-lg">
            <Wallet className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Available to Save
            </p>
            <p className="text-2xl font-bold text-foreground">
              $
              {walletBalance.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>
        <Button
          onClick={() => setIsWalletModalOpen(true)}
          variant="outline"
          className="gap-2 bg-white"
        >
          <Plus className="w-4 h-4" /> Add Funds
        </Button>
      </div>

      <Dialog open={isWalletModalOpen} onOpenChange={setIsWalletModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Deposit to Wallet</DialogTitle>
            <DialogDescription>
              Simulate adding money to your account.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Deposit Amount</Label>
              <Input
                type="number"
                min="0"
                value={walletDepositAmount}
                onChange={(e) => setWalletDepositAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <Button onClick={handleDepositToWallet} className="w-full">
              Deposit
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Insights goals={goals} profile={profile} />

      <div id="goals" className="py-8 mb-8 mx-8">
        <div className="mb-5 flex justify-between items-end">
          <h2 className="text-2xl font-bold text-gray-800">Your Life Goals</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {goals.length} active goal{goals.length !== 1 ? "s" : ""}
          </p>
        </div>

        {goals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-border rounded-xl bg-muted/30">
            <span className="text-6xl mb-4">🌱</span>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No goals yet!
            </h3>
            <p className="text-muted-foreground text-center max-w-sm mb-6">
              Create your first financial goal to start growing your plant.
            </p>
            <Button onClick={() => setIsModalOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" /> Create First Goal
            </Button>
          </div>
        ) : (
          <div className="flex items-stretch gap-3">
            <Button onClick={() => scroll("left")} size="icon">
              <ChevronLeft />
            </Button>

            <div ref={scrollRef} className="flex-1 flex gap-5 overflow-x-auto">
              {goals.map((goal, index) => (
                <div key={goal.id} style={{ width: 288 }}>
                  <GoalCard
                    goal={goal}
                    index={index}
                    onUpdate={refreshData}
                    walletBalance={walletBalance}
                  />
                </div>
              ))}

              <motion.div
                onClick={() => setIsModalOpen(true)}
                className="border-dashed border p-6 cursor-pointer flex items-center justify-center hover:bg-muted/50 transition-colors rounded-xl"
                style={{ width: 288 }}
              >
                <Plus />
              </motion.div>
            </div>

            <Button onClick={() => scroll("right")} size="icon">
              <ChevronRight />
            </Button>
          </div>
        )}
      </div>

      <div className="mx-8 mb-16 grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <GrowthGarden health={plantStats.health} level={plantStats.level} />
        <ManifestationSlider />
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