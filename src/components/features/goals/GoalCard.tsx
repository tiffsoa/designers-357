import { useState } from "react";
import { motion } from "motion/react";
import {
  Calendar,
  DollarSign,
  Trash2,
  AlertTriangle,
  Pencil,
} from "lucide-react";
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

  // Edit form state
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
  const monthsRemaining = Math.max(0, Math.ceil(daysRemaining / 30));

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
    toast.success(`$${value} added to ${goal.title}!`);
    setAmount("");
    closeDialog();
    onUpdate();
  };

  const handleSaveEdit = () => {
    const target = parseFloat(editTarget);
    if (!editTitle.trim() || isNaN(target) || target <= 0 || !editDeadline)
      return;
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
    editTitle.trim() !== "" &&
    parseFloat(editTarget) > 0 &&
    editDeadline !== "";

  const displayEmoji = editCustomEmoji || editEmoji;

  const dialogDescriptions: Record<DialogView, string> = {
    add: "Add money to this goal.",
    edit: "Update your goal details below.",
    delete: "This action can't be undone.",
  };

  const safeBgClass = goal.color?.includes("from-")
    ? goal.color.replace("from-", "bg-").split(" ")[0]
    : goal.color;

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
          className="h-full cursor-pointer gap-0 py-0 hover:border-primary/50 hover:shadow-md transition-all flex flex-col"
        >
          {/* Header */}
          <div className="px-6 pt-6 pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{goal.emoji}</span>
                <div>
                  <p className="text-base font-bold text-foreground leading-snug">
                    {goal.title}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {monthsRemaining}{" "}
                    {monthsRemaining === 1 ? "month" : "months"} left
                  </p>
                </div>
              </div>
              <span className="text-2xl font-bold text-primary shrink-0 ml-2">
                {progress.toFixed(0)}%
              </span>
            </div>
          </div>

          <CardContent className="px-6 pb-6 flex flex-col flex-1">
            <div className="mt-auto space-y-4">
              <div>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${safeBgClass}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(progress, 100)}%` }}
                    transition={{
                      duration: 1,
                      ease: "easeOut",
                      delay: index * 0.1,
                    }}
                  />
                </div>
                <div className="flex justify-between mt-1.5 text-xs text-muted-foreground font-medium">
                  <span>${goal.currentAmount.toLocaleString()} saved</span>
                  <span>${goal.targetAmount.toLocaleString()}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
                <div>
                  <div className="text-xs text-muted-foreground mb-0.5">
                    Target Date
                  </div>
                  <div className="text-sm font-semibold flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    {deadline.toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-0.5">
                    Still Needed
                  </div>
                  <div className="text-sm font-semibold">
                    ${remaining.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Goal Dialog */}
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) closeDialog();
          else setIsOpen(true);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <span className="text-2xl">
                {view === "edit" ? displayEmoji : goal.emoji}
              </span>
              {view === "edit" ? editTitle || goal.title : goal.title}
            </DialogTitle>
            <DialogDescription>{dialogDescriptions[view]}</DialogDescription>
          </DialogHeader>

          {/* ── Add money view ── */}
          {view === "add" && (
            <div className="space-y-6 py-2">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-primary/10 rounded-xl p-3 border border-primary/20">
                  <div className="text-xs text-muted-foreground mb-1 font-medium">
                    Saved so far
                  </div>
                  <div className="text-xl font-bold text-primary">
                    ${goal.currentAmount.toLocaleString()}
                  </div>
                </div>
                <div className="bg-muted rounded-xl p-3 border border-border">
                  <div className="text-xs text-muted-foreground mb-1 font-medium">
                    Target
                  </div>
                  <div className="text-xl font-bold">
                    ${goal.targetAmount.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="font-medium">
                  Amount to Add
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="pl-9 h-11"
                    step="0.01"
                  />
                </div>
              </div>

              <Button
                onClick={handleAddMoney}
                className="w-full h-11 font-semibold"
              >
                Add Money
              </Button>

              <div className="flex items-center justify-between pt-2 border-t border-border mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    openEdit();
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit goal
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setView("delete");
                  }}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  Delete goal
                </Button>
              </div>
            </div>
          )}

          {/* ── Edit view ── */}
          {view === "edit" && (
            <div className="space-y-6 py-2">
              {/* Goal name */}
              <div className="space-y-2">
                <Label className="font-medium">Goal Name</Label>
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="h-11"
                />
              </div>

              {/* Emoji picker */}
              <div className="space-y-2">
                <Label className="font-medium">Icon</Label>
                <div className="grid grid-cols-8 gap-2">
                  {EMOJI_OPTIONS.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => {
                        setEditEmoji(e);
                        setEditCustomEmoji("");
                      }}
                      className={`text-xl h-10 w-10 rounded-lg flex items-center justify-center transition-colors
                        ${
                          editEmoji === e && !editCustomEmoji
                            ? "bg-primary/10 border-2 border-primary"
                            : "bg-muted hover:bg-muted/80 border border-transparent"
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
                  className="h-11 mt-2 text-lg placeholder:text-sm placeholder:text-muted-foreground"
                  maxLength={4}
                />
              </div>

              {/* Target + Date row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-medium">Target Amount</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="number"
                      value={editTarget}
                      onChange={(e) => setEditTarget(e.target.value)}
                      className="pl-9 h-11"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="font-medium">Target Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
                    <Input
                      type="date"
                      value={editDeadline}
                      onChange={(e) => setEditDeadline(e.target.value)}
                      className="pl-9 h-11"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setView("add")}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  disabled={!editIsValid}
                  className="flex-1 font-semibold"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}

          {/* ── Delete confirm view ── */}
          {view === "delete" && (
            <div className="space-y-6 py-2">
              <div className="flex items-start gap-3 bg-destructive/10 border border-destructive/20 rounded-xl p-4">
                <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm text-destructive font-medium">
                  Deleting "{goal.title}" will remove all saved progress. Are
                  you sure?
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setView("add")}
                  className="flex-1"
                >
                  Keep Goal
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  className="flex-1 font-semibold"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
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
