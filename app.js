/**
 * Main application — UI logic, autocomplete, results display, URL sharing.
 * Loads pre-computed pairs from data/pairs.json for instant lookups.
 */

let clubs = [];
let allPairs = [];       // Full pre-computed pairs array
let pairsMap = new Map(); // O(1) lookup by "ClubA|ClubB" key
let clubMap = new Map();  // O(1) club lookup by name
let selectedA = null;
let selectedB = null;
let lastResult = null;

const slug = name => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '');
const pairKey = (a, b) => [a, b].sort().join('|');

// Load both datasets in parallel
Promise.all([
  fetch('data/clubs.json?v=16').then(r => r.json()),
  fetch('data/pairs.json?v=16').then(r => r.json())
]).then(([clubData, pairData]) => {
  clubs = clubData.sort((a, b) => a.name.localeCompare(b.name));
  clubs.forEach(c => clubMap.set(c.name, c));

  allPairs = pairData;
  pairData.forEach(p => pairsMap.set(pairKey(p.a, p.b), p));

  console.log(`Loaded ${clubs.length} clubs, ${allPairs.length} pairs`);
  checkUrlParams();
});

/**
 * Look up a pre-computed pair. Falls back to on-the-fly calculation for
 * pairs not in pairs.json (score 0, no strapline).
 */
function lookupPair(clubA, clubB) {
  const key = pairKey(clubA.name, clubB.name);
  const cached = pairsMap.get(key);
  if (cached) return cached;

  // Fallback: compute on the fly (for 0-score pairs not in the JSON)
  const result = calculateDerbyScore(clubA, clubB);
  return {
    a: clubA.name,
    b: clubB.name,
    score: result.score,
    verdict: result.verdict,
    distance: result.distance,
    radius: result.radius,
    tierGap: Math.abs(clubA.tier - clubB.tier),
    densityFactor: result.breakdown.densityFactor,
    breakdown: result.breakdown,
    rivalryName: null,
    strapline: null,
    youtube: null,
    keyMoments: [],
    tags: []
  };
}

// DOM refs
const inputA = document.getElementById('club-a');
const inputB = document.getElementById('club-b');
const listA = document.getElementById('list-a');
const listB = document.getElementById('list-b');
const settleBtn = document.getElementById('settle-btn');
const resultsEl = document.getElementById('results');

// Autocomplete
setupAutocomplete(inputA, listA, 'a');
setupAutocomplete(inputB, listB, 'b');

function setupAutocomplete(input, list, which) {
  let highlightIdx = -1;

  input.addEventListener('input', () => {
    if (which === 'a') selectedA = null;
    else selectedB = null;
    updateSettleBtn();

    const query = input.value.trim().toLowerCase();
    if (query.length < 1) {
      list.classList.remove('active');
      return;
    }

    const matches = clubs.filter(c =>
      c.name.toLowerCase().includes(query)
    ).slice(0, 12);

    if (matches.length === 0) {
      list.classList.remove('active');
      return;
    }

    highlightIdx = -1;
    renderList(list, matches, which);
    list.classList.add('active');
  });

  input.addEventListener('keydown', (e) => {
    const items = list.querySelectorAll('.autocomplete-item');
    if (!items.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      highlightIdx = Math.min(highlightIdx + 1, items.length - 1);
      updateHighlight(items, highlightIdx);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      highlightIdx = Math.max(highlightIdx - 1, 0);
      updateHighlight(items, highlightIdx);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightIdx >= 0 && items[highlightIdx]) {
        items[highlightIdx].click();
      }
    } else if (e.key === 'Escape') {
      list.classList.remove('active');
    }
  });

  input.addEventListener('focus', () => {
    if (input.value.trim().length >= 1) {
      input.dispatchEvent(new Event('input'));
    }
  });

  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !list.contains(e.target)) {
      list.classList.remove('active');
    }
  });
}

function renderList(list, matches, which) {
  list.innerHTML = matches.map((club, i) => `
    <div class="autocomplete-item" data-index="${i}" data-name="${club.name}">
      <span>${club.name}</span>
      <span class="tier-badge">${TIER_LABELS[club.tier]}</span>
    </div>
  `).join('');

  list.querySelectorAll('.autocomplete-item').forEach(item => {
    item.addEventListener('click', () => {
      const club = matches[parseInt(item.dataset.index)];
      selectClub(club, which);
      list.classList.remove('active');
    });
  });
}

