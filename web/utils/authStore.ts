import { create } from "zustand";

export interface User {
  id: string;
  name: string;
  email: string;
  points: number;
}

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
