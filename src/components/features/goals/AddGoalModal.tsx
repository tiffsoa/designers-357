import { useState } from "react";
import { DollarSign, Calendar } from "lucide-react";
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
import type { LifeGoal } from "@/lib/types";

const EMOJI_OPTIONS = [
  "✈️",
  "🏠",
  "🚗",
  "🎓",
  "💍",
  "🏖️",
  "💻",
  "🎸",
  "🏋️",
  "🌍",
  "🛟",
  "💰",
  "🎉",
  "📚",
  "🎮",
  "🌱",
];

// Changed from gradients to solid tailwind colors
const GOAL_COLORS = [
  "bg-emerald-500",
  "bg-green-500",
  "bg-teal-500",
  "bg-lime-500",
  "bg-cyan-500",
];

interface AddGoalModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (goal: Omit<LifeGoal, "id" | "currentAmount">) => void;
  goalCount: number;
}

export function AddGoalModal({
  open,
  onClose,
  onAdd,
  goalCount,
}: AddGoalModalProps) {
  const [title, setTitle] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("🎯");
  const [customEmoji, setCustomEmoji] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");

  const displayEmoji = customEmoji || selectedEmoji;
  const isValid =
    title.trim() && targetAmount && parseFloat(targetAmount) > 0 && deadline;

  const handleSubmit = () => {
    if (!isValid) return;
    onAdd({
      title: title.trim(),
      emoji: displayEmoji,
      targetAmount: parseFloat(targetAmount),
      deadline,
      color: GOAL_COLORS[goalCount % GOAL_COLORS.length],
    });
    setTitle("");
    setSelectedEmoji("🎯");
    setCustomEmoji("");
    setTargetAmount("");
    setDeadline("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add New Goal</DialogTitle>
          <DialogDescription>
            Set a target amount and deadline for your next savings goal.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-2">
          {/* Goal name */}
          <div className="space-y-2">
            <Label htmlFor="goal-title" className="font-medium">
              Goal Name
            </Label>
            <Input
              id="goal-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Trip to Japan, Down Payment"
              className="h-11"
            />
          </div>

          {/* Emoji picker */}
          <div className="space-y-2">
            <Label className="font-medium">Pick an Icon</Label>
            <div className="grid grid-cols-8 gap-2">
              {EMOJI_OPTIONS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => {
                    setSelectedEmoji(e);
                    setCustomEmoji("");
                  }}
                  className={`text-xl h-10 w-10 rounded-lg flex items-center justify-center transition-colors
                    ${
                      selectedEmoji === e && !customEmoji
                        ? "bg-primary/10 border-2 border-primary"
                        : "bg-muted hover:bg-muted/80 border border-transparent"
                    }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Amount + Date row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-medium">Target Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="number"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  placeholder="0.00"
                  className="pl-9 h-11"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-medium">Target Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
                <Input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="pl-9 h-11 block w-full"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={!isValid}
            className="w-full h-11 font-semibold mt-2 text-white"
          >
            Create Goal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
