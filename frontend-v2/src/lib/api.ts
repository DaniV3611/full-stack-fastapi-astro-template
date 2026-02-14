import { OpenAPI } from "@/client";
let configured = false;
export function configureApiClient() {
  if (configured) return;
  OpenAPI.BASE = import.meta.env.PUBLIC_API_URL;
  OpenAPI.TOKEN = async () => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("access_token") ?? "";
  };
  configured = true;
}
