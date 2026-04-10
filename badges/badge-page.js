/**
 * Shared JS for badge filter pages.
 * Reads data-badge attribute from the container to filter pairs.
 */

const slug = name => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '');

Promise.all([
  fetch('/data/clubs.json?v=18').then(r => r.json()),
  fetch('/data/pairs.json?v=18').then(r => r.json())
]).then(([clubData, pairData]) => {
  const clubMap = new Map();
  clubData.forEach(c => clubMap.set(c.name, c));

  const badge = document.getElementById('badge-table').dataset.badge;
  const rows = pairData
    .filter(p => (p.badges || []).includes(badge))
    .sort((a, b) => b.score - a.score || a.distance - b.distance);

  document.getElementById('badge-count').textContent = `${rows.length} matchups`;

  document.getElementById('badge-table').innerHTML = rows.map((p, i) => {
    const ca = clubMap.get(p.a);
    const cb = clubMap.get(p.b);
    if (!ca || !cb) return '';
    const scoreClass = p.score >= 75 ? 'fierce' : p.score >= 55 ? 'local' : '';
    return `<a class="leaderboard-row" href="/?a=${slug(p.a)}&b=${slug(p.b)}">
      <span class="lb-rank">${i + 1}</span>
      <span class="lb-badges">
        <span class="lb-badge" style="background:linear-gradient(135deg,${ca.col1},${ca.col2})"></span>
        <span class="lb-badge" style="background:linear-gradient(135deg,${cb.col1},${cb.col2})"></span>
      </span>
      <span class="lb-names">${p.a} vs ${p.b}</span>
      <span class="lb-score ${scoreClass}">${p.score}</span>
      <span class="lb-distance">${p.distance}mi</span>
    </a>`;
  }).join('');
});
