import matches from '../../data/matches.json';
import { calculateMomentum } from '../../lib/momentum/momentum-engine';
import MomentumArc from '../../components/momentum/MomentumArc';
import GameTimeline from '../../components/momentum/GameTimeline';
import type { Match } from '../../lib/types';

export default function MatchDetail() {
    const match = matches.matches[0] as Match;
    const momentum = calculateMomentum(match);

    return (
        <main className="min-h-screen bg-[var(--color-background)] py-12 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header bleibt gleich */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-[var(--font-headline)] bg-gradient-to-r from-[var(--primary-navy)] to-[var(--accent-electric-blue)] bg-clip-text text-transparent mb-4">
                        🎾 Momentum Arc
                    </h1>
                    <p className="text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto">
                        Live Engine + SVG Visualization – v1 MVP
                    </p>
                </div>

                {/* MomentumArc HERO */}
                <div className="bg-[var(--color-surface)] rounded-3xl shadow-2xl border border-[var(--color-border)] p-8 mb-12 overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-[var(--font-headline)] text-[var(--color-text-primary)]">
                            AO 2026 Final – Momentum Arc
                        </h2>
                        <div className="text-sm text-[var(--color-text-secondary)] font-[var(--font-mono)]">
                            30 Games • {momentum.events.length} Events
                        </div>
                    </div>

                    <MomentumArc momentum={momentum} />

                    <div className="mt-8">
                        <GameTimeline momentum={momentum} sets={match.sets} />
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-12">
                    <div className="p-6 bg-[var(--momentum-strong-positive)]/10 rounded-xl">
                        <div className="text-3xl font-bold text-[var(--momentum-strong-positive)]">{Math.max(...momentum.states)}</div>
                        <div className="text-sm text-[var(--color-text-secondary)]">Peak Momentum</div>
                    </div>
                    <div className="p-6 bg-[var(--momentum-strong-negative)]/10 rounded-xl">
                        <div className="text-3xl font-bold text-[var(--momentum-strong-negative)]">{Math.min(...momentum.states)}</div>
                        <div className="text-sm text-[var(--color-text-secondary)]">Low Point</div>
                    </div>
                    <div className="p-6 bg-[var(--accent-electric-blue)]/10 rounded-xl">
                        <div className="text-3xl font-bold text-[var(--accent-electric-blue)]">{momentum.events.filter(e => e.tier === 1).length}</div>
                        <div className="text-sm text-[var(--color-text-secondary)]">Tier 1 Events</div>
                    </div>
                </div>

                {/* Events Table */}
                <div className="bg-[var(--color-surface)] rounded-2xl p-8 border border-[var(--color-border)] shadow-lg">
                    <h3 className="text-2xl font-[var(--font-headline)] mb-6 flex items-center gap-3">
                        <span className="text-3xl">📍</span>
                        Key Momentum Events
                    </h3>
                    <div className="grid gap-4">
                        {momentum.events.map((event, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-gradient-to-r rounded-xl hover:shadow-md transition-all">
                                <div className="text-3xl">{event.icon}</div>
                                <div className="flex-1">
                                    <div className="font-bold text-lg">{event.name}</div>
                                    <div className="text-sm text-[var(--color-text-secondary)]">Game {event.game} • Tier {event.tier}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
