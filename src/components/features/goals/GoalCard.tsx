import { useState } from "react";
import { motion } from "motion/react";
import confetti from "canvas-confetti";
import {
  Calendar,
  DollarSign,
  Trash2,
  AlertTriangle,
  Pencil,
  CheckCircle2,
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
import {
  addMoneyToGoal,
  deleteGoal,
  updateGoal,
  updateWalletBalance,
  withdrawMoneyFromGoal,
} from "@/lib/storage";
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

type DialogView = "add" | "edit" | "delete" | "confirmAdd" | "withdraw";

interface GoalCardProps {
  goal: LifeGoal;
  index: number;
  onUpdate: () => void;
  walletBalance: number;
}

export function GoalCard({
  goal,
  index,
  onUpdate,
  walletBalance,
}: GoalCardProps) {
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

  const exactTargetDate = deadline.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const daysRemaining = Math.ceil(
    (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );
  

  let timeRemainingText = "";
  if (daysRemaining < 0) {
    timeRemainingText = "Past due";
  } else if (daysRemaining === 0) {
    timeRemainingText = "Due today!";
  } else if (daysRemaining < 30) {
    timeRemainingText = `${daysRemaining} day${daysRemaining !== 1 ? "s" : ""} left`;
  } else {
    const months = Math.round(daysRemaining / 30);
    timeRemainingText = `${months} month${months !== 1 ? "s" : ""} left`;
  }

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

  const isCompleted = goal.currentAmount >= goal.targetAmount;

  const initiateAddMoney = () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      toast.error("Please enter a valid positive amount");
      return;
    }
    if (value > walletBalance) {
      toast.error("Not enough funds in your wallet!");
      return;
    }
    setView("confirmAdd"); // Move to confirmation screen instead of saving instantly
  };

  const handleConfirmAdd = () => {
    const value = parseFloat(amount);
    addMoneyToGoal(goal.id, value);
    updateWalletBalance(walletBalance - value);

    if (goal.currentAmount + value >= goal.targetAmount) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      toast.success(`🎉 You did it! ${goal.title} is fully funded! `);
    } else {
      toast.success(`$${value} added to ${goal.title}! Check your Growth Garden to see your plant grow 🌱`);
    }
    setAmount("");
    closeDialog();
    onUpdate();
  };

  const handleWithdraw = () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      toast.error("Please enter a valid positive amount");
      return;
    }
    if (value > goal.currentAmount) {
      toast.error("You cannot withdraw more than you've saved!");
      return;
    }

    withdrawMoneyFromGoal(goal.id, value);
    updateWalletBalance(walletBalance + value);
    toast.success(`$${value} withdrawn back to your wallet.`);
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
    toast.success(`"${goal.title}" successfully deleted.`);
    closeDialog();
    onUpdate();
  };

  const editIsValid =
    editTitle.trim() !== "" &&
    parseFloat(editTarget) > 0 &&
    editDeadline !== "";

  const displayEmoji = editCustomEmoji || editEmoji;

  const dialogDescriptions: Record<DialogView, string> = {
    add: "Manage the funds for this goal.",
    edit: "Update your goal details below.",
    delete: "This action can't be undone.",
    confirmAdd: "Confirm your deposit.",
    withdraw: "Take money out of this goal.",
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
          className={`h-full cursor-pointer gap-0 py-0 hover:shadow-md transition-all flex flex-col ${
            isCompleted
              ? "bg-emerald-50 border-emerald-200 hover:border-emerald-300"
              : "bg-card hover:border-primary/50"
          }`}
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
                  {isCompleted ? (
                    <div className="flex items-center gap-1 mt-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full w-fit">
                      <CheckCircle2 className="w-3 h-3" /> Goal Reached
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {timeRemainingText}
                    </p>
                  )}
                </div>
              </div>
              <span className="text-2xl font-bold text-primary shrink-0 ml-2">
                {Math.min(progress, 100).toFixed(0)}%
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
            <DialogTitle className="flex items-center justify-between text-xl">
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  {view === "edit" ? displayEmoji : goal.emoji}
                </span>
                {view === "edit" ? editTitle || goal.title : goal.title}
              </div>

              {view === "add" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 text-muted-foreground hover:text-foreground flex items-center gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    openEdit();
                  }}
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span className="text-sm font-medium">Edit Goal</span>
                </Button>
              )}
            </DialogTitle>
            <DialogDescription>{dialogDescriptions[view]}</DialogDescription>
          </DialogHeader>

          {/* ── Add money view ── */}
          {view === "add" && (
            <div className="space-y-6 py-2">
              {/* UPDATED: Clean, unified 4-card grid */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-muted/30 p-3 rounded-xl border border-border flex flex-col items-center justify-center">
                  <span className="text-xs text-muted-foreground font-medium mb-1">
                    Target Date
                  </span>
                  <span className="font-semibold text-foreground text-center leading-tight">
                    {exactTargetDate}
                  </span>
                </div>
                <div className="bg-muted/30 rounded-xl p-3 border border-border flex flex-col items-center justify-center">
                  <div className="text-xs text-muted-foreground mb-1 font-medium">
                    Target Amount
                  </div>
                  <div className="text-lg font-bold">
                    ${goal.targetAmount.toLocaleString()}
                  </div>
                </div>
                {/* We use the primary color just for the "Saved" stat to highlight success */}
                <div className="bg-primary/10 rounded-xl p-3 border border-primary/20 flex flex-col items-center justify-center">
                  <div className="text-xs text-primary/80 mb-1 font-medium">
                    Saved so far
                  </div>
                  <div className="text-xl font-bold text-primary">
                    ${goal.currentAmount.toLocaleString()}
                  </div>
                </div>
                <div className="bg-muted/30 rounded-xl p-3 border border-border flex flex-col items-center justify-center">
                  <div className="text-xs text-muted-foreground mb-1 font-medium">
                    Still Needed
                  </div>
                  <div className="text-lg font-bold text-foreground">
                    ${remaining.toLocaleString()}
                  </div>
                </div>
              </div>

              {isCompleted ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-2">
                  <div className="text-4xl">🥳</div>
                  <h3 className="font-bold text-emerald-800">
                    You've reached your target!
                  </h3>
                  <p className="text-sm text-emerald-600">
                    This goal is fully funded.
                  </p>
                </div>
              ) : (
                <div className="bg-muted/20 border border-border rounded-xl p-4 space-y-4">
                  <div className="text-sm flex justify-between px-1">
                    <span className="text-muted-foreground">
                      Available in Wallet:
                    </span>
                    <span className="font-semibold text-primary">
                      ${walletBalance.toLocaleString()}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="amount"
                      className="font-medium text-xs text-muted-foreground uppercase tracking-wider"
                    >
                      Amount to Transfer
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="amount"
                        type="number"
                        min="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="pl-9 h-11 bg-background"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-1">
                    <Button
                      onClick={() => setView("withdraw")}
                      variant="outline"
                      className="flex-1 h-10 font-medium text-muted-foreground hover:text-foreground"
                    >
                      Withdraw
                    </Button>
                    <Button
                      onClick={initiateAddMoney}
                      className="flex-1 h-10 font-semibold shadow-sm"
                    >
                      Add Money
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Confirm Add View ── */}
          {view === "confirmAdd" && (
            <div className="space-y-6 py-2">
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 text-center">
                <p className="text-muted-foreground text-sm mb-2">
                  You are about to add
                </p>
                <p className="text-4xl font-bold text-primary mb-2">
                  ${parseFloat(amount).toLocaleString()}
                </p>
                <p className="text-muted-foreground text-sm">to {goal.title}</p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setView("add")}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmAdd}
                  className="flex-1 font-semibold"
                >
                  Confirm Deposit
                </Button>
              </div>
            </div>
          )}

          {/* ── Withdraw View ── */}
          {view === "withdraw" && (
            <div className="space-y-6 py-2">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                <p className="text-amber-800 text-sm">
                  Move money from this goal back to your wallet.
                </p>
                <p className="text-amber-900 font-bold mt-2">
                  Available to withdraw: ${goal.currentAmount.toLocaleString()}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Amount to Withdraw</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="number"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="pl-9 h-11"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setView("add")}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleWithdraw}
                  className="flex-1 font-semibold bg-amber-500 hover:bg-amber-600 text-white"
                >
                  Confirm Withdrawal
                </Button>
              </div>
            </div>
          )}

          {/* ── Edit view ── */}
          {view === "edit" && (
            <div className="space-y-6 p-5 bg-white border border-border rounded-xl mt-2 shadow-inner">
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

              <div className="flex items-center justify-between pt-4 border-t border-border mt-6">
                <Button
                  variant="ghost"
                  onClick={() => setView("delete")}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive px-2"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Goal
                </Button>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setView("add")}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveEdit}
                    disabled={!editIsValid}
                    className="font-semibold"
                  >
                    Save Changes
                  </Button>
                </div>
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
