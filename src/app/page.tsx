import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import DashboardContent from "@/components/DashboardContent";

export default function HomePage() {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--background)" }}>
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar />
        <main
          id="main-content"
          className="flex-1 overflow-y-auto"
          style={{ background: "var(--background)" }}
        >
          <DashboardContent />
        </main>
      </div>
    </div>
  );
}
