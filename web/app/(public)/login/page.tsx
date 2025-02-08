"use client";

import { LoginForm } from "@/components/LoginForm";

export default function Login() {
    return (
        <div className="bg-gradient-to-b from-forest-50 to-sage-100">
            <div className="absolute inset-0 opacity-5" />
            <div className="relative container mx-auto px-4 py-8">
                <LoginForm />
            </div>
        </div>
    );
}
