import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased min-h-screen flex flex-col bg-[var(--color-background)] text-[var(--color-text-primary)]`}>
        {/* Brand Header */}
        <header className="w-full bg-[var(--primary-navy)] text-white shadow-lg sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[var(--momentum-positive)] to-[var(--accent-electric-blue)] flex items-center justify-center shadow-lg transform rotate-3">
                <span className="text-[var(--primary-navy)] font-black text-sm">M</span>
              </div>
              <span className="font-black text-xl tracking-tighter text-white">
                MOMENTUM<span className="text-[var(--momentum-positive)]">ARC</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-slate-300">
              <Link href="/" className="hover:text-white transition-colors">Analyzer</Link>
              <Link href="/" className="hover:text-white transition-colors">Live Feed</Link>
              <Link href="/" className="hover:text-white transition-colors">Historical</Link>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Brand Footer */}
        <footer className="w-full bg-white border-t border-slate-200 py-12 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center">
                  <span className="text-white font-bold text-[10px]">M</span>
                </div>
                <span className="font-bold text-sm tracking-tight text-slate-900">
                  Momentum Arc Professional
                </span>
              </div>

              <div className="text-slate-400 text-xs font-medium">
                Built with <span className="text-slate-900 font-bold tracking-tighter">STEP 1-6 Framework</span> • © 2026 Advanced Agentic Coding
              </div>

              <div className="flex gap-6 text-slate-400 text-xs font-bold uppercase tracking-widest">
                <a href="#" className="hover:text-slate-900 transition-colors">API</a>
                <a href="#" className="hover:text-slate-900 transition-colors">Github</a>
                <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
