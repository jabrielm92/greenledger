import { create } from "zustand";
import type { OnboardingState } from "@/types";

interface OnboardingStore extends OnboardingState {
  setStep: (step: number) => void;
  setCompanyData: (data: Partial<OnboardingState>) => void;
  setSelectedFrameworks: (frameworks: string[]) => void;
  setQuickbooksConnected: (connected: boolean) => void;
  reset: () => void;
}

const initialState: OnboardingState = {
  step: 1,
  companyName: "",
  employeeCount: "",
  country: "",
  city: "",
  industry: "",
  fiscalYearStart: 1,
  selectedFrameworks: [],
  quickbooksConnected: false,
};

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  ...initialState,
  setStep: (step) => set({ step }),
  setCompanyData: (data) => set((state) => ({ ...state, ...data })),
  setSelectedFrameworks: (frameworks) =>
    set({ selectedFrameworks: frameworks }),
  setQuickbooksConnected: (connected) =>
    set({ quickbooksConnected: connected }),
  reset: () => set(initialState),
}));
