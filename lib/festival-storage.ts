import { Festival } from "@/types/festival";

const STORAGE_KEY = "festperfect_festival";

export const storage = {
  saveFestival: (festival: Festival): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(festival));
    } catch (error) {
      console.error("Error saving festival to localStorage:", error);
    }
  },

  loadFestival: (): Festival | null => {
    if (typeof window === "undefined") return null;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error loading festival from localStorage:", error);
      return null;
    }
  },

  clearFestival: (): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing festival from localStorage:", error);
    }
  },
};
