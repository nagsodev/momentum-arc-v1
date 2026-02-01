'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import type { Match, MomentumOutput } from '../../lib/types';

interface MatchCardProps {
    match: Match;
    momentum: MomentumOutput;
}

export default function MatchCard({ match, momentum }: MatchCardProps) {
    const { player1, player2, tournament, round, finalScore, id } = match;

    // Helper to get flag emoji
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

    // Mini Arc Logic
    const miniArcData = useMemo(() => {
        const { positions, states, colors, events } = momentum;
        if (!positions || positions.length === 0) return null;

        // Simplify paths for a 60px height
        // Scale Y from 0-280 to 0-60
        const scaleY = 60 / 280;

        const pathSegments = [];
        for (let i = 1; i < positions.length; i++) {
            const prev = positions[i - 1];
            const curr = positions[i];
            const color = colors[i - 1];

            // Simplified linear path for mini arc to keep it performant and clean
            pathSegments.push(
                <line
                    key={`mini-seg-${i}`}
                    x1={`${(prev.x / 1000) * 100}%`}
                    y1={prev.y * scaleY}
                    x2={`${(curr.x / 1000) * 100}%`}
                    y2={curr.y * scaleY}
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                />
            );
        }

        // Find biggest swing for the icon
        let maxAbsState = -1;
        let swingIndex = -1;
        states.forEach((s, idx) => {
            if (Math.abs(s) > maxAbsState) {
                maxAbsState = Math.abs(s);
                swingIndex = idx;
            }
        });

        // Find if there's an event at that swing
        const swingEvent = events.find(e => e.game === swingIndex + 1) || events[0];
        const swingPos = positions[swingIndex + 1] || positions[0];

        return {
            pathSegments,
            swingIcon: swingEvent?.icon,
            swingX: `${(swingPos.x / 1000) * 100}%`,
            swingY: swingPos.y * scaleY
        };
    }, [momentum]);

    return (
        <Link
            href={`/match/${id}`}
            className="block group outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-electric-blue)] focus-visible:ring-offset-8 rounded-[2rem] transition-all"
        >
            <div className="bg-white rounded-2xl p-4 border border-[var(--color-border)] shadow-sm transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-2xl group-active:scale-[0.98]">
                {/* Header: Tournament & Round */}
                <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-tertiary, #94A3B8)]">
                        {tournament}
                    </span>
                    <span className="text-[10px] font-medium bg-slate-100 px-2 py-0.5 rounded text-slate-500">
                        {round}
                    </span>
                </div>

                {/* Players & Score */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex flex-col gap-1 w-[40%] text-right">
                        <span className="text-xl">{getFlag(player1.country)}</span>
                        <span className="font-bold text-slate-900 truncate">{player1.name.split(' ').pop()}</span>
                    </div>

                    <div className="flex flex-col items-center">
                        <span className="text-sm font-black text-slate-400">VS</span>
                        <span className="text-lg font-bold text-[var(--accent-electric-blue)]">{finalScore}</span>
                    </div>

                    <div className="flex flex-col gap-1 w-[40%] text-left">
                        <span className="text-xl">{getFlag(player2.country)}</span>
                        <span className="font-bold text-slate-900 truncate">{player2.name.split(' ').pop()}</span>
                    </div>
                </div>

                {/* Mini Momentum Arc */}
                <div className="relative w-full h-[60px] bg-slate-50/50 rounded-lg overflow-hidden border border-slate-100">
                    <svg className="w-full h-full overflow-visible">
                        {/* Center Line */}
                        <line x1="0" y1="30" x2="100%" y2="30" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="2,2" />

                        {/* Curve */}
                        {miniArcData?.pathSegments}

                        {/* Peak Icon */}
                        {miniArcData && (
                            <g transform={`translate(0, ${miniArcData.swingY})`}>
                                <text
                                    x={miniArcData.swingX}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    className="text-[10px] font-bold fill-slate-600 pointer-events-none drop-shadow-sm"
                                >
                                    {miniArcData.swingIcon}
                                </text>
                            </g>
                        )}
                    </svg>
                </div>

                {/* Footer: Action Hint */}
                <div className="mt-4 flex justify-between items-center text-[10px] font-semibold text-slate-400">
                    <span>MOMENTUM PREVIEW</span>
                    <span className="group-hover:text-[var(--accent-electric-blue)] transition-colors">VIEW ANALYSIS →</span>
                </div>
            </div>
        </Link>
    );
}
