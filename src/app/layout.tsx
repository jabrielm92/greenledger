import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "GreenLedger — ESG Compliance on Autopilot",
    template: "%s | GreenLedger",
  },
  description:
    "AI-powered ESG compliance automation for small and medium businesses. Transform complex regulatory requirements into simple workflows.",
  keywords: [
    "ESG",
    "compliance",
    "sustainability",
    "CSRD",
    "GRI",
    "SASB",
    "carbon emissions",
    "reporting",
    "GreenLedger",
  ],
  authors: [{ name: "GreenLedger" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "GreenLedger",
    title: "GreenLedger — ESG Compliance on Autopilot",
    description:
      "Stop drowning in spreadsheets. GreenLedger automates ESG data collection, emissions calculation, and compliance reporting for SMBs.",
  },
  twitter: {
    card: "summary_large_image",
    title: "GreenLedger — ESG Compliance on Autopilot",
    description:
      "AI-powered ESG compliance for small and medium businesses. CSRD, GRI, SASB reports in minutes.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
