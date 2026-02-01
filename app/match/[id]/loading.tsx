export default function MatchLoading() {
    return (
        <div className="min-h-screen bg-[var(--color-background)] p-6 animate-pulse">
            <div className="max-w-6xl mx-auto">
                {/* Back Button Skeleton */}
                <div className="w-32 h-10 bg-white rounded-2xl border border-slate-200 mb-8" />

                {/* Match Header Skeleton */}
                <div className="w-full h-48 bg-white rounded-[32px] border border-slate-200 mb-8" />

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3 space-y-8">
                        {/* Main Chart Skeleton */}
                        <div className="bg-white rounded-[32px] p-8 border border-slate-200 h-[400px]">
                            <div className="w-48 h-8 bg-slate-100 rounded mb-4" />
                            <div className="w-full h-[240px] bg-slate-50 rounded-2xl" />
                        </div>

                        {/* Insights Skeleton */}
                        <div className="bg-white rounded-[32px] p-8 border border-slate-200 h-[200px]">
                            <div className="w-40 h-8 bg-slate-100 rounded mb-8" />
                            <div className="grid grid-cols-3 gap-6">
                                <div className="h-24 bg-slate-50 rounded-2xl" />
                                <div className="h-24 bg-slate-50 rounded-2xl" />
                                <div className="h-24 bg-slate-50 rounded-2xl" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Sidebar Skeletons */}
                        <div className="bg-slate-900 rounded-[32px] p-8 h-[300px]" />
                        <div className="bg-white rounded-[32px] p-8 border border-slate-200 h-[400px]" />
                    </div>
                </div>
            </div>
        </div>
    );
}
