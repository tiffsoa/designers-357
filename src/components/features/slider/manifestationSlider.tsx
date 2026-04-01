"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { TrendingUp, Calendar, PiggyBank, Calculator } from "lucide-react";

const getUserProfile = () => ({
  weeklySavings: 50,
  weeklyIncome: 500,
});

const saveUserProfile = (profile: any) => {
  console.log("saved", profile);
};

export default function ManifestationSlider() {
  const [profile, setProfile] = useState(getUserProfile());
  const [savingsValue, setSavingsValue] = useState([profile.weeklySavings]);

  const monthlyImpact = savingsValue[0] * 4.33;
  const yearlyImpact = savingsValue[0] * 52;
  const yearlyWithInterest = yearlyImpact * 1.04;

  const handleValueChange = (value: number[]) => {
    setSavingsValue(value);
  };

  const handleValueCommit = (value: number[]) => {
    const newProfile = { ...profile, weeklySavings: value[0] };
    setProfile(newProfile);
    saveUserProfile(newProfile);
  };

  const getMotivationalMessage = () => {
    const pct = (savingsValue[0] / profile.weeklyIncome) * 100;
    if (pct === 0) return "Slide to see your potential";
    if (pct < 10) return "A solid start to your savings habit.";
    if (pct < 20) return "Great momentum, you're on the right track.";
    if (pct < 30) return "Excellent discipline. Your future self thanks you.";
    return "Outstanding savings rate. Maximizing your growth!";
  };

  return (
    <div className="mt-8 mb-8 px-8">
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        {/* Header */}
        <div className="mb-6 flex flex-col items-start border-b border-border pb-4">
          <div className="flex items-center gap-2 mb-1">
            <Calculator className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">
              Savings Simulator
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Adjust your weekly contribution to see the long-term impact on your
            goals.
          </p>
        </div>

        <div className="mb-8 rounded-xl bg-muted/30 p-6 border border-border/50">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="text-center md:text-left md:w-1/3 shrink-0">
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                If I save
              </div>
              <div className="text-5xl font-bold text-primary tracking-tight mb-1">
                ${savingsValue[0]}
              </div>
              <div className="text-sm font-medium text-muted-foreground">
                per week
              </div>
            </div>

            <div className="w-full md:w-2/3">
              <div className="mb-4 flex justify-between text-sm font-medium text-muted-foreground">
                <span>$0</span>
                <span>${profile.weeklyIncome} Max</span>
              </div>
              <Slider
                value={savingsValue}
                onValueChange={handleValueChange}
                onValueCommit={handleValueCommit}
                max={profile.weeklyIncome}
                step={5}
                className="py-2 cursor-pointer"
              />
              <div className="mt-4 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {getMotivationalMessage()}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-1">
            Projected Growth
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-muted/50 border border-border p-5 flex flex-col items-center text-center transition-colors hover:bg-muted">
              <Calendar className="mb-3 h-5 w-5 text-muted-foreground" />
              <div className="text-2xl font-bold text-foreground">
                ${monthlyImpact.toFixed(0)}
              </div>
              <div className="text-xs font-medium text-muted-foreground mt-1 uppercase tracking-wider">
                Per Month
              </div>
            </div>

            <div className="rounded-xl bg-muted/50 border border-border p-5 flex flex-col items-center text-center transition-colors hover:bg-muted">
              <TrendingUp className="mb-3 h-5 w-5 text-muted-foreground" />
              <div className="text-2xl font-bold text-foreground">
                ${yearlyImpact.toFixed(0)}
              </div>
              <div className="text-xs font-medium text-muted-foreground mt-1 uppercase tracking-wider">
                Per Year
              </div>
            </div>

            <div className="rounded-xl bg-primary p-5 flex flex-col items-center text-center text-primary-foreground shadow-md relative overflow-hidden">
              <div className="absolute -right-4 -top-4 opacity-10">
                <PiggyBank className="h-24 w-24" />
              </div>

              <PiggyBank className="mb-3 h-5 w-5 opacity-90 relative z-10" />
              <div className="text-2xl font-bold relative z-10">
                ${yearlyWithInterest.toFixed(0)}
              </div>
              <div className="text-xs font-medium opacity-90 mt-1 uppercase tracking-wider relative z-10">
                With 4% Interest
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}