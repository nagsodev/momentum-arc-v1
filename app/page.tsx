'use client';

import React from 'react';
import Link from 'next/link';
import matches from '../data/matches.json';
import { calculateMomentum } from '../lib/momentum/momentum-engine';
import type { Match } from '../lib/types';
import MatchCard from '../components/match/MatchCard';

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] py-12 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-6xl font-[900] bg-gradient-to-r from-[var(--primary-navy)] to-[var(--accent-electric-blue)] bg-clip-text text-transparent mb-4 tracking-tighter">
            Tennis Momentum Visualizer
          </h1>
          <p className="text-xl text-[var(--color-text-secondary)] font-medium max-w-2xl mx-auto">
            Discover the narrative behind every match with AI-powered momentum analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(matches as Match[]).map((match: Match) => {
            const momentum = calculateMomentum(match);
            return (
              <div key={match.id} className="animate-in fade-in zoom-in-95 duration-500 fill-mode-both" style={{ animationDelay: `${(matches as Match[]).indexOf(match) * 100}ms` }}>
                <MatchCard
                  match={match}
                  momentum={momentum}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
