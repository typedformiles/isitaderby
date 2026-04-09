/**
 * Derby scoring algorithm.
 * Pure functions — no DOM, no side effects.
 */

const TIER_LABELS = {
  1: 'Premier League',
  2: 'Championship',
  3: 'League One',
  4: 'League Two',
  5: 'National League',
  6: 'National League North / South'
};

/**
 * Tier-adjusted derby radius in miles.
 * Lower tiers have wider radii because clubs are more spread out.
 */
function getDerbyRadius(tier) {
  if (tier <= 2) return 25;
  if (tier <= 4) return 35;
  return 50;
}

/**
 * Haversine distance between two lat/lng points in miles.
 */
function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 3958.8; // Earth radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

/**
 * Pre-compute club density: how many other clubs are within 25 miles.
 * Called once after clubs load. Stored as club._nearbyCount.
 */
function precomputeDensity(allClubs) {
  const DENSITY_RADIUS = 25; // miles
  for (const club of allClubs) {
    let count = 0;
    for (const other of allClubs) {
      if (other === club) continue;
      const d = haversineDistance(club.lat, club.lng, other.lat, other.lng);
      if (d <= DENSITY_RADIUS) count++;
    }
    club._nearbyCount = count;
  }
}

/**
 * Density factor: adjusts radius based on how many nearby clubs exist.
 *
 * Dense areas (many nearby clubs) → tighten the radius:
 *   6 nearby = no change (1.0), 12+ nearby = halved (0.4)
 *   Regional floors prevent over-tightening outside London:
 *     West Midlands: 0.75 — dense but not London-dense
 *     Greater Manchester / Lancashire / Cheshire: 0.60 — denser than WM
 *       but the East Lancs derby at 34 was genuinely wrong
 *     London / everywhere else: 0.40
 *
 * Sparse areas (few nearby clubs) → widen the radius:
 *   3 or fewer nearby = 1.3×, 1 or fewer = 1.5×
 *   This "loneliness bonus" means isolated clubs like Norwich/Ipswich
 *   or Carlisle/Barrow get a fairer shake — they don't have other options.
 */
function getDensityFactor(nearbyCount, county) {
  if (nearbyCount <= 1) return 1.5;
  if (nearbyCount <= 3) return 1.3;
  if (nearbyCount <= 6) return 1.0;
  let floor = 0.4;
  if (county === 'West Midlands') floor = 0.75;
  else if (county === 'Greater Manchester' || county === 'Lancashire' || county === 'Cheshire') floor = 0.6;
  return Math.max(floor, 6 / nearbyCount);
}

/**
 * Calculate the derby score and verdict between two clubs.
 *
 * @param {Object} clubA - { name, ground, lat, lng, tier, city, county }
 * @param {Object} clubB - same shape
 * @returns {Object} { score, verdict, distance, radius, breakdown, flavour }
 */
