import { navigate, transitionEnabledOnThisPage } from "astro:transitions/client";

export function navigateTo(path: string): void {
  if (typeof window === "undefined") {
    return;
  }

  if (window.location.pathname === path) {
    return;
  }

  if (transitionEnabledOnThisPage()) {
    navigate(path, { history: "auto" });
    return;
  }

  window.location.assign(path);
}

export function replaceTo(path: string): void {
  if (typeof window === "undefined") {
    return;
  }

  if (window.location.pathname === path) {
    return;
  }

  if (transitionEnabledOnThisPage()) {
    navigate(path, { history: "replace" });
    return;
  }

  window.location.replace(path);
}
