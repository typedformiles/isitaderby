#!/usr/bin/env python3
"""
Build script: generates data/pairs.json from clubs.json + straplines.js

Computes derby scores for all club pairs, merges in strapline metadata,
and outputs a single JSON file that the browser app loads directly.

Usage: python3 scripts/build-pairs.py
"""

import json
import math
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# ─── Load clubs ──────────────────────────────────────────────────────────────

with open(os.path.join(ROOT, 'data/clubs.json')) as f:
    clubs = json.load(f)
clubs.sort(key=lambda c: c['name'])
print(f'Loaded {len(clubs)} clubs')


# ─── Algorithm (matches derby.js exactly) ────────────────────────────────────

BASE_RADIUS = 30

def haversine_distance(lat1, lng1, lat2, lng2):
    R = 3958.8  # Earth radius in miles
    d_lat = math.radians(lat2 - lat1)
    d_lng = math.radians(lng2 - lng1)
    a = (math.sin(d_lat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(d_lng / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def get_density_factor(nearby_count, county):
    if nearby_count == 0: return 1.8  # Genuine isolation — zero neighbours within 25mi
    if nearby_count <= 1: return 1.5
    if nearby_count <= 3: return 1.3
    if nearby_count <= 6: return 1.0
    floor = 0.4
    if county == 'West Midlands':
        floor = 0.75
    elif county in ('Greater Manchester', 'Lancashire', 'Cheshire', 'West Yorkshire'):
        floor = 0.6
    return max(floor, 6 / nearby_count)

def get_verdict(score):
    if score >= 75: return 'Proper Local Derby'
    if score >= 55: return 'Local Derby'
    if score >= 35: return 'Regional Derby'
    if score >= 15: return 'Clutching'
    return 'Not a Derby'


# ─── Pre-compute density ─────────────────────────────────────────────────────

print('Computing club density...')
DENSITY_RADIUS = 25
for club in clubs:
    count = 0
    for other in clubs:
        if other is club:
            continue
        if haversine_distance(club['lat'], club['lng'], other['lat'], other['lng']) <= DENSITY_RADIUS:
            count += 1
    club['_nearbyCount'] = count


# ─── Load straplines from JS file ────────────────────────────────────────────

straplines = {}
straplines_path = os.path.join(ROOT, 'straplines.js')
with open(straplines_path) as f:
    js_content = f.read()

# Parse key-value pairs from the STRAPLINES object
# Matches: 'Key1|Key2':\n    'value text...',
pattern = r"'([^'|]+\|[^']+)':\s*\n?\s*'((?:[^'\\]|\\.)*)'"
for m in re.finditer(pattern, js_content):
    key = m.group(1)
    value = m.group(2).replace("\\'", "'").replace("\\n", "\n")
    straplines[key] = value

# Handle the emoji strapline (Palace vs Brighton uses unicode escape)
# Re-scan for entries containing unicode escapes
pattern2 = r"'([^'|]+\|[^']+)':\s*\n?\s*'((?:[^'\\]|\\.|\\u[0-9a-fA-F]{4})*)'"
for m in re.finditer(pattern2, js_content):
    key = m.group(1)
    if key not in straplines:
        value = m.group(2).replace("\\'", "'")
        straplines[key] = value

print(f'Loaded {len(straplines)} straplines')


# ─── Compute all pairs ───────────────────────────────────────────────────────

print('Computing all pairs...')
pairs = []
total = 0
included = 0

def pair_key(a, b):
    return '|'.join(sorted([a, b]))

for i in range(len(clubs)):
    for j in range(i + 1, len(clubs)):
        total += 1
        ca = clubs[i]
        cb = clubs[j]

        distance = haversine_distance(ca['lat'], ca['lng'], cb['lat'], cb['lng'])

        base_radius = BASE_RADIUS

        density_a = get_density_factor(ca.get('_nearbyCount', 0), ca['county'])
        density_b = get_density_factor(cb.get('_nearbyCount', 0), cb['county'])
        if density_a < 1 or density_b < 1:
            density_factor = min(density_a, density_b)
        else:
            density_factor = max(density_a, density_b)
        radius = round(base_radius * density_factor * 10) / 10

        max_range = radius * 1.5
        distance_score = max(0, 100 * (1 - distance / max_range)) if max_range > 0 else 0

        same_city = ca['city'].lower() == cb['city'].lower()
        same_county = ca['county'].lower() == cb['county'].lower()
        same_tier = ca['tier'] == cb['tier']

        city_bonus = 15 if same_city else 0
        # Reduce city bonus in dense areas for distant same-city pairs
        # (e.g. 8 miles across London shouldn't get the same bonus as 2 miles)
        if city_bonus == 15 and ca.get('_nearbyCount', 0) >= 20 and cb.get('_nearbyCount', 0) >= 20 and distance >= 5:
            city_bonus = 5
        county_bonus = 10 if (not same_city and same_county) else 0
        tier_bonus = 5 if same_tier else 0

        raw_score = distance_score + city_bonus + county_bonus + tier_bonus
        score = min(100, math.ceil(raw_score))

        key = pair_key(ca['name'], cb['name'])
        strapline = straplines.get(key)

        # Include EVERY pair — even 0-score ones get a page so that any
        # historical rivalry / famous scoreline (however geographically odd)
        # can be enriched later. Was previously filtered to score > 0.
        if True:
            included += 1
            tier_gap = abs(ca['tier'] - cb['tier'])
            rounded_dist = round(distance * 10) / 10

            tags = []
            if same_city: tags.append('same-city')
            if same_county and not same_city: tags.append('same-county')
            if same_tier: tags.append('same-tier')
            if tier_gap >= 4: tags.append('cross-tier')
            if score >= 75: tags.append('proper-derby')
            if strapline: tags.append('has-history')

            pairs.append({
                'a': ca['name'],
                'b': cb['name'],
                'score': score,
                'verdict': get_verdict(score),
                'distance': rounded_dist,
                'radius': radius,
                'tierGap': tier_gap,
                'densityFactor': round(density_factor * 100) / 100,
                'breakdown': {
                    'distanceScore': round(distance_score),
                    'cityBonus': city_bonus,
                    'countyBonus': county_bonus,
                    'tierBonus': tier_bonus,
                    'baseRadius': base_radius,
                    'nearbyA': ca['_nearbyCount'],
                    'nearbyB': cb['_nearbyCount'],
                },
                'rivalryName': None,
                'strapline': strapline,
                'youtube': None,
                'keyMoments': [],
                'tags': tags,
            })

# Sort by score descending, then distance ascending
pairs.sort(key=lambda p: (-p['score'], p['distance']))

print(f'Total possible pairs: {total}')
print(f'Included in pairs.json: {included} (score > 0 or has strapline)')
print(f'With straplines: {sum(1 for p in pairs if p["strapline"])}')


# ─── Write output ────────────────────────────────────────────────────────────

out_path = os.path.join(ROOT, 'data/pairs.json')
output = json.dumps(pairs, indent=2, ensure_ascii=False)
with open(out_path, 'w') as f:
    f.write(output)

size_kb = len(output.encode('utf-8')) / 1024
print(f'Written {out_path} ({size_kb:.0f} KB, {len(pairs)} pairs)')
