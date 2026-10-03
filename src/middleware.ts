import { NextRequest, NextResponse } from "next/server";

const authRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	const accessToken = request.cookies.get("accessToken")?.value;

	// Logged-in user cannot access login/register
	if (accessToken && authRoutes.includes(pathname)) {
		return NextResponse.redirect(new URL("/profile", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/login", "/register"],
};