'use client';
import React from 'react';
import type { MomentumOutput, Set } from '../../lib/types';
import MomentumArc from './MomentumArc';
import GameTimeline from './GameTimeline';

interface MomentumChartProps {
    momentum: MomentumOutput;
    sets: Set[];
}

export default function MomentumChart({ momentum, sets }: MomentumChartProps) {
    const chartWidth = 800;
    const chartHeight = 320;

    return (
        <div className="w-full bg-[var(--color-surface)] rounded-3xl border border-[var(--color-border)] shadow-xl overflow-hidden">
            {/* Container mit festem Aspect Ratio für die Overlays */}
            <div className="relative w-full aspect-[8/3.2]">
                {/* Layer 1: Game Timeline (Background) */}
                <div className="absolute inset-0 z-0">
                    <GameTimeline
                        momentum={momentum}
                        sets={sets}
                        width={chartWidth}
                        height={chartHeight}
                        overlayMode={true}
                    />
                </div>

                {/* Layer 2: Momentum Arc (Overlay) */}
                <div className="absolute inset-0 z-10">
                    <MomentumArc
                        momentum={momentum}
                        width={chartWidth}
                        height={chartHeight}
                        overlayMode={true}
                    />
                </div>
            </div>

            {/* Common Legend */}
            <div className="p-4 border-t border-[var(--color-border)] bg-slate-50/50 flex gap-6 justify-center text-xs text-[var(--color-text-secondary)] flex-wrap">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF4757]"></div>
                    <span>Negative Momentum</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#F8F9FA] border"></div>
                    <span>Neutral</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#00D96F]"></div>
                    <span>Positive Momentum</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#3498DB]"></div>
                    <span>Tier 1 Event</span>
                </div>
            </div>
        </div>
    );
}
