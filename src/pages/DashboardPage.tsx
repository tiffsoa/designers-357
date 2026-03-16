import Navbar from "@/components/features/navigation/Navbar";
import { WelcomeBanner } from "@/components/features/welcomeBanner/welcomeBanner";
import Insights from "@/components/features/insights/Insights";
import Dictionary from "../components/features/dictionary/Dictionary"

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <WelcomeBanner />
      <Insights />
      <Dictionary />
    </>
  );
}
