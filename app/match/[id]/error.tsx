'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function MatchError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen bg-[var(--color-background)] p-6 flex items-center justify-center">
            <div className="text-center max-w-md bg-white p-12 rounded-[40px] border border-slate-200 shadow-xl">
                <div className="text-6xl mb-6">⚠️</div>
                <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Something went wrong</h2>
                <p className="text-slate-500 mb-8 leading-relaxed">
                    {error.message || "We couldn't load the match analysis. It might be a data formatting issue or the match no longer exists."}
                </p>
                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => reset()}
                        className="w-full bg-slate-900 text-white px-6 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl active:scale-95"
                    >
                        Try Again
                    </button>
                    <Link
                        href="/"
                        className="w-full bg-slate-50 text-slate-600 px-6 py-4 rounded-2xl font-bold hover:bg-slate-100 transition-all border border-slate-200"
                    >
                        Back to Feed
                    </Link>
                </div>
            </div>
        </div>
    );
}
