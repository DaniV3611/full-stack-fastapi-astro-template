export function navigateTo(path: string): void {
  if (typeof window === "undefined") {
    return;
  }

  if (window.location.pathname === path) {
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

  window.location.replace(path);
}
