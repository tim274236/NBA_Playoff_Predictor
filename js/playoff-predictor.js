import React, { useEffect, useMemo, useState } from "https://esm.sh/react@18.3.1";
import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";
import { BRACKET } from "./data/bracket.js";
import { TEAM_STATS } from "./data/teamStats.js";
import { ROSTERS } from "./data/rosters.js";

const TEAM_LOOKUP = {
    "Oklahoma City Thunder": "okc",
    "Los Angeles Lakers": "lal",
    "Houston Rockets": "hou",
    "Denver Nuggets": "den",
    "Minnesota Timberwolves": "min",
    "San Antonio Spurs": "sas",
    "Golden State Warriors": "gsw",
    "LA Clippers": "lac",
    "Portland Trail Blazers": "por",
    "Boston Celtics": "bos",
    "Cleveland Cavaliers": "cle",
    "Toronto Raptors": "tor",
    "New York Knicks": "nyk",
    "Atlanta Hawks": "atl",
    "Detroit Pistons": "det",
    "Charlotte Hornets": "cha",
    "Miami Heat": "mia",
    "Philadelphia 76ers": "phi",
    "Orlando Magic": "orl",
    "Phoenix Suns": "phx"
};

const TEAM_ACCENTS = {
    okc: "#2f80ed",
    lal: "#f4c542",
    hou: "#ef4444",
    den: "#60a5fa",
    min: "#22c55e",
    sas: "#94a3b8",
    gsw: "#f59e0b",
    lac: "#38bdf8",
    por: "#f97316",
    bos: "#10b981",
    cle: "#7c3aed",
    tor: "#dc2626",
    nyk: "#2563eb",
    atl: "#fb7185",
    det: "#14b8a6",
    cha: "#06b6d4",
    mia: "#f43f5e",
    phi: "#3b82f6",
    orl: "#8b5cf6",
    phx: "#e56020"
};

const WEST_PLAYIN = BRACKET.west.playIn;
const EAST_PLAYIN = BRACKET.east.playIn;
const WEST_R1 = BRACKET.west.r1;
const EAST_R1 = BRACKET.east.r1;

const SERIES_META = [
    { id: "playin_w1", round: "Play-In", column: "west-playin", title: "West 7 vs 8", home: WEST_PLAYIN[0], away: WEST_PLAYIN[1] },
    { id: "playin_w2", round: "Play-In", column: "west-playin", title: "West 9 vs 10", home: WEST_PLAYIN[2], away: WEST_PLAYIN[3] },
    { id: "r1_w1", round: "Round 1", column: "west-r1", title: "West 1", home: WEST_R1[0].home, awayFrom: { seriesId: "playin_w1" } },
    { id: "r1_w2", round: "Round 1", column: "west-r1", title: "West 2", home: WEST_R1[1].home, away: WEST_R1[1].away },
    { id: "r1_w3", round: "Round 1", column: "west-r1", title: "West 3", home: WEST_R1[2].home, away: WEST_R1[2].away },
    { id: "r1_w4", round: "Round 1", column: "west-r1", title: "West 4", home: WEST_R1[3].home, awayFrom: { seriesId: "playin_w2" } },
    { id: "r2_w1", round: "Semifinals", column: "west-r2", title: "West Semi A", homeFrom: { seriesId: "r1_w1" }, awayFrom: { seriesId: "r1_w2" } },
    { id: "r2_w2", round: "Semifinals", column: "west-r2", title: "West Semi B", homeFrom: { seriesId: "r1_w3" }, awayFrom: { seriesId: "r1_w4" } },
    { id: "r3_w", round: "Conf Finals", column: "center-west", title: "West Finals", homeFrom: { seriesId: "r2_w1" }, awayFrom: { seriesId: "r2_w2" } },
    { id: "playin_e1", round: "Play-In", column: "east-playin", title: "East 7 vs 8", home: EAST_PLAYIN[0], away: EAST_PLAYIN[1] },
    { id: "playin_e2", round: "Play-In", column: "east-playin", title: "East 9 vs 10", home: EAST_PLAYIN[2], away: EAST_PLAYIN[3] },
    { id: "r1_e1", round: "Round 1", column: "east-r1", title: "East 1", home: EAST_R1[0].home, awayFrom: { seriesId: "playin_e1" } },
    { id: "r1_e2", round: "Round 1", column: "east-r1", title: "East 2", home: EAST_R1[1].home, away: EAST_R1[1].away },
    { id: "r1_e3", round: "Round 1", column: "east-r1", title: "East 3", home: EAST_R1[2].home, away: EAST_R1[2].away },
    { id: "r1_e4", round: "Round 1", column: "east-r1", title: "East 4", home: EAST_R1[3].home, awayFrom: { seriesId: "playin_e2" } },
    { id: "r2_e1", round: "Semifinals", column: "east-r2", title: "East Semi A", homeFrom: { seriesId: "r1_e1" }, awayFrom: { seriesId: "r1_e2" } },
    { id: "r2_e2", round: "Semifinals", column: "east-r2", title: "East Semi B", homeFrom: { seriesId: "r1_e3" }, awayFrom: { seriesId: "r1_e4" } },
    { id: "r3_e", round: "Conf Finals", column: "center-east", title: "East Finals", homeFrom: { seriesId: "r2_e1" }, awayFrom: { seriesId: "r2_e2" } },
    { id: "finals", round: "NBA Finals", column: "center-finals", title: "NBA Finals", homeFrom: { seriesId: "r3_w" }, awayFrom: { seriesId: "r3_e" } }
];

