import { InsightCard } from "./InsightCard";
import {Icons} from "@/components/shared/icons";

export default function Insights() {
    return (
      <div id="insights" className="ml-30 mr-30 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 scroll-mt-20">
        <InsightCard
          title="Total Saved"
          value={"$2250"}
          icon={Icons.walletIcon}
        />
        <InsightCard
          title="Savings Rate"
          value={"45%"}
          icon={Icons.trendingUpIcon}
        />
        <InsightCard
          title="Active Goals"
          value={"5"}
          icon={Icons.targetIcon}
        />
        <InsightCard
          title="Active Streak"
          value={"12 days"}
          icon={Icons.flameIcon}
        />
      </div>
    );
}
