'use client';
import Link from 'next/link';
import matches from '../../data/matches.json';
import { calculateMomentum } from '../../lib/momentum/momentum-engine';
import type { Match } from '../../lib/types';

export default function Feed() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-4"
                    >
                        ← Back to Home
                    </Link>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                        Live Momentum Feed
                    </h1>
                </div>

                <div className="space-y-4">
                    {matches.matches.map((match) => {
                        const typedMatch = match as Match;
                        const momentum = calculateMomentum(typedMatch);
                        const currentMomentum = momentum.states[momentum.states.length - 1] || 0;

                        return (
                            <Link
                                key={typedMatch.id}
                                href={`/match/${typedMatch.id}`}
                                className="block"
                            >
                                <div className="group bg-white/70 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 hover:shadow-2xl hover:bg-white/90 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center">
                                                <span className="text-white font-bold text-lg">🎾</span>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-xl text-slate-900">{typedMatch.tournament}</h3>
                                                <p className="text-sm text-slate-500">{typedMatch.round}</p>
                                            </div>
                                        </div>
                                        <div className={`px-4 py-2 rounded-full font-bold text-sm ${currentMomentum > 0
                                            ? 'bg-green-100 text-green-700'
                                            : currentMomentum < 0
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-slate-100 text-slate-700'
                                            }`}>
                                            {currentMomentum > 0 ? '+' : ''}{currentMomentum}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <span className="text-2xl">{typedMatch.player1.country === 'SRB' ? '🇷🇸' : '🎾'}</span>
                                                <span className="font-semibold text-lg">{typedMatch.player1.name}</span>
                                            </div>
                                        </div>

                                        <div className="text-center px-4">
                                            <div className="text-sm font-medium text-slate-500 mb-1">Set {typedMatch.sets.length}</div>
                                            <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-2 rounded-full transition-all duration-1000 ${currentMomentum > 0
                                                        ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                                                        : currentMomentum < 0
                                                            ? 'bg-gradient-to-r from-red-400 to-pink-500'
                                                            : 'bg-slate-400'
                                                        }`}
                                                    style={{
                                                        width: `${50 + (currentMomentum * 10)}%`,
                                                        marginLeft: currentMomentum < 0 ? `${50 + (currentMomentum * 10)}%` : '0'
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex-1 text-right">
                                            <div className="flex items-center space-x-2 mb-1 justify-end">
                                                <span className="font-semibold text-lg">{typedMatch.player2.name}</span>
                                                <span className="text-2xl">{typedMatch.player2.country === 'ESP' ? '🇪🇸' : '🎾'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-500">Score: {typedMatch.finalScore}</span>
                                        <div className="flex gap-2">
                                            <span className="font-medium bg-slate-100 px-3 py-1 rounded-full text-xs">
                                                {momentum.events.length} Events
                                            </span>
                                            <span className="font-medium bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">
                                                Live
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