function updateHighlight(items, idx) {
  items.forEach((item, i) => {
    item.classList.toggle('highlighted', i === idx);
  });
}

function selectClub(club, which) {
  if (which === 'a') {
    selectedA = club;
    inputA.value = club.name;
  } else {
    selectedB = club;
    inputB.value = club.name;
  }
  updateSettleBtn();
}

function updateSettleBtn() {
  settleBtn.disabled = !(selectedA && selectedB && selectedA.name !== selectedB.name);
}

// Settle button
settleBtn.addEventListener('click', () => {
  if (!selectedA || !selectedB) return;
  showResult(selectedA, selectedB);
});

// Random button — picks a random pair scoring 50+ from pre-computed data
document.getElementById('random-btn').addEventListener('click', () => {
  if (!window._derbyPairs) {
    window._derbyPairs = allPairs.filter(p => p.score >= 50);
  }
  const pair = window._derbyPairs[Math.floor(Math.random() * window._derbyPairs.length)];
  const flip = Math.random() < 0.5;
  selectedA = clubMap.get(flip ? pair.a : pair.b);
  selectedB = clubMap.get(flip ? pair.b : pair.a);
  inputA.value = selectedA.name;
  inputB.value = selectedB.name;
  updateSettleBtn();
  showResult(selectedA, selectedB);
});

