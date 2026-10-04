/** biome-ignore-all assist/source/organizeImports: <explanation> */
"use client";

import Link from "next/link";
import {
  BadgeCheckIcon,
  BanknoteArrowDown,
  BellIcon,
  CreditCardIcon,
  LayoutDashboard,
  LogOutIcon,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import Logo from "@/assets/svg/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";
import { useGetme, useLogout } from "@/hooks";

export const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading } = useGetme();
  const { mutate: logout, isPending: logoutPending } = useLogout();

  const routes = [
    {
      name: "Home",
      url: "/",
    },
    {
      name: "About",
      url: "/about",
    },
    {
      name: "Features",
      url: "/features",
    },
    {
      name: "Contact",
      url: "/contact",
    },
    {
      name: "Complaint",
      url: "/complaint",
    },
  ];

  const user = data?.data;

  const userInitial =
    user?.name?.charAt(0)?.toUpperCase() ??
    user?.email?.charAt(0)?.toUpperCase() ??
    "U";
  const dashboardPathByRole: Record<string, string> = {
    admin: "/dashboard/admin",
    citizen: "/dashboard/citizen",
    manager: "/dashboard/manager",
    technician: "/dashboard/technician",
  };
  const role = user?.role?.trim().toLowerCase();
  const dashboardPath = role ? dashboardPathByRole[role] : undefined;

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        // Remove current user from React Query cache
        queryClient.removeQueries({
          queryKey: ["user"],
        });

        // Remove stored tokens if they are stored in localStorage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        toast.add({
          title: "Logged out",
          description: "Logged out successfully.",
          type: "success",
        });

        router.push("/");
        router.refresh();
      },

      onError: (error) => {
        toast.add({
          title: "Logout failed",
          description:
            error instanceof Error
              ? error.message
              : "Something went wrong. Please try again.",
          type: "error",
        });
      },
    });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Logo />

          <span className="text-xl font-bold tracking-tight text-slate-900">
            CivicFlow
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {routes.map((route) => {
            const isActive =
              route.url === "/"
                ? pathname === "/"
                : pathname.startsWith(route.url);

            return (
              <Link
                key={route.url}
                href={route.url}
                className={[
                  "text-sm font-medium transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-slate-600 hover:text-slate-900",
                ].join(" ")}
              >
                {route.name}
              </Link>
            );
          })}
        </nav>

        {/* Authentication */}
        <div className="flex items-center gap-3">
          {isLoading ? (
            // Loading skeleton
            <div className="size-9 animate-pulse rounded-full bg-slate-200" />
          ) : user ? (
            // Logged in user
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    aria-label="Open user menu"
                  >
                    <Avatar>
                      <AvatarImage
                        src={user.imageUrl || undefined}
                        alt={user.name ?? "User"}
                      />

                      <AvatarFallback>{userInitial}</AvatarFallback>
                    </Avatar>
                  </Button>
                }
              />

              <DropdownMenuContent align="end" className="w-56">
                {/* User Information */}
                <div className="px-2 py-2">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {user.name ?? "User"}
                  </p>

                  <p className="truncate text-xs text-slate-500">
                    {user.email}
                  </p>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  {dashboardPath && (
                    <DropdownMenuItem
                      onClick={() => router.push(dashboardPath)}
                    >
                      <LayoutDashboard />
                      {role
                        ? `${role.charAt(0).toUpperCase()}${role.slice(1)} Dashboard`
                        : "Dashboard"}
                    </DropdownMenuItem>
                  )}

                  {/* Profile */}
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <BadgeCheckIcon />
                    Profile
                  </DropdownMenuItem>

                  {/* Billing */}
                  <DropdownMenuItem
                    onClick={() => router.push("/payment-pending")}
                  >
                   <BanknoteArrowDown />
                    Payment Pending
                  </DropdownMenuItem>
                  {/* My Payments History */}
                  <DropdownMenuItem
                    onClick={() => router.push("/my-payments-history")}
                  >
                    <CreditCardIcon />
                    Payments History
                  </DropdownMenuItem>
                  {/* Notifications */}
                  <DropdownMenuItem
                    onClick={() => router.push("/notifications")}
                  >
                    <BellIcon />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                {/* Logout */}
                <DropdownMenuItem
                  disabled={logoutPending}
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOutIcon />

                  {logoutPending ? "Signing out..." : "Sign Out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // Logged out user
            <>
              {/* Sign In */}
              <Link
                href="/login"
                className="hidden text-sm font-medium text-slate-700 transition hover:text-slate-900 sm:inline-flex"
              >
                Sign in
              </Link>

              {/* Get Started */}
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
