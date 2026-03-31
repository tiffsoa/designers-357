import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DollarSign, Calendar, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { LifeGoal } from "@/lib/types";

const EMOJI_OPTIONS = [
  "✈️", "🏠", "🚗", "🎓", "💍", "🏖️",
  "💻", "🎸", "🏋️", "🌍", "🛟", "💰",
  "🎉", "📚", "🎮", "🌱",
];

const GOAL_COLORS = [
  "from-emerald-500 to-teal-500",
  "from-green-500 to-emerald-500",
  "from-lime-500 to-green-500",
  "from-teal-500 to-emerald-600",
  "from-green-400 to-teal-500",
  "from-emerald-400 to-green-600",
];

interface AddGoalModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (goal: Omit<LifeGoal, "id" | "currentAmount">) => void;
  goalCount: number;
}

export function AddGoalModal({ open, onClose, onAdd, goalCount }: AddGoalModalProps) {
  const [title, setTitle] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("🎯");
  const [customEmoji, setCustomEmoji] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");

  const displayEmoji = customEmoji || selectedEmoji;
  const isValid = title.trim() && targetAmount && parseFloat(targetAmount) > 0 && deadline;

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
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden gap-0 border-0 shadow-2xl">
        {/* Modal Header */}
        <div className="bg-[#064e3b] px-6 pt-6 pb-5">
          <DialogTitle className="text-white text-xl font-bold flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-[#bbf7d0]" />
            Set a New Goal
          </DialogTitle>
          <p className="text-[#bbf7d0]/80 text-sm">
            What dream are you working towards?
          </p>
        </div>

        {/* Modal Body */}
        <div className="bg-[#f9fefb] px-6 py-5 space-y-5">
          {/* Goal name */}
          <div className="space-y-1.5">
            <Label className="text-[#064e3b] font-semibold text-sm tracking-wide uppercase text-xs">
              Goal Name
            </Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Trip to Japan, Dream Car..."
              className="bg-white border-gray-200 focus-visible:ring-2 focus-visible:ring-[#064e3b]/20 focus-visible:border-[#064e3b] h-11 text-gray-800 placeholder:text-gray-400"
            />
          </div>

          {/* Emoji picker */}
          <div className="space-y-2">
            <Label className="text-[#064e3b] font-semibold text-xs tracking-wide uppercase">
              Pick an Icon
            </Label>
            <div className="grid grid-cols-8 gap-1.5">
              {EMOJI_OPTIONS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => { setSelectedEmoji(e); setCustomEmoji(""); }}
                  className={`text-xl h-9 w-9 rounded-lg flex items-center justify-center transition-all duration-150
                    ${selectedEmoji === e && !customEmoji
                      ? "bg-[#bbf7d0] ring-2 ring-[#064e3b]/30 scale-110 shadow-sm"
                      : "bg-white border border-gray-100 hover:bg-[#bbf7d0]/50 hover:scale-105"
                    }`}
                >
                  {e}
                </button>
              ))}
            </div>
            <Input
              value={customEmoji}
              onChange={(e) => {
                const val = [...e.target.value].slice(-1).join("");
                setCustomEmoji(val);
              }}
              placeholder="Or type your own emoji"
              className="bg-white border-gray-200 focus-visible:ring-2 focus-visible:ring-[#064e3b]/20 focus-visible:border-[#064e3b] h-9 text-lg placeholder:text-sm placeholder:text-gray-400"
              maxLength={4}
            />
          </div>

          {/* Amount + Date row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[#064e3b] font-semibold text-xs tracking-wide uppercase">
                Target Amount
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="number"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  placeholder="0.00"
                  className="pl-8 bg-white border-gray-200 focus-visible:ring-2 focus-visible:ring-[#064e3b]/20 focus-visible:border-[#064e3b] h-11"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[#064e3b] font-semibold text-xs tracking-wide uppercase">
                Target Date
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
                <Input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="pl-8 bg-white border-gray-200 focus-visible:ring-2 focus-visible:ring-[#064e3b]/20 focus-visible:border-[#064e3b] h-11"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>
          </div>

          {/* Live preview */}
          <AnimatePresence>
            {title && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-xl p-3.5 flex items-center gap-3 border border-[#bbf7d0] shadow-sm"
              >
                <span className="text-2xl">{displayEmoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-800 text-sm truncate">{title}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {targetAmount && parseFloat(targetAmount) > 0
                      ? `$${parseFloat(targetAmount).toLocaleString()} target`
                      : "Set your target amount"}
                    {deadline && ` · Due ${new Date(deadline + "T00:00:00").toLocaleDateString("en-US", { month: "short", year: "numeric" })}`}
                  </div>
                </div>
                <div className="text-xs font-semibold text-[#064e3b] bg-[#bbf7d0] px-2 py-0.5 rounded-full">
                  0%
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={!isValid}
            className="w-full bg-linear-to-r from-[#064e3b] to-emerald-600 hover:from-[#065f46] hover:to-emerald-700 text-white py-5 rounded-xl font-bold text-base shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Create Goal &amp; Start Saving 🌱
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
