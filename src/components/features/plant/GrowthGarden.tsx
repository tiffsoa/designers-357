import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Flower } from "lucide-react";

const PLANT_STAGES = [
  { level: 1, emoji: "🌱", label: "Sprout" },
  { level: 2, emoji: "🌿", label: "Seedling" },
  { level: 3, emoji: "🪴", label: "Potted Plant" },
  { level: 4, emoji: "🌳", label: "Mighty Tree" },
];

interface GrowthGardenProps {
  health: number; // 0 to 100
  level: number;
}

export function GrowthGarden({ health, level }: GrowthGardenProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const currentStage = PLANT_STAGES[Math.min(level - 1, 3)];
  const isMaxLevel = level >= 4 && health >= 100;

  useEffect(() => {
    if (health > 0) {
      const startTimer = setTimeout(() => setIsAnimating(true), 0);
      const stopTimer = setTimeout(() => setIsAnimating(false), 1000);
      
      return () => {
        clearTimeout(startTimer);
        clearTimeout(stopTimer);
      };

    }
  }, [health, level]);

  return (
    <div className=" rounded-xl border border-border bg-card p-8 shadow-sm flex flex-col h-full">
      <div className="mb-2">
        <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
          <Flower className="text-primary w-5 h-5" />
          Growth Garden
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Your financial growth journey
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-8">
        <motion.div
          key={currentStage.emoji}
          className="text-8xl drop-shadow-md select-none"
          animate={
            isAnimating
              ? { scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] }
              : { y: [0, -6, 0] }
          }
          transition={{
            duration: isAnimating ? 0.6 : 4,
            repeat: isAnimating ? 0 : Infinity,
            ease: "easeInOut",
          }}
        >
          {currentStage.emoji}
        </motion.div>

        <div className="mt-6 text-center">
          <h3 className="text-lg font-bold text-gray-800">
            Level {level} {currentStage.label}
          </h3>
          <p className="text-sm font-medium text-emerald-600 mt-1">
            {isMaxLevel ? "Fully Grown!" : `${health}% Health`}
          </p>
        </div>
      </div>

      <div className="space-y-2 w-full mt-auto">
        <div className="flex justify-between text-xs font-medium text-gray-500 px-1">
          <span>Plant Health</span>
          <span>{isMaxLevel ? "100" : health}/100</span>
        </div>
        <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: `${isMaxLevel ? 100 : health}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 mt-6">
        <p className="text-sm text-emerald-800 leading-relaxed">
          💡 <strong>How it works:</strong> Add money to your goals to water
          your plant automatically! Each contribution helps it grow stronger. 🌱
        </p>
      </div>
    </div>
  );
}
