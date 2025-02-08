"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
    return (
        <nav className="absolute top-0 left-0 right-0 z-50 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link
                    href="/"
                    className="text-white font-bold text-2xl font-grotesk"
                >
                    ACME
                </Link>
                <div className="hidden md:flex items-center space-x-8">
                    <Link href="#" className="text-white hover:text-gray-200">
                        About
                    </Link>
                    <Link href="#" className="text-white hover:text-gray-200">
                        Services
                    </Link>
                    <Link href="#" className="text-white hover:text-gray-200">
                        Tour
                    </Link>
                    <Link href="#" className="text-white hover:text-gray-200">
                        Blog
                    </Link>
                    <Link href="#" className="text-white hover:text-gray-200">
                        Contact
                    </Link>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="text-white">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                            />
                        </svg>
                    </button>
                    <Button
                        variant="outline"
                        className="text-white border-white hover:bg-white hover:text-black"
                    >
                        Login
                    </Button>
                </div>
            </div>
        </nav>
    );
}
