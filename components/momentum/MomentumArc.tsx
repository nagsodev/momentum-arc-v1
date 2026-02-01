'use client';
import type { MomentumOutput, Position } from '../../lib/types';
import { useEffect, useRef } from 'react';

interface MomentumArcProps {
    momentum: MomentumOutput;
    width?: number;
    height?: number;
}

export default function MomentumArc({
    momentum,
    width = 800,
    height = 280
}: MomentumArcProps) {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const svg = svgRef.current;
        if (!svg) return;

        // Clear previous content to avoid partial updates causing issues if needed, 
        // although the cleanup function handles it, this is safe for re-renders within the same mount if refs persist differently.
        // Actually the cleanup function `svg.innerHTML = ''` runs before this effect re-runs, so we are good.

        // Gridlines (5 Linien)
        const gridY = [56, 112, 140, 168, 224];
        gridY.forEach(y => {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', '0');
            line.setAttribute('y1', y.toString());
            line.setAttribute('x2', width.toString());
            line.setAttribute('y2', y.toString());
            line.setAttribute('stroke', 'rgba(0,26,62,0.15)');
            line.setAttribute('stroke-width', y === 140 ? '2' : '1');
            line.setAttribute('stroke-dasharray', '4,4');
            svg.appendChild(line);
        });

        // Momentum Kurve
        momentum.positions.forEach((pos, i) => {
            if (i === 0) return;

            const prev = momentum.positions[i - 1];
            const isHardOverride = Math.abs(momentum.states[i] - momentum.states[i - 1]) >= 2;

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const color = momentum.colors[i];

            if (isHardOverride) {
                // Scharfe Kante
                path.setAttribute('d', `M ${prev.x} ${prev.y} L ${pos.x} ${pos.y}`);
            } else {
                // Glatte Kurve
                const midX = (prev.x + pos.x) / 2;
                const midY = (prev.y + pos.y) / 2;
                path.setAttribute('d', `M ${prev.x} ${prev.y} Q ${midX} ${midY} ${pos.x} ${pos.y}`);
            }

            path.setAttribute('stroke', color);
            path.setAttribute('stroke-width', '4');
            path.setAttribute('stroke-linecap', 'round');
            path.setAttribute('stroke-linejoin', 'round');
            path.setAttribute('fill', 'none');
            svg.appendChild(path);
        });

        // Event Markers
        momentum.events.forEach(event => {
            const pos = momentum.positions[event.game - 1]; // game is 1-indexed, positions 0-indexed? 
            // Assuming user logic is correct: game - 1
            if (!pos) return;

            const marker = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            marker.setAttribute('cx', pos.x.toString());
            marker.setAttribute('cy', pos.y.toString());
            marker.setAttribute('r', event.tier === 1 ? '12' : '8');
            marker.setAttribute('fill', event.tier === 1 ? '#3498DB' : '#00D96F');
            marker.setAttribute('stroke', 'white');
            marker.setAttribute('stroke-width', '2');
            svg.appendChild(marker);

            // Event Icon (Text)
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', pos.x.toString());
            text.setAttribute('y', (pos.y + 4).toString());
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('font-size', event.tier === 1 ? '16' : '12');
            text.setAttribute('font-weight', 'bold');
            text.setAttribute('fill', 'white');
            text.textContent = event.icon;
            svg.appendChild(text);
        });

        // Cleanup
        return () => {
            svg.innerHTML = '';
        };
    }, [momentum, width, height]);

    return (
        <div className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)] shadow-lg">
            <svg
                ref={svgRef}
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-[280px] block"
                preserveAspectRatio="xMidYMid meet"
            />
            <div className="mt-4 flex gap-4 text-xs text-[var(--color-text-secondary)] justify-center flex-wrap">
                <span>🔴 Negative</span>
                <span>⚪ Neutral</span>
                <span>🟢 Positive</span>
                <span className="text-[var(--accent-electric-blue)]">🔵 Tier 1 Event</span>
            </div>
        </div>
    );
}
