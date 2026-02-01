'use client';
import React from 'react';
import type { MomentumOutput, Set } from '../../lib/types';

interface GameTimelineProps {
    momentum: MomentumOutput;
    sets: Set[];
}

export default function GameTimeline({ momentum, sets }: GameTimelineProps) {
    const totalGames = momentum.states.length;

    return (
        <div className="w-full overflow-x-auto">
            <div className="flex gap-1 h-16 md:h-20 p-2 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] shadow-inner">
                {sets.map((set, setIndex) => (
                    <React.Fragment key={`set-${set.setNumber}`}>
                        {/* Set Games */}
                        {Array.from({ length: set.games }, (_, gameIndex) => {
                            const gameNum = setIndex * 10 + gameIndex; // Simplified
                            const state = momentum.states[gameNum];
                            const color = momentum.colors[gameNum];

                            return (
                                <div
                                    key={`${set.setNumber}-${gameIndex + 1}`}
                                    className="flex-1 min-w-[32px] rounded-lg border border-white/50 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
                                    style={{ backgroundColor: color }}
                                    title={`Game ${gameNum + 1}: State ${state}`}
                                >
                                    {(gameIndex === 0 || gameIndex === set.games - 1) && (
                                        <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs font-mono text-[var(--color-text-secondary)] bg-[var(--color-surface)] px-1 rounded">
                                            {gameNum + 1}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                        {/* Set Separator */}
                        {setIndex < sets.length - 1 && (
                            <div className="w-px bg-[var(--color-border)] mx-2 relative self-stretch flex-shrink-0">
                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold text-[var(--primary-charcoal)] whitespace-nowrap">
                                    SET {setIndex + 2}
                                </span>
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Legend */}
            <div className="flex gap-6 justify-center mt-4 text-xs text-[var(--color-text-secondary)] flex-wrap">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-4 bg-[var(--momentum-strong-negative)] rounded"></div>
                    <span>Negative</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-4 bg-[var(--momentum-neutral)] border rounded"></div>
                    <span>Neutral</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-4 bg-[var(--momentum-strong-positive)] rounded"></div>
                    <span>Positive</span>
                </div>
            </div>
        </div>
    );
}
