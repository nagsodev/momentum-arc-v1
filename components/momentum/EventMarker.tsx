'use client';

import React from 'react';
import type { MomentumEvent, Position } from '../../lib/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface EventMarkerProps {
    event: MomentumEvent;
    position: Position;
}

export default function EventMarker({ event }: EventMarkerProps) {
    // Type-based colors (User Suggestion 2)
    const bgColor = {
        'break': '#C0152F',        // Red
        'rebreak': '#C0152F',      // Red
        'double_fault': '#E68161', // Orange
        'error_cluster': '#E68161',// Orange
        'tiebreak_won': '#32808D', // Turquoise
        'tiebreak_lost': '#C0152F',// Red (Lost is effectively a break for opponent)
        'point_streak': '#32808D', // Turquoise
        'big_game': '#32808D',     // Turquoise
    }[event.type] || '#32808D';

    // Size mapping based on tiers (User Suggestion 1)
    const sizeClasses = {
        1: 'w-[32px] h-[32px] text-lg shadow-[0_0_15px_rgba(192,21,47,0.4)]', // Big + Glow
        2: 'hidden md:flex w-[24px] h-[24px] text-sm',                        // Medium
        3: 'hidden lg:flex w-[16px] h-[16px] text-[10px]'                     // Small
    }[event.tier];

    return (
        <div
            className={cn(
                "rounded-full flex items-center justify-center shadow-lg border-2 border-white cursor-pointer transition-all duration-300 hover:scale-125 z-20 group -translate-x-1/2 -translate-y-1/2",
                sizeClasses
            )}
            style={{ backgroundColor: bgColor }}
        >
            <span className="select-none leading-none">{event.icon}</span>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900 text-white text-[11px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl pointer-events-none z-30 border border-slate-800">
                {event.name}
            </div>
        </div>
    );
}
