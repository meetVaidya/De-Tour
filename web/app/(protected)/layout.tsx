// app/(protected)/layout.tsx
"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation"; // Import usePathname
import { useAuth } from "@/context/AuthContext";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname(); // Get current path

  useEffect(() => {
    if (loading) return; // Wait until loading is finished

    // Case 1: Not authenticated -> Redirect to sign-in
    if (!user) {
      // Avoid redirect loop if already on a public auth page
      if (pathname !== "/sign-in" && pathname !== "/sign-up") {
        console.log("ProtectedLayout: No user, redirecting to /sign-in");
        router.replace("/sign-in");
      }
      return;
    }

    // Case 2: Authenticated but NOT onboarded (no role) -> Redirect to sign-up to choose type
    if (user && !user.role) {
      // Avoid redirect loop if already on the sign-up page or onboarding
      if (pathname !== "/sign-up" && pathname !== "/onboarding") {
        console.log(
          "ProtectedLayout: User authenticated but no role, redirecting to /sign-up to choose type.",
        );
        // Redirect to sign-up page. The user will select type and likely click Google again.
        router.replace("/sign-up");
      }
      return;
    }

    // Case 3: Authenticated AND onboarded (has role) -> Allow access
    // No redirect needed, allow children to render.
    // console.log("ProtectedLayout: User authenticated and has role, allowing access.");
  }, [user, loading, router, pathname]); // Add pathname to dependency array

  // Render loading state
  if (loading) {
    return <div>Loading session...</div>;
  }

  // Render children only if authenticated AND onboarded,
  // OR if currently on the onboarding page itself (which handles its own logic)
  if (user && (user.role || pathname === "/onboarding")) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <main>
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    );
  }

  // Fallback/Waiting state while redirecting
  // Avoid rendering children if user exists but has no role and isn't on onboarding/signup
  if (
    user &&
    !user.role &&
    pathname !== "/sign-up" &&
    pathname !== "/onboarding"
  ) {
    return <div>Redirecting...</div>; // Or loading indicator
  }

  // If not loading, no user, and not on auth pages (should have been redirected)
  if (!user && pathname !== "/sign-in" && pathname !== "/sign-up") {
    return <div>Redirecting to sign in...</div>; // Or loading indicator
  }

  // If none of the above conditions met (e.g., on /sign-in or /sign-up when not logged in), render nothing from layout
  // Or potentially render children if the auth pages themselves are inside this layout group (but they shouldn't be)
  return null;
}
