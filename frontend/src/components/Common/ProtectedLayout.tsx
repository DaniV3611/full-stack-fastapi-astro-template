import { Home, Settings, ShieldUser } from "lucide-react";
import type { ComponentType, ReactNode } from "react";

import type { UserPublic } from "@/client";
import { Appearance } from "@/components/common/Appearance";
import { Footer } from "@/components/common/Footer";
import { Logo } from "@/components/common/Logo";
import { UserMenu } from "@/components/common/UserMenu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";

type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

export function ProtectedLayout({
  children,
  user,
}: {
  children: ReactNode;
  user: UserPublic | null | undefined;
}) {
  const path = typeof window === "undefined" ? "/" : window.location.pathname;
  const navItems: NavItem[] = [{ href: "/dashboard", label: "Dashboard", icon: Home }];

  if (user?.is_superuser) {
    navItems.push({ href: "/dashboard/admin", label: "Admin", icon: ShieldUser });
  }

  navItems.push({ href: "/dashboard/settings", label: "Settings", icon: Settings });

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="px-4 py-4 group-data-[collapsible=icon]:px-2">
          <Logo href="/dashboard" className="group-data-[collapsible=icon]:hidden" />
          <Logo href="/dashboard" className="hidden text-xs group-data-[collapsible=icon]:block" />
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={path === item.href} tooltip={item.label}>
                        <a href={item.href}>
                          <Icon className="size-4" />
                          <span>{item.label}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <div className="px-2 py-1 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
            <Appearance />
          </div>
          <UserMenu user={user} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="flex h-12 items-center border-b px-4 md:h-14">
          <SidebarTrigger className="-ml-1" />
        </header>

        <div className="flex min-h-[calc(100svh-3rem)] flex-1 flex-col">
          <main className="flex-1 p-6 md:p-8">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
          <Footer />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
