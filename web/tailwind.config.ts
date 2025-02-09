import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            gridTemplateRows: {
                "auto-140": "repeat(auto-fill, 140px)",
            },
            colors: {
                earth: {
                    50: "#f8f9f7",
                    100: "#e8eae6",
                    200: "#d1d6cd",
                    300: "#b3bca9",
                    400: "#919c85",
                    500: "#738264",
                    600: "#5d684f",
                    700: "#4a523f",
                    800: "#3c4233",
                    900: "#32372b",
                },
                forest: {
                    50: "#f2f7f4",
                    100: "#e0ede5",
                    200: "#c1dccb",
                    300: "#94c3a6",
                    400: "#62a67f",
                    500: "#3f8a5f",
                    600: "#2d6f4a",
                    700: "#245b3d",
                    800: "#1f4832",
                    900: "#1b3c2b",
                },
                sage: {
                    50: "#f5f8f5",
                    100: "#e7efe7",
                    200: "#c5d8c5",
                    300: "#a3c1a3",
                    400: "#739973",
                    500: "#497849",
                    600: "#385d38",
                    700: "#2c482c",
                    800: "#213721",
                    900: "#162516",
                },
                moss: {
                    50: "#f3f8f3",
                    100: "#e7f1e7",
                    200: "#d1e4d1",
                    300: "#a9cba9",
                    400: "#7aad7a",
                    500: "#558c55",
                    600: "#417041",
                    700: "#355935",
                    800: "#2d482d",
                    900: "#263c26",
                },
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                chart: {
                    "1": "hsl(var(--chart-1))",
                    "2": "hsl(var(--chart-2))",
                    "3": "hsl(var(--chart-3))",
                    "4": "hsl(var(--chart-4))",
                    "5": "hsl(var(--chart-5))",
                },
            },
            fontFamily: {
                grotesk: ["var(--font-host-grotesk)"],
                sans: ["Inter var", "sans-serif"],
                opendyslexic: ["OpenDyslexic", "sans-serif"],
            },
            animation: {
                "fade-in": "fadeIn 0.5s ease-out",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0", transform: "translateY(10px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
        },
    },
    plugins: [require("tailwindcss-animate"), require("@tailwindcss/forms")],
} satisfies Config;
