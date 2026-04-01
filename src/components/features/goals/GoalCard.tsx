import { useState } from "react";
import { motion } from "motion/react";
import { Calendar, DollarSign, Trash2, AlertTriangle, Pencil } from "lucide-react";
import type { LifeGoal } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { addMoneyToGoal, deleteGoal, updateGoal } from "@/lib/storage";
import { toast } from "sonner";

const EMOJI_OPTIONS = [
  "✈️", "🏠", "🚗", "🎓", "💍", "🏖️",
  "💻", "🎸", "🏋️", "🌍", "🛟", "💰",
  "🎉", "📚", "🎮", "🌱",
];

type DialogView = "add" | "edit" | "delete";

interface GoalCardProps {
  goal: LifeGoal;
  index: number;
  onUpdate: () => void;
}

export function GoalCard({ goal, index, onUpdate }: GoalCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<DialogView>("add");
  const [amount, setAmount] = useState("");

  // Edit form state — initialised when edit view opens
  const [editTitle, setEditTitle] = useState("");
  const [editEmoji, setEditEmoji] = useState("");
  const [editCustomEmoji, setEditCustomEmoji] = useState("");
  const [editTarget, setEditTarget] = useState("");
  const [editDeadline, setEditDeadline] = useState("");

  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const remaining = goal.targetAmount - goal.currentAmount;
  const deadline = new Date(goal.deadline);
  const today = new Date();
  const daysRemaining = Math.ceil(
    (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );
  const monthsRemaining = Math.ceil(daysRemaining / 30);

  const openEdit = () => {
    setEditTitle(goal.title);
    setEditEmoji(goal.emoji);
    setEditCustomEmoji("");
    setEditTarget(String(goal.targetAmount));
    setEditDeadline(goal.deadline);
    setView("edit");
  };

  const closeDialog = () => {
    setIsOpen(false);
    setView("add");
    setAmount("");
  };

  const handleAddMoney = () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    addMoneyToGoal(goal.id, value);
    toast.success(`$${value} added to ${goal.title}! 🌱 Plant watered!`);
    setAmount("");
    closeDialog();
    onUpdate();
  };

  const handleSaveEdit = () => {
    const target = parseFloat(editTarget);
    if (!editTitle.trim() || isNaN(target) || target <= 0 || !editDeadline) return;
    updateGoal(goal.id, {
      title: editTitle.trim(),
      emoji: editCustomEmoji || editEmoji,
      targetAmount: target,
      deadline: editDeadline,
    });
    toast.success(`"${editTitle.trim()}" updated!`);
    closeDialog();
    onUpdate();
  };

  const handleDelete = () => {
    deleteGoal(goal.id);
    toast.success(`"${goal.title}" removed.`);
    closeDialog();
    onUpdate();
  };

  const editIsValid =
    editTitle.trim() && parseFloat(editTarget) > 0 && editDeadline;
  const displayEmoji = editCustomEmoji || editEmoji;

  const dialogDescriptions: Record<DialogView, string> = {
    add: "Add money to this goal and watch your plant grow!",
    edit: "Update your goal details below.",
    delete: "This action can't be undone.",
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="h-full"
      >
        <Card
          onClick={() => setIsOpen(true)}
          className="h-full cursor-pointer gap-0 py-0 hover:border-green-300 hover:shadow-lg transition-all flex flex-col"
        >
          {/* Header */}
          <div className="px-6 pt-6 pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{goal.emoji}</span>
                <div>
                  <p className="text-base font-bold text-gray-800 leading-snug">
                    {goal.title}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {monthsRemaining}{" "}
                    {monthsRemaining === 1 ? "month" : "months"} left
                  </p>
                </div>
              </div>
              <span className="text-2xl font-bold text-[#064e3b] shrink-0 ml-2">
                {progress.toFixed(0)}%
              </span>
            </div>
          </div>

          <CardContent className="px-6 pb-6 flex flex-col flex-1">
            <div className="mt-auto space-y-4">
              <div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full bg-linear-to-r ${goal.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(progress, 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 }}
                  />
                </div>
                <div className="flex justify-between mt-1.5 text-xs text-gray-400">
                  <span>${goal.currentAmount.toLocaleString()} saved</span>
                  <span>${goal.targetAmount.toLocaleString()}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                <div>
                  <div className="text-xs text-gray-400 mb-0.5">Target Date</div>
                  <div className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    {deadline.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-0.5">Still Needed</div>
                  <div className="text-sm font-semibold text-gray-700">
                    ${remaining.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Goal Dialog */}
      <Dialog open={isOpen} onOpenChange={(open) => { if (!open) closeDialog(); else setIsOpen(true); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <span className="text-3xl">
                {view === "edit" ? displayEmoji : goal.emoji}
              </span>
              {view === "edit" ? (editTitle || goal.title) : goal.title}
            </DialogTitle>
            <DialogDescription>{dialogDescriptions[view]}</DialogDescription>
          </DialogHeader>

          {/* ── Add money view ── */}
          {view === "add" && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                  <div className="text-xs text-gray-500 mb-1">Saved so far</div>
                  <div className="text-xl font-bold text-[#064e3b]">
                    ${goal.currentAmount.toLocaleString()}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <div className="text-xs text-gray-500 mb-1">Target</div>
                  <div className="text-xl font-bold text-gray-700">
                    ${goal.targetAmount.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full bg-linear-to-r ${goal.color}`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="amount" className="text-sm font-semibold text-gray-700">
                  Amount to Add
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="pl-8 h-11 focus-visible:ring-2 focus-visible:ring-[#064e3b]/20 focus-visible:border-[#064e3b]"
                    step="0.01"
                  />
                </div>
              </div>

              <Button
                onClick={handleAddMoney}
                className="w-full bg-linear-to-r from-[#064e3b] to-emerald-600 hover:from-[#065f46] hover:to-emerald-700 text-white py-5 rounded-xl font-bold"
              >
                Add Money &amp; Water Plant 🌱
              </Button>

              {/* Secondary actions */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={(e) => { e.stopPropagation(); openEdit(); }}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#064e3b] transition-colors py-1"
                >
                  <Pencil className="w-3 h-3" />
                  Edit goal
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setView("delete"); }}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors py-1"
                >
                  Delete goal
                </button>
              </div>
            </div>
          )}

          {/* ── Edit view ── */}
          {view === "edit" && (
            <div className="space-y-4 py-2">
              {/* Goal name */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#064e3b] uppercase tracking-wide">
                  Goal Name
                </Label>
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="h-11 focus-visible:ring-2 focus-visible:ring-[#064e3b]/20 focus-visible:border-[#064e3b]"
                />
              </div>

              {/* Emoji picker */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-[#064e3b] uppercase tracking-wide">
                  Icon
                </Label>
                <div className="grid grid-cols-8 gap-1.5">
                  {EMOJI_OPTIONS.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => { setEditEmoji(e); setEditCustomEmoji(""); }}
                      className={`text-xl h-9 w-9 rounded-lg flex items-center justify-center transition-all duration-150
                        ${editEmoji === e && !editCustomEmoji
                          ? "bg-[#bbf7d0] ring-2 ring-[#064e3b]/30 scale-110 shadow-sm"
                          : "bg-gray-50 border border-gray-100 hover:bg-[#bbf7d0]/50 hover:scale-105"
                        }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
                <Input
                  value={editCustomEmoji}
                  onChange={(e) => {
                    const val = [...e.target.value].slice(-1).join("");
                    setEditCustomEmoji(val);
                  }}
                  placeholder="Or type your own emoji"
                  className="h-9 text-lg placeholder:text-sm placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-[#064e3b]/20 focus-visible:border-[#064e3b]"
                  maxLength={4}
                />
              </div>

              {/* Target + Date row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-[#064e3b] uppercase tracking-wide">
                    Target Amount
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="number"
                      value={editTarget}
                      onChange={(e) => setEditTarget(e.target.value)}
                      className="pl-8 h-11 focus-visible:ring-2 focus-visible:ring-[#064e3b]/20 focus-visible:border-[#064e3b]"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-[#064e3b] uppercase tracking-wide">
                    Target Date
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
                    <Input
                      type="date"
                      value={editDeadline}
                      onChange={(e) => setEditDeadline(e.target.value)}
                      className="pl-8 h-11 focus-visible:ring-2 focus-visible:ring-[#064e3b]/20 focus-visible:border-[#064e3b]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <Button
                  variant="outline"
                  onClick={() => setView("add")}
                  className="rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  disabled={!editIsValid}
                  className="rounded-xl bg-linear-to-r from-[#064e3b] to-emerald-600 hover:from-[#065f46] hover:to-emerald-700 text-white font-semibold disabled:opacity-40"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}

          {/* ── Delete confirm view ── */}
          {view === "delete" && (
            <div className="space-y-4 py-2">
              <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-4">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">
                  Deleting <span className="font-semibold">"{goal.title}"</span> will remove all saved progress. Are you sure?
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => setView("add")}
                  className="rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  Keep Goal
                </Button>
                <Button
                  onClick={handleDelete}
                  className="rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold"
                >
                  <Trash2 className="w-4 h-4 mr-1.5" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
