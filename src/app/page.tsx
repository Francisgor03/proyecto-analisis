import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import DashboardContent from "@/components/DashboardContent";
import AuthGuard from "@/components/AuthGuard";

export default function HomePage() {
  return (
    <AuthGuard>
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
    </AuthGuard>
  );
}
