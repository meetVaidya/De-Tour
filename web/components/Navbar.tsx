"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-forest-50/90 border-b border-forest-200">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="group"
                >
                    <Link
                        href="/"
                        className="text-forest-800 font-bold text-2xl font-grotesk flex items-center space-x-2"
                    >
                        <svg
                            className="w-8 h-8 text-forest-600"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4.5 12.75l6 6 9-13.5"
                            />
                        </svg>
                        <span>ACME</span>
                        <span className="block h-1 w-0 group-hover:w-full bg-forest-500 transition-all duration-300" />
                    </Link>
                </motion.div>

                <div className="hidden md:flex items-center space-x-8">
                    {["About", "Services", "Tour", "Blog", "Contact"].map((item) => (
                        <motion.div
                            key={item}
                            whileHover={{ y: -2 }}
                            className="group"
                        >
                            <Link
                                href="#"
                                className="text-forest-700 hover:text-forest-900 font-medium relative"
                            >
                                {item}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-forest-500 group-hover:w-full transition-all duration-300" />
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <div className="flex items-center space-x-4">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-forest-600 hover:text-forest-800 transition-colors duration-200"
                    >
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
                    </motion.button>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button
                            variant="outline"
                            className="
                                bg-gradient-to-r from-forest-600 to-forest-500
                                hover:from-forest-700 hover:to-forest-600
                                text-white border-none
                                px-6 py-2 rounded-xl
                                shadow-md hover:shadow-lg
                                transition-all duration-200
                            "
                        >
                            Login
                        </Button>
                    </motion.div>
                </div>
            </div>
        </nav>
    );
}
