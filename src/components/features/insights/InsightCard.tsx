import type { LucideIcon } from "lucide-react";

interface InsightCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
}

export function InsightCard({ title, value, icon: Icon }: InsightCardProps) {
  return (
    <div className="bg-card rounded-xl p-5 border border-[#064e3b]/5 shadow-sm hover:shadow-md transition-shadow">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Icon className="h-5 w-5 text-[#064e3b] mb-2" />
          <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-tight">
            {title}
          </p>
        </div>
        <h3 className="text-2xl font-bold text-[#064e3b] mt-1">
          {typeof value === "number" && title.toLowerCase().includes("saved")
            ? `$${value.toLocaleString()}`
            : value}
        </h3>
      </div>
    </div>
  );
}
