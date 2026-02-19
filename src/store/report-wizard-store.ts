import { create } from "zustand";

interface ReportWizardState {
  step: number;
  title: string;
  frameworkType: string;
  reportingPeriodId: string;
  selectedSections: string[];
  generatedSections: Record<string, GeneratedSectionData>;
  manualEdits: Record<string, string>;
  isGenerating: boolean;
  generationProgress: number;
  currentGeneratingSection: string;
  reportId: string | null;

  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setTitle: (title: string) => void;
  setFrameworkType: (type: string) => void;
  setReportingPeriodId: (id: string) => void;
  setSelectedSections: (sections: string[]) => void;
  toggleSection: (code: string) => void;
  setGeneratedSection: (code: string, data: GeneratedSectionData) => void;
  setManualEdit: (code: string, content: string) => void;
  setIsGenerating: (generating: boolean) => void;
  setGenerationProgress: (progress: number, section?: string) => void;
  setReportId: (id: string) => void;
  reset: () => void;
}

interface GeneratedSectionData {
  code: string;
  title: string;
  content: string;
  dataPointsUsed: string[];
  confidence: number;
}

const initialState = {
  step: 0,
  title: "",
  frameworkType: "CSRD",
  reportingPeriodId: "",
  selectedSections: [] as string[],
  generatedSections: {} as Record<string, GeneratedSectionData>,
  manualEdits: {} as Record<string, string>,
  isGenerating: false,
  generationProgress: 0,
  currentGeneratingSection: "",
  reportId: null as string | null,
};

export const useReportWizardStore = create<ReportWizardState>((set) => ({
  ...initialState,

  setStep: (step) => set({ step }),
  nextStep: () => set((s) => ({ step: Math.min(s.step + 1, 4) })),
  prevStep: () => set((s) => ({ step: Math.max(s.step - 1, 0) })),

  setTitle: (title) => set({ title }),
  setFrameworkType: (frameworkType) => set({ frameworkType }),
  setReportingPeriodId: (reportingPeriodId) => set({ reportingPeriodId }),

  setSelectedSections: (selectedSections) => set({ selectedSections }),
  toggleSection: (code) =>
    set((s) => ({
      selectedSections: s.selectedSections.includes(code)
        ? s.selectedSections.filter((c) => c !== code)
        : [...s.selectedSections, code],
    })),

  setGeneratedSection: (code, data) =>
    set((s) => ({
      generatedSections: { ...s.generatedSections, [code]: data },
    })),

  setManualEdit: (code, content) =>
    set((s) => ({
      manualEdits: { ...s.manualEdits, [code]: content },
    })),

  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setGenerationProgress: (generationProgress, currentGeneratingSection) =>
    set({
      generationProgress,
      ...(currentGeneratingSection ? { currentGeneratingSection } : {}),
    }),

  setReportId: (reportId) => set({ reportId }),
  reset: () => set(initialState),
}));
