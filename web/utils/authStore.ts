import { create } from "zustand";

interface AuthState {
    isLoggedIn: boolean;
    login: () => void;
    logout: () => void;
    setAuth: (auth: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    isLoggedIn: false,
    login: () => set({ isLoggedIn: true }),
    logout: () => set({ isLoggedIn: false }),
    setAuth: (auth) => set({ isLoggedIn: auth }),
}));
