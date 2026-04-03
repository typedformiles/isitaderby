/**
 * Custom straplines for notable matchups.
 * Keyed by sorted club names joined with '|'.
 */

const STRAPLINES = {
  // Famous local derbies
  'Arsenal|Tottenham Hotspur':
    'The North London Derby. Four miles and a world of difference. This is as local as it gets.',
  'Liverpool|Everton':
    'The Merseyside Derby. Anfield and Goodison are so close you can practically hear the other ground from yours.',
  'Manchester City|Manchester United':
    'The Manchester Derby. Same city, same road out of town, completely different planets.',
  'Sheffield United|Sheffield Wednesday':
    'The Steel City Derby. Two clubs forged in the same city, separated by a couple of miles and a century of grudges.',
  'Nottingham Forest|Notts County':
    'Separated by the River Trent and 200 yards. The oldest derby fixture in world football.',
  'Newcastle United|Sunderland':
    'The Tyne-Wear Derby. Ten miles of mutual disdain between two cities that agree on absolutely nothing.',
  'Aston Villa|Birmingham City':
    'The Second City Derby. Birmingham is big enough for two clubs, but neither thinks the other deserves to be here.',
  'Bristol City|Bristol Rovers':
    'The Bristol Derby. Same city, same passion, very different postcode lottery.',
  'Crystal Palace|Brighton & Hove Albion':
    'The M23 Derby. Forty-odd miles of motorway and genuine, deep-seated hostility. Don\'t let the distance fool you.',
  'Millwall|West Ham United':
    'The Dockers Derby. Born from the same docklands, separated by the Thames and a rivalry that runs deeper than football.',
  'Derby County|Nottingham Forest':
    'The East Midlands Derby. The A52 connects these two — Brian Clough managed both and they\'ve never forgiven each other.',
  'Burton Albion|Nottingham Forest':
    'Close enough on the map, but this has never carried the same weight as the East Midlands Derby down the A52.',
  'Plymouth Argyle|Exeter City':
    'The Devon Derby. Thirty-six miles of country roads, but in the south-west these two are as local as it gets.',
  'Wolverhampton Wanderers|West Bromwich Albion':
    'The Black Country Derby. Three miles apart in the industrial heartland. This one\'s personal.',
  'Wolverhampton Wanderers|Aston Villa':
    'The West Midlands Derby. Not quite the same city, but close enough that bragging rights carry all week at work.',
  'Fulham|Chelsea':
    'The West London Derby. A mile and a half apart along the Thames. Neighbours who couldn\'t be more different.',
  'Brentford|Fulham':
    'The West London local. These two are proper neighbours — close enough to argue over whose patch the pub is on.',
  'Queens Park Rangers|Chelsea':
    'West London rivals. Close enough to share a high street, far enough apart in ambition to start arguments.',
  'Tottenham Hotspur|West Ham United':
    'London rivals with a rivalry that runs deeper than geography — but the geography helps.',
  'Charlton Athletic|Millwall':
    'South-east London neighbours. Different sides of the same streets, same intensity.',
  'Leyton Orient|West Ham United':
    'East London neighbours. The Olympic Stadium move made this one even more complicated.',
  'Portsmouth|Southampton':
    'The South Coast Derby. Thirty miles of the M27 and the fiercest rivalry on the south coast.',

  // Famous rivalries that AREN'T local derbies
  'Liverpool|Manchester United':
    'The biggest rivalry in English football — but it\'s built on decades of title races, not geography. Thirty miles and two cities apart. A rivalry, not a derby.',
  'Leeds United|Manchester United':
    'The Roses Rivalry. Runs deep through history, politics and the War of the Roses. Fierce, yes. Local? Not at thirty-odd miles.',
  'Arsenal|Manchester United':
    'Highbury vs Old Trafford defined the Premier League era. But with 200 miles between them, this was always about trophies, not territory.',
  'Arsenal|Chelsea':
    'London rivals, sure — but at opposite ends of the city. This rivalry was built in the Abramovich era, not on street corners.',
  'Chelsea|Tottenham Hotspur':
    'Both London, but eight miles and a cultural gulf apart. More of a mutual irritation than a proper local derby.',
  'Burnley|Blackburn Rovers':
    'The East Lancashire Derby. Cotton mill towns separated by Pendle Hill and a grudge that\'s older than the Football League.',
  'Bolton Wanderers|Wigan Athletic':
    'Greater Manchester neighbours with a rivalry that punches above its geographic weight.',
  'Carlisle United|Barrow':
    'Cumbrian rivals. In a county this remote, thirty miles apart IS your local derby.',
  'Accrington Stanley|Burnley':
    'East Lancashire neighbours. Accrington were a founding Football League member before Burnley existed.',
  'Stoke City|Port Vale':
    'The Potteries Derby. Same city, different ends of the Six Towns. Proper local.',
  'Walsall|West Bromwich Albion':
    'Black Country neighbours. Not the headline derby but close enough to matter every single time.',
  'Tranmere Rovers|Everton':
    'Across the Mersey. Close enough to see Liverpool\'s skyline but just far enough to feel like a different world.',
  'Tranmere Rovers|Liverpool':
    'The Mersey separates them. Tranmere can see Anfield\'s lights from Prenton Park.',
  'Oldham Athletic|Rochdale':
    'Greater Manchester neighbours in the Pennine foothills. As local as it gets outside the city centre.',
  'Stockport County|Manchester City':
    'Stockport sits right on Manchester\'s southern border. The Etihad is practically visible from Edgeley Park.',
  'Salford City|Manchester United':
    'Owned by the Class of 92, three miles from Old Trafford. The most complicated relationship in Manchester football.',
  'Wrexham|Chester':
    'The cross-border derby. Welsh town vs English city, twelve miles apart, centuries of history.'
};

function getStrapline(clubA, clubB) {
  const key = [clubA.name, clubB.name].sort().join('|');
  return STRAPLINES[key] || null;
}
