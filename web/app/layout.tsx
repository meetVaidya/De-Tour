import { Host_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { AuthProvider } from "@/components/AuthProvider";
import { getSession } from "@/lib/sessions";

const hostGrotesk = Host_Grotesk({
    variable: "--font-host-grotesk",
    subsets: ["latin"],
});

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();
    const isAuthenticated = !!session;

    return (
        <html lang="en">
            <body>
                <AuthProvider isAuthenticated={isAuthenticated} />
                <Navbar />
                {children}
            </body>
        </html>
    );
}
