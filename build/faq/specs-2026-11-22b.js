// FAQ round Nov 22 2026 (b): competitor gap plan step 2, the trophy guide (see CLAUDE.md "Competitor gap plan").
// Work notes: research_notes/gap-plan-2-trophies.json (names from the platform list, tips agreed by 2+ independent
// guides; guides are never named). Gameplay tables are spoiler-free ("Chapter N", no mission names). Story trophies
// sit in two closed spoiler tables; the heavy ones get their own. "Bad Luck, I Guess" has one source for its method,
// so the page names no method for it.
const OUT = ['/news/gta-6-out-now', 'Leonida Is Open: GTA VI Is Out'];
const L = (href, txt) => `<a href="${href}" style="color:var(--blue)">${txt}</a>`;
const G = 'GTA VI, in-game';
const HEAD = ['Trophy', 'Grade', 'How to Get It'];
const M = (slug, name) => L(`/story/missions/${slug}`, name);
module.exports = [
{
  slug: 'gta-6-trophy-guide', q: 'What Are the GTA 6 Trophies?', h1: 'GTA 6 Trophy Guide',
  desc: 'All 55 GTA 6 trophies and achievements: how to unlock each one, what you can miss, and how long the platinum takes. Story trophies sit behind a spoiler.',
  source: G,
  answer: [`<strong>55 trophies: 1 platinum, 2 gold, 6 silver and 46 bronze.</strong> On Xbox they add up to 1,000 Gamerscore. One playthrough covers all of it. No online trophies, no difficulty settings, and free roam keeps running after the credits, so whatever you skipped is still out there.`,
    `Plan on about 200 hours. Roughly a third of that is the story, most of the rest is the ${L('/faq/gta-6-100-percent-completion', '100% checklist')} behind the gold A Long Road. That one is the grind. The rest come from living in Leonida: robbing, racing, hunting and scanning everything with WAiNK.`,
    `Almost nothing is missable. The one thing to watch: in Chapter 1, Lucia offers a meditation on the balcony at Jason's house. Take it. It disappears later, and nobody has pinned down yet whether the meditation trophy needs it. Keep a manual save at the start and end of every chapter anyway.`,
    { table: { title: 'Activities and Side Jobs', head: HEAD, rows: [
      ['Cunning Stunts', 'Silver', `Finish 250 of the 397 ${L('/gameplay/activities/stunts', 'stunts')}. Every kind counts: stunt jumps, flying under bridges, knife flights and BASE jumps. Bridges go fastest.`],
      ['Master of None', 'Bronze', `Try every activity type once: fishing, hunting, golf, a shooting range, pool, basketball, an arcade or TV game, winning a race and a stunt. ${L('/gameplay/activities', 'All activities')}.`],
      ['The Shootist', 'Silver', `Gold medals in every challenge at the ${L('/gameplay/activities/combat-training', 'shooting ranges')}: 42 medals over 12 ranges. Your Focus levels up on the way.`],
      ['Top Fun', 'Bronze', `Win a Top Fun drone race at all 14 locations. One win per spot is enough. ${L('/gameplay/activities/racing', 'Racing')}.`],
      ['Earn Cash, Not Kudos', 'Bronze', `Win 20 different races out of the 40. Winning the same race twice counts once.`],
      ['Baited My Tackle', 'Bronze', `Beat ${L('/gameplay/characters/cal-hampton', 'Cal')} at ${L('/gameplay/activities/fishing', 'fishing')}. Some time after you meet him in Chapter 1, he texts you a spot. Go and win.`],
      ['Stick Fiddler', 'Bronze', `Finish one ${L('/gameplay/activities/games', 'arcade game')}: Tenebrae Lux, Street Trash III or Time Jackers Rewind on the TV at home, or Bang For Your Buck on a cabinet.`],
      ['Personal Best', 'Bronze', `Max out Strength for Jason and Lucia. Take your partner to the gym: training one trains the other. ${L('/faq/does-gta-6-have-a-gym-and-fitness-system', 'The fitness system')}.`],
      ['Fair Game', 'Bronze', `Hunt one of the unique animals Bret texts you about. Jason only, from Chapter 2. ${L('/gameplay/activities/hunting', 'Hunting')}.`],
      ['Positive Mental Attitude', 'Bronze', `Get the meditation counter to 18. A spot done by both Jason and Lucia counts twice. ${L('/gameplay/collectibles/meditation-spots', 'Every meditation spot')}.`],
      ['This Was No Boat Accident', 'Bronze', `Finish ${L('/gameplay/characters/kenton-rees', 'Kenton')}'s last job. His diving work starts in Chapter 1: seven ${L('/gameplay/collectibles/shipwrecks-and-treasure', 'shipwrecks')} and a metal detector. He leaves for a while, then comes back.`],
      ['Road to Rehabilitation', 'Bronze', `Finish all five jobs for ${L('/faq/gta-6-andy-missions', 'Andy')}. Lucia only, from a call in Chapter 3.`],
      ['The Lone Rider', 'Bronze', `Finish all five jobs for ${L('/faq/gta-6-billy-missions', 'Billy')} at the Thrillbilly Mud Club. They open partway through Chapter 2.`],
      ['Spin On This!', 'Bronze', `Finish ${L('/gameplay/characters/tyrone-russo', 'Tyrone')}'s last job. Jason only, from Chapter 3: burn down the ${L('/faq/gta-6-tyrone-drug-labs', 'synthetic drug labs')} around Vice City first.`],
      ['Strangers &amp; Freaks', 'Silver', `Finish 8 strands for strangers. Contacts with their own job chains (Moses, Tyrone, Yasmani, Andy, Billy) do not count. Watch the trophy tracker.`],
    ] } },
    { table: { title: 'Collectibles and Exploration', head: HEAD, rows: [
      ['Don\'t Touch My Deck', 'Silver', `Complete any 3 of the 18 ${L('/gameplay/collectibles/collectible-cards', 'collectible card')} sets. Progress sits under Progress, Collections.`],
      ['You WAiNKer!', 'Silver', `Scan 100 places with WAiNK: landmarks, curiosities, sculptures, No Flusher tags. ${L('/gameplay/collectibles/waink-locations', 'WAiNK locations')}.`],
      ['The Goodtime State', 'Bronze', `Clear all the fog on the map. A plane over the dark patches does it fastest.`],
      ['One Last Thing', 'Bronze', `Complete 50 of the 80 challenges. Plenty finish on their own, and 100% wants 70 anyway. Leave it for late.`],
      ['Actions Speak Louder', 'Bronze', `Make 500 choices that move your Criminal Profile. It comes by itself. Stay away from the permanent Irredeemable profile.`],
    ] } },
    { table: { title: 'Vehicles', head: HEAD, rows: [
      ['Whip It Good', 'Bronze', `Scan 100 vehicles with WAiNK. Stand by a busy road. You never have to drive them.`],
      ['On the Spot', 'Bronze', `Register 10 vehicles in the ${L('/gameplay/brands/scooter-brothers', 'Scooter Bros')} app. You need free garage space and every registration costs money, so cheap cars and bikes do the job.`],
      ['Little Boxes', 'Bronze', `Buy all 8 garages for sale, about $160,000 in total, in the Vice City Real Estate app. It arrives in Chapter 2. The garages the story gives you do not count.`],
      ['Supply &amp; Demand', 'Bronze', `Deliver every car on ${L('/faq/gta-6-randys-wish-list', "Randy's wish list")}. It opens in Chapter 3 with the ${L('/faq/how-to-get-the-key-cloner-in-gta-6', 'Key Cloner')}. ${L('/faq/how-to-steal-and-sell-cars-in-gta-6', 'How car theft works')}.`],
      ['Challenging Tank', 'Bronze', `Take a Rhino from ${L('/gameplay/locations/mile-zero-air-station', 'Mile Zero Air Station')} and kill with it. ${L('/faq/how-to-get-a-tank-in-gta-6', 'How to get a tank')}.`],
      ['Catch Me If You Can', 'Bronze', `Steal a passenger jet docked at a jet bridge at ${L('/gameplay/locations/vice-city-international-airport', 'VCIA')}, not one out on the apron, and fly about 1 km away.`],
      ['Capital Offense', 'Bronze', `Hidden. Drive a car out of a vehicle showroom through the front window, the old-school way. Which showroom and which car count is not pinned down yet.`],
      ['Ten Pin', 'Bronze', `Kick 10 pedestrians off a bike within one minute. Busy ${L('/gameplay/locations/ocean-beach', 'Ocean Beach')} makes it easy.`],
    ] } },
    { table: { title: 'Crime and Combat', head: HEAD, rows: [
      ['Maximum Withdrawal', 'Silver', `Rob 5 of the 8 bank vaults and get away. They open through an optional Chapter 4 mission. Bring your partner for a second bag.`],
      ['A Classic Blitz Play', 'Bronze', `Rob an armored truck and escape. A bank vault job counts too, or stop a truck and blow its doors with a sticky bomb.`],
      ['Retail Therapy', 'Bronze', `Rob 3 shops in a row with your partner without losing your Wanted Level. The three jewelry stores in north Vice City sit close together. The trophy takes about 30 seconds to pop.`],
      ['Sneakthief', 'Bronze', `Rob a jewelry store unseen. Yasmani's jobs in Chapter 3 give you the Snap Gun: pick the back door, find the code note in the back room, empty the safe. ${L('/faq/gta-6-safe-codes', 'Safe codes')}.`],
      ['Pest Control', 'Bronze', `Rob one Illegal Operation from each of the 9 gangs. 100% wants all 39. ${L('/gameplay/gangs-and-factions', 'The gangs')}.`],
      ['Let\'s Go Bowling', 'Bronze', `At Kingpin Bowling in ${L('/gameplay/locations/port-gellhorn', 'Port Gellhorn')}, take the office watch, the Gutterball shotgun and the safe (code 0300), then lose the cops. Separate visits work.`],
      ['Hot Together', 'Bronze', `Lose a 4-star Wanted Level with your partner along. Bank vaults always bring 4 stars, so it tends to happen anyway. ${L('/faq/how-does-the-wanted-system-work', 'The wanted system')}.`],
      ['Gunslinger', 'Bronze', `Drop 5 enemies in one use of Combat Focus. Fill Focus first and bring an accurate assault rifle.`],
      ['Dime on the Dollar', 'Bronze', `Launder $250,000 in marked bills through your contacts. It adds up over time once Chapter 3 hands you the Dye Pack Jammer. ${L('/gameplay/characters/yasmani-cabrera', 'Yasmani')} pays best.`],
      ['Treat Yo Self', 'Bronze', `Spend $100,000 in shops, in total. Guns, car mods and tattoos burn it fastest. ${L('/faq/how-to-make-money-in-gta-6', 'Making it back')}.`],
    ] } },
    { table: { title: 'Easter Eggs', head: HEAD, rows: [
      ['In The Beginning…', 'Bronze', `Order an Apple Martini at the Ocean View rooftop bar on Ocean Beach and drink it.`],
      ['The Truth Is Out There', 'Bronze', `Alone, late at night, near the Starlet Motel in ${L('/gameplay/locations/kelly-county', 'Kelly County')}: follow the trail from a parked car with blinking lights to the blue light, help the woman and walk her back. It does not show every night. No car? Leave and come back. ${L('/faq/gta-6-easter-eggs', 'More easter eggs')}.`],
      ['Bad Luck, I Guess', 'Bronze', `Hidden, and the trigger is not pinned down yet.`],
    ] } },
    { table: { title: 'The Big Ones', head: HEAD, rows: [
      ['A Long Road', 'Gold', `Hit 100% completion. The checklist shows up after the story under Progress, Stats, and everything you did before already counts. ${L('/faq/gta-6-100-percent-completion', 'What 100% takes')}.`],
      ['Vice Got a Price!', 'Platinum', `Earn every other trophy.`],
    ] } },
    `The story trophies come automatically as you play. They sit below, closed, because their names give the plot away.`,
    { spoiler: { chapter: 'Story trophies', table: { head: ['Trophy', 'Grade', 'Unlocks'], rows: [
      ['Just Like Paradise', 'Bronze', `${M('gone-fishing', 'Gone Fishing')}`],
      ['Paradise Lost', 'Bronze', `Chapter 1 done. It pops after ${M('whats-in-the-bag', 'What\'s in the Bag?')}, not at the last Chapter 1 cutscene`],
      ['Trust', 'Bronze', `${M('breakfast-run', 'Breakfast Run')}`],
      ['T**s Ass Drug Money', 'Bronze', `Chapter 2 done. It pops after ${M('welcome-to-vice-city', 'Welcome to Vice City')}`],
      ['Break the Bank', 'Bronze', `${M('the-cartel-heist', 'The Cartel Heist')}`],
      ['Vice City, Baby!', 'Bronze', `Chapter 3 done. It pops after ${M('ocean-beach', 'Ocean Beach')} and ${M('another-life', 'Another Life')}`],
      ['Family Matters', 'Bronze', `${M('childs-play', 'Child\'s Play')}`],
      ['DWNFALL', 'Bronze', `${M('headliners', 'Headliners')}`],
      ['Top Of The World, Ma', 'Bronze', `Chapter 4 done`],
      ['Snow Storm', 'Bronze', `${M('operation-savage-glory', 'Operation Savage Glory')}`],
    ] } } },
    { spoiler: { chapter: 'Late story, heavy', table: { head: ['Trophy', 'Grade', 'Unlocks'], rows: [
      ['Hi-Jacked', 'Bronze', `${M('vcia-takedown', 'VCIA Takedown')}`],
      ['You Gotta Know When to Get Off', 'Gold', `The final mission, ${M('starting-from-zero', 'Starting From Zero')}`],
    ] } } },
  ],
  related: [
    { q: 'Are there missable trophies in GTA 6?', html: 'Not really. Free roam stays open after the credits and side jobs wait for you. The only doubt is the Chapter 1 balcony meditation with Lucia: take it, in case the meditation trophy needs it.', source: G },
    { q: 'How long does the GTA 6 platinum take?', html: `About 200 hours in one playthrough. The story is the smaller part. Most of the time goes into the ${L('/faq/gta-6-100-percent-completion', '100% checklist')}.`, source: G },
    { q: 'Are there online trophies?', html: 'No. Every trophy is single player, and there are no difficulty settings to worry about.', source: G },
  ],
  more: ['gta-6-100-percent-completion', 'gta-6-safe-codes', 'how-to-get-a-tank-in-gta-6'],
  card: { label: 'Trophies', big: '55', sub: '1 Platinum, about 200 hours' },
  intel: [OUT, ['/gameplay/activities', 'Activities'], ['/gameplay/collectibles', 'Collectibles']],
  index: { section: 'gameplay', q: 'What are the GTA 6 trophies?', short: '55 trophies: 1 platinum, 2 gold, 6 silver, 46 bronze, 1,000 Gamerscore on Xbox. One playthrough, about 200 hours, no online trophies. The 100% gold trophy is the grind.' },
},
];
