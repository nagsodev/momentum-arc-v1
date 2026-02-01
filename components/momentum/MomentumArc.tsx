'use client';

import type { MomentumOutput } from '../../lib/types';
import { useMemo } from 'react';

import EventMarker from './EventMarker';

interface MomentumArcProps {
    momentum: MomentumOutput;
    player1: string;
    player2: string;
    focusSet?: number | 'all';
    width?: number;
    height?: number;
    overlayMode?: boolean;
}

export default function MomentumArc({
    momentum,
    player1,
    player2,
    focusSet = 'all',
    width = 1000,
    height = 280,
    overlayMode = false
}: MomentumArcProps) {
    const gridY = [56, 112, 140, 168, 224];

    // Calculate dynamic viewBox
    const viewBox = useMemo(() => {
        if (focusSet === 'all') {
            return { x: 0, w: 1000 };
        }

        // Find game range for this set
        // The set data is in match.sets, but let's assume we can get it from momentum or just pass it in
        // Since we don't have match.sets here directly unless passed, let's use setSeparators
        const separators = [0, ...momentum.setSeparators, 1000];
        const startX = separators[Number(focusSet) - 1] || 0;
        const endX = separators[Number(focusSet)] || 1000;

        return { x: startX, w: endX - startX };
    }, [focusSet, momentum.setSeparators]);

    const curveSegments = useMemo(() => {
        const segments = [];
        const { positions, states, colors } = momentum;

        for (let i = 1; i < positions.length; i++) {
            const prev = positions[i - 1];
            const curr = positions[i];
            const color = colors[i - 1];

            const prevStateValue = i > 1 ? states[i - 2] : 0;
            const currStateValue = states[i - 1];
            const isHardOverride = Math.abs(currStateValue - prevStateValue) >= 3;

            let pathData: string;
            if (isHardOverride) {
                pathData = `M ${prev.x} ${prev.y} L ${curr.x} ${curr.y}`;
            } else {
                const midX = (prev.x + curr.x) / 2;
                pathData = `M ${prev.x} ${prev.y} Q ${midX} ${prev.y} ${curr.x} ${curr.y}`;
            }

            segments.push(
                <path
                    key={`segment-${i}`}
                    d={pathData}
                    stroke={color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />
            );
        }
        return segments;
    }, [momentum]);

    const content = (
        <div className="relative w-full h-full">
            <svg
                viewBox={`${viewBox.x} 0 ${viewBox.w} 280`}
                className="w-full h-full block transition-all duration-700 ease-in-out"
                preserveAspectRatio="xMidYMid meet"
            >
                <defs>
                    <linearGradient id="p1Gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#1A6873" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="#32808D" stopOpacity="0.05" />
                    </linearGradient>
                    <linearGradient id="p2Gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#E68161" stopOpacity="0.05" />
                        <stop offset="100%" stopColor="#C0152F" stopOpacity="0.1" />
                    </linearGradient>
                </defs>

                {/* Player Territories */}
                <rect x="0" y="0" width="1000" height="140" fill="url(#p1Gradient)" />
                <rect x="0" y="140" width="1000" height="140" fill="url(#p2Gradient)" />

                {/* Player Name Overlays */}
                <text x={viewBox.x + 20} y="34" className="text-xl font-black uppercase tracking-tighter fill-[#32808D]/40 select-none">
                    {player1}
                </text>
                <text x={viewBox.x + 20} y="260" className="text-xl font-black uppercase tracking-tighter fill-[#C0152F]/40 select-none">
                    {player2}
                </text>

                {/* Horizontal Gridlines */}
                <g className="grid-lines">
                    {gridY.map(y => (
                        <line
                            key={`grid-${y}`}
                            x1="0"
                            y1={y}
                            x2="1000"
                            y2={y}
                            stroke="#E5E7EB"
                            strokeWidth={y === 140 ? "3" : "1"}
                            strokeDasharray={y === 140 ? "" : "4,4"}
                        />
                    ))}
                </g>

                {/* Set Separators (only show if not zoomed or if in range) */}
                <g className="set-separators">
                    {momentum.setSeparators.map((x, i) => (
                        <line
                            key={`set-sep-${i}`}
                            x1={x}
                            y1="0"
                            x2={x}
                            y2="280"
                            stroke="#9CA3AF"
                            strokeWidth="1.5"
                            strokeDasharray="6,4"
                        />
                    ))}
                </g>

                {/* Momentum Curve */}
                <g className="momentum-curve">
                    {curveSegments}
                </g>
            </svg>

            {/* Event Markers Overlay with dynamic positioning */}
            <div className="absolute inset-0 pointer-events-none">
                {momentum.events.map((event, i) => {
                    const pos = momentum.positions[event.game];
                    if (!pos) return null;

                    // Filter markers that are out of view if zoomed
                    if (pos.x < viewBox.x || pos.x > viewBox.x + viewBox.w) return null;

                    // Calculate zoomed percentage
                    const left = ((pos.x - viewBox.x) / viewBox.w) * 100;
                    const top = (pos.y / 280) * 100;

                    return (
                        <div
                            key={`marker-wrapper-${i}`}
                            className="absolute pointer-events-auto transition-all duration-700 ease-in-out"
                            style={{ left: `${left}%`, top: `${top}%` }}
                        >
                            <EventMarker event={event} position={pos} />
                        </div>
                    );
                })}
            </div>
        </div>
    );

    if (overlayMode) {
        return content;
    }

    return (
        <div className="w-full">
            <div className="relative w-full overflow-hidden rounded-3xl border border-slate-200 bg-white" style={{ aspectRatio: '1000 / 280' }}>
                {content}
            </div>
        </div>
    );
}
