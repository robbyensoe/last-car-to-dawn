// LAST CAR TO DAWN — tuning constants.
// One night, three scores, and a building that remembers: the ALARM meter is
// what the night feels like right now; EVIDENCE is what it will remember
// tomorrow; HEAT is what tomorrow charges you for it.

export const VIEW_W = 1180;
export const VIEW_H = 640;

export const INK = {
  floor: '#2b2119',        // espresso marble, lifted so the room reads
  floorAlt: '#362a1e',
  wall: '#8c6d1f',         // antique brass
  wallEdge: '#c9a227',
  cover: '#54401f',        // walnut furniture, warm against the floor
  coverEdge: '#97753f',
  thief: '#f5f0e1',        // ivory — a tuxedo in the dark
  thiefShade: '#cfc7ae',
  warden: '#7a1e2b',       // bordeaux uniforms
  wardenDark: '#57141e',
  boss: '#4a2a6a',         // the pit boss wears violet
  sense: '#35d0ba',        // jade — every sensor in the building
  senseDim: 'rgba(53,208,186,0.16)',
  loot: '#ffdf00',         // lemon gold
  alarm: '#e84034',
  evidence: '#f5b23c',
  paper: '#f5f0e1',
  mute: '#9a8f78',
  glass: '#3d5a66',
};

export const THIEF = {
  walk: 148,
  sneak: 82,
  radius: 11,
  noiseWalk: 74,           // px a walking step carries
  noiseSneak: 0,
};

export const WARDEN = {
  patrol: 62,
  pursue: 158,
  sightIn: 168,            // inner cone: full detection rate
  sightOut: 232,
  coneHalf: 0.42,          // radians
  fillIn: 118,             // detection per second, inner cone
  fillOut: 42,
  drain: 30,
  suspectAt: 40,           // investigate
  chaseAt: 100,
  catchDist: 24,
  radioDelay: 1.2,         // s of headset wind-up before a sighting propagates
  radioRange: 260,
};

export const EYE = {         // the cameras ("Eyes")
  range: 196,
  halfAngle: 0.31,
  sweepArc: 0.85,
  sweepRate: 0.55,
  feedIn: 40,              // alarm per second, inner fan
  feedOut: 18,
  deadDisc: 30,            // stand here and it cannot see you
};

export const METERS = {
  drain: 9,                // alarm per second once clear
  drainDelay: 2.5,
  tierAlert: 60,           // wardens +25% speed, converging
  lockdownAt: 100,
  sealSeconds: 12,         // exit sealed in a lockdown
  escapeClock: 45,         // seconds to reach the exit once it starts
};

export const PROOF = {       // evidence: the building's long memory
  guardIn: 6, guardOut: 2.5,   // per second seen
  eye: 4,                      // per second on camera
  laser: 8,
  investigate: 5,              // once per warden
  chase: 15,                   // once per warden
  litLoot: 3,                  // a bag lifted from a lit pedestal
  noticed: 25, identified: 50, manhunt: 75,
};

export const TOOLS = {
  blackoutSeconds: 6,      // E: every Eye dark, laser ring down
  cleanerCut: 20,          // C: evidence removed per clean
  cleanerChannel: 2.5,     // s standing in a dead disc
};
