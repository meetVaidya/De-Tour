import { create } from "zustand";

export interface User {
  id: string;
  name: string;
  email: string;
  points: number;
}

interface AuthState {
    isLoggedIn: boolean;
    user: any; // or define a proper User type
    login: () => void;
    logout: () => void;
    setAuth: (auth: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    isLoggedIn: false,
    user: null,
    login: () => set({ isLoggedIn: true }),
    logout: () => set({ isLoggedIn: false }),
    setAuth: (auth) => set({ isLoggedIn: auth }),
}));
