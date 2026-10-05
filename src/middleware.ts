import { NextRequest, NextResponse } from "next/server";

type Role =
  | "CITIZEN"
  | "STAFF"
  | "TECHNICIAN"
  | "MANAGER"
  | "ADMIN";

const roleRoutes: Record<string, Role[]> = {
  "/dashboard/citizen": ["CITIZEN"],
  "/dashboard/technician": ["TECHNICIAN"],
  "/dashboard/manager": ["MANAGER"],
  "/dashboard/admin": ["ADMIN"],
};

const protectedRoutes = [
  "/dashboard",
  "/complaint",
  "/payment-pending",
  "/profile",
  "/settings",
];

const authRoutes = [
  "/login",
  "/register",
];

function getRoleFromToken(
  token: string,
): Role | null {
  try {
    const payload = JSON.parse(
      Buffer.from(
        token.split(".")[1],
        "base64url",
      ).toString(),
    );

    return payload.role ?? null;
  } catch {
    return null;
  }
}

export function middleware(
  request: NextRequest,
) {
  const { pathname } = request.nextUrl;

  const accessToken =
    request.cookies.get("accessToken")?.value;

  const isAuthRoute = authRoutes.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`),
  );

  /*
   * Already logged in → don't allow
   * login/register page
   */
  if (isAuthRoute && accessToken) {
    const role =
      getRoleFromToken(accessToken);

    if (role === "ADMIN") {
      return NextResponse.redirect(
        new URL(
          "/dashboard/admin",
          request.url,
        ),
      );
    }

    if (role === "MANAGER") {
      return NextResponse.redirect(
        new URL(
          "/dashboard/manager",
          request.url,
        ),
      );
    }

    if (role === "TECHNICIAN") {
      return NextResponse.redirect(
        new URL(
          "/dashboard/technician",
          request.url,
        ),
      );
    }

    return NextResponse.redirect(
      new URL(
        "/dashboard/citizen",
        request.url,
      ),
    );
  }

  /*
   * Check authenticated routes
   */
  const isProtectedRoute =
    protectedRoutes.some(
      (route) =>
        pathname === route ||
        pathname.startsWith(`${route}/`),
    );

  if (isProtectedRoute && !accessToken) {
    const loginUrl = new URL(
      "/login",
      request.url,
    );

    loginUrl.searchParams.set(
      "redirect",
      pathname,
    );

    return NextResponse.redirect(loginUrl);
  }

  /*
   * Check role-based routes
   */
  for (const [
    route,
    allowedRoles,
  ] of Object.entries(roleRoutes)) {
    const matches =
      pathname === route ||
      pathname.startsWith(`${route}/`);

    if (!matches) {
      continue;
    }

    if (!accessToken) {
      return NextResponse.redirect(
        new URL(
          "/login",
          request.url,
        ),
      );
    }

    const role =
      getRoleFromToken(accessToken);

    if (
      !role ||
      !allowedRoles.includes(role)
    ) {
      return NextResponse.redirect(
        new URL(
          "/dashboard",
          request.url,
        ),
      );
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