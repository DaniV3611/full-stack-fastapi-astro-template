import { ProtectedLayout } from "@/components/common/ProtectedLayout";
import { RequireAuth } from "@/components/common/RouteGuards";
import { AppProviders } from "@/components/providers/AppProviders";
import useAuth from "@/hooks/useAuth";

function DashboardContent() {
  const { user } = useAuth();

  return (
    <ProtectedLayout user={user}>
      <div>
        <h1 className="text-2xl truncate max-w-sm">
          Hi, {user?.full_name || user?.email} 👋
        </h1>
        <p className="text-muted-foreground">Welcome back, nice to see you again!</p>
      </div>
    </ProtectedLayout>
  );
}

export function DashboardPage() {
  return (
    <AppProviders>
      <RequireAuth>
        <DashboardContent />
      </RequireAuth>
    </AppProviders>
  );
}
