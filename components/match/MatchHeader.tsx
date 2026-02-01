'use client';

import React from 'react';
import type { Match } from '../../lib/types';

interface MatchHeaderProps {
    match: Match;
}

export default function MatchHeader({ match }: MatchHeaderProps) {
    const { player1, player2, tournament, date, finalScore, sets } = match;

    // Helper for flag emojis
    const getFlag = (country: string) => {
        const flags: Record<string, string> = {
            'SRB': '🇷🇸',
            'ESP': '🇪🇸',
            'SUI': '🇨🇭',
            'GBR': '🇬🇧',
            'USA': '🇺🇸',
            'ITA': '🇮🇹',
            'GRE': '🇬🇷',
            'NOR': '🇳🇴',
            'GER': '🇩🇪',
            'POL': '🇵🇱'
        };
        return flags[country] || '🎾';
    };

    // Determine set winner counts
    const p1Sets = sets.filter(s => s.winner === player1.name).length;
    const p2Sets = sets.filter(s => s.winner === player2.name).length;
    const isP1Winner = p1Sets > p2Sets;
    const isP2Winner = p2Sets > p1Sets;

    return (
        <div className="w-full bg-white rounded-3xl p-8 border border-[var(--color-border)] shadow-sm mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
                {/* Player 1 */}
                <div className="flex flex-col items-center md:items-end flex-1 gap-2 order-2 md:order-1">
                    <span className="text-4xl md:text-5xl mb-2">{getFlag(player1.country)}</span>
                    <h2 className={`text-2xl md:text-3xl font-black text-slate-900 text-center md:text-right ${isP1Winner ? 'text-[var(--momentum-strong-positive)]' : ''}`}>
                        {player1.name}
                    </h2>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Rank</span>
                        <span className="text-sm font-bold text-slate-600">#{player1.rank}</span>
                    </div>
                </div>

                {/* Score Section */}
                <div className="flex flex-col items-center gap-2 order-1 md:order-2">
                    <div className="px-4 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                        Final Score
                    </div>
                    <div className="text-4xl md:text-5xl font-black text-slate-900 flex items-center gap-4">
                        <span className={isP1Winner ? 'text-[var(--momentum-strong-positive)]' : ''}>{p1Sets}</span>
                        <span className="text-slate-300">-</span>
                        <span className={isP2Winner ? 'text-[var(--momentum-strong-positive)]' : ''}>{p2Sets}</span>
                    </div>
                    <div className="text-lg font-bold text-slate-400 mt-2">
                        {finalScore}
                    </div>
                </div>

                {/* Player 2 */}
                <div className="flex flex-col items-center md:items-start flex-1 gap-2 order-3">
                    <span className="text-4xl md:text-5xl mb-2">{getFlag(player2.country)}</span>
                    <h2 className={`text-2xl md:text-3xl font-black text-slate-900 text-center md:text-left ${isP2Winner ? 'text-[var(--momentum-strong-positive)]' : ''}`}>
                        {player2.name}
                    </h2>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Rank</span>
                        <span className="text-sm font-bold text-slate-600">#{player2.rank}</span>
                    </div>
                </div>
            </div>

            {/* Match Info Footer */}
            <div className="flex flex-col md:flex-row justify-between items-center border-t border-slate-100 pt-6 gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                        <span className="text-xl">🏆</span>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tournament</p>
                        <p className="text-sm font-bold text-slate-800">{tournament}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 md:text-right">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</p>
                        <p className="text-sm font-bold text-slate-800" suppressHydrationWarning>{new Date(date).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                        <span className="text-xl">📅</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
