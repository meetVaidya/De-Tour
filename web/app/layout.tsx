"use client";
import { Host_Grotesk } from "next/font/google";
import "./globals.css";
import "../styles/fonts.css";
import { Navbar } from "@/components/Navbar";
import { AuthProvider } from "@/components/AuthProvider";
import { FontSwitcher } from "@/components/FontSwitcher";
import { useFontStore } from "@/utils/font-store";
import { useEffect, useState } from "react";

const hostGrotesk = Host_Grotesk({
    variable: "--font-host-grotesk",
    subsets: ["latin"],
});

function FontProvider({ children }: { children: React.ReactNode }) {
    const { isOpenDyslexic } = useFontStore();

    return (
        <div
            style={{
                fontFamily: isOpenDyslexic ? "OpenDyslexic" : "inherit",
            }}
        >
            {children}
        </div>
    );
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check authentication status on client side
        const checkAuth = async () => {
            try {
                const response = await fetch("/api/auth/check");
                const data = await response.json();
                setIsAuthenticated(data.isAuthenticated);
            } catch (error) {
                console.error("Error checking auth status:", error);
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    return (
        <html lang="en">
            <body>
                <AuthProvider isAuthenticated={isAuthenticated} />
                <Navbar />
                <FontProvider>{children}</FontProvider>
                <FontSwitcher />
            </body>
        </html>
    );
}