function calculateDerbyScore(clubA, clubB) {
  const distance = haversineDistance(clubA.lat, clubA.lng, clubB.lat, clubB.lng);

  // Average both clubs' radii so cross-tier matchups are fair.
  const radiusA = getDerbyRadius(clubA.tier);
  const radiusB = getDerbyRadius(clubB.tier);
  const baseRadius = (radiusA + radiusB) / 2;
  const effectiveTier = Math.round((clubA.tier + clubB.tier) / 2);

  // Density adjustment:
  // - Dense areas (factor < 1): use the denser club (tighter radius wins)
  //   so a London NL club vs a PL club still gets a tight radius.
  // - Sparse areas (factor > 1): use the LESS isolated club (smaller bonus wins)
  //   so the loneliness bonus only applies when BOTH clubs are isolated.
  const densityA = getDensityFactor(clubA._nearbyCount || 0, clubA.county);
  const densityB = getDensityFactor(clubB._nearbyCount || 0, clubB.county);
  const densityFactor = (densityA < 1 || densityB < 1)
    ? Math.min(densityA, densityB)  // Either is dense → tighten
    : Math.max(densityA, densityB); // Both non-dense → the more isolated club's bonus applies
  const radius = Math.round(baseRadius * densityFactor * 10) / 10;

  // Distance score: linear decay over 1.5× radius
  const maxRange = radius * 1.5;
  const distanceScore = Math.max(0, 100 * (1 - distance / maxRange));

  // Bonuses
  const sameCity = clubA.city.toLowerCase() === clubB.city.toLowerCase();
  const sameCounty = clubA.county.toLowerCase() === clubB.county.toLowerCase();
  const sameTier = clubA.tier === clubB.tier;

  const cityBonus = sameCity ? 15 : 0;
  const countyBonus = (!sameCity && sameCounty) ? 10 : 0; // Only if not already same city
  const tierBonus = sameTier ? 5 : 0;

  const rawScore = distanceScore + cityBonus + countyBonus + tierBonus;
  const score = Math.min(100, Math.round(rawScore));

  const verdict = getVerdict(score);
  const tierGap = Math.abs(clubA.tier - clubB.tier);
  const flavour = getFlavourText(verdict, clubA, clubB, distance, tierGap);

  return {
    score,
    verdict,
    distance: Math.round(distance * 10) / 10,
    radius,
    effectiveTier,
    breakdown: {
      distanceScore: Math.round(distanceScore),
      cityBonus,
      countyBonus,
      tierBonus,
      sameCity,
      sameCounty,
      sameTier,
      densityFactor,
      nearbyA: clubA._nearbyCount || 0,
      nearbyB: clubB._nearbyCount || 0,
      baseRadius
    },
    flavour
  };
}

function getVerdict(score) {
  if (score >= 75) return 'Proper Local Derby';
  if (score >= 55) return 'Local Derby';
  if (score >= 35) return 'Regional Rivalry';
  if (score >= 15) return 'Stretch — Barely a Derby';
  return 'Not a Derby';
}

function getVerdictClass(verdict) {
  if (verdict === 'Proper Local Derby') return 'fierce';
  if (verdict === 'Local Derby') return 'local';
  if (verdict === 'Regional Rivalry') return 'rivalry';
  if (verdict === 'Stretch — Barely a Derby') return 'stretch';
  return 'not-derby';
}

function getFlavourText(verdict, clubA, clubB, distance, tierGap) {
  const distStr = distance < 1 ? 'less than a mile' : `${Math.round(distance * 10) / 10} miles`;
  const gapStr = tierGap === 1 ? 'one division' : `${tierGap} divisions`;

  // Tier gap qualifier — appended when clubs are close but in different footballing worlds
  let gapNote = '';
  if (tierGap >= 4) {
    gapNote = ` Though with ${gapStr} between them, they share a postcode but not a planet.`;
  } else if (tierGap >= 2) {
    gapNote = ` ${gapStr} apart in the pyramid though, so don't expect this on a fixture list any time soon.`;
  }

  let base;
  switch (verdict) {
    case 'Proper Local Derby':
      base = tierGap <= 1
        ? `Only ${distStr} apart. This is about as local as it gets. Bragging rights are everything.`
        : `Only ${distStr} apart — geographically, this is a proper derby.`;
      break;
    case 'Local Derby':
      base = tierGap <= 1
        ? `At ${distStr} apart, these two are proper neighbours. This one matters.`
        : `At ${distStr} apart, the geography says derby.`;
      break;
    case 'Regional Rivalry':
      base = `${distStr} apart — they're in the same neck of the woods, but you'd need to set off early.`;
      break;
    case 'Stretch — Barely a Derby':
      base = `${distStr} is pushing the definition. Your mate is clutching at straws calling this a derby.`;
      break;
    default:
      base = `${distStr} apart. Come on. This is not a derby by any stretch of the imagination.`;
      break;
  }

  return base + gapNote;
}
