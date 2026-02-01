import Link from 'next/link';

export default function MatchNotFound() {
    return (
        <div className="min-h-screen bg-[var(--color-background)] p-6 flex items-center justify-center">
            <div className="text-center max-w-md bg-white p-12 rounded-[40px] border border-slate-200 shadow-xl">
                <div className="text-6xl mb-6">🔍</div>
                <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Match Not Found</h2>
                <p className="text-slate-500 mb-8 leading-relaxed">
                    We couldn't find the specific match you're looking for. It might have been moved or the ID is incorrect.
                </p>
                <Link
                    href="/"
                    className="inline-block bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl active:scale-95"
                >
                    Back to Feed
                </Link>
            </div>
        </div>
    );
}
