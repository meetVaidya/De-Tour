import { create } from "zustand";

interface FontState {
    isOpenDyslexic: boolean;
    toggleFont: () => void;
}

export const useFontStore = create<FontState>((set) => ({
    isOpenDyslexic: false,
    toggleFont: () =>
        set((state) => ({ isOpenDyslexic: !state.isOpenDyslexic })),
}));
