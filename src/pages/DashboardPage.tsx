import Navbar from "@/components/features/navigation/Navbar";
import { WelcomeBanner } from "@/components/features/welcomeBanner/welcomeBanner";
import Insights from "@/components/features/insights/Insights";
import Dictionary from "../components/features/dictionary/Dictionary"
import ManifestationSlider from "@/components/features/slider/manifestationSlider";

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <WelcomeBanner />
      <Insights />
      <ManifestationSlider />
      <Dictionary />
    </>
  );
}
