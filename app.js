/**
 * Main application — UI logic, autocomplete, results display, URL sharing.
 */

let clubs = [];
let selectedA = null;
let selectedB = null;
let lastResult = null;

// Load club data
fetch('data/clubs.json')
  .then(r => r.json())
  .then(data => {
    clubs = data.sort((a, b) => a.name.localeCompare(b.name));
    precomputeDensity(clubs);
    checkUrlParams();
  });

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

// Random button — picks a random pair scoring 50+
document.getElementById('random-btn').addEventListener('click', () => {
  // Build list of viable pairs on first click, then cache
  if (!window._derbyPairs) {
    window._derbyPairs = [];
    for (let i = 0; i < clubs.length; i++) {
      for (let j = i + 1; j < clubs.length; j++) {
        const r = calculateDerbyScore(clubs[i], clubs[j]);
        if (r.score >= 50) {
          window._derbyPairs.push([clubs[i], clubs[j]]);
        }
      }
    }
  }
  const pair = window._derbyPairs[Math.floor(Math.random() * window._derbyPairs.length)];
  // Randomise which is A and B
  const flip = Math.random() < 0.5;
  selectedA = flip ? pair[0] : pair[1];
  selectedB = flip ? pair[1] : pair[0];
  inputA.value = selectedA.name;
  inputB.value = selectedB.name;
  updateSettleBtn();
  showResult(selectedA, selectedB);
});

function showResult(clubA, clubB) {
  const result = calculateDerbyScore(clubA, clubB);
  const verdictClass = getVerdictClass(result.verdict);

  // Matchup — club names are clickable to show rivals
  const matchupEl = document.getElementById('matchup');
  matchupEl.innerHTML = `<span class="club-name-link" data-club="${clubA.name}">${clubA.name}</span> vs <span class="club-name-link" data-club="${clubB.name}">${clubB.name}</span>`;
  matchupEl.querySelectorAll('.club-name-link').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const club = clubs.find(c => c.name === el.dataset.club);
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
  verdictEl.textContent = result.verdict;
  verdictEl.className = 'verdict-text ' + verdictClass;

  // Score bar
  const scoreBar = document.getElementById('score-bar');
  scoreBar.style.width = '0%';
  scoreBar.className = 'score-bar-fill ' + verdictClass;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      scoreBar.style.width = result.score + '%';
    });
  });

  // Score number
  document.getElementById('score-number').textContent = `${result.score} / 100`;

  // Flavour
  document.getElementById('flavour').textContent = result.flavour;

  // Strapline (custom context for notable matchups)
  const straplineEl = document.getElementById('strapline');
  const strapline = getStrapline(clubA, clubB);
  if (strapline) {
    straplineEl.textContent = strapline;
    straplineEl.style.display = 'block';
  } else {
    straplineEl.style.display = 'none';
  }

  // Breakdown
  const breakdownEl = document.getElementById('breakdown');
  const densityChanged = result.breakdown.densityFactor < 1;
  const rows = [
    ['Distance between grounds', `${result.distance} miles`],
    ['Base tier radius', `${result.breakdown.baseRadius} miles (Tier ${result.effectiveTier})`],
  ];
  if (densityChanged) {
    rows.push(['Density adjustment', `${Math.round(result.breakdown.densityFactor * 100)}% (${Math.max(result.breakdown.nearbyA, result.breakdown.nearbyB)} nearby clubs)`]);
  }
  rows.push(
    ['Effective derby radius', `${result.radius} miles`],
    ['Distance score', `${result.breakdown.distanceScore}`],
    ['Same city bonus', result.breakdown.cityBonus ? `+${result.breakdown.cityBonus}` : '—'],
    ['Same county bonus', result.breakdown.countyBonus ? `+${result.breakdown.countyBonus}` : '—'],
    ['Same tier bonus', result.breakdown.tierBonus ? `+${result.breakdown.tierBonus}` : '—'],
    ['Final score', `${result.score} / 100`]
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
    showMatchupOnMap(clubA, clubB, result);
    if (derbyMap) derbyMap.invalidateSize();
  }, 150);

  // Store for share button
  lastResult = { clubA, clubB, result };

  // Update URL
  updateUrl(clubA, clubB);

  // Scroll to results
  resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// URL sharing
function updateUrl(clubA, clubB) {
  const slug = name => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '');
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

  const slug = name => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '');
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
document.getElementById('share-btn').addEventListener('click', function () {
  navigator.clipboard.writeText(window.location.href).then(() => {
    this.textContent = 'Copied!';
    this.classList.add('copied');
    setTimeout(() => {
      this.textContent = 'Copy link';
      this.classList.remove('copied');
    }, 2000);
  });
});

