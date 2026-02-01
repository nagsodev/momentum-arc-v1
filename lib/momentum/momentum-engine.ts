import type { Match, MomentumOutput, MomentumEvent, Position } from '../types';

export function calculateMomentum(match: Match): MomentumOutput {
    const totalGames = match.sets.reduce((sum, set) => sum + set.games, 0);

    // v1: Realistische Momentum States (ersetzt später durch Event-basierte Logik)
    const states: number[] = [];
    const colors: string[] = [];
    const positions: Position[] = [];

    // Djokovic AO Final Pattern:
    // Set 1: Djokovic baut Momentum auf
    // Set 2: Alcaraz Rebreak → Swing
    // Set 3: Oscillation
    for (let i = 0; i < totalGames; i++) {
        let state: number;

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

        // Brand Colors mappen
        const colorMap: Record<number, string> = {
            '-2': '#FF4757',    // Signal-Rot
            '-1': '#FF4757',
            '0': '#F8F9FA',     // Off-White
            '1': '#00D96F',     // Neon-Grün
            '2': '#00D96F'
        };
        colors.push(colorMap[state]);

        // SVG Positionen (viewBox 0-1000 x 0-280)
        const x = i === 0 ? 0 : (i / (totalGames - 1)) * 1000;
        const y = 280 - ((state + 2) / 4 * 280);
        positions.push({ x, y });
    }

    // Demo Events (Tier 1/2)
    const events: MomentumEvent[] = [
        { game: 7, type: 'break', tier: 1, name: 'Break Djokovic', icon: '🔓', player: 'player1' },
        { game: 15, type: 'rebreak', tier: 1, name: 'Rebreak Alcaraz', icon: '🔁', player: 'player2' },
        { game: 21, type: 'big_game', tier: 2, name: 'Big Hold Djokovic', icon: '⭐', player: 'player1' },
        { game: 26, type: 'point_streak', tier: 2, name: '5-Point Streak', icon: '⚡', player: 'player1' }
    ];

    return {
        states,
        events,
        colors,
        positions
    };
}

// Test Export für app/page.tsx
export type { Match, MomentumOutput, MomentumEvent, Position };