function showResult(clubA, clubB) {
  const pair = lookupPair(clubA, clubB);
  const verdictClass = getVerdictClass(pair.verdict);

  // Matchup — club names are clickable to show rivals
  const matchupEl = document.getElementById('matchup');
  matchupEl.innerHTML = `<span class="club-name-link" data-club="${clubA.name}">${clubA.name}</span> vs <span class="club-name-link" data-club="${clubB.name}">${clubB.name}</span>`;
  matchupEl.querySelectorAll('.club-name-link').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const club = clubMap.get(el.dataset.club);
      if (club) showClubRivals(club);
    });
  });

  // Club colour badges
  document.getElementById('badge-a').style.background =
    `linear-gradient(135deg, ${clubA.col1} 0%, ${clubA.col2} 100%)`;
  document.getElementById('badge-b').style.background =
    `linear-gradient(135deg, ${clubB.col1} 0%, ${clubB.col2} 100%)`;

  // Verdict
  const verdictEl = document.getElementById('verdict');
  verdictEl.textContent = pair.verdict;
  verdictEl.className = 'verdict-text ' + verdictClass;

  // Score bar
  const scoreBar = document.getElementById('score-bar');
  scoreBar.style.width = '0%';
  scoreBar.className = 'score-bar-fill ' + verdictClass;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      scoreBar.style.width = pair.score + '%';
    });
  });

  // Score number
  document.getElementById('score-number').textContent = `${pair.score} / 100`;

  // Rivalry score (if available)
  const rivalryContainer = document.getElementById('rivalry-bar-container');
  const rivalryBar = document.getElementById('rivalry-bar');
  const rivalryNumber = document.getElementById('rivalry-number');
  const rivalryMeta = document.getElementById('rivalry-meta');
  if (pair.rivalryScore != null) {
    rivalryContainer.classList.add('active');
    rivalryBar.style.width = '0%';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        rivalryBar.style.width = pair.rivalryScore + '%';
      });
    });
    const fire = pair.rivalryScore >= 90 ? ' 🔥🔥' : pair.rivalryScore >= 80 ? ' 🔥' : '';
    rivalryNumber.textContent = `${pair.rivalryScore} / 100${fire}`;
    const metaParts = [];
    if (pair.meetings) metaParts.push(`${pair.meetings} meetings`);
    if (pair.firstMeeting) metaParts.push(`since ${pair.firstMeeting}`);
    rivalryMeta.textContent = metaParts.join(' \u2022 ');
  } else {
    rivalryContainer.classList.remove('active');
  }

  // Badges
  const BADGE_LABELS = {
    'same-city': '🏟️ Same City',
    'same-county': '🏔️ Same County',
    'cross-river': '🌊 Cross-River',
    '200-club': '🔄 200 Club',
    'dormant': '💀 Dormant',
    'ghost-derby': '👻 Ghost Derby',
    'worlds-apart': '🌍 Worlds Apart',
    'most-played': '👑 Most-Played Fixture',
  };
  const badgesEl = document.getElementById('badges');
  const badges = pair.badges || [];
  if (badges.length > 0) {
    badgesEl.innerHTML = badges
      .filter(b => BADGE_LABELS[b])
      .map(b => `<a href="/badges/${b}.html" class="badge-pill">${BADGE_LABELS[b]}</a>`)
      .join('');
    badgesEl.style.display = 'flex';
  } else {
    badgesEl.innerHTML = '';
    badgesEl.style.display = 'none';
  }

  // Flavour text — generate from verdict + distance + tier gap
  const flavour = getFlavourText(pair.verdict, clubA, clubB, pair.distance, pair.tierGap);
  document.getElementById('flavour').textContent = flavour;

  // Strapline (from pairs data)
  const straplineEl = document.getElementById('strapline');
  if (pair.strapline) {
    straplineEl.textContent = pair.strapline;
    straplineEl.style.display = 'block';
  } else {
    straplineEl.style.display = 'none';
  }

  // Video embed (YouTube or TikTok)
  const youtubeEl = document.getElementById('youtube-embed');
  if (pair.youtube) {
    const isShort = pair.youtubeShort || false;
    youtubeEl.innerHTML = `<iframe class="${isShort ? 'yt-short' : ''}" src="${pair.youtube}" title="Derby highlights" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
    youtubeEl.style.display = 'block';
  } else if (pair.tiktok) {
    const videoId = pair.tiktok.split('/').pop();
    youtubeEl.innerHTML = `<blockquote class="tiktok-embed" cite="${pair.tiktok}" data-video-id="${videoId}" style="max-width:605px;min-width:325px;margin:0 auto;"><section></section></blockquote>`;
    youtubeEl.style.display = 'block';
    // Load/reload TikTok embed script
    if (!document.querySelector('script[src*="tiktok.com/embed.js"]')) {
      const s = document.createElement('script');
      s.src = 'https://www.tiktok.com/embed.js';
      s.async = true;
      document.body.appendChild(s);
    } else if (window.tiktokEmbed) {
      window.tiktokEmbed.lib.render();
    }
  } else {
    youtubeEl.innerHTML = '';
    youtubeEl.style.display = 'none';
  }

  // Breakdown
  const breakdownEl = document.getElementById('breakdown');
  const densityChanged = pair.densityFactor !== 1;
  const rows = [
    ['Distance between grounds', `${pair.distance} miles`],
    ['Base derby radius', `${pair.breakdown.baseRadius} miles`],
  ];
  if (densityChanged) {
    const fewerNearby = Math.min(pair.breakdown.nearbyA, pair.breakdown.nearbyB);
    const moreNearby = Math.max(pair.breakdown.nearbyA, pair.breakdown.nearbyB);
    const label = pair.densityFactor > 1 ? 'Loneliness bonus' : 'Density adjustment';
    const clubCount = pair.densityFactor > 1
      ? `${fewerNearby} nearby clubs`
      : `${moreNearby} nearby clubs`;
    rows.push([label, `${Math.round(pair.densityFactor * 100)}% (${clubCount})`]);
  }
  rows.push(
    ['Effective derby radius', `${pair.radius} miles`],
    ['Distance score', `${pair.breakdown.distanceScore}`],
    ['Same city bonus', pair.breakdown.cityBonus ? `+${pair.breakdown.cityBonus}` : '\u2014'],
    ['Same county bonus', pair.breakdown.countyBonus ? `+${pair.breakdown.countyBonus}` : '\u2014'],
    ['Same tier bonus', pair.breakdown.tierBonus ? `+${pair.breakdown.tierBonus}` : '\u2014'],
    ['Final score', `${pair.score} / 100`]
  );
  breakdownEl.innerHTML = rows.map(([label, value]) => {
    const isBonus = typeof value === 'string' && value.startsWith('+');
    return `<div class="breakdown-row">
      <span class="breakdown-label">${label}</span>
      <span class="breakdown-value${isBonus ? ' bonus' : ''}">${value}</span>
    </div>`;
  }).join('');

  // Show results
  resultsEl.classList.add('active');

  // Map — delay to let container become visible, then invalidate size
  setTimeout(() => {
    showMatchupOnMap(clubA, clubB, pair);
    if (derbyMap) derbyMap.invalidateSize();
  }, 150);

  // Store for share button
  lastResult = { clubA, clubB, result: pair };

  // Update URL
  updateUrl(clubA, clubB);

  // Scroll to results
  resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// URL sharing
function updateUrl(clubA, clubB) {
  const params = new URLSearchParams();
  params.set('a', slug(clubA.name));
  params.set('b', slug(clubB.name));
  history.replaceState(null, '', '?' + params.toString());
}

function checkUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const a = params.get('a');
  const b = params.get('b');
  if (!a || !b) return;

  const clubA = clubs.find(c => slug(c.name) === a);
  const clubB = clubs.find(c => slug(c.name) === b);

  if (clubA && clubB) {
    selectedA = clubA;
    selectedB = clubB;
    inputA.value = clubA.name;
    inputB.value = clubB.name;
    updateSettleBtn();
    showResult(clubA, clubB);
  }
}

// Share buttons
document.getElementById('share-social-btn').addEventListener('click', function () {
  if (!lastResult) return;
  const snippet = buildShareSnippet(lastResult.clubA, lastResult.clubB, lastResult.result);
  navigator.clipboard.writeText(snippet).then(() => {
    this.textContent = 'Copied!';
    this.classList.add('copied');
    const matchup = `${lastResult.clubA.name} vs ${lastResult.clubB.name}`;
    if (window.goatcounter) goatcounter.count({ path: `share-social/${matchup}`, title: 'Social Share: ' + matchup, event: true });
    setTimeout(() => {
      this.textContent = 'Share result';
      this.classList.remove('copied');
    }, 2000);
  });
});

function buildShareSnippet(clubA, clubB, result) {
  const filledCount = Math.round(result.score / 10);
  const verdictClass = getVerdictClass(result.verdict);

  const blockMap = {
    fierce: '\u{1F7E9}',
    local: '\u{1F7E9}',
    rivalry: '\u{1F7E8}',
    stretch: '\u{1F7E7}',
    'not-derby': '\u{1F7E5}'
  };
  const emojiMap = {
    fierce: '\u{1F525}',
    local: '\u2705',
    rivalry: '\u{1F937}',
    stretch: '\u{1F928}',
    'not-derby': '\u{1F6AB}'
  };

  const filled = blockMap[verdictClass] || '\u2B1C';
  const empty = '\u2B1C';
  const bar = filled.repeat(filledCount) + empty.repeat(10 - filledCount);
  const emoji = emojiMap[verdictClass] || '';

  const url = `isitaderby.co.uk/?a=${slug(clubA.name)}&b=${slug(clubB.name)}`;

  const lines = [
    '\u26BD Is It A Derby?',
    '',
    `${clubA.name} vs ${clubB.name}`,
    `${bar} Derby: ${result.score}/100`,
  ];

  if (result.rivalryScore != null) {
    const rivalryFilled = Math.round(result.rivalryScore / 10);
    const rivalryBar = '\u{1F7E8}'.repeat(rivalryFilled) + '\u2B1C'.repeat(10 - rivalryFilled);
    lines.push(`${rivalryBar} Rivalry: ${result.rivalryScore}/100`);
  }

  lines.push(
    `${result.verdict.toUpperCase()} ${emoji}`,
    `\u{1F4CD} ${result.distance} miles apart`,
  );

  if (result.meetings) {
    lines.push(`\u{1F4CA} ${result.meetings} meetings since ${result.firstMeeting}`);
  }

  lines.push('', url);

  return lines.join('\n');
}

// Leaderboards now live on their own pages — no toggles needed here

// Rivals panel — now reads from pre-computed pairs
function showClubRivals(club) {
  const rivals = allPairs
    .filter(p => p.a === club.name || p.b === club.name)
    .map(p => ({
      otherName: p.a === club.name ? p.b : p.a,
      pair: p
    }))
    .map(r => {
      // If rivalry data exists, weight score 40% + rivalry 60% with a
      // sparse-rivalry penalty. If there's no rivalry data, fall back to
      // the raw derby score so geographically-close pairs still rank.
      const hasRivalry = r.pair.rivalryScore != null;
      let combined;
      if (hasRivalry) {
        const rivalry = r.pair.rivalryScore;
        const raw = Math.round(r.pair.score * 0.4 + rivalry * 0.6);
        const penalty = Math.min(rivalry / 20, 1);
        combined = Math.round(raw * penalty);
      } else {
        combined = r.pair.score;
      }
      return { ...r, combined };
    })
    .filter(r => r.combined >= 15)
    .sort((a, b) => b.combined - a.combined || (clubMap.get(a.otherName)?.tier || 99) - (clubMap.get(b.otherName)?.tier || 99) || a.pair.distance - b.pair.distance)
    .slice(0, 10);

  document.getElementById('rivals-badge').style.background =
    `linear-gradient(135deg, ${club.col1}, ${club.col2})`;
  document.getElementById('rivals-title').textContent = `${club.name} \u2014 Top Rivals`;

  document.getElementById('rivals-list').innerHTML = rivals.map((r, i) => {
    const other = clubMap.get(r.otherName);
    if (!other) return '';
    const scoreClass = r.combined >= 75 ? 'fierce' : r.combined >= 55 ? 'local' : '';
    return `<div class="leaderboard-row" data-a="${slug(club.name)}" data-b="${slug(r.otherName)}">
      <span class="lb-rank">${i + 1}</span>
      <span class="lb-badges">
        <span class="lb-badge" style="background:linear-gradient(135deg,${other.col1},${other.col2})"></span>
      </span>
      <span class="lb-names">${r.otherName}</span>
      <span class="lb-score ${scoreClass}">${r.combined}</span>
      <span class="lb-distance">${r.pair.distance}mi</span>
    </div>`;
  }).join('');

  addLeaderboardClickHandlers('#rivals-list');

  const rivalsPanel = document.getElementById('rivals-panel');
  rivalsPanel.classList.add('active');
  rivalsPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.getElementById('rivals-close').addEventListener('click', () => {
  document.getElementById('rivals-panel').classList.remove('active');
});

// Shared click handler for leaderboard-style rows
function addLeaderboardClickHandlers(containerSelector) {
  document.querySelectorAll(`${containerSelector} .leaderboard-row`).forEach(row => {
    row.addEventListener('click', () => {
      const a = clubs.find(c => slug(c.name) === row.dataset.a);
      const b = clubs.find(c => slug(c.name) === row.dataset.b);
      if (a && b) {
        selectedA = a;
        selectedB = b;
        inputA.value = a.name;
        inputB.value = b.name;
        updateSettleBtn();
        showResult(a, b);
        document.getElementById('rivals-panel').classList.remove('active');
      }
    });
  });
}

// Browse/filter derbies
const filterToggle = document.getElementById('filter-toggle');
if (filterToggle) {
  filterToggle.addEventListener('click', function () {
    this.classList.toggle('open');
    const content = document.getElementById('filter-content');
    content.classList.toggle('open');
    if (content.classList.contains('open') && !content.dataset.built) {
      applyFilters();
      content.dataset.built = '1';
    }
  });

  const filterScore = document.getElementById('filter-score');
  const filterScoreVal = document.getElementById('filter-score-val');
  const filterVerdict = document.getElementById('filter-verdict');
  const filterResults = document.getElementById('filter-results');
  const filterCount = document.getElementById('filter-count');

  function applyFilters() {
    const minScore = parseInt(filterScore.value) || 0;
    const verdict = filterVerdict.value;

    let filtered = allPairs.filter(p => p.score >= minScore);
    if (verdict) filtered = filtered.filter(p => p.verdict === verdict);

    filterCount.textContent = `${filtered.length} matchups`;
    const top = filtered.slice(0, 100);

    filterResults.innerHTML = top.map((p, i) => {
      const ca = clubMap.get(p.a);
      const cb = clubMap.get(p.b);
      if (!ca || !cb) return '';
      const scoreClass = p.score >= 75 ? 'fierce' : p.score >= 55 ? 'local' : '';
      return `<div class="leaderboard-row" data-a="${slug(p.a)}" data-b="${slug(p.b)}">
        <span class="lb-rank">${i + 1}</span>
        <span class="lb-badges">
          <span class="lb-badge" style="background:linear-gradient(135deg,${ca.col1},${ca.col2})"></span>
          <span class="lb-badge" style="background:linear-gradient(135deg,${cb.col1},${cb.col2})"></span>
        </span>
        <span class="lb-names">${p.a} vs ${p.b}</span>
        <span class="lb-score ${scoreClass}">${p.score}</span>
        <span class="lb-distance">${p.distance}mi</span>
      </div>`;
    }).join('');

    addLeaderboardClickHandlers('#filter-results');
  }

  filterScore.addEventListener('input', () => {
    filterScoreVal.textContent = filterScore.value;
    applyFilters();
  });
  filterVerdict.addEventListener('change', applyFilters);
}
