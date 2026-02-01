'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import matches from '../../../data/matches.json';
import { calculateMomentum } from '../../../lib/momentum/momentum-engine';
import MomentumChart from '../../../components/momentum/MomentumChart';
import type { Match } from '../../../lib/types';

export default function MatchDetail() {
    const params = useParams();
    const matchId = params.id as string;

    const foundMatch = matches.matches.find(m => m.id === matchId);

    if (!foundMatch) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Match not found</h1>
                    <Link href="/feed" className="text-blue-600 hover:text-blue-700">
                        ← Back to Feed
                    </Link>
                </div>
            </div>
        );
    }

    const match = foundMatch as Match;
    const momentum = calculateMomentum(match);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Back Button */}
                <Link
                    href="/feed"
                    className="inline-flex items-center space-x-2 mb-8 text-slate-600 hover:text-slate-900 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Zurück zum Feed</span>
                </Link>

                {/* Match Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-4">
                        {match.tournament}
                    </h1>
                    <p className="text-xl text-slate-600 mb-6">{match.round}</p>
                    <div className="flex justify-center items-center gap-8 text-2xl font-semibold">
                        <div className="flex items-center gap-2">
                            <span className="text-3xl">{match.player1.country === 'SRB' ? '🇷🇸' : '🎾'}</span>
                            <span>{match.player1.name}</span>
                        </div>
                        <span className="font-bold text-slate-900">{match.finalScore}</span>
                        <div className="flex items-center gap-2">
                            <span>{match.player2.name}</span>
                            <span className="text-3xl">{match.player2.country === 'ESP' ? '🇪🇸' : '🎾'}</span>
                        </div>
                    </div>
                </div>

                {/* MomentumArc + Timeline */}
                <div className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-3xl p-8 mb-8 shadow-xl">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Momentum Visualization</h2>
                    <MomentumChart momentum={momentum} sets={match.sets} />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-12">
                    <div className="p-6 bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl">
                        <div className="text-3xl font-bold text-green-600">{Math.max(...momentum.states)}</div>
                        <div className="text-sm text-slate-600">Peak Momentum</div>
                    </div>
                    <div className="p-6 bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl">
                        <div className="text-3xl font-bold text-red-600">{Math.min(...momentum.states)}</div>
                        <div className="text-sm text-slate-600">Low Point</div>
                    </div>
                    <div className="p-6 bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl">
                        <div className="text-3xl font-bold text-blue-600">{momentum.events.filter(e => e.tier === 1).length}</div>
                        <div className="text-sm text-slate-600">Tier 1 Events</div>
                    </div>
                </div>

                {/* Events Table */}
                <div className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-2xl p-8 shadow-lg">
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <span className="text-3xl">📍</span>
                        Key Momentum Events
                    </h3>
                    <div className="grid gap-4">
                        {momentum.events.map((event, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl hover:shadow-md transition-all">
                                <div className="text-3xl">{event.icon}</div>
                                <div className="flex-1">
                                    <div className="font-bold text-lg">{event.name}</div>
                                    <div className="text-sm text-slate-600">Game {event.game} • Tier {event.tier}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