const COLUMN_ORDER = [
    { key: "west-playin", label: "West Play-In" },
    { key: "west-r1", label: "West Round 1" },
    { key: "west-r2", label: "West Semis" },
    { key: "center-west", label: "🥈 West Finals" },
    { key: "center-finals", label: "🏆 NBA Finals" },
    { key: "center-east", label: "🥈 East Finals" },
    { key: "east-r2", label: "East Semis" },
    { key: "east-r1", label: "East Round 1" },
    { key: "east-playin", label: "East Play-In" }
];

const STORAGE_KEY = "nba-playoff-predictor-2026";

function getWinnerLabel(series) {
    if (series.winner === "home") {
        return series.home;
    }
    if (series.winner === "away") {
        return series.away;
    }
    return "TBD";
}

function resolveSlotValue(definition, side, currentSeries) {
    const direct = definition[side];
    if (direct) {
        return direct;
    }

    const fromDefinition = definition[`${side}From`];
    if (!fromDefinition) {
        return "TBD";
    }

    const sourceSeries = currentSeries[fromDefinition.seriesId];
    return sourceSeries ? getWinnerLabel(sourceSeries) : "TBD";
}

function buildSeriesMap(previousSeries = {}) {
    const computed = {};

    SERIES_META.forEach((definition) => {
        const home = resolveSlotValue(definition, "home", computed);
        const away = resolveSlotValue(definition, "away", computed);
        const previous = previousSeries[definition.id];
        const sameMatchup = previous && previous.home === home && previous.away === away;
        const isPlayIn = definition.id.startsWith("playin_");
        const winsNeeded = isPlayIn ? 1 : 4;
        const homeWins = sameMatchup ? previous.homeWins : 0;
        const awayWins = sameMatchup ? previous.awayWins : 0;
        const winner = homeWins >= winsNeeded && awayWins < winsNeeded ? "home"
            : awayWins >= winsNeeded && homeWins < winsNeeded ? "away"
            : null;

        computed[definition.id] = {
            id: definition.id,
            title: definition.title,
            round: definition.round,
            column: definition.column,
            home,
            away,
            homeWins,
            awayWins,
            winner,
            isPlayIn
        };
    });

    return computed;
}

function getInitialState() {
    return {
        series: buildSeriesMap(),
        mvp: {
            westFinalsVote: null,
            eastFinalsVote: null,
            finalsVote: null
        },
        modalSeriesId: null
    };
}

