import type { MomentumEvent, Set } from '../types';

export function calculateStates(events: MomentumEvent[], sets: Set[]): number[] {
    const totalGames = sets.reduce((sum, set) => sum + set.games, 0);
    const states: number[] = new Array(totalGames).fill(0);

    let currentState = 0;
    let eventDurations: Record<string, number> = {}; // Tracks how long an effect should last

    // Group events by game for easier processing
    const eventsByGame: Record<number, MomentumEvent[]> = {};
    events.forEach(e => {
        if (!eventsByGame[e.game]) eventsByGame[e.game] = [];
        eventsByGame[e.game].push(e);
    });

    // Track when sets end to apply set-change rules
    const setEndGames: number[] = [];
    let cumulativeGames = 0;
    sets.forEach(set => {
        cumulativeGames += set.games;
        setEndGames.push(cumulativeGames);
    });

    for (let g = 1; g <= totalGames; g++) {
        const gameEvents = eventsByGame[g] || [];
        const isSetEnd = setEndGames.includes(g);

        // 1. Process Events for this game
        gameEvents.forEach(event => {
            const multiplier = event.player === 'player1' ? 1 : -1;

            switch (event.type) {
                case 'break':
                    // Check for Rebreak (within 2 games)
                    const prevBreak = events.find(e =>
                        e.type === 'break' &&
                        e.game < g &&
                        e.game >= g - 2 &&
                        e.player !== event.player
                    );

                    if (prevBreak) {
                        // Hard Override for Rebreak
                        currentState = 2 * multiplier;
                    } else {
                        currentState = 2 * multiplier;
                    }
                    eventDurations['long'] = 2; // Lasts 2 more games
                    break;

                case 'rebreak':
                    currentState = 2 * multiplier;
                    eventDurations['long'] = 2;
                    break;

                case 'big_game':
                    currentState = 1 * multiplier;
                    eventDurations['long'] = 2;
                    break;

                case 'point_streak':
                    currentState = 1 * multiplier;
                    eventDurations['short'] = 1; // Lasts 1 more game
                    break;

                case 'error_cluster':
                    currentState = -1 * multiplier; // -1 for the player who made errors
                    eventDurations['short'] = 1;
                    break;

                case 'tiebreak_won':
                    currentState = 2 * multiplier;
                    eventDurations['long'] = 2;
                    break;

                case 'double_fault':
                    // If it's a critical point (tier 1), it's a big drop
                    if (event.tier === 1) {
                        currentState = -2 * multiplier;
                        eventDurations['short'] = 1;
                    } else {
                        currentState = -1 * multiplier;
                        eventDurations['short'] = 1;
                    }
                    break;
            }
        });

        // 2. Apply Decay (if no events in this game)
        if (gameEvents.length === 0) {
            if (eventDurations['short'] > 0) {
                eventDurations['short']--;
            } else if (eventDurations['long'] > 0) {
                eventDurations['long']--;
            } else {
                // Natural decay towards 0
                if (currentState > 0) currentState = Math.max(0, currentState - 0.5);
                else if (currentState < 0) currentState = Math.min(0, currentState + 0.5);
            }
        }

        // 3. Set Change Rules
        if (isSetEnd) {
            // Winner -1 (min 0), Loser +1 (max 0)
            if (currentState > 0) currentState = Math.max(0, currentState - 1);
            else if (currentState < 0) currentState = Math.min(0, currentState + 1);

            // Clear event durations on set break
            eventDurations = {};
        }

        // Clip state to [-2, 2]
        states[g - 1] = Math.max(-2, Math.min(2, currentState));
    }

    return states;
}
