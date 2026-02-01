'use client';
import React from 'react';
import type { MomentumOutput, Set } from '../../lib/types';

interface GameTimelineProps {
    momentum: MomentumOutput;
    sets: Set[];
    width?: number;
    height?: number;
    overlayMode?: boolean;
}

export default function GameTimeline({
    momentum,
    sets,
    width = 800,
    height = 280,
    overlayMode = false
}: GameTimelineProps) {
    const totalGames = momentum.states.length;

    // Im Overlay-Modus sitzen die Blöcke am unteren Rand
    const blockHeight = overlayMode ? 16 : 40;
    const blockY = overlayMode ? height - blockHeight - 20 : (height - blockHeight) / 2;

    return (
        <div className={`w-full ${overlayMode ? '' : 'p-6 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] shadow-lg'}`}>
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full block"
                style={{ height: overlayMode ? '100%' : '80px' }}
                preserveAspectRatio="xMidYMid meet"
            >
                {/* Gridlines nur wenn nicht im Overlay (da MomentumArc sie schon hat) */}
                {!overlayMode && [56, 112, 140, 168, 224].map(y => (
                    <line
                        key={y}
                        x1="0"
                        y1={y}
                        x2={width}
                        y2={y}
                        stroke="rgba(0,26,62,0.1)"
                        strokeWidth="1"
                        strokeDasharray="4,4"
                    />
                ))}

                {/* Game blocks using the same X positions as the arc */}
                {momentum.positions.map((pos, i) => {
                    if (i === 0) return null; // Skip first position

                    const prevPos = momentum.positions[i - 1];
                    const blockWidth = pos.x - prevPos.x;
                    // IMPORTANT: states[i-1] corresponds to the segment ending at positions[i]
                    const state = momentum.states[i - 1];
                    const color = momentum.colors[i - 1];

                    return (
                        <g key={`game-${i}`}>
                            <rect
                                x={prevPos.x}
                                y={blockY}
                                width={blockWidth}
                                height={blockHeight}
                                fill={color}
                                stroke="rgba(255,255,255,0.2)"
                                strokeWidth="1"
                                rx="2"
                                className="hover:opacity-80 transition-opacity cursor-pointer"
                            >
                                <title suppressHydrationWarning>{`Game ${i}: State ${state}`}</title>
                            </rect>

                            {/* Game labels */}
                            {!overlayMode && (i === 1 || i === totalGames || i % 5 === 0) && (
                                <text
                                    x={prevPos.x + blockWidth / 2}
                                    y={blockY + blockHeight + 15}
                                    textAnchor="middle"
                                    fontSize="10"
                                    fill="var(--color-text-secondary)"
                                >
                                    {i}
                                </text>
                            )}
                        </g>
                    );
                })}

                {/* Set separators */}
                {sets.map((set, setIndex) => {
                    if (setIndex === sets.length - 1) return null;

                    let gamesBeforeNextSet = 0;
                    for (let i = 0; i <= setIndex; i++) {
                        gamesBeforeNextSet += sets[i].games;
                    }

                    const separatorPos = momentum.positions[gamesBeforeNextSet];
                    if (!separatorPos) return null;

                    return (
                        <g key={`sep-${setIndex}`}>
                            <line
                                x1={separatorPos.x}
                                y1={0}
                                x2={separatorPos.x}
                                y2={height}
                                stroke="var(--color-border)"
                                strokeWidth="1"
                                strokeDasharray="2,2"
                            />
                            {!overlayMode && (
                                <text
                                    x={separatorPos.x}
                                    y={20}
                                    textAnchor="middle"
                                    fontSize="10"
                                    fontWeight="bold"
                                    fill="var(--color-text-secondary)"
                                >
                                    SET {setIndex + 2}
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>

            {!overlayMode && (
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
            )}
        </div>
    );
}
