import { type NextRequest, NextResponse } from "next/server";

type Role = "CITIZEN" | "STAFF" | "TECHNICIAN" | "MANAGER" | "ADMIN";

const dashboardByRole: Record<Role, string> = {
  ADMIN: "/dashboard/admin",
  MANAGER: "/dashboard/manager",
  TECHNICIAN: "/dashboard/technician",
  CITIZEN: "/dashboard/citizen",
  STAFF: "/dashboard/citizen",
};

const roleRoutes: Record<string, Role[]> = {
  "/dashboard/admin": ["ADMIN"],
  "/dashboard/manager": ["MANAGER"],
  "/dashboard/technician": ["TECHNICIAN"],
  "/dashboard/citizen": ["CITIZEN"],
};

const protectedRoutes = [
  "/dashboard",
  "/complaint",
  "/payment-pending",
  "/profile",
  "/settings",
];

const authRoutes = ["/login", "/register"];

function matchesRoute(pathname: string, route: string): boolean {
  return pathname === route || pathname.startsWith(`${route}/`);
}

function getRoleFromToken(token: string): Role | null {
  try {
    const parts = token.split(".");

    if (parts.length !== 3 || !parts[1]) {
      return null;
    }

    const payloadPart = parts[1].replace(/-/g, "+").replace(/_/g, "/");

    const normalizedPayload = payloadPart.padEnd(
      Math.ceil(payloadPart.length / 4) * 4,
      "=",
    );

    const payload = JSON.parse(atob(normalizedPayload)) as {
      role?: unknown;
      exp?: unknown;
    };

    // Reject expired tokens when the token contains an expiration.
    if (
      typeof payload.exp === "number" &&
      payload.exp <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    if (typeof payload.role !== "string") {
      return null;
    }

    const role = payload.role.toUpperCase();

    if (
      role === "ADMIN" ||
      role === "MANAGER" ||
      role === "TECHNICIAN" ||
      role === "CITIZEN" ||
      role === "STAFF"
    ) {
      return role;
    }

    return null;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const role = accessToken ? getRoleFromToken(accessToken) : null;

  const isAuthRoute = authRoutes.some((route) => matchesRoute(pathname, route));

  const isProtectedRoute = protectedRoutes.some((route) =>
    matchesRoute(pathname, route),
  );

  // Redirect authenticated users away from login and registration.
  if (isAuthRoute && role) {
    const destination = dashboardByRole[role];

    return NextResponse.redirect(new URL(destination, request.url));
  }

  // Require authentication for protected routes.
  if (isProtectedRoute && !role) {
    const loginUrl = new URL("/login", request.url);

    loginUrl.searchParams.set("redirect", `${pathname}${search}`);

    return NextResponse.redirect(loginUrl);
  }

  // Restrict dashboards to their allowed roles.
  if (isProtectedRoute && role) {
    for (const [route, allowedRoles] of Object.entries(roleRoutes)) {
      if (!matchesRoute(pathname, route)) {
        continue;
      }

      if (!allowedRoles.includes(role)) {
        return NextResponse.redirect(
          new URL(dashboardByRole[role], request.url),
        );
      }

      break;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/complaint/:path*",
    "/payment-pending/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/login",
    "/register",
  ],
};
