import { useState } from "react";

const goalsData = [
  { id: 1, name: "Grad Trip" },
  { id: 2, name: "First Condo" },
  { id: 3, name: "Emergency Fund" },
];

export default function BudgetPlan() {
  const [total, setTotal] = useState(500);
  const [allocations, setAllocations] = useState(
    goalsData.map((g) => ({ ...g, amount: 0 }))
  );

  const handleChange = (id: number, value: number) => {
    setAllocations((prev) =>
      prev.map((g) =>
        g.id === id ? { ...g, amount: value } : g
      )
    );
  };

  const totalAllocated = allocations.reduce(
    (sum, g) => sum + g.amount,
    0
  );

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Budget Plan
      </h1>

      {/* Total Input */}
      <div className="mb-6">
        <label className="block mb-2">
          Total Budget ($)
        </label>
        <input
          type="number"
          value={total}
          onChange={(e) => setTotal(Number(e.target.value))}
          className="border p-2 w-full"
        />
      </div>

      {/* Goals */}
      <div className="space-y-4">
        {allocations.map((goal) => (
          <div key={goal.id}>
            <label className="block">
              {goal.name}: ${goal.amount}
            </label>
            <input
              type="range"
              min={0}
              max={total}
              value={goal.amount}
              onChange={(e) =>
                handleChange(goal.id, Number(e.target.value))
              }
              className="w-full"
            />
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6">
        <p>Total Allocated: ${totalAllocated}</p>
        <p>Remaining: ${total - totalAllocated}</p>
      </div>
    </div>
  );
}
