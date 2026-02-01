import type { Point, Set, MomentumEvent } from '../types';

export function detectEvents(points: Point[], sets: Set[], player1Name: string = 'Player 1', player2Name: string = 'Player 2'): MomentumEvent[] {
    const events: MomentumEvent[] = [];

    // Group points by game
    const games = groupPointsToGames(points);

    // 1. & 2. Break of Serve & Big Game (Deuce analysis)
    games.forEach((gamePoints, index) => {
        if (gamePoints.length === 0) return;

        const gameNumber = gamePoints[0].game;
        const server = gamePoints[0].server;
        const lastPoint = gamePoints[gamePoints.length - 1];
        const winner = lastPoint.winner;

        // Break of Serve
        if (winner !== server) {
            const winnerName = winner === 'player1' ? player1Name : player2Name;
            events.push({
                game: gameNumber,
                type: 'break',
                tier: 1,
                name: `Break (${winnerName})`,
                icon: '🔓',
                player: winner
            });
        }

        // Big Game (≥ 2 Deuces)
        // Logic: Deuce is reached when score is 3-3 (40-40). 
        // Every 2 points after that if it stays tied, it's another deuce.
        let p1Score = 0;
        let p2Score = 0;
        let deuceCount = 0;

        gamePoints.forEach(p => {
            if (p.winner === 'player1') p1Score++;
            else p2Score++;

            if (p1Score >= 3 && p2Score >= 3 && p1Score === p2Score) {
                deuceCount++;
            }
        });

        if (deuceCount >= 2) {
            const winnerName = winner === 'player1' ? player1Name : player2Name;
            events.push({
                game: gameNumber,
                type: 'big_game',
                tier: 2,
                name: `Big Game (${winnerName})`,
                icon: '⭐',
                player: winner
            });
        }
    });

    // 3. Point Streak (3+ consecutive points)
    let currentStreakPlayer: 'player1' | 'player2' | null = null;
    let streakCount = 0;

    points.forEach((p, i) => {
        if (p.winner === currentStreakPlayer) {
            streakCount++;
        } else {
            if (streakCount >= 3 && currentStreakPlayer) {
                const playerName = currentStreakPlayer === 'player1' ? player1Name : player2Name;
                events.push({
                    game: points[i - 1].game,
                    type: 'point_streak',
                    tier: 2,
                    name: `${streakCount}-Point Streak (${playerName})`,
                    icon: '⚡',
                    player: currentStreakPlayer
                });
            }
            currentStreakPlayer = p.winner;
            streakCount = 1;
        }
    });
    // Check last streak
    if (streakCount >= 3 && currentStreakPlayer) {
        const playerName = currentStreakPlayer === 'player1' ? player1Name : player2Name;
        events.push({
            game: points[points.length - 1].game,
            type: 'point_streak',
            tier: 2,
            name: `${streakCount}-Point Streak (${playerName})`,
            icon: '⚡',
            player: currentStreakPlayer
        });
    }

    // 4. Error Cluster (≥ 2 unforced errors in a row)
    // We check for unforced errors by the same player in a row
    for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];

        // If p1 was an error by player X AND p2 was an error by the SAME player X
        // Note: winner is the OTHER player if it's an unforced error.
        // So we need to check who committed the error.
        // If type is 'unforced_error', the loser of the point committed it.
        const errorPlayer1 = p1.type === 'unforced_error' ? (p1.winner === 'player1' ? 'player2' : 'player1') : null;
        const errorPlayer2 = p2.type === 'unforced_error' ? (p2.winner === 'player1' ? 'player2' : 'player1') : null;

        if (errorPlayer1 && errorPlayer1 === errorPlayer2) {
            const playerName = errorPlayer1 === 'player1' ? player1Name : player2Name;
            events.push({
                game: p2.game,
                type: 'error_cluster',
                tier: 3,
                name: `Error Cluster (${playerName})`,
                icon: '❌',
                player: errorPlayer1
            });
            i++; // Skip next to avoid overlapping clusters of 2 (e.g. 3 in a row becomes 1 cluster)
        }
    }

    // 5. Tiebreak Win/Loss
    sets.forEach(set => {
        if (set.tiebreak && set.winner) {
            // Find if this set's outcome is in our points (at the end of a set)
            // This is harder without knowing which points belong to which set exactly
            // but we can look for the last point of the match or set-ending points.
            // For now, let's look for games where game count reached the set winner's game count.
            const setWinnerName = set.winner;
            const playerKey = (setWinnerName === player1Name) ? 'player1' : 'player2';

            // We just add a tiebreak event for the game index where it happened
            events.push({
                game: set.games, // Approximate game number
                type: 'tiebreak_won',
                tier: 1,
                name: `Tiebreak Won (${setWinnerName})`,
                icon: '🏆',
                player: playerKey
            });
        }
    });

    return events;
}

function groupPointsToGames(points: Point[]): Point[][] {
    const games: Map<number, Point[]> = new Map();
    points.forEach(p => {
        if (!games.has(p.game)) {
            games.set(p.game, []);
        }
        games.get(p.game)!.push(p);
    });
    return Array.from(games.values());
}
