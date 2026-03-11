import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ROI Calculator — See How Much You Could Save on ESG Compliance",
  description:
    "Calculate your ESG compliance costs and see how much you could save with GreenLedger vs. manual reporting, consultants, or enterprise platforms.",
  openGraph: {
    title: "ROI Calculator — See How Much You Could Save",
    description:
      "Calculate your ESG compliance costs and discover potential savings with automated reporting.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ESG Compliance ROI Calculator | GreenLedger",
    description:
      "Calculate your compliance costs and see savings with automated ESG reporting.",
  },
  alternates: {
    canonical:
      "https://greenledger.arisolutionsinc.com/roi-calculator",
  },
};

export default function ROICalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
