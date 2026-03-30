import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, DollarSign } from "lucide-react";
import type { LifeGoal } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { addMoneyToGoal } from "@/lib/storage";
import { toast } from "sonner";

interface GoalCardProps {
  goal: LifeGoal;
  index: number;
  onUpdate: () => void;
}

export function GoalCard({ goal, index, onUpdate }: GoalCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");

  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const remaining = goal.targetAmount - goal.currentAmount;

  const deadline = new Date(goal.deadline);
  const today = new Date();
  const daysRemaining = Math.ceil(
    (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );
  const monthsRemaining = Math.ceil(daysRemaining / 30);

  const handleAddMoney = () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    addMoneyToGoal(goal.id, value);
    toast.success(`$${value} added to ${goal.title}! 🌱 Plant watered!`);
    setAmount("");
    setIsOpen(false);
    onUpdate();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        onClick={() => setIsOpen(true)}
        className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 hover:border-green-300 transition-all hover:shadow-lg cursor-pointer"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{goal.emoji}</div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">{goal.title}</h3>
              <p className="text-sm text-gray-500">
                {monthsRemaining} {monthsRemaining === 1 ? "month" : "months"}{" "}
                left
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              {progress.toFixed(0)}%
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${goal.color}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-gray-500 mb-1">Target Date</div>
            <div className="text-sm font-medium text-gray-800 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {deadline.toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Remaining</div>
            <div className="text-sm font-medium text-gray-800">
              ${remaining.toLocaleString()}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Add Money Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <span className="text-3xl">{goal.emoji}</span>
              {goal.title}
            </DialogTitle>
            <DialogDescription>
              Add money to this goal and watch your plant grow!
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-xs text-gray-600">Current</div>
                <div className="text-xl font-bold text-green-700">
                  ${goal.currentAmount.toLocaleString()}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-600">Target</div>
                <div className="text-xl font-bold text-gray-700">
                  ${goal.targetAmount.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount to Add</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="pl-8"
                  step="0.01"
                />
              </div>
            </div>

            <Button
              onClick={handleAddMoney}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-6 rounded-xl font-bold"
            >
              Add Money & Water Plant 🌱
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
