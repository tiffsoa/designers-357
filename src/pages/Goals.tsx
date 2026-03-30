import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Target, Sparkles } from "lucide-react";
import { GoalCard } from "../components/features/goals/GoalCard";
import { getGoals } from "../lib/storage";
import { Button } from "../components/ui/button";
import Navbar from "@/components/features/navigation/Navbar";

export function Goals() {
  const [goals, setGoals] = useState(getGoals());

  const refreshGoals = () => {
    setGoals(getGoals());
  };

  return (
    <>
      <Navbar />
      <div className="space-y-6 py-8 pb-12 mx-8">
        <div className="bg-primary rounded-2xl p-8 text-background shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-6 h-6" />
            <span className="text-sm font-medium text-primary-foreground/80">
              Life Goals
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-4">
            What Are You Working Towards?
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl">
            These aren't just savings accounts - they're your dreams taking
            shape. Let's make them happen! 🎯
          </p>
        </div>

        <Button className="bg-gradient-to-r bg-primary rounded-2xl p-8 text-background shadow-lg  text-white py-6 px-8 rounded-xl font-bold shadow-lg">
          <Plus className="w-5 h-5 mr-2" />
          Add New Goal
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal, index) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              index={index}
              onUpdate={refreshGoals}
            />
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-8 shadow-md border border-gray-200"
        >
          <div className="flex items-start gap-4">
            <Sparkles className="w-8 h-8 text-green-600 mt-1" />
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Pro Tips for Crushing Your Goals
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-xl">🎯</span>
                  <span>
                    <strong>Be specific:</strong> "Europe trip" becomes "2 weeks
                    in Italy + France with $3,500 budget"
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-xl">📅</span>
                  <span>
                    <strong>Set realistic deadlines:</strong> Give yourself
                    breathing room - life happens!
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-xl">💰</span>
                  <span>
                    <strong>Automate it:</strong> Set up automatic transfers so
                    saving happens without thinking
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-xl">🎉</span>
                  <span>
                    <strong>Celebrate milestones:</strong> Hit 25%? 50%? Treat
                    yourself (reasonably!) for staying on track
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