function usePredictions() {
    const [state, setState] = useState(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                return getInitialState();
            }

            const parsed = JSON.parse(raw);
            return {
                ...getInitialState(),
                ...parsed,
                series: buildSeriesMap(parsed.series || {}),
                mvp: {
                    ...getInitialState().mvp,
                    ...(parsed.mvp || {})
                },
                modalSeriesId: null
            };
        } catch (error) {
            console.warn("Could not restore saved playoff prediction state.", error);
            return getInitialState();
        }
    });

    useEffect(() => {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                series: state.series,
                mvp: state.mvp
            })
        );
    }, [state.series, state.mvp]);

    const setWins = (seriesId, side, wins) => {
        setState((current) => {
            const baseSeries = current.series[seriesId];
            if (!baseSeries) {
                return current;
            }

            const nextSeries = {
                ...current.series,
                [seriesId]: {
                    ...baseSeries,
                    [`${side}Wins`]: wins
                }
            };

            const normalized = buildSeriesMap(nextSeries);

            return {
                ...current,
                series: normalized
            };
        });
    };

    const setModalSeriesId = (seriesId) => {
        setState((current) => ({
            ...current,
            modalSeriesId: seriesId
        }));
    };

    const setMvpVote = (field, value) => {
        setState((current) => ({
            ...current,
            mvp: {
                ...current.mvp,
                [field]: value || null
            }
        }));
    };

    const resetAll = () => {
        const next = getInitialState();
        localStorage.removeItem(STORAGE_KEY);
        setState(next);
    };

    return {
        state,
        setWins,
        setModalSeriesId,
        setMvpVote,
        resetAll
    };
}

function getTeamId(teamName) {
    return TEAM_LOOKUP[teamName] || null;
}

function getTeamBadge(teamName) {
    const id = getTeamId(teamName);
    if (!id) {
        return "TBD";
    }
    return id.toUpperCase();
}

function TeamRow({ label, teamName, wins, onWinsChange, isWinner, isLoser, showSelector = true }) {
    const teamId = getTeamId(teamName);
    const isTbd = !teamId;
    const winOptions = [0, 1, 2, 3, 4];

    return (
        React.createElement("div", {
            className: [
                "team-row",
                isWinner ? "is-winner" : "",
                isLoser ? "is-loser" : "",
                isTbd ? "is-tbd" : ""
            ].filter(Boolean).join(" ")
        },
            React.createElement("div", { className: "team-main" },
                React.createElement("div", {
                    className: "team-logo",
                    style: { backgroundColor: teamId ? TEAM_ACCENTS[teamId] : "#94a3b8" }
                }, teamId ? teamId.toUpperCase() : "?"),
                React.createElement("div", null,
                    React.createElement("div", { className: "team-name" }, teamName),
                    React.createElement("div", { className: "team-meta" }, label)
                )
            ),
            showSelector && React.createElement("label", { className: "wins-control" },
                React.createElement("span", { className: "sr-only" }, `Wins for ${teamName}`),
                React.createElement("select", {
                    value: wins,
                    onChange: (event) => onWinsChange(Number(event.target.value)),
                    disabled: isTbd
                },
                    winOptions.map((value) => (
                        React.createElement("option", { key: value, value }, value)
                    ))
                )
            )
        )
    );
}

