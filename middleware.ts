import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
	const { pathname } = req.nextUrl;
	const isAuthenticated = !!req.auth;

	// Public routes that don't require authentication  
	const publicRoutes = ["/", "/auth/sign-in", "/auth/error"];
	const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith("/api/auth");

	// If user is not authenticated and trying to access protected route
	if (!isAuthenticated && !isPublicRoute) {
		const signInUrl = new URL("/auth/sign-in", req.url);
		signInUrl.searchParams.set("callbackUrl", pathname);
		return NextResponse.redirect(signInUrl);
	}

	// If user is authenticated and trying to access sign-in page, redirect to home
	if (isAuthenticated && pathname === "/auth/sign-in") {
		return NextResponse.redirect(new URL("/", req.url));
	}

	return NextResponse.next();
});

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api/auth (auth API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public files (images, etc.)
		 */
		"/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)",
	],
};