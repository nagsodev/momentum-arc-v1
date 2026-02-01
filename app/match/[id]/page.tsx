'use client';

import React, { useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import matches from '../../../data/matches.json';
import { calculateMomentum } from '../../../lib/momentum/momentum-engine';
import MomentumChart from '../../../components/momentum/MomentumChart';
import type { Match } from '../../../lib/types';
import MatchHeader from '../../../components/match/MatchHeader';

export default function MatchDetail() {
    const params = useParams();
    const matchId = params.id as string;
    const [activeSet, setActiveSet] = useState<number | 'all'>('all');

    const match = (matches as Match[]).find((m: Match) => m.id === matchId);

    if (!match) {
        notFound();
    }

    const fullMomentum = calculateMomentum(match);

    // Insights Logic: Find the biggest swings
    const insights = fullMomentum.events
        .filter(e => e.tier === 1)
        .slice(0, 3)
        .map(e => ({
            title: e.name,
            description: `A critical ${e.type.replace('_', ' ')} in game ${e.game} that significantly shifted the momentum in favor of ${e.player === 'player1' ? match.player1.name : match.player2.name}.`,
            icon: e.icon
        }));

    return (
        <div className="min-h-screen bg-[var(--color-background)] p-6 animate-in fade-in duration-700">
            <div className="max-w-6xl mx-auto">
                {/* Back Button */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <Link
                        href="/"
                        className="inline-flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-all bg-white px-5 py-2.5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-x-1"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-xs font-black uppercase tracking-widest">Back to Feed</span>
                    </Link>

                    {/* Set Switcher */}
                    <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm gap-1">
                        <button
                            onClick={() => setActiveSet('all')}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all outline-none focus-visible:ring-2 focus-visible:ring-slate-400 active:scale-95 ${activeSet === 'all' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            All
                        </button>
                        {match.sets.map(s => (
                            <button
                                key={s.setNumber}
                                onClick={() => setActiveSet(s.setNumber)}
                                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all outline-none focus-visible:ring-2 focus-visible:ring-slate-400 active:scale-95 ${activeSet === s.setNumber ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                Set {s.setNumber}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Match Header Component */}
                <MatchHeader match={match} />

                {/* Main Visualization Card */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3 space-y-8">
                        <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-2xl relative group">
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Momentum Analysis</h2>
                                    <p className="text-sm text-slate-400 font-medium">Live AI-generated performance curve</p>
                                </div>
                                <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold uppercase tracking-widest animate-pulse">
                                    Live Processing
                                </div>
                            </div>

                            <div className="relative w-full aspect-[1000/320]">
                                <MomentumChart
                                    momentum={fullMomentum}
                                    focusSet={activeSet}
                                    player1={match.player1.name}
                                    player2={match.player2.name}
                                />
                            </div>
                        </div>

                        {/* Events Insights (Prompt 16 - "Why it turned") */}
                        <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 transform rotate-12 opacity-5 pointer-events-none">
                                <span className="text-9xl font-black">💡</span>
                            </div>
                            <h3 className="text-2xl font-black mb-8 text-slate-900 tracking-tight">Match Turning Points</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {insights.map((insight, i) => (
                                    <div key={i} className="flex flex-col gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group">
                                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                                            {insight.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 mb-1">{insight.title}</h4>
                                            <p className="text-xs text-slate-500 leading-relaxed">{insight.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Stats Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-transparent"></div>
                            <h3 className="text-lg font-black mb-6 relative z-10 tracking-widest uppercase text-slate-400">Match Stats</h3>
                            <div className="space-y-6 relative z-10">
                                <div className="flex justify-between items-end">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Peak Momentum</span>
                                    <span className="text-3xl font-black text-emerald-400">+{Math.max(...fullMomentum.states)}</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-400" style={{ width: '80%' }}></div>
                                </div>

                                <div className="flex justify-between items-end">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Low Point</span>
                                    <span className="text-3xl font-black text-rose-400">{Math.min(...fullMomentum.states)}</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-rose-400" style={{ width: '40%' }}></div>
                                </div>

                                <div className="flex justify-between items-end">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Clutch Factor</span>
                                    <span className="text-3xl font-black text-blue-400">{fullMomentum.events.filter((e: any) => e.tier === 1).length}</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-400" style={{ width: '65%' }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Events List */}
                        <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm">
                            <h3 className="text-xs font-black mb-6 tracking-widest uppercase text-slate-400">Timeline</h3>
                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {fullMomentum.events.slice(0, 8).map((event, i) => (
                                    <div key={i} className="flex gap-4 items-start pb-4 border-b border-slate-50 last:border-0 hover:translate-x-1 transition-transform cursor-default">
                                        <span className="text-xl">{event.icon}</span>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{event.name}</p>
                                            <p className="text-[10px] font-medium text-slate-400 uppercase">Game {event.game}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
