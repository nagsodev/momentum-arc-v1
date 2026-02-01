'use client';

import React from 'react';
import type { MomentumOutput, Set as MatchSet } from '../../lib/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface GameTimelineProps {
    momentum: MomentumOutput;
    sets: MatchSet[];
}

export default function GameTimeline({ momentum, sets }: GameTimelineProps) {
    // Helper to determine if a game is the first or last of its set
    const getGameLabel = (globalGameIndex: number) => {
        let gameCount = 0;
        for (const set of sets) {
            const firstGameOfSet = gameCount;
            const lastGameOfSet = gameCount + set.games - 1;

            if (globalGameIndex === firstGameOfSet || globalGameIndex === lastGameOfSet) {
                return (globalGameIndex + 1).toString();
            }
            gameCount += set.games;
        }
        return null;
    };

    // Group games by sets for rendering separators
    const setsWithGames = React.useMemo(() => {
        let currentGameIndex = 0;
        return sets.map((set, setIdx) => {
            const gamesInSet = momentum.colors.slice(currentGameIndex, currentGameIndex + set.games).map((color, i) => ({
                color,
                globalIndex: currentGameIndex + i,
                label: getGameLabel(currentGameIndex + i)
            }));
            currentGameIndex += set.games;
            return {
                setNumber: set.setNumber,
                games: gamesInSet
            };
        });
    }, [momentum, sets]);

    return (
        <div className="w-full bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)] shadow-sm overflow-x-auto">
            <div className="flex items-end gap-1 min-w-max pb-6">
                {setsWithGames.map((setInfo, setIdx) => (
                    <React.Fragment key={`set-group-${setIdx}`}>
                        {/* Set Blocks */}
                        <div className="flex gap-1 items-end">
                            {setInfo.games.map((game, gameIdx) => (
                                <div key={`game-${game.globalIndex}`} className="flex flex-col items-center gap-2 group">
                                    {/* Game Label */}
                                    <span className={cn(
                                        "text-[10px] font-medium transition-opacity",
                                        game.label ? "opacity-100 text-[var(--color-text-secondary)]" : "opacity-0 group-hover:opacity-100 text-[var(--color-text-tertiary)]"
                                    )}>
                                        {game.label || game.globalIndex + 1}
                                    </span>

                                    {/* Game Block */}
                                    <div
                                        className="w-4 sm:w-6 h-[30px] md:h-10 rounded-[4px] border border-white/10 shadow-sm transition-all duration-200 cursor-pointer hover:-translate-y-[2px] hover:shadow-md"
                                        style={{ backgroundColor: game.color }}
                                        title={`Game ${game.globalIndex + 1}`}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Set Separator (except after the last set) */}
                        {setIdx < setsWithGames.length - 1 && (
                            <div className="flex flex-col items-center gap-2 mx-1 self-stretch">
                                <span className="text-[10px] font-bold text-[var(--color-text-primary)] whitespace-nowrap">
                                    SET {setIdx + 2}
                                </span>
                                <div className="w-0.5 bg-[var(--color-border-strong, #9CA3AF)] h-[30px] md:h-10 rounded-full" />
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>

            <div className="flex justify-between items-center text-[10px] text-[var(--color-text-tertiary)] uppercase tracking-wider font-semibold">
                <span>Start of Match</span>
                <span>Match Progress</span>
            </div>
        </div>
    );
}
