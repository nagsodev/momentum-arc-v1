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

export default function EventMarker({ event, position }: EventMarkerProps) {
    // Convert 0-1000 and 0-280 coordinates to percentages
    const left = (position.x / 1000) * 100;
    const top = (position.y / 280) * 100;

    // Type-based background colors
    const bgColor = {
        'break': 'var(--momentum-strong-positive)',
        'rebreak': 'var(--momentum-strong-negative)',
        'big_game': 'var(--momentum-positive)',
        'double_fault': 'var(--momentum-strong-negative)',
        'tiebreak_won': 'var(--momentum-strong-positive)',
        'tiebreak_lost': 'var(--momentum-strong-negative)',
        'point_streak': 'var(--momentum-positive)',
        'error_cluster': 'var(--momentum-negative)'
    }[event.type] || 'var(--accent-electric-blue)';

    // Size mapping based on tier
    const sizeClasses = {
        1: 'w-[28px] h-[28px] text-lg',
        2: 'w-[22px] h-[22px] text-sm',
        3: 'hidden sm:flex w-[18px] h-[18px] text-xs'
    }[event.tier];

    return (
        <div
            className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center shadow-lg border-2 border-white cursor-pointer transition-all duration-300 hover:scale-125 z-20 group",
                sizeClasses
            )}
            style={{
                left: `${left}%`,
                top: `${top}%`,
                backgroundColor: bgColor
            }}
        >
            <span className="select-none leading-none">{event.icon}</span>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900/90 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-30">
                {event.name}
            </div>
        </div>
    );
}
