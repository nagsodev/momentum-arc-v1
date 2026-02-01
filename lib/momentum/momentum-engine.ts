import type { Match, MomentumOutput, MomentumEvent, Position } from '../types';

export function calculateMomentum(match: Match): MomentumOutput {
    const totalGames = match.sets.reduce((sum, set) => sum + set.games, 0);

    const states: number[] = [];
    const colors: string[] = [];
    const positions: Position[] = [];

    // Start-Position (Game 0)
    positions.push({ x: 0, y: 140 });

    for (let i = 0; i < totalGames; i++) {
        let state: number;

        // Djokovic AO Final Pattern
        if (i < 4) state = 0;           // Neutral Start
        else if (i < 8) state = 1;      // Djokovic Control
        else if (i < 10) state = 2;     // Djokovic Peak
        else if (i < 13) state = 1;     // Set 2 Start
        else if (i < 16) state = -1;    // Alcaraz Pressure
        else if (i < 19) state = -2;    // Alcaraz Rebreak
        else if (i < 22) state = -1;    // Recovery
        else if (i < 25) state = 0;     // Neutral
        else state = (i % 3) - 1;       // Set 3 Oscillation

        states.push(state);

        // Brand Colors
        const colorMap: Record<number, string> = {
            '-2': '#FF4757',    // Red
            '-1': '#FF4757',
            '0': '#F8F9FA',     // Neutral
            '1': '#00D96F',     // Green
            '2': '#00D96F'
        };
        colors.push(colorMap[state]);

        // SVG Positionen (Default Scale 800x280)
        const x = ((i + 1) / totalGames) * 800;
        const y = 140 - (state * 40); // 0 -> 140, 1 -> 100, 2 -> 60, -1 -> 180, -2 -> 220
        positions.push({ x, y });
    }

    const events: MomentumEvent[] = [
        { game: 7, type: 'break', tier: 1, name: 'Break Djokovic', icon: '🔓', player: 'player1' },
        { game: 15, type: 'rebreak', tier: 1, name: 'Rebreak Alcaraz', icon: '🔁', player: 'player2' },
        { game: 21, type: 'big_game', tier: 2, name: 'Big Hold Djokovic', icon: '⭐', player: 'player1' },
        { game: 26, type: 'point_streak', tier: 2, name: '5-Point Streak', icon: '⚡', player: 'player1' }
    ];

    return { states, events, colors, positions };
}

// Test Export für app/page.tsx
export type { Match, MomentumOutput, MomentumEvent, Position };
