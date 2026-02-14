import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useMemo } from "react";

import { ApiError } from "@/client";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { configureApiClient } from "@/lib/api";

function handleApiError(error: Error) {
  if (!(error instanceof ApiError)) {
    return;
  }

  if (![401, 403].includes(error.status)) {
    return;
  }

  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("access_token");
  window.location.replace("/login");
}

export function AppProviders({ children }: { children: ReactNode }) {
  configureApiClient();

  const queryClient = useMemo(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: handleApiError,
        }),
        mutationCache: new MutationCache({
          onError: handleApiError,
        }),
      }),
    [],
  );

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster richColors closeButton />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
