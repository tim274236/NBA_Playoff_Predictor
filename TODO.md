# NBA Playoff Predictor — To-Do List

Tasks tracked here are the canonical backlog for the bracket app.
The Claude skill reads this file to stay current on pending work.

---

## Pending

- [ ] **Move MVP Trophy section to bottom of page**
  Move the `.mvp-hub` section from its current position (below the hero, above the bracket) to below the bracket and Finals card, so it anchors the bottom of the page.

- [ ] **Add team logo placeholders**
  Add a logo placeholder element to the left of each team name inside `.team-row`. Should display the team's actual logo image where available, or a styled circular/square placeholder with the team's accent colour when not. Size: ~36×36px.

- [ ] **Zoom out / scale bracket so all boxes fit at once with ≥2cm spacing**
  Apply a CSS `zoom` or `transform: scale()` to the `.bracket-shell` so the full 9-column bracket is visible on screen without horizontal scrolling. Ensure at least ~28–30px (≈2cm at 96dpi) of gap between each card in both directions.

- [ ] **West Play-In 9 vs 10: set 9th seed to Phoenix Suns**
  In `js/data/bracket.js`, update the `west.playIn` array: index 2 (currently `"TBD"`) → `"Phoenix Suns"`. Add `"Phoenix Suns"` / `"phx"` to `TEAM_LOOKUP`, `TEAM_ACCENTS`, `ROSTERS`, and `TEAM_STATS` in `playoff-predictor.js` if not already present.

---

## Completed

- [x] Restructure bracket layout: Finals at bottom centre, centripetal flow
- [x] Remove blur-on-hover effect for non-focused cards
- [x] Remove team badge bubbles from matchup cards
- [x] Fix play-in to single-elimination (1-win, not best-of-7)
- [x] Add play-in result badges (Winner → 7th/8th Seed)
- [x] Fix card overlap — remove aspect-ratio constraint, fixed 230px columns
- [x] Widen page to 2400px max for landscape bracket display
