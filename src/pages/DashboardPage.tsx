import Navbar from "@/components/features/navigation/Navbar";

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <div className="p-8">
        <h1 className="text-3xl font-bold">Welcome back, Sarah!</h1>
        <p className="text-muted-foreground">Here is what's happening today.</p>
        {/* temporary placeholder to test login*/}
      </div>
    </>
  );
}
