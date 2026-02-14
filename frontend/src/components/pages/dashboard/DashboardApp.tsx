import { useEffect, useState } from "react";

import { RequireAuth, RequireSuperuser } from "@/components/common/RouteGuards";
import { AdminContent } from "@/components/pages/AdminPage";
import { DashboardContent } from "@/components/pages/DashboardPage";
import { SettingsContent } from "@/components/pages/SettingsPage";
import { AppProviders } from "@/components/providers/AppProviders";

function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }

  return pathname;
}

function DashboardRoutes() {
  const [pathname, setPathname] = useState(() => {
    if (typeof window === "undefined") {
      return "/dashboard";
    }

    return normalizePath(window.location.pathname);
  });

  useEffect(() => {
    const updatePath = () => {
      setPathname(normalizePath(window.location.pathname));
    };

    updatePath();
    window.addEventListener("popstate", updatePath);
    document.addEventListener("astro:page-load", updatePath);

    return () => {
      window.removeEventListener("popstate", updatePath);
      document.removeEventListener("astro:page-load", updatePath);
    };
  }, []);

  if (pathname === "/dashboard/admin") {
    return (
      <RequireSuperuser>
        <AdminContent />
      </RequireSuperuser>
    );
  }

  if (pathname === "/dashboard/settings") {
    return <SettingsContent />;
  }

  return <DashboardContent />;
}

export function DashboardApp() {
  return (
    <AppProviders>
      <RequireAuth>
        <DashboardRoutes />
      </RequireAuth>
    </AppProviders>
  );
}
