import type { Metadata, Viewport } from "next";
import "./globals.css";

const fontLink = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap";

export const metadata: Metadata = {
  title: "Fitsync — AI-Powered Fitness Platform",
  description:
    "Sync your body, sync your life. AI-powered fitness tracking, nutrition, and community.",
  manifest: "/manifest.json",
  icons: {
    icon: { url: "/favicon.svg", type: "image/svg+xml" },
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={fontLink} rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary selection:bg-accent-coral/15 selection:text-text-primary">
        {children}
      </body>
    </html>
  );
}
