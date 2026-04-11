/**
 * Shared JS for leaderboard subpages.
 * Loads clubs + pairs data, renders a table based on the page's data-mode attribute.
 */

const slug = name => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '');

Promise.all([
  fetch('data/clubs.json?v=31').then(r => r.json()),
  fetch('data/pairs.json?v=31').then(r => r.json())
]).then(([clubData, pairData]) => {
  const clubMap = new Map();
  clubData.forEach(c => clubMap.set(c.name, c));

  const mode = document.getElementById('leaderboard-table').dataset.mode;
  let rows = [];

  if (mode === 'ultimate') {
    rows = pairData
      .filter(p => p.rivalryScore != null)
      .map(p => {
        const rawUnrounded = p.score * 0.4 + p.rivalryScore * 0.6;
        const penalty = Math.min(p.rivalryScore / 20, 1);
        const hybridUnrounded = rawUnrounded * penalty;
        return { ...p, hybrid: Math.round(hybridUnrounded), hybridUnrounded };
      })
      // Ties on the rounded hybrid resolve by: unrounded hybrid (so 99.4
      // sits below 100.0), then by combined derby+rivalry raw sum, then
      // distance. No alphabetical fallback — that gave Arsenal vs Spurs
      // an unfair edge over Man City vs Man Utd when both rounded to 100.
      .sort((a, b) =>
        b.hybrid - a.hybrid ||
        b.hybridUnrounded - a.hybridUnrounded ||
        (b.score + b.rivalryScore) - (a.score + a.rivalryScore) ||
        a.distance - b.distance
      );
  } else if (mode === 'closest') {
    rows = pairData
      .filter(p => p.score >= 55)
      .sort((a, b) => b.score - a.score || a.distance - b.distance);
  } else if (mode === 'rivalries') {
    rows = pairData
      .filter(p => p.rivalryScore != null && p.rivalryScore > 0)
      .sort((a, b) => b.rivalryScore - a.rivalryScore || b.meetings - a.meetings);
  }

  const container = document.getElementById('leaderboard-table');
  container.innerHTML = rows.map((p, i) => {
    const ca = clubMap.get(p.a);
    const cb = clubMap.get(p.b);
    if (!ca || !cb) return '';

    let mainScore, metaText, scoreClass;
    if (mode === 'ultimate') {
      mainScore = p.hybrid;
      metaText = `${p.score}+${p.rivalryScore}`;
      scoreClass = p.hybrid >= 90 ? 'fierce' : p.hybrid >= 70 ? 'local' : '';
    } else if (mode === 'closest') {
      mainScore = p.score;
      metaText = `${p.distance}mi`;
      scoreClass = p.score >= 75 ? 'fierce' : 'local';
    } else {
      mainScore = p.rivalryScore;
      metaText = p.meetings ? `${p.meetings} mtgs` : '';
      scoreClass = p.rivalryScore >= 80 ? 'fierce' : p.rivalryScore >= 60 ? 'local' : '';
    }

    return `<a class="leaderboard-row" href="/?a=${slug(p.a)}&b=${slug(p.b)}">
      <span class="lb-rank">${i + 1}</span>
      <span class="lb-badges">
        <span class="lb-badge" style="background:linear-gradient(135deg,${ca.col1},${ca.col2})"></span>
        <span class="lb-badge" style="background:linear-gradient(135deg,${cb.col1},${cb.col2})"></span>
      </span>
      <span class="lb-names">${p.a} vs ${p.b}</span>
      <span class="lb-score ${scoreClass}">${mainScore}</span>
      <span class="lb-distance">${metaText}</span>
    </a>`;
  }).join('');
});
