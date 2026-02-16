import type { Metadata } from "next";
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
    "carbon emissions",
    "reporting",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
