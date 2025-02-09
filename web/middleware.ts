"use strict";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/sessions";

// Define all routes that should be protected (require authentication)
const protectedRoutes = [
    "/main",
    "/user-details",
    "/merchants",
    "/merchantregister",
    "/dashboard",
];

// Define public routes (accessible without authentication)
// Removed "/" from publicRoutes to avoid redirecting logged-in users from "/" to "/" again.
const publicRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
    try {
        const pathname = request.nextUrl.pathname;

        // Get the session cookie
        const sessionCookie = request.cookies.get("session")?.value;
        const session = await decrypt(sessionCookie);

        // Debug logs
        console.log("Current path:", pathname);
        console.log("Session:", session);
        console.log(
            "Is protected route:",
            protectedRoutes.some((route) => pathname.startsWith(route)),
        );

        // Check if the current route is protected
        const isProtectedRoute = protectedRoutes.some(
            (route) => pathname.startsWith(route) || pathname === route,
        );

        if (isProtectedRoute && !session?.userId) {
            // Redirect to login if no valid session
            console.log("Redirecting to login...");
            return NextResponse.redirect(new URL("/login", request.url));
        }

        // Check if trying to access auth pages while logged in
        // Only check routes explicitly in publicRoutes
        if (publicRoutes.includes(pathname) && session?.userId) {
            console.log("Redirecting to main...");
            return NextResponse.redirect(new URL("/itinerary", request.url));
        }

        return NextResponse.next();
    } catch (error) {
        console.error("Middleware error:", error);
        // In case of any error, redirect to login
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

// Configure middleware matcher
export const config = {
    matcher: [
        /*
         * Match all paths except:
         * 1. /api/ (API routes)
         * 2. /_next/ (Next.js internals)
         * 3. /static (static files)
         * 4. /favicon.ico, /sitemap.xml (public files)
         */
        "/((?!api|_next|static|favicon.ico|sitemap.xml).*)",
    ],
};
