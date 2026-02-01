import React, { useMemo, useState, useRef } from 'react';
import type { MomentumOutput } from '../../lib/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import EventMarker from './EventMarker';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

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
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const gridY = [56, 112, 140, 168, 224];

    // Calculate dynamic viewBox
    const viewBox = useMemo(() => {
        if (focusSet === 'all') {
            return { x: 0, w: 1000 };
        }
        const separators = [0, ...momentum.setSeparators, 1000];
        const startX = separators[Number(focusSet) - 1] || 0;
        const endX = separators[Number(focusSet)] || 1000;
        return { x: startX, w: endX - startX };
    }, [focusSet, momentum.setSeparators]);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const xPercent = (e.clientX - rect.left) / rect.width;
        const xSVG = viewBox.x + (xPercent * viewBox.w);

        // Find nearest position
        let nearestIndex = 0;
        let minDiff = Infinity;

        momentum.positions.forEach((pos, i) => {
            const diff = Math.abs(pos.x - xSVG);
            if (diff < minDiff) {
                minDiff = diff;
                nearestIndex = i;
            }
        });

        if (nearestIndex >= 0) setHoveredIndex(nearestIndex);
    };

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
                <React.Fragment key={`segment-group-${i}`}>
                    <path
                        d={pathData}
                        stroke="white"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                        opacity="0.8"
                    />
                    <path
                        d={pathData}
                        stroke={color}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                    />
                </React.Fragment>
            );
        }
        return segments;
    }, [momentum]);

    const content = (
        <div
            ref={containerRef}
            className="relative w-full h-full cursor-crosshair group/chart"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredIndex(null)}
        >
            <svg
                viewBox={`${viewBox.x} -20 ${viewBox.w} 320`}
                className="w-full h-full block transition-all duration-700 ease-in-out"
                preserveAspectRatio="none"
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

                <rect x="-1000" y="-500" width="3000" height="640" fill="url(#p1Gradient)" />
                <rect x="-1000" y="140" width="3000" height="640" fill="url(#p2Gradient)" />

                <text x={viewBox.x + 20} y="34" className="text-xl font-black uppercase tracking-tighter fill-[#1A6873]/30 select-none">
                    {player1}
                </text>
                <text x={viewBox.x + 20} y="260" className="text-xl font-black uppercase tracking-tighter fill-[#C0152F]/30 select-none">
                    {player2}
                </text>

                <g className="grid-lines">
                    {gridY.map(y => (
                        <line
                            key={`grid-${y}`}
                            x1="-1000"
                            y1={y}
                            x2="2000"
                            y2={y}
                            stroke={y === 140 ? "#94A3B8" : "#E5E7EB"}
                            strokeWidth={y === 140 ? "2" : "1"}
                            strokeDasharray="4,4"
                        />
                    ))}
                </g>

                <g className="set-separators">
                    {momentum.setSeparators.map((x, i) => (
                        <line
                            key={`set-sep-${i}`}
                            x1={x}
                            y1="-20"
                            x2={x}
                            y2="300"
                            stroke="#9CA3AF"
                            strokeWidth="1.5"
                            strokeDasharray="6,4"
                            opacity="0.3"
                        />
                    ))}
                </g>

                <g className="momentum-curve">
                    {curveSegments}
                </g>

                {/* Vertical Tracker Line */}
                {hoveredIndex !== null && (
                    <line
                        x1={momentum.positions[hoveredIndex].x}
                        y1="-20"
                        x2={momentum.positions[hoveredIndex].x}
                        y2="300"
                        stroke="#94A3B8"
                        strokeWidth="1"
                        strokeDasharray="4,4"
                    />
                )}
            </svg>

            {/* Event Markers Overlay */}
            <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none">
                <div className="relative w-full h-full">
                    {momentum.events.map((event, i) => {
                        const pos = momentum.positions[event.game];
                        if (!pos || pos.x < viewBox.x || pos.x > viewBox.x + viewBox.w) return null;
                        const left = ((pos.x - viewBox.x) / viewBox.w) * 100;
                        const top = ((pos.y + 20) / 320) * 100;
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

            {/* State Tooltip Overlay */}
            {hoveredIndex !== null && hoveredIndex > 0 && (
                <div
                    className="absolute bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-2xl border border-slate-200 pointer-events-none z-50 transform -translate-x-1/2 transition-all duration-150"
                    style={{
                        left: `${((momentum.positions[hoveredIndex].x - viewBox.x) / viewBox.w) * 100}%`,
                        top: '10px'
                    }}
                >
                    <div className="flex flex-col gap-1 min-w-[140px]">
                        <div className="flex justify-between items-center pb-1 border-b border-slate-100">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Game {hoveredIndex}</span>
                            <span className={cn(
                                "text-[10px] px-1.5 py-0.5 rounded-full font-black uppercase",
                                momentum.states[hoveredIndex - 1] > 0 ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                            )}>
                                {Math.abs(momentum.states[hoveredIndex - 1]).toFixed(1)}
                            </span>
                        </div>
                        <div className="pt-1">
                            <p className="text-sm font-black text-slate-900 leading-tight">
                                {momentum.states[hoveredIndex - 1] >= 1.5 && 'Dominant Streak'}
                                {momentum.states[hoveredIndex - 1] > 0 && momentum.states[hoveredIndex - 1] < 1.5 && 'Positive Control'}
                                {momentum.states[hoveredIndex - 1] === 0 && 'Neutral Flow'}
                                {momentum.states[hoveredIndex - 1] < 0 && momentum.states[hoveredIndex - 1] > -1.5 && 'Testing Phase'}
                                {momentum.states[hoveredIndex - 1] <= -1.5 && 'Strong Opponent Pressure'}
                            </p>
                            <p className="text-[10px] text-slate-400 font-medium">Momentum State Index</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    if (overlayMode) return content;

    return (
        <div className="w-full">
            <div className="relative w-full overflow-x-auto pb-4 custom-scrollbar">
                <div className="min-w-[800px] md:min-w-0">
                    <div
                        className="relative w-full overflow-hidden rounded-2xl md:rounded-3xl border border-slate-200 bg-white"
                        style={{ aspectRatio: '1000 / 320' }}
                    >
                        <div className="w-full h-full">{content}</div>
                    </div>
                </div>
            </div>

            {/* Analytical Legend (User Suggestion) */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-6 px-2">
                <div className="flex gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-[#32808D] shadow-[0_0_8px_rgba(50,128,141,0.5)]"></div>
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{player1} Control</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-[#C0152F] shadow-[0_0_8px_rgba(192,21,47,0.5)]"></div>
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{player2} Control</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-6 items-center border-l border-slate-200 pl-6">
                    <div className="flex items-center gap-2 group">
                        <div className="w-[18px] h-[18px] rounded-full bg-[#C0152F] flex items-center justify-center text-[10px] text-white shadow-md border border-white">🔓</div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-900 transition-colors">Tier 1: Breaks</span>
                    </div>
                    <div className="flex items-center gap-2 group">
                        <div className="w-[14px] h-[14px] rounded-full bg-[#32808D] flex items-center justify-center text-[8px] text-white shadow-md border border-white">⚡</div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-900 transition-colors">Tier 2: Big Games</span>
                    </div>
                    <div className="flex items-center gap-2 group">
                        <div className="w-[10px] h-[10px] rounded-full bg-[#E68161] flex items-center justify-center text-[6px] text-white shadow-md border border-white">⚠️</div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-900 transition-colors">Tier 3: Errors</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
