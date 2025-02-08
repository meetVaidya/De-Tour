'use client';

import { motion } from "framer-motion";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { login } from "@/lib/actions";
import Link from "next/link";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function LoginForm() {
    const [state, loginAction] = useActionState(login, undefined);

    return (
        <div className="min-h-screen bg-gradient-to-b from-forest-50 to-sage-100">
            <div className="absolute inset-0 bg-[url('/leaf-pattern.png')] opacity-5" />

            <main className="relative container mx-auto px-4 py-12 max-w-md">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    transition={{ duration: 0.5 }}
                    className="backdrop-blur-sm bg-white/90 rounded-2xl shadow-xl p-8 md:p-10 border border-forest-200"
                >
                    <div className="space-y-4 mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-forest-800 group">
                            Welcome Back
                            <span className="block h-1 w-20 bg-forest-500 mt-2 group-hover:w-32 transition-all duration-300" />
                        </h1>
                        <p className="text-forest-600 text-lg">
                            Sign in to your account
                        </p>
                    </div>

                    <form
                        action={loginAction}
                        className="space-y-6"
                    >
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-forest-700">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 rounded-xl border border-forest-200
                                         focus:ring-forest-500 focus:border-forest-500
                                         placeholder-forest-400 text-forest-900"
                            />
                            {state?.errors?.email && (
                                <p className="text-red-500 text-sm mt-1">{state.errors.email}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-forest-700">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                className="w-full px-4 py-3 rounded-xl border border-forest-200
                                         focus:ring-forest-500 focus:border-forest-500
                                         placeholder-forest-400 text-forest-900"
                            />
                            {state?.errors?.password && (
                                <p className="text-red-500 text-sm mt-1">{state.errors.password}</p>
                            )}
                        </div>

                        <div className="space-y-4">
                            <SubmitButton />

                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={fadeIn}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="text-center"
                            >
                                <p className="text-forest-600">
                                    Don't have an account?{" "}
                                    <Link
                                        href="/register"
                                        className="text-forest-700 hover:text-forest-800 font-medium
                                                underline decoration-2 decoration-forest-300
                                                hover:decoration-forest-500 transition-all duration-200"
                                    >
                                        Register here
                                    </Link>
                                </p>
                            </motion.div>
                        </div>
                    </form>
                </motion.div>
            </main>
        </div>
    );
}

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <motion.button
            disabled={pending}
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
                w-full py-3 px-6 text-lg font-medium text-white
                bg-gradient-to-r from-forest-600 to-forest-500
                hover:from-forest-700 hover:to-forest-600
                rounded-xl shadow-md
                transform transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2
                ${pending ? 'opacity-50 cursor-not-allowed' : ''}
                group
            `}
        >
            {pending ? (
                <span className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Signing in...</span>
                </span>
            ) : (
                <span className="flex items-center justify-center space-x-2">
                    <span>Sign In</span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                         fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </span>
            )}
        </motion.button>
    );
}

export default LoginForm;
