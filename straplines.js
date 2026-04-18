/**
 * Custom straplines for notable matchups.
 * Keyed by sorted club names joined with '|'.
 * These are fun facts, historical context, and rivalry explainers.
 */

const STRAPLINES = {

  // =============================================
  // FIERCE LOCAL DERBIES (top of the leaderboard)
  // =============================================

  'Nottingham Forest|Notts County':
    'The oldest professional derby in world football. Just 300 yards and the River Trent separate them. Notts County, founded in 1862, are the oldest professional club in the world — and they even gave Juventus their famous black and white stripes.',

  'Everton|Liverpool':
    'The "Friendly Derby" — though try telling that to fans. Everton were the original Anfield tenants until a rent dispute with the landlord John Houlding in 1892 led them to move across Stanley Park. Houlding kept the ground and founded Liverpool FC. Families in this city are literally split down the middle.',

  'Chelsea|Fulham':
    'Separated by barely a mile along the Thames. Fulham are actually the older club, founded in 1879, but Chelsea were specifically created in 1905 to fill Stamford Bridge — which was originally built as an athletics venue.',

  'Leyton Orient|West Ham United':
    'East London\'s original rivalry. When West Ham moved to the Olympic Stadium in Stratford in 2016, Orient complained it was encroaching on their patch — the new ground is closer to Orient\'s Brisbane Road than to the Hammers\' old home at Upton Park.',

  'Port Vale|Stoke City':
    'The Potteries Derby. Both from Stoke-on-Trent, a city made of six towns. Vale Park and the bet365 Stadium are under two miles apart. Port Vale were originally called "Burslem Port Vale" after the town they\'re from — one of the six towns Arnold Bennett made famous.',

  'Gateshead|Newcastle United':
    'Separated only by the Tyne. Gateshead once played in the Football League (1930-1960) but were controversially voted out and replaced by Peterborough. The original Gateshead AFC folded in 1977, but the phoenix club has risen back through the pyramid.',

  'Barnet|Wealdstone':
    'North London non-league neighbours. Wealdstone famously won the Conference and FA Trophy double in 1985 — a feat that\'s never been repeated. They then fell through financial ruin and spent years groundsharing at various venues, including at one point sharing with their rivals Barnet.',

  'Aston Villa|Birmingham City':
    'The Second City Derby and one of the most hostile in English football. The clubs are just over two miles apart. The rivalry intensified during the 2010 League Cup quarter-final when a Birmingham fan ran onto the pitch and attacked Villa\'s Jack Grealish — who got up and scored the winner.',

  'Dartford|Ebbsfleet United':
    'Kent neighbours separated by two and a half miles. Ebbsfleet made worldwide headlines in 2008 when they were bought by the crowdfunding website MyFootballClub, giving 30,000 online members voting rights on team affairs. It didn\'t last.',

  'Aldershot Town|Farnborough':
    'Hampshire neighbours with a phoenix club twist. The original Aldershot FC went bust in 1992 mid-season — the first Football League club to fold since Accrington Stanley in 1962. The current Aldershot Town rose from the ashes.',

  'Sheffield United|Sheffield Wednesday':
    'The Steel City Derby. Wednesday were originally a cricket club whose members played football on Wednesdays (their half-day off). United were formed by the Sheffield United Cricket Club. Both emerged from the sporting culture of the same steel city. The clubs have shared the same division for less than half of their combined history, making each meeting rare and highly charged.',

  'Bristol City|Bristol Rovers':
    'The Bristol Derby. Rovers have been nomads — they\'ve played at more grounds than almost any English club, and were groundless for years, playing at Bath City\'s Twerton Park from 1986 to 1996. City stayed put at Ashton Gate, lording it over their neighbours.',

  'Eastleigh|Southampton':
    'Just five miles apart in Hampshire. Eastleigh\'s rise through non-league has been funded by chairman Stewart Donald, who later bought Sunderland in 2018 — not the most popular tenure on Wearside.',

  'Gateshead|South Shields':
    'Both from the south bank of the Tyne, six miles apart. South Shields were founded in 1888 and have experienced multiple reformations. Their current iteration has been on a rapid rise through the non-league pyramid.',

  'Rushall Olympic|Walsall':
    'Just three miles apart in the West Midlands. Rushall Olympic play at Dales Lane, a ground with a capacity under 2,000 — roughly 1/5th the size of Walsall\'s Bescot Stadium next door.',

  'Manchester City|Manchester United':
    'The Manchester Derby. United were originally "Newton Heath LYR" (a railway workers\' team) while City were "Ardwick AFC." When Newton Heath nearly went bankrupt in 1902, legend has it the club was saved by a brewery owner\'s dog — the club was renamed Manchester United. The rest is history, and City fans have never let United forget they weren\'t always the bigger club.',

  'Arsenal|Tottenham Hotspur':
    'The North London Derby. Arsenal were originally from Woolwich in south-east London and only moved to Highbury in 1913 — directly into Tottenham\'s patch. Spurs have never forgiven them. In 1919, Arsenal were controversially promoted to the First Division ahead of Spurs despite finishing only fifth in the Second Division. The grudge is over a century old.',

  'Newcastle United|Sunderland':
    'The Tyne-Wear Derby. This rivalry predates organised football — the cities have been competing since medieval times. Sunderland\'s official nickname "The Black Cats" was only adopted in 2000 after a vote. The derby has produced some extraordinary moments, including Sunderland\'s 3-0 win at St James\' Park in 1979 that some credit with costing Newcastle manager Bill McGarry his job.',

  'Fulham|Queens Park Rangers':
    'West London neighbours just two and a half miles apart. Both have had periods as fashionable London clubs — QPR had their Rodney Marsh and Stan Bowles era in the 70s, while Fulham attracted Johnny Haynes and later became Mohamed Al-Fayed\'s vanity project, complete with a Michael Jackson statue outside Craven Cottage.',

  'Brentford|Fulham':
    'The oldest rivalry in West London. Brentford\'s move to the Gtech Community Stadium in 2020 actually brought them slightly closer to Fulham\'s Craven Cottage. In the 2019/20 season, Brentford\'s "Moneyball" approach under Matthew Benham transformed them from a yo-yo club into a Premier League side.',

  'West Bromwich Albion|Wolverhampton Wanderers':
    'The Black Country Derby. Just three miles separate Molineux and The Hawthorns. Both were founding members of the Football League in 1888. The A41 between them is one of the most tension-filled stretches of road in English football on derby day.',

  'Blackburn Rovers|Burnley':
    '"The East Lancashire Derby" — though calling it that is generous given the 10-mile gap and a large hill in the way. These cotton mill towns have been suspicious of each other since the Industrial Revolution. Blackburn spent Jack Walker\'s millions on a Premier League title in 1995; Burnley spent theirs on... well, Burnley things. The hatred is real, even if the geography is a stretch.',

  'Portsmouth|Southampton':
    'The South Coast Derby. Separated by ~16 miles of the M27. Portsmouth fans call Southampton "Scummers," Saints fans call Pompey "Skates." The rivalry intensified when Southampton were founding members of the Premier League in 1992 while Portsmouth languished in the lower divisions. Pompey\'s 2008 FA Cup win remains a sore point for Saints fans.',

  'Port Vale|Stoke City':
    'The Potteries Derby. Both from different parts of Stoke-on-Trent, a federation of six towns. When Port Vale were expelled from the Football League in 1907 for financial irregularities, it took them until 1919 to get back. Stoke, meanwhile, were founding members of the Football League itself.',

  // =============================================
  // FAMOUS DERBIES & RIVALRIES WITH HISTORY
  // =============================================

  'Brighton & Hove Albion|Crystal Palace':
    '"The M23 Derby" \uD83D\uDE44. This one is ~37 miles of questionable hatred. It kicked off in the 1976/77 FA Cup when Palace knocked Brighton out, and fans clashed on the terraces. The violence escalated through the late 70s and 80s. Both clubs will tell you the other started it. The geographical distance is largely irrelevant, they care so much because they\'re both historically so irrelevant.',

  'Derby County|Nottingham Forest':
    'The East Midlands Derby. Brian Clough managed Derby to the First Division title in 1972, then resigned in a dispute with the chairman. He joined Brighton briefly, then took over at arch-rivals Forest — and won the European Cup twice. Derby fans worshipped him, then watched him become a god at the club down the A52.',

  'Millwall|West Ham United':
    'The Dockers Derby. Both clubs emerged from the Thames Ironworks and docklands of east and south-east London in the 1890s. The rivalry is among the most intense in English football and police regularly deploy thousands of officers for fixtures between them. The clubs haven\'t played each other in the league since 2012.',

  'Liverpool|Manchester United':
    'The biggest club rivalry in English football — but it\'s built on the cities\' economic competition during the Industrial Revolution, not proximity. Manchester had the canals and railways; Liverpool had the port. In football terms, the two clubs have won a combined 39 league titles. But at 30 miles apart, this is a rivalry, not a derby.',

  'Leeds United|Manchester United':
    '"The Roses Derby" — except it isn\'t one, is it? It traces back to the Wars of the Roses in the 15th century, which is a great pub argument but doesn\'t change the fact that they\'re nearly 40 miles apart. The football hatred peaked under Don Revie\'s Leeds in the late 60s/70s. Fierce? Absolutely. A derby? Have a word.',

  'Arsenal|Manchester United':
    'Wenger vs Ferguson was box office, yes. The pizza in the tunnel, the "Invincibles" — great telly. But calling this a derby is like calling a phone call a conversation over the garden fence. Two hundred miles apart. Come on.',

  'Arsenal|Chelsea':
    'Both London clubs, but at opposite ends of the city. This rivalry was mostly dormant until Roman Abramovich\'s 2003 takeover turned Chelsea into a superpower, directly threatening Arsenal\'s position. The 2004 Champions League quarter-final (Wayne Bridge\'s winner) and multiple Cup finals fuelled the fire.',

  'Chelsea|Tottenham Hotspur':
    'Both London, but eight miles and a cultural gulf apart. The Battle of the Bridge in 2016 (nine yellows, Leicester won the league instead) was great theatre, but this is less a derby and more a recurring scheduling headache. Spurs fans despise Chelsea; Chelsea fans aren\'t sure they think about Spurs at all.',

  'Tottenham Hotspur|West Ham United':
    'This rivalry has cultural undertones — historically, Spurs drew support from the Jewish community in north London while West Ham\'s East End base had its own distinct identity. On the pitch, the fixture has produced some extraordinary moments, including West Ham\'s famous 1-0 win at White Hart Lane when Carlos Tevez kept them up on the final day of 2006/07.',

  'Charlton Athletic|Millwall':
    'South-east London\'s simmering grudge match. Charlton\'s return to The Valley in 1992 after seven years of exile (they\'d been groundsharing at Selhurst Park and Upton Park) was an emotional homecoming. Having Millwall just down the road added edge to every fixture.',

  'Leyton Orient|West Ham United':
    'When West Ham moved to the Olympic Stadium in 2016, Orient chairman Barry Hearn led the legal challenge. Orient\'s Brisbane Road is closer to the Olympic Park than Upton Park ever was. Orient argued it would destroy their fanbase. The move went ahead anyway.',

  'Bolton Wanderers|Wigan Athletic':
    'Greater Manchester rivals whose hatred intensified during their simultaneous Premier League years (2005-2012). Before Wigan\'s rise, Bolton fans barely acknowledged them. After Wigan won the FA Cup in 2013 (beating Manchester City) and were relegated the same week, even Bolton had to grudgingly respect them.',

  'Manchester United|Salford City':
    'The Class of 92 connection — Salford are co-owned by Gary Neville, Ryan Giggs, Paul Scholes, Nicky Butt, and David Beckham. The Peninsula Stadium is three miles from Old Trafford. United fans are divided: some see it as flattery, others as an annoying sideshow.',

  'Manchester City|Stockport County':
    'Edgeley Park is roughly four miles from the Etihad. When City were in their wilderness years (playing in the third tier in 1998/99), Stockport were actually above them in the second tier. City fans of a certain age remember that, even if the club\'s newer global fanbase doesn\'t.',

  'Oldham Athletic|Rochdale':
    'Pennine neighbours in the hills east of Manchester. Both have spent most of their existence in the lower divisions. Oldham\'s Boundary Park is one of the highest and most exposed grounds in England — visiting players and fans learn to dress warm.',

  'Chester|Wrexham':
    'The cross-border derby. Wrexham play in Wales, Chester in England, twelve miles apart. The rivalry took on new life after Ryan Reynolds and Rob McElhenney bought Wrexham in 2020, turning a modest Welsh club into a global brand. Chester fans remain distinctly unimpressed.',

  'Huddersfield Town|Peterborough United':
    '98 miles apart. No geography, pure grudge. It started in the 1992 Division Three play-off semis — Huddersfield dominated both legs but lost 4-3 on aggregate, conceding late both times. Posh went up; Terriers stewed. Fast-forward to 2011: the clubs met again in the League One play-off final at Old Trafford, and Peterborough scored three in seven minutes to win. Then the defining twist — on the final day of 2012/13, Huddersfield drew with Barnsley to save themselves and Peterborough were relegated with 54 points, a record for a relegated side. Two decades of collision points and no real way home.',

  'Gillingham|Swindon Town':
    'One of English football\'s most random rivalries. 100 miles apart in Kent and Wiltshire respectively — no geographical connection whatsoever. The grudge was born in March 1979 at Priestfield: Gillingham\'s Danny Westwood was sent off, a fan struck the referee, and things escalated. The return fixture ended in a tunnel brawl that hospitalised a Swindon coach. Reignited again in the inaugural 1986/87 play-offs. Still described as a "tasty" fixture today — police often separate the fans. Zero geography, all grudge.',

  'Coventry City|Sunderland':
    '170 miles apart but Sunderland fans have never forgiven Coventry. On the final day of 1976/77, Coventry managing director Jimmy Hill got the kick-off delayed due to "traffic congestion." When news came through that Sunderland had lost at Everton, Coventry and Bristol City played out a convenient 2-2 draw — both stayed up, Sunderland went down. An inquiry cleared Hill, but the hatred stuck. Sunderland fans booed him for decades.',

  'Barrow|Carlisle United':
    'Cumbria\'s best attempt at a derby — 55 miles apart across some of England\'s emptiest countryside. Getting to either ground requires genuine commitment and a full tank. When Barrow returned to League Two in 2020 after 48 years, Cumbria had two professional clubs again for the first time since the 70s. That\'s still not a derby though.',

  'Accrington Stanley|Burnley':
    'Most people know Accrington Stanley from the 1980s milk advert ("Accrington Stanley? Who are they? Exactly!"). But the original Accrington FC were founding members of the Football League in 1888 — they resigned from the league in 1893. The current club are a completely separate entity, founded in 1968.',

  'Walsall|West Bromwich Albion':
    'Just four miles apart in the Black Country. Walsall\'s finest hour was arguably beating Arsenal 2-1 in the 1933 FA Cup third round — still regarded as one of the greatest FA Cup upsets of all time.',

  'Everton|Tranmere Rovers':
    'Separated by the Mersey and the Birkenhead tunnel. Tranmere\'s Prenton Park looks across the river to Liverpool\'s skyline. During their 2000s golden era under John Aldridge (a Liverpool legend), Tranmere occasionally drew bigger crowds than Everton for midweek games. That particularly stung.',

  'Liverpool|Tranmere Rovers':
    'Across the Mersey. Tranmere can see the city of Liverpool from Prenton Park but exist in a completely different footballing universe. The clubs met in the FA Cup fourth round in 2001 — Liverpool won 4-2 at Prenton Park on the way to their cup treble.',

  'Aston Villa|Wolverhampton Wanderers':
    'The West Midlands Derby. Wolves and Villa are the two most successful clubs in the region. Villa won the European Cup in 1982; Wolves won the league three times in the 1950s. The rivalry is intensified by both clubs\' belief that they, not the other, are the true big club of the West Midlands.',

  'Burton Albion|Nottingham Forest':
    'Twenty-two miles apart, and Burton would love this to be considered a derby. They were a non-league club until 2009, so their brief Championship coexistence with Forest in 2016/17 was less a rivalry and more a once-in-a-lifetime holiday. Forest have the East Midlands Derby; Burton have wishful thinking.',

  'Exeter City|Plymouth Argyle':
    '"The Devon Derby" — 36 miles of the A38 behind a caravan. Devon fans insist this is their local derby, and when your nearest alternative is in Cornwall, they\'ve got a point. But 36 miles is 36 miles, and no amount of cream teas changes that.',

  'Plymouth Argyle|Torquay United':
    'South Devon rivals. Torquay were a Football League club from 1927 to 2014, when they were relegated to the Conference. Their Plainmoor ground is famous for its views of Torbay — arguably the most scenic ground in English football.',

  'Exeter City|Torquay United':
    'The other Devon rivalry. Only 18 miles apart along the coast. Exeter once toured South America in 1914 and played against Brazil — making them the first non-South American team to play the Brazilian national side.',

  'Ipswich Town|Norwich City':
    '"The Old Farm Derby" — at least the name is self-aware. Tractors instead of tenements, and a solid 40+ miles of Suffolk and Norfolk countryside between them. They genuinely despise each other, but geographically? Two counties and a lot of sugar beet fields say otherwise.',

  'Birmingham City|Coventry City':
    'West Midlands neighbours. Coventry\'s greatest moment — winning the 1987 FA Cup final against Tottenham with Keith Houchen\'s diving header — remains one of the most iconic goals in Cup history. It\'s replayed so often that even Birmingham fans know every frame.',

  'Luton Town|Watford':
    '"The Bedfordshire-Hertfordshire derby" — a name only a county council could love. They\'re ~16 miles apart up the M1, which sounds close until you remember neither town is exactly a footballing metropolis. Luton banned away fans in the 1980s and installed a plastic pitch; Watford had Elton John. Both were weird in their own way.',

  'Oxford United|Reading':
    '"The Thames Valley Derby" — a name that screams geography homework rather than footballing hatred. Twenty-five miles of commuter belt separate them. Oxford won the League Cup in 1986; Reading got 106 Championship points in 2005/06. Both memorable, neither enough to make this a proper derby.',

  'Oxford United|Swindon Town':
    'Twenty-nine miles of the A420 — barely a rivalry, more of a long commute. Swindon reached the Premier League in 1993 and got immediately relegated. Their 1969 League Cup win over Arsenal remains sacred locally, which tells you everything about the size of the club. Both insist this is a derby. The map disagrees.',

  'Cambridge United|Peterborough United':
    'The Cambridgeshire derby, ~30 miles apart. Peterborough are famous for their "Posh" nickname and for scoring goals in absurd quantities — they hit 134 in 1960/61, a Football League record for a single season.',

  'Grimsby Town|Scunthorpe United':
    'North Lincolnshire rivals, ~27 miles apart across the Humber flatlands. Grimsby\'s Blundell Park is actually in Cleethorpes, not Grimsby. Scunthorpe are famous for their unintentional run-in with email spam filters — their name contains an unfortunate substring.',

  'Doncaster Rovers|Rotherham United':
    'South Yorkshire neighbours. Doncaster\'s Belle Vue was one of the great old English grounds before they moved to the Keepmoat. Rotherham\'s New York Stadium sits on the site of a former steelworks — the name comes from the old Guest and Chrimes factory.',

  'Barnsley|Sheffield United':
    'South Yorkshire rivals, ten miles apart. Barnsley are one of the Premier League\'s shortest-staying members — they survived one season in 1997/98. Their fans still talk about that year the way other clubs talk about winning trophies.',

  'Barnsley|Sheffield Wednesday':
    'Another South Yorkshire pairing. Barnsley\'s Oakwell ground has hosted rugby league, cricket, and even baseball over the years. Wednesday\'s Hillsborough is forever associated with the 1989 disaster — the most solemn ground in English football.',

  'Huddersfield Town|Leeds United':
    'West Yorkshire neighbours who\'d love to call this a derby. Huddersfield won the league three times in a row (1924-26) — back when Leeds were nothing. A century later the roles have thoroughly reversed, and Huddersfield\'s claim to rivalry is mostly nostalgic.',

  'Bradford City|Huddersfield Town':
    'West Yorkshire rivals. Bradford\'s Valley Parade fire in 1985 killed 56 people — the worst disaster at an English football ground until Hillsborough four years later. The tragedy changed stadium safety regulations across the country.',

  'Bradford City|Leeds United':
    'Both from West Yorkshire but worlds apart in profile. Bradford\'s time in the Premier League (1999-2001) included a miraculous final-day survival in 2000, beating Liverpool 1-0 when they needed a win to stay up.',

  'Chesterfield|Sheffield United':
    'Twelve miles apart in the Peak District foothills. Chesterfield\'s famous crooked spire church overshadows the ground. In the 1997 FA Cup semi-final, Chesterfield were denied a blatantly good goal against Middlesbrough when 2-1 up — they would have reached the final. The "ghost goal" still haunts Spireites fans.',

  'Crewe Alexandra|Stoke City':
    'Cheshire vs Staffordshire, ~13 miles apart. Crewe\'s Dario Gradi era (1983-2007) produced an extraordinary production line of talent: Dean Ashton, Danny Murphy, Seth Johnson, Rob Jones, David Platt, and more all came through their youth system.',

  'AFC Wimbledon|MK Dons':
    'Not a derby. Not even close geographically. But this is English football\'s most emotionally charged non-derby. When Wimbledon FC were controversially relocated to Milton Keynes in 2003, the original fans formed AFC Wimbledon and started from scratch. The hatred is real, but it\'s about identity theft, not postcodes.',

  'MK Dons|Wycombe Wanderers':
    'Buckinghamshire\'s attempt at a rivalry. When MK Dons parachuted into Milton Keynes, Wycombe suddenly had a neighbour — like someone building a Tesco Express next to your village shop. Adams Park sits in the Chiltern Hills looking down, both literally and metaphorically.',

  'Cheltenham Town|Forest Green Rovers':
    'Gloucestershire neighbours, ten miles apart. Forest Green, under chairman Dale Vince, became the world\'s first vegan football club — no meat sold at the ground, organic pitch, solar-powered lawnmower. Cheltenham, more traditionally run, look across the county with bemusement.',

  'Harrogate Town|York City':
    'North Yorkshire neighbours. Harrogate are the new kids — they only reached the Football League in 2020 via the National League play-offs, during the COVID season. Their Wetherby Road ground (now EnviroVent Stadium) was upgraded hastily to meet EFL requirements.',

  'Blackpool|Fleetwood Town':
    'Lancashire coast rivals, just seven miles apart. Blackpool\'s Bloomfield Road has seen FA Cup finals (1953, the "Matthews Final") and Premier League football (2010/11). Fleetwood, owned by fishing industry magnate Andy Pilley, rose from the Northern Premier League to League One in just eight years.',

  'Blackpool|Preston North End':
    'Lancashire\'s "other" rivalry — 16 miles of the M55 and a lot of mutual side-eye. Preston were the first-ever league champions and the original "Invincibles." Blackpool had Stanley Matthews and the 1953 FA Cup Final. Both cling to their history because the present hasn\'t been as kind.',

  'Blackpool|Morecambe':
    'Twenty miles of the Lancashire coast between them. Morecambe spent decades in non-league before reaching League Two in 2007 with a ground smaller than most Premier League car parks. Blackpool, meanwhile, had a whole Premier League season to their name. Neither is really in a position to brag.',

  'Barrow|Morecambe':
    'Morecambe Bay rivals. You can see across the bay from one town to the other, but driving round takes over an hour. It\'s a properly remote corner of English football.',

  'Mansfield Town|Notts County':
    'Nottinghamshire neighbours. Mansfield\'s Field Mill is one of the oldest grounds still in use — football has been played on the site since 1861, making it arguably the oldest football ground in the world.',

  'Chesterfield|Mansfield Town':
    'East Midlands neighbours straddling the Nottinghamshire-Derbyshire border. Both are proper market town clubs — the kind that have been the backbone of the lower leagues for over a century.',

  'Lincoln City|Scunthorpe United':
    'Lincolnshire rivals. Lincoln\'s 2016/17 FA Cup run — reaching the quarter-finals as a non-league club, the first to do so since 1914 — captivated the nation. Danny Cowley took them from the National League to League One.',

  'Brighton & Hove Albion|Crawley Town':
    'Sussex\'s attempt at a local rivalry. Twenty-five miles apart and about a hundred divisions of quality between them. Crawley\'s greatest day was beating Leeds 2-1 in the 2011 FA Cup as a non-league club. Brighton are now in the Premier League spending nine figures on transfers. Not exactly a meeting of equals.',

  'Chelmsford City|Colchester United':
    'Essex\'s version of a rivalry. Colchester once beat Don Revie\'s Leeds 3-2 in the 1971 FA Cup — one of the great giant-killings. Chelmsford are still waiting for their equivalent moment. At 20-odd miles apart, this is a regional grumble at best.',

  'Gillingham|Maidstone United':
    'Kent rivals. The original Maidstone United reached the Football League in 1989 but went bust just three years later. The current club, reformed in 1992, have worked their way back up to the National League South. Gillingham, meanwhile, have survived in the Football League since 1920.',

  'Dover Athletic|Folkestone Invicta':
    'The closest Kent coastal rivals. Dover\'s Crabble ground sits in a valley surrounded by the famous white cliffs — one of the most dramatically located grounds in England.',

  'Darlington|Hartlepool United':
    'County Durham neighbours. Darlington\'s ill-fated 25,000-seater Reynolds Arena (built in 2003 for a club averaging 3,000 fans) became a symbol of financial overreach in football. The club nearly folded and now play at Blackwell Meadows, capacity 3,000.',

  'Darlington|Spennymoor Town':
    'County Durham neighbours, eight miles apart. Spennymoor play at the wonderfully named Brewery Field — named because it sits next to the former Whitbread brewery site.',

  'Darlington|Hartlepool United':
    'The Tees-Wear derby. Hartlepool are famously the club whose mascot, H\'Angus the Monkey (named after a legend about locals hanging a shipwrecked monkey they mistook for a French spy during the Napoleonic Wars), was elected as the town\'s mayor in 2002. He served three terms.',

  'Dartford|Welling United':
    'South-east London/Kent borders. Welling\'s Park View Road is one of the most unassuming grounds in English football — a non-league outpost surrounded by suburban streets.',

  'Bromley|Crystal Palace':
    'South London neighbours. Bromley were one of the great amateur clubs of the post-war era, winning the FA Amateur Cup multiple times. Their modern Hayes Lane ground sits just four miles from Selhurst Park.',

  'AFC Wimbledon|Sutton United':
    'South London neighbours with a shared non-league heritage. Sutton are best known for their 1989 FA Cup giant-killing of Coventry City — the holders at the time. Goalkeeper Dave Beasant had won the Cup with Wimbledon the previous year; Sutton knocked his old team\'s Cup victim out the next season.',

  'Aldershot Town|Woking':
    'Surrey-Hampshire border rivals, 12 miles apart. Woking\'s Tim Buzaglo scored a hat-trick against West Bromwich Albion in the 1991 FA Cup third round — one of non-league football\'s most famous individual performances.',

  'Bath City|Bristol City':
    'Somerset vs Bristol, 12 miles apart. Bath City have been a non-league fixture since their founding in 1889. Their Twerton Park ground was famously used by Bristol Rovers as a temporary home from 1986-1996 when Rovers had no ground of their own.',

  'Taunton Town|Yeovil Town':
    'Somerset rivals. Yeovil were the great giant-killers of non-league football in the post-war years — their sloping pitch at Huish Park became legendary. They finally reached the Football League in 2003 after decades of trying.',

  'Torquay United|Weymouth':
    'South coast neighbours across the Dorset-Devon border — pleasant scenery, questionable football. Torquay\'s Plainmoor ground offers views of the English Riviera, which is fortunate because the football hasn\'t always been worth watching. Both clubs have bounced around the non-league system like a ball on a shingle beach.',

  'Plymouth Argyle|Truro City':
    'Cornwall\'s only senior club vs Devon\'s biggest — ~41 miles of the A38 and a county border. Truro are the most south-westerly club in the English football system, which sounds romantic until you realise it mainly means nobody visits.',
};

function getStrapline(clubA, clubB) {
  const key = [clubA.name, clubB.name].sort().join('|');
  return STRAPLINES[key] || null;
}
