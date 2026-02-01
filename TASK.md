# 🎾 Next Session: Momentum Arc Visualization Refinement

This task list outlines the priorities for improving the analytical depth and visual consistency of the Momentum Arc dashboard.

## 🚀 Priority Tasks

### 1. Data & Demo: Tier 2/3 Event Visibility
*   **Goal**: Ensure all event levels are visually represented and understood.
*   **Actions**:
    *   Modify `data/matches.json` to include detailed "Tier 2" (Big/Streak) and "Tier 3" (Error) events for a specific match (e.g., Federer-Nadal 2008).
    *   Verify that `EventMarker.tsx` correctly renders these tiers.
    *   Show a high-quality Match Card demonstration featuring these multi-tier events.

### 2. Analytical Density: Filling Neutral Zones
*   **Goal**: Prevent "empty" segments of the graph when momentum is near the baseline.
*   **Actions**:
    *   Update the `momentum-engine.ts` or `visual-mapper.ts` logic to automatically populate neutral zones with Tier 2/3 markers (e.g., "Sustained Rally" or "Tactical Battle").
    *   Ensure the visual weight of these markers is appropriate for the neutral context.

### 3. Turning Points Logic: Match Narrative Balance
*   **Goal**: Ensure "Turning Points" reflect the overall match winner's critical moments, not just the loser's streaks.
*   **Context**: Example [Federer-Nadal 2008](http://localhost:3000/match/federer-nadal-wimbledon-2008). 
*   **Actions**:
    *   Implement a "Winner-Bias" or "Finish-Aware" algorithm for event selection.
    *   Include "Clutch Saves" or "Winning Momentum Shifts" in the Turning Points summary.

### 4. UI/UX: Set Switcher Stability
*   **Goal**: Seamless transitions when focusing on specific sets.
*   **Actions**:
    *   **Fix**: Prevent player name overlays in territories from shifting or jumping when `focusSet` changes.
    *   **Fix**: Resolve "empty graph" issues where the momentum line doesn't reach the edges of the focused set view.

### 5. Interaction: Tooltip & Legend Polishing
*   **Goal**: Flawless interactivity and consistent terminology.
*   **Actions**:
    *   **Fix**: Resolve Tooltip clipping at the edges of the chart container (overflow issues).
    *   **Fix**: Align the Legend terminology and colors exactly with the Player Territory gradients and the actual curve colors used in the graph.

---
*Note: This plan ensures the Momentum Arc evolves from a visual gimmick into a robust, edge-case-hardened analytical dashboard.*
