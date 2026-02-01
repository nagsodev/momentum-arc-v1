import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tennis Momentum Visualizer",
  description: "AI-powered tennis match momentum visualization",
  openGraph: {
    title: "Tennis Momentum Visualizer",
    description: "AI-powered tennis match momentum visualization",
    type: "website",
    locale: "de_DE",
    siteName: "Momentum Arc",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#001A3E",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={`${inter.className} antialiased min-h-screen flex flex-col bg-[var(--color-background)] text-[var(--color-text-primary)]`}>
        {/* Brand Header */}
        <header className="w-full bg-[var(--primary-navy)] text-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Logo Placeholder */}
              <div className="w-8 h-8 rounded-full bg-[var(--momentum-positive)] flex items-center justify-center shadow-sm">
                <span className="text-[var(--primary-navy)] font-bold text-xs">M</span>
              </div>
              <span className="font-bold text-lg tracking-tight text-white">
                Momentum Arc
              </span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
