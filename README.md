# Is It A Derby? ⚽

**Settle the local derby debate once and for all.**

Pick two English football clubs and get a scored verdict on whether it's a proper derby or not. Covers **177 clubs** from the Premier League down to National League North & South.

**[Try it live](https://isitaderby.co.uk)**

## How it works

Every matchup gets two independent scores:

### Derby Score (0–100) — the geography
1. **Distance between grounds** — straight-line (Haversine) distance
2. **Flat 30-mile base radius** for every club, regardless of tier — density handles regional variation instead
3. **Density adjustment** — in dense clusters the radius tightens, in sparse areas it widens:
   - **Regional floors** prevent over-tightening outside London:
     - London: 0.40
     - Greater Manchester / Lancashire / Cheshire / West Yorkshire: 0.60
     - West Midlands: 0.75
   - **Loneliness bonus** for isolated clubs: **1.8× when zero nearby** (Norwich, Cambridge, Carlisle, Plymouth, Hereford etc.), 1.5× when ≤1, 1.3× when ≤3 — because what counts as "local" depends on what else is nearby
4. **Bonuses** — same city (+15), same county (+10), same tier (+5)

### Rivalry Score (0–100) — the history
For pairs with meaningful history:
- **Meeting frequency** (40%) — total competitive meetings all-time
- **Recency** (25%) — have they played each other recently?
- **Antiquity** (20%) — how far back does the fixture go?
- **Notable moments** (15%) — editorial assessment of iconic games, controversies, giant-killings

### Verdict thresholds

| Score | Verdict |
|-------|---------|
| 75–100 | Proper Local Derby |
| 55–74 | Local Derby |
| 35–54 | Distant Neighbours |
| 15–34 | Clutching |
| 0–14 | Not a Derby |

## Features

- **Search & score** any two clubs with autocomplete
- **Interactive map** showing both grounds with distance line (Leaflet + CARTO dark tiles)
- **Club colour badges** — gradient circles using each club's primary/secondary colours
- **130+ editorial straplines** covering historic rivalries, famous matches and oddities
- **489 pairs with rivalry scores** — head-to-head data compiled from Wikipedia, 11v11, FBref and club histories
- **40+ embedded YouTube highlights** for the standout matchups
- **Top Rivals per club** — click any club name to see its top 10 rivals ranked by combined derby + rivalry score
- **Leaderboards** — Ultimate Rivalries, Closest Derbies, Fiercest Rivalries
- **Wordle-style sharing** — copy a text snippet with emoji score bar for group chats
- **Shareable URLs** — link directly to any matchup (e.g. `?a=arsenal&b=tottenham-hotspur`)
- **Every pair has a page** — all 15,576 possible combinations are pre-computed and addressable
- **Fully static** — no backend, loads instantly from GitHub Pages

## Tech

- Vanilla HTML/CSS/JS — no framework
- [Leaflet](https://leafletjs.com/) for maps
- [CARTO](https://carto.com/) dark basemap tiles
- Hosted on GitHub Pages, custom domain via Cloudflare
- [GoatCounter](https://www.goatcounter.com/) for privacy-friendly analytics

## Data

Club data is from the 2025/26 season. Ground coordinates sourced from Wikipedia/Google Maps. 177 clubs across 6 tiers of the English football pyramid. Rivalry data is compiled manually from published sources and subject to editorial judgement.

## Running locally

```bash
# Any static server works
python3 -m http.server 8080
# Then open http://localhost:8080
```

To regenerate `data/pairs.json` from `data/clubs.json`:

```bash
python3 scripts/build-pairs.py
```

Note: this overwrites all enrichment (straplines, rivalry scores, videos). Normal workflow is surgical edits to `data/pairs.json` directly.

## Contributing

Got a strapline that needs adding? A club colour that's wrong? A rivalry score that undersells the history? Open an issue or PR.

## License

MIT
