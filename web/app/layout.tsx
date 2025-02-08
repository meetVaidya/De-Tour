import { Host_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const hostGrotesk = Host_Grotesk({
    variable: "--font-host-grotesk",
    subsets: ["latin"],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${hostGrotesk.variable} antialiased`}>
                <Navbar />
                <main>{children}</main>
            </body>
        </html>
    );
}