document.getElementById('share-social-btn').addEventListener('click', function () {
  if (!lastResult) return;
  const snippet = buildShareSnippet(lastResult.clubA, lastResult.clubB, lastResult.result);
  navigator.clipboard.writeText(snippet).then(() => {
    this.textContent = 'Copied!';
    this.classList.add('copied');
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
    fierce: '\u{1F7E9}',   // green
    local: '\u{1F7E9}',    // green
    rivalry: '\u{1F7E8}',   // yellow
    stretch: '\u{1F7E7}',   // orange
    'not-derby': '\u{1F7E5}' // red
  };
  const emojiMap = {
    fierce: '\u{1F525}',    // fire
    local: '\u2705',         // check
    rivalry: '\u{1F937}',    // shrug
    stretch: '\u{1F928}',   // raised eyebrow
    'not-derby': '\u{1F6AB}' // no entry
  };

  const filled = blockMap[verdictClass] || '\u2B1C';
  const empty = '\u2B1C';
  const bar = filled.repeat(filledCount) + empty.repeat(10 - filledCount);
  const emoji = emojiMap[verdictClass] || '';

  const slug = name => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '');
  const url = `typedformiles.github.io/isitaderby/?a=${slug(clubA.name)}&b=${slug(clubB.name)}`;

  return [
    '\u26BD Is It A Derby?',
    '',
    `${clubA.name} vs ${clubB.name}`,
    `${bar} ${result.score}/100`,
    `${result.verdict.toUpperCase()} ${emoji}`,
    `\u{1F4CD} ${result.distance} miles apart`,
    '',
    url
  ].join('\n');
}

// Methodology toggle
document.getElementById('methodology-toggle').addEventListener('click', function () {
  this.classList.toggle('open');
  document.getElementById('methodology-content').classList.toggle('open');
});

// Leaderboard toggle
document.getElementById('leaderboard-toggle').addEventListener('click', function () {
  this.classList.toggle('open');
  const content = document.getElementById('leaderboard-content');
  content.classList.toggle('open');
  // Build leaderboard on first open
  if (content.classList.contains('open') && !content.dataset.built) {
    buildLeaderboard();
    content.dataset.built = '1';
  }
});

function buildLeaderboard() {
  const pairs = [];
  for (let i = 0; i < clubs.length; i++) {
    for (let j = i + 1; j < clubs.length; j++) {
      const result = calculateDerbyScore(clubs[i], clubs[j]);
      if (result.score >= 55) { // Local Derby or higher
        pairs.push({ a: clubs[i], b: clubs[j], result });
      }
    }
  }
  pairs.sort((x, y) => y.result.score - x.result.score || x.result.distance - y.result.distance);

  const slug = name => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '');
  const top = pairs.slice(0, 50);

  document.getElementById('leaderboard-list').innerHTML = top.map((p, i) => {
    const verdictClass = p.result.score >= 75 ? 'fierce' : 'local';
    return `<div class="leaderboard-row" data-a="${slug(p.a.name)}" data-b="${slug(p.b.name)}">
      <span class="lb-rank">${i + 1}</span>
      <span class="lb-badges">
        <span class="lb-badge" style="background:linear-gradient(135deg,${p.a.col1},${p.a.col2})"></span>
        <span class="lb-badge" style="background:linear-gradient(135deg,${p.b.col1},${p.b.col2})"></span>
      </span>
      <span class="lb-names">${p.a.name} vs ${p.b.name}</span>
      <span class="lb-score ${verdictClass}">${p.result.score}</span>
      <span class="lb-distance">${p.result.distance}mi</span>
    </div>`;
  }).join('');

  // Click to view matchup
  document.querySelectorAll('.leaderboard-row').forEach(row => {
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
      }
    });
  });
}

// Rivals panel
function showClubRivals(club) {
  const rivals = clubs
    .filter(c => c.name !== club.name)
    .map(c => ({ club: c, result: calculateDerbyScore(club, c) }))
    .sort((a, b) => b.result.score - a.result.score || a.result.distance - b.result.distance)
    .slice(0, 10);

  const slug = name => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '');

  document.getElementById('rivals-badge').style.background =
    `linear-gradient(135deg, ${club.col1}, ${club.col2})`;
  document.getElementById('rivals-title').textContent = `${club.name} — Top Rivals`;

  document.getElementById('rivals-list').innerHTML = rivals.map((r, i) => {
    const scoreClass = r.result.score >= 75 ? 'fierce' : r.result.score >= 55 ? 'local' : '';
    return `<div class="leaderboard-row" data-a="${slug(club.name)}" data-b="${slug(r.club.name)}">
      <span class="lb-rank">${i + 1}</span>
      <span class="lb-badges">
        <span class="lb-badge" style="background:linear-gradient(135deg,${r.club.col1},${r.club.col2})"></span>
      </span>
      <span class="lb-names">${r.club.name}</span>
      <span class="lb-score ${scoreClass}">${r.result.score}</span>
      <span class="lb-distance">${r.result.distance}mi</span>
    </div>`;
  }).join('');

  // Click rival row to load matchup
  document.querySelectorAll('#rivals-list .leaderboard-row').forEach(row => {
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

  const rivalsPanel = document.getElementById('rivals-panel');
  rivalsPanel.classList.add('active');
  rivalsPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.getElementById('rivals-close').addEventListener('click', () => {
  document.getElementById('rivals-panel').classList.remove('active');
});
