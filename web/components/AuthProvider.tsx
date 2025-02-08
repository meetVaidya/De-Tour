'use client'

import { useEffect } from "react";
import { useAuthStore } from "@/utils/authStore";

export function AuthProvider({ isAuthenticated }: { isAuthenticated: boolean }) {
    const setAuth = useAuthStore((state) => state.setAuth);

    useEffect(() => {
        setAuth(isAuthenticated);
    }, [isAuthenticated, setAuth]);

    return null;
}
