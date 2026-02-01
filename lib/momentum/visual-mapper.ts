import type { MomentumEvent, Position } from '../types';

export function mapToVisual(states: number[], events: MomentumEvent[]): { colors: string[], positions: Position[] } {
    const totalGames = states.length;

    // Color mapping based on momentum state (-2 to +2)
    const colorMap: Record<string, string> = {
        '-2': '#C0152F', // Strong Negative
        '-1': '#E68161', // Soft Negative
        '0': '#F5F5F5',  // Neutral
        '1': '#32808D',  // Soft Positive
        '2': '#1A6873'   // Strong Positive
    };

    // Positions for SVG viewBox (0-1000 width, 0-280 height)
    // We include a point at (0, 140) to start the line from the center left
    const positions: Position[] = [{ x: 0, y: 140 }];

    // Map each game state to a coordinate
    states.forEach((state, i) => {
        const gameNumber = i + 1;
        const x = (gameNumber / totalGames) * 1000;

        // Vertical mapping: -2 at bottom (280), +2 at top (0)
        // Formula: y = 140 - (state * 70)
        // state +2 -> 140 - (2 * 70) = 0
        // state 0  -> 140 - (0 * 70) = 140
        // state -2 -> 140 - (-2 * 70) = 280
        const y = 140 - (state * 70);

        positions.push({ x, y });
    });

    // Map states to hex colors (using rounded states for the lookup)
    const colors = states.map(s => {
        const rounded = Math.round(s).toString();
        return colorMap[rounded] || '#F5F5F5';
    });

    return { colors, positions };
}
