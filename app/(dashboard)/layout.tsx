import { Sidebar } from '@/components/shared/Sidebar';
import { BottomNav } from '@/components/shared/BottomNav';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="app-layout">
        <Sidebar />
        <main className="app-main">{children}</main>
        <BottomNav />
      </div>
    </ProtectedRoute>
  );
}
