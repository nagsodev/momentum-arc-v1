export interface Match {
    id: string;
    tournament: string;
    round: string;
    date: string;
    player1: Player;
    player2: Player;
    sets: Set[];
    pointSequence: Point[];
    finalScore: string;
}

export interface Player {
    name: string;
    country: string;
    rank?: number;
}

export interface Set {
    setNumber: number;
    games: number;
    score: string;
    winner: string | null;
    tiebreak?: boolean;
}

export interface Point {
    game: number;
    point: number;
    winner: 'player1' | 'player2';
    type: 'ace' | 'winner' | 'unforced_error' | 'forced_error' | 'double_fault' | 'let' | 'net';
    server: 'player1' | 'player2';
    score?: string;
}

export interface MomentumOutput {
    states: number[];           // [-2, -1, 0, 1, 2] pro Game
    events: MomentumEvent[];
    colors: string[];           // Hex colors für Kurve
    positions: Position[];      // SVG Koordinaten
}

export interface MomentumEvent {
    game: number;
    type: 'break' | 'rebreak' | 'big_game' | 'tiebreak_won' | 'tiebreak_lost' | 'double_fault' | 'point_streak' | 'error_cluster';
    tier: 1 | 2 | 3;
    name: string;               // "Break (Djokovic)"
    icon: string;               // "🔓", "⭐", "❌"
    player: 'player1' | 'player2';
}

export interface Position {
    x: number;  // 0-1000 SVG
    y: number;  // 0-280 SVG
}
