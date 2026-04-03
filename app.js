/**
 * Main application — UI logic, autocomplete, results display, URL sharing.
 */

let clubs = [];
let selectedA = null;
let selectedB = null;

// Load club data
fetch('data/clubs.json')
  .then(r => r.json())
  .then(data => {
    clubs = data.sort((a, b) => a.name.localeCompare(b.name));
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

function showResult(clubA, clubB) {
  const result = calculateDerbyScore(clubA, clubB);
  const verdictClass = getVerdictClass(result.verdict);

  // Matchup
  document.getElementById('matchup').textContent = `${clubA.name} vs ${clubB.name}`;

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
  const rows = [
    ['Distance between grounds', `${result.distance} miles`],
    ['Tier-adjusted derby radius', `${result.radius} miles (Tier ${result.effectiveTier})`],
    ['Distance score', `${result.breakdown.distanceScore}`],
    ['Same city bonus', result.breakdown.cityBonus ? `+${result.breakdown.cityBonus}` : '—'],
    ['Same county bonus', result.breakdown.countyBonus ? `+${result.breakdown.countyBonus}` : '—'],
    ['Same tier bonus', result.breakdown.tierBonus ? `+${result.breakdown.tierBonus}` : '—'],
    ['Final score', `${result.score} / 100`]
  ];
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

// Share button
document.getElementById('share-btn').addEventListener('click', function () {
  navigator.clipboard.writeText(window.location.href).then(() => {
    this.textContent = 'Copied!';
    this.classList.add('copied');
    setTimeout(() => {
      this.textContent = 'Copy shareable link';
      this.classList.remove('copied');
    }, 2000);
  });
});

// Methodology toggle
document.getElementById('methodology-toggle').addEventListener('click', function () {
  this.classList.toggle('open');
  document.getElementById('methodology-content').classList.toggle('open');
});
