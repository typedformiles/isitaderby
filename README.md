# Is It A Derby? ⚽

**Settle the local derby debate once and for all.**

Pick two English football clubs and get a scored verdict on whether it's a proper derby or not. Covers 151 clubs from the Premier League down to National League North & South.

**[Try it live](https://typedformiles.github.io/isitaderby/)**

## How it works

The score (0-100) is based on:

1. **Distance between grounds** — straight-line (Haversine) distance between stadiums
2. **Tier-adjusted radius** — what counts as "local" scales with league level (25mi for PL/Championship, 35mi for League One/Two, 50mi for National League)
3. **Club density adjustment** — in dense areas like London (15+ clubs within 25mi), the radius tightens. In sparse areas like Cumbria, a "loneliness bonus" widens it
4. **Bonuses** — same city (+15), same county (+10), same tier (+5)

### Verdict thresholds

| Score | Verdict |
|-------|---------|
| 75-100 | Proper Local Derby |
| 55-74 | Local Derby |
| 35-54 | Regional Rivalry |
| 15-34 | Stretch — Barely a Derby |
| 0-14 | Not a Derby |

## Features

- **Search & score** any two clubs with autocomplete
- **Interactive map** showing both grounds with distance line (Leaflet + CARTO dark tiles)
- **Club colour badges** — gradient circles using each club's primary/secondary colours
- **90+ historical straplines** — fun facts and rivalry context for notable matchups
- **Proper Derbies Ranked** — leaderboard of the top 50 highest-scoring derbies
- **Wordle-style sharing** — copy a text snippet with emoji score bar for group chats
- **Shareable URLs** — link directly to any matchup (e.g. `?a=arsenal&b=tottenham-hotspur`)
- **Fully static** — no build step, no backend, works offline

## Tech

- Vanilla HTML/CSS/JS
- [Leaflet](https://leafletjs.com/) for maps
- [CARTO](https://carto.com/) dark basemap tiles
- Hosted on GitHub Pages

## Data

Club data is from the 2024/25 season. Ground coordinates sourced from Wikipedia/Google Maps. 170 clubs across 6 tiers of the English football pyramid.

## Running locally

```bash
# Any static server works
python3 -m http.server 8080
# Then open http://localhost:8080
```

## Contributing

Got a strapline that needs adding? A club colour that's wrong? Open an issue or PR.

## License

MIT