function MatchupCard({ series, onWinsChange, onOpenModal }) {
    const homeWinner = series.winner === "home";
    const awayWinner = series.winner === "away";
    const isFinals = series.id === "finals";
    const isPlayIn = series.isPlayIn;
    const maxWins = isPlayIn ? 1 : 4;

    const playInBadge = isPlayIn
        ? (series.id.endsWith("1") ? "Winner → 7th Seed" : "Winner → 8th Seed")
        : null;

    const statusText = series.winner
        ? `${getWinnerLabel(series)} advances`
        : isPlayIn
            ? "Single game — pick a winner"
            : "Waiting for a 4-win pick";

    return (
        React.createElement("article", {
            className: ["matchup-card", series.winner ? "has-winner" : "", isFinals ? "matchup-card--finals" : ""].filter(Boolean).join(" ")
        },
            React.createElement("div", { className: "matchup-card__header" },
                React.createElement("div", null,
                    React.createElement("p", { className: "matchup-round" }, series.round),
                    React.createElement("h3", { className: "matchup-title" }, series.title)
                ),
                React.createElement("button", {
                    type: "button",
                    className: "info-button",
                    onClick: () => onOpenModal(series.id),
                    "aria-label": `Open stats modal for ${series.title}`
                }, "i")
            ),
            React.createElement("div", { className: "matchup-card__body" },
                React.createElement(TeamRow, {
                    label: "Home",
                    teamName: series.home,
                    wins: series.homeWins,
                    onWinsChange: (wins) => onWinsChange(series.id, "home", wins),
                    isWinner: homeWinner,
                    isLoser: awayWinner,
                    showSelector: !isPlayIn
                }),
                React.createElement(TeamRow, {
                    label: "Away",
                    teamName: series.away,
                    wins: series.awayWins,
                    onWinsChange: (wins) => onWinsChange(series.id, "away", wins),
                    isWinner: awayWinner,
                    isLoser: homeWinner,
                    showSelector: !isPlayIn
                }),
                isPlayIn && React.createElement("div", { className: "playin-winner-pick" },
                    React.createElement("label", { className: "playin-winner-label" }, "Winner"),
                    React.createElement("select", {
                        value: series.winner === "home" ? "home" : series.winner === "away" ? "away" : "",
                        onChange: (event) => {
                            const val = event.target.value;
                            if (val === "home") {
                                onWinsChange(series.id, "home", 1);
                                onWinsChange(series.id, "away", 0);
                            } else if (val === "away") {
                                onWinsChange(series.id, "away", 1);
                                onWinsChange(series.id, "home", 0);
                            } else {
                                onWinsChange(series.id, "home", 0);
                                onWinsChange(series.id, "away", 0);
                            }
                        }
                    },
                        React.createElement("option", { value: "" }, "— Pick winner"),
                        React.createElement("option", { value: "home", disabled: series.home === "TBD" }, series.home),
                        React.createElement("option", { value: "away", disabled: series.away === "TBD" }, series.away)
                    )
                )
            ),
            React.createElement("div", { className: "matchup-card__footer" },
                playInBadge && React.createElement("span", { className: "playin-badge" }, playInBadge),
                React.createElement("span", { className: "series-status" }, statusText)
            )
        )
    );
}

function StatModal({ series, onClose }) {
    if (!series) {
        return null;
    }

    const rows = [
        { label: "OFF RTG", key: "offRtg" },
        { label: "DEF RTG", key: "defRtg" },
        { label: "EFG%", key: "efgPct" },
        { label: "OREB%", key: "orebPct" }
    ];

    const homeId = getTeamId(series.home);
    const awayId = getTeamId(series.away);
    const homeStats = homeId ? TEAM_STATS[homeId] : null;
    const awayStats = awayId ? TEAM_STATS[awayId] : null;

    return (
        React.createElement("div", { className: "modal-shell", role: "dialog", "aria-modal": "true" },
            React.createElement("div", {
                className: "modal-backdrop",
                onClick: onClose
            }),
            React.createElement("div", { className: "stats-modal" },
                React.createElement("div", { className: "stats-modal__header" },
                    React.createElement("div", null,
                        React.createElement("p", { className: "matchup-round" }, "Team Comparison"),
                        React.createElement("h2", { className: "stats-modal__title" }, series.title)
                    ),
                    React.createElement("button", {
                        type: "button",
                        className: "close-button",
                        onClick: onClose,
                        "aria-label": "Close stats modal"
                    }, "×")
                ),
                React.createElement("div", { className: "stats-table" },
                    React.createElement("div", { className: "stats-table__header" },
                        React.createElement("span", null, series.home),
                        React.createElement("span", null, "Metric"),
                        React.createElement("span", null, series.away)
                    ),
                    rows.map((row) => (
                        React.createElement("div", { className: "stats-table__row", key: row.key },
                            React.createElement("span", null, homeStats ? homeStats[row.key] : "—"),
                            React.createElement("strong", null, row.label),
                            React.createElement("span", null, awayStats ? awayStats[row.key] : "—")
                        )
                    ))
                )
            )
        )
    );
}

function MvpSelect({ label, sublabel, players, value, onChange }) {
    return (
        React.createElement("label", { className: "mvp-pill" },
            React.createElement("span", { className: "mvp-pill__title" }, label),
            React.createElement("span", { className: "mvp-pill__subtitle" }, sublabel),
            React.createElement("select", {
                value: value || "",
                onChange: (event) => onChange(event.target.value)
            },
                React.createElement("option", { value: "" }, players.length ? "Select player" : "Awaiting bracket winner"),
                players.map((player) => (
                    React.createElement("option", { key: player, value: player }, player)
                ))
            )
        )
    );
}

