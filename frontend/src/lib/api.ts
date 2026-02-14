import { OpenAPI } from "@/client";

let configured = false;

export function configureApiClient() {
  if (configured) return;

  const env = import.meta.env as Record<string, string | undefined>;
  OpenAPI.BASE = env.PUBLIC_API_URL ?? env.VITE_API_URL ?? "http://localhost:8000";
  OpenAPI.TOKEN = async () => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("access_token") ?? "";
  };

  configured = true;
}
