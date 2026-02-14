import { useEffect, type ReactNode } from "react";

import useAuth, { isLoggedIn } from "@/hooks/useAuth";
import { replaceTo } from "@/lib/navigation";

export function GuestOnly({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (isLoggedIn()) {
      replaceTo("/");
    }
  }, []);

  if (isLoggedIn()) {
    return null;
  }

  return <>{children}</>;
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, isLoadingUser } = useAuth();

  useEffect(() => {
    if (!isLoggedIn()) {
      replaceTo("/login");
    }
  }, []);

  useEffect(() => {
    if (!isLoadingUser && !user) {
      replaceTo("/login");
    }
  }, [isLoadingUser, user]);

  if (!isLoggedIn() || isLoadingUser || !user) {
    return <div className="text-muted-foreground">Loading...</div>;
  }

  return <>{children}</>;
}

export function RequireSuperuser({ children }: { children: ReactNode }) {
  const { user, isLoadingUser } = useAuth();

  useEffect(() => {
    if (!isLoggedIn()) {
      replaceTo("/login");
      return;
    }

    if (!isLoadingUser && user && !user.is_superuser) {
      replaceTo("/");
    }
  }, [isLoadingUser, user]);

  if (!isLoggedIn() || isLoadingUser || !user || !user.is_superuser) {
    return <div className="text-muted-foreground">Loading...</div>;
  }

  return <>{children}</>;
}
