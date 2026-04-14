# NBA Playoff Predictor — To-Do List

Tasks tracked here are the canonical backlog for the bracket app.
The Claude skill reads this file to stay current on pending work.

---

## Pending

- [x] **Move MVP Trophy section to bottom of page**
  Move the `.mvp-hub` section from its current position (below the hero, above the bracket) to below the bracket and Finals card, so it anchors the bottom of the page.

- [x] **Add team logo placeholders**
  Add a logo placeholder element to the left of each team name inside `.team-row`. Should display the team's actual logo image where available, or a styled circular/square placeholder with the team's accent colour when not. Size: ~36×36px.

- [x] **Zoom out / scale bracket so all boxes fit at once with ≥2cm spacing**
  Apply a CSS `zoom` or `transform: scale()` to the `.bracket-shell` so the full 9-column bracket is visible on screen without horizontal scrolling. Ensure at least ~28–30px (≈2cm at 96dpi) of gap between each card in both directions.

- [x] **West Play-In 9 vs 10: set 9th seed to Phoenix Suns**
  In `js/data/bracket.js`, update the `west.playIn` array: index 2 (currently `"TBD"`) → `"Phoenix Suns"`. Add `"Phoenix Suns"` / `"phx"` to `TEAM_LOOKUP`, `TEAM_ACCENTS`, `ROSTERS`, and `TEAM_STATS` in `playoff-predictor.js` if not already present.

- [x] **Remove decorative glass orb bubbles from matchup cards**
  Remove the `::after` pseudo-element on `.matchup-card` (the 92px circular gloss orb in the top-right corner of each card) and the matching `::before` shimmer overlay. Keep the glass background and border styling — only remove the floating circle decorations.

- [x] **Play-in result: replace 0/1 wins dropdown with Win/Loss selector**
  In play-in matchup cards, replace the wins `<select>` (options: 0, 1) with a simpler Win / Loss toggle or dropdown so users pick "Win" or "Loss" rather than a numeric score. Should still resolve the series winner the same way (1 win = advance).

- [ ] **Upgrade stats modal: centered layout, horizontal bar charts, team logos**
  Redesign the `.stats-modal` team comparison panel with three sub-tasks:
  - **Centered metric layout:** Each stat row should show the metric label centred between the two values, with team name displayed directly above its value column in the header (currently left/right aligned — align both to their respective columns).
  - **Horizontal bar charts:** Replace plain stat numbers with a split bar chart for each metric. Each side's bar length is proportional to its value relative to the opposing team. Bar colour uses the team's `TEAM_ACCENTS` colour (accessible via `getTeamId()` + `TEAM_ACCENTS`). Both bars grow from the centre outward toward their respective team side.
  - **Team logos in modal header:** Add a 48×48px team logo image (or accent-coloured placeholder if no image) for each team in the `.stats-modal__header`, flanking the title on either side.

---

## Completed

- [x] Restructure bracket layout: Finals at bottom centre, centripetal flow
- [x] Remove blur-on-hover effect for non-focused cards
- [x] Remove team badge bubbles from matchup cards
- [x] Fix play-in to single-elimination (1-win, not best-of-7)
- [x] Add play-in result badges (Winner → 7th/8th Seed)
- [x] Fix card overlap — remove aspect-ratio constraint, fixed 230px columns
- [x] Widen page to 2400px max for landscape bracket display
