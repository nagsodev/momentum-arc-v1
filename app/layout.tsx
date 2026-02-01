import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Momentum Arc | Professional Tennis Analysis",
  description: "Advanced AI-powered tennis match momentum visualization. Deep-dive into every swing, break point, and tactical shift with the professional Momentum Arc analyzer.",
  keywords: ["tennis", "momentum", "analytics", "visualization", "ATP", "WTA", "match analysis"],
  authors: [{ name: "Advanced Agentic Coding" }],
  openGraph: {
    title: "Momentum Arc | Professional Tennis Analysis",
    description: "AI-powered tennis match momentum visualization. See the narrative behind the score.",
    url: "https://momentum-arc.vercel.app",
    siteName: "Momentum Arc",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Momentum Arc Analytics Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Momentum Arc | Tennis Momentum Visualizer",
    description: "Deep-dive into tennis match narratives with AI momentum curves.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
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
      <body className={`${inter.className} antialiased min-h-screen flex flex-col bg-[var(--color-background)] text-[var(--color-text-primary)] transition-colors duration-300`}>
        {/* Brand Header */}
        <header className="w-full bg-[var(--primary-navy)] text-white shadow-lg sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--primary-navy)] rounded-xl p-1 transition-all">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[var(--momentum-positive)] to-[var(--accent-electric-blue)] flex items-center justify-center shadow-lg transform rotate-3">
                <span className="text-[var(--primary-navy)] font-black text-sm">M</span>
              </div>
              <span className="font-black text-xl tracking-tighter text-white">
                MOMENTUM<span className="text-[var(--momentum-positive)]">ARC</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
              <Link href="/" className="hover:text-white transition-colors focus-visible:text-white outline-none">Analyzer</Link>
              <Link href="/" className="hover:text-white transition-colors focus-visible:text-white outline-none">Live Feed</Link>
              <Link href="/" className="hover:text-white transition-colors focus-visible:text-white outline-none">Historical</Link>
            </nav>
          </div>
        </header>

        {/* Main Content with Transition */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-page-enter">
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
