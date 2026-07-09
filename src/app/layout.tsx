import type { Metadata, Viewport } from "next";
import "./globals.css";

const fontLink = "https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap";

export const metadata: Metadata = {
  title: "FitSync — The AI-Powered Fitness Ecosystem",
  description:
    "Sync your body, sync your life. AI-powered fitness tracking, nutrition, and community in one premium platform.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FitSync",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0f1a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={fontLink} rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-secondary/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
