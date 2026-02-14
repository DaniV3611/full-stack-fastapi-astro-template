import { ChevronsUpDown, LogOut, Settings } from "lucide-react";

import type { UserPublic } from "@/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import useAuth from "@/hooks/useAuth";
import { navigateTo } from "@/lib/navigation";
import { getInitials } from "@/utils";

export function UserMenu({ user }: { user: UserPublic | null | undefined }) {
  const { logout } = useAuth();
  const { isMobile, setOpenMobile } = useSidebar();

  if (!user) {
    return null;
  }

  const handleMenuClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              data-testid="user-menu"
            >
              <div className="flex min-w-0 items-center gap-2.5 text-left">
                <Avatar className="size-8">
                  <AvatarFallback className="bg-zinc-600 text-white text-xs">
                    {getInitials(user.full_name || "User")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{user.full_name || "User"}</p>
                  <p className="text-muted-foreground truncate text-xs">{user.email}</p>
                </div>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex items-center gap-2.5">
                <Avatar className="size-8">
                  <AvatarFallback className="bg-zinc-600 text-white text-xs">
                    {getInitials(user.full_name || "User")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{user.full_name || "User"}</p>
                  <p className="text-muted-foreground truncate text-xs">{user.email}</p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                handleMenuClick();
                navigateTo("/dashboard/settings");
              }}
            >
              <Settings className="size-4" />
              User Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                handleMenuClick();
                logout();
              }}
            >
              <LogOut className="size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
