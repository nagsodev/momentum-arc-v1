'use client';
import React from 'react';
import type { MomentumOutput } from '../../lib/types';
import MomentumArc from './MomentumArc';

interface MomentumChartProps {
    momentum: MomentumOutput;
    player1: string;
    player2: string;
    focusSet?: number | 'all';
}

export default function MomentumChart({
    momentum,
    player1,
    player2,
    focusSet = 'all'
}: MomentumChartProps) {
    return (
        <div className="w-full">
            {/* Momentum Arc Visualization */}
            <MomentumArc
                momentum={momentum}
                player1={player1}
                player2={player2}
                focusSet={focusSet}
            />
        </div>
    );
}