function App() {
    const { state, setWins, setModalSeriesId, setMvpVote, resetAll } = usePredictions();

    const groupedSeries = useMemo(() => {
        return COLUMN_ORDER.map((column) => ({
            ...column,
            items: SERIES_META
                .filter((seriesDefinition) => seriesDefinition.column === column.key)
                .map((seriesDefinition) => state.series[seriesDefinition.id])
                .filter(Boolean)
        }));
    }, [state.series]);

    const westWinnerId = getTeamId(getWinnerLabel(state.series.r3_w));
    const eastWinnerId = getTeamId(getWinnerLabel(state.series.r3_e));
    const finalsWinnerId = getTeamId(getWinnerLabel(state.series.finals));

    const westPlayers = westWinnerId ? (ROSTERS[westWinnerId] || []) : [];
    const eastPlayers = eastWinnerId ? (ROSTERS[eastWinnerId] || []) : [];
    const finalsPlayers = finalsWinnerId ? (ROSTERS[finalsWinnerId] || []) : [];
    const modalSeries = state.modalSeriesId ? state.series[state.modalSeriesId] : null;

    const submitPrediction = () => {
        const finalsWinner = getWinnerLabel(state.series.finals);
        const message = finalsWinner === "TBD"
            ? "Prediction saved locally. Finish the bracket to crown a champion."
            : `Prediction saved locally. ${finalsWinner} is your projected champion.`;
        window.alert(message);
    };

    return (
        React.createElement(React.Fragment, null,
            React.createElement("div", { className: "predictor-page" },
                React.createElement("header", { className: "hero" },
                    React.createElement("a", { className: "back-link", href: "index.html" }, "← Back to tools"),
                    React.createElement("p", { className: "eyebrow" }, "Tim Haddon Signature Build"),
                    React.createElement("h1", { className: "hero__title" }, "2026 NBA Playoff Predictor"),
                    React.createElement("p", { className: "hero__copy" }, "Build a full playoff path, compare team profiles, and lock in conference and Finals MVP picks from your projected winners."),
                    React.createElement("div", { className: "hero__actions" },
                        React.createElement("button", {
                            type: "button",
                            className: "submit-tag",
                            onClick: submitPrediction
                        }, "Submit Prediction"),
                        React.createElement("button", {
                            type: "button",
                            className: "ghost-button",
                            onClick: resetAll
                        }, "Reset Bracket")
                    )
                ),
                React.createElement("div", { className: "bracket-wrapper" },
                    React.createElement("section", { className: "bracket-shell" },
                        groupedSeries.map((column) => (
                            React.createElement("div", { className: "bracket-column", key: column.key, "data-col": column.key },
                                React.createElement("div", { className: "column-label" }, column.label),
                                column.items.map((series) => (
                                    React.createElement(MatchupCard, {
                                        key: series.id,
                                        series,
                                        onWinsChange: setWins,
                                        onOpenModal: setModalSeriesId
                                    })
                                ))
                            )
                        ))
                    )
                ),
                React.createElement("section", { className: "mvp-hub" },
                    React.createElement("div", { className: "section-heading" },
                        React.createElement("p", { className: "eyebrow" }, "MVP Hub"),
                        React.createElement("h2", null, "Trophy picks update from the live bracket")
                    ),
                    React.createElement("div", { className: "mvp-grid" },
                        React.createElement(MvpSelect, {
                            label: "Oscar Robertson Trophy",
                            sublabel: "West Finals MVP",
                            players: westPlayers,
                            value: state.mvp.westFinalsVote,
                            onChange: (value) => setMvpVote("westFinalsVote", value)
                        }),
                        React.createElement(MvpSelect, {
                            label: "Bob Cousy Trophy",
                            sublabel: "East Finals MVP",
                            players: eastPlayers,
                            value: state.mvp.eastFinalsVote,
                            onChange: (value) => setMvpVote("eastFinalsVote", value)
                        }),
                        React.createElement(MvpSelect, {
                            label: "Bill Russell Trophy",
                            sublabel: "NBA Finals MVP",
                            players: finalsPlayers,
                            value: state.mvp.finalsVote,
                            onChange: (value) => setMvpVote("finalsVote", value)
                        })
                    )
                )
            ),
            React.createElement(StatModal, {
                series: modalSeries,
                onClose: () => setModalSeriesId(null)
            })
        )
    );
}

createRoot(document.getElementById("app")).render(React.createElement(App));
