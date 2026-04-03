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
 * Calculate the derby score and verdict between two clubs.
 *
 * @param {Object} clubA - { name, ground, lat, lng, tier, city, county }
 * @param {Object} clubB - same shape
 * @returns {Object} { score, verdict, distance, radius, breakdown, flavour }
 */
function calculateDerbyScore(clubA, clubB) {
  const distance = haversineDistance(clubA.lat, clubA.lng, clubB.lat, clubB.lng);

  // Average both clubs' radii so cross-tier matchups are fair.
  // Without this, a League One club would get a huge radius advantage
  // against a PL club, scoring higher than a closer Championship rival.
  const radiusA = getDerbyRadius(clubA.tier);
  const radiusB = getDerbyRadius(clubB.tier);
  const radius = (radiusA + radiusB) / 2;
  const effectiveTier = Math.round((clubA.tier + clubB.tier) / 2);

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
  const flavour = getFlavourText(verdict, clubA, clubB, distance);

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
      sameTier
    },
    flavour
  };
}

function getVerdict(score) {
  if (score >= 75) return 'Fierce Local Derby';
  if (score >= 55) return 'Local Derby';
  if (score >= 35) return 'Regional Rivalry';
  if (score >= 15) return 'Stretch — Barely a Derby';
  return 'Not a Derby';
}

function getVerdictClass(verdict) {
  if (verdict === 'Fierce Local Derby') return 'fierce';
  if (verdict === 'Local Derby') return 'local';
  if (verdict === 'Regional Rivalry') return 'rivalry';
  if (verdict === 'Stretch — Barely a Derby') return 'stretch';
  return 'not-derby';
}

function getFlavourText(verdict, clubA, clubB, distance) {
  const distStr = distance < 1 ? 'less than a mile' : `${Math.round(distance * 10) / 10} miles`;
  switch (verdict) {
    case 'Fierce Local Derby':
      return `Only ${distStr} apart. This is about as local as it gets. Bragging rights are everything.`;
    case 'Local Derby':
      return `At ${distStr} apart, these two are proper neighbours. This one matters.`;
    case 'Regional Rivalry':
      return `${distStr} apart — they're in the same neck of the woods, but you'd need to set off early.`;
    case 'Stretch — Barely a Derby':
      return `${distStr} is pushing the definition. Your mate is clutching at straws calling this a derby.`;
    default:
      return `${distStr} apart. Come on. This is not a derby by any stretch of the imagination.`;
  }
}
