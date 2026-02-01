import type { Match, MomentumOutput, MomentumEvent, Position, Set } from '../types';
import { detectEvents } from './event-detector';
import { calculateStates } from './state-calculator';
import { mapToVisual } from './visual-mapper';

export function calculateMomentum(match: Match): MomentumOutput {
    // 1. Detect Events first
    const events = detectEvents(match.pointSequence, match.sets, match.player1.name, match.player2.name);

    // 2. Calculate States based on events
    const states = calculateStates(events, match.sets);

    // 3. Map to visual properties (colors and positions)
    const { colors, positions } = mapToVisual(states, events);

    return { states, events, colors, positions };
}

// Test Export für app/page.tsx
export type { Match, MomentumOutput, MomentumEvent, Position };
