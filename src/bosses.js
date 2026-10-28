/**
 * The Echo Chamber Simulator - Influencer Boss Encounters
 * High-threat "Megaphone Influencer" boss cards with special hazard mechanics,
 * live timers, and tactical counters (Bribe, Quote-Bomb, Super-Shadowban).
 */

const BOSS_PROFILES = [
  {
    id: 'boss_andrew_tallow',
    name: 'Andrew Tallow',
    handle: '@RawSpleenKing',
    faction: 'gender_alpha',
    icon: '🗿',
    theme: '#3b82f6',
    title: '👑 APEX INFLUENCER: 96-HOUR JAWLINE STREAM',
    dialogue: 'IF YOU ARE NOT SWALLOWING UNPASTEURIZED YAK TALLOW AT 3:45 AM, YOU ARE AN NPC IN MY MATRIX. BENCH PRESS PROGRESSION IS LAW.',
    durationSec: 25,
    passiveTensionPerSec: 0.6,
    passiveTempPerSec: 0.5,
    bribeCost: 100,
    bribeRewardCash: 350,
    swarmCostWatts: 500,
    swarmRewardWatts: 4500
  },
  {
    id: 'boss_goddess_manifesta',
    name: 'Goddess Manifesta',
    handle: '@CosmicTrustFund777',
    faction: 'gender_femme',
    icon: '💅',
    theme: '#ec4899',
    title: '✨ CELESTIAL SIREN: $1,200 FIRST DATE DECREE',
    dialogue: 'Sprinkle sprinkle! Any male who does not wire his quarterly earnings directly to my manifestation crystal fund will have his root chakra blocked for 3 reincarnations.',
    durationSec: 25,
    passiveTensionPerSec: 0.7,
    passiveTempPerSec: 0.4,
    bribeCost: 120,
    bribeRewardCash: 420,
    swarmCostWatts: 600,
    swarmRewardWatts: 5000
  },
  {
    id: 'boss_skibidi_pope',
    name: 'The Skibidi Pontiff',
    handle: '@OhioVatican',
    faction: 'rot_alpha',
    icon: '🚽',
    theme: '#06b6d4',
    title: '🌀 BRAINROT MONARCH: GLOBAL AURA FORECLOSURE',
    dialogue: 'CHAT IS THIS REAL? BABY GRONK JUST FANUM TAXED THE SUN. SUBWAY SURFERS QUAD SCREEN BROADCASTING TO EVERY TV ON EARTH NO CAP ONG FR FR.',
    durationSec: 22,
    passiveTensionPerSec: 0.5,
    passiveTempPerSec: 0.8,
    bribeCost: 90,
    bribeRewardCash: 300,
    swarmCostWatts: 450,
    swarmRewardWatts: 4000
  },
  {
    id: 'boss_general_whiskers',
    name: 'Lord Barnaby',
    handle: '@PharaohFeline',
    faction: 'pet_cat',
    icon: '🐱',
    theme: '#a855f7',
    title: '🐾 SUPREME FELINE: SUBURBAN KIBBLE EMBARGO',
    dialogue: 'CANINES ARE PROHIBITED WITHIN 500 METERS OF CARDINAL FURNITURE. ALL MUNICIPAL TUNA FACTORIES ARE NOW UNDER FELINE REQUISITION.',
    durationSec: 24,
    passiveTensionPerSec: 0.6,
    passiveTempPerSec: 0.4,
    bribeCost: 110,
    bribeRewardCash: 380,
    swarmCostWatts: 550,
    swarmRewardWatts: 4800
  },
  {
    id: 'boss_elon_rust',
    name: 'Elon Rust',
    handle: '@HyperMarsSovereign',
    faction: 'tech_corp',
    icon: '🤖',
    theme: '#10b981',
    title: '⚡ TECHNO-FEUDAL EMPEROR: AIR SUBSCRIPTION TIER',
    dialogue: 'Starting tomorrow, Earth atmospheric nitrogen is gated behind our $19.99/mo verified premium badge. Unverified breathers will be throttled at 480p.',
    durationSec: 26,
    passiveTensionPerSec: 0.7,
    passiveTempPerSec: 0.6,
    bribeCost: 130,
    bribeRewardCash: 500,
    swarmCostWatts: 650,
    swarmRewardWatts: 5500
  }
];

class BossManager {
  constructor() {
    this.activeBoss = null;
    this.bossTimer = 0;
    this.nextBossSpawnTime = Date.now() + 65000; // First boss after 65s
    this.bossHistory = [];
  }

  tick(deltaSec, simState) {
    if (this.activeBoss) {
      this.bossTimer -= deltaSec;

      // Passive boss effects
      simState.tension = Math.min(100, simState.tension + (this.activeBoss.passiveTensionPerSec * deltaSec));
      simState.serverTemp = Math.min(simState.maxServerTemp + 5, simState.serverTemp + (this.activeBoss.passiveTempPerSec * deltaSec));

      if (this.bossTimer <= 0) {
        // Boss expired without counter
        this.resolveBoss('EXPIRED', simState);
      }
    } else {
      const now = Date.now();
      if (now >= this.nextBossSpawnTime && !simState.gameOver && !simState.paused) {
        this.spawnRandomBoss(simState);
      }
    }
  }

  spawnRandomBoss(simState) {
    const unpicked = BOSS_PROFILES.filter(b => b.id !== (this.bossHistory[this.bossHistory.length - 1] || ''));
    const boss = unpicked[Math.floor(Math.random() * unpicked.length)] || BOSS_PROFILES[0];
    
    this.activeBoss = JSON.parse(JSON.stringify(boss));
    this.bossTimer = boss.durationSec;
    this.bossHistory.push(boss.id);
    this.nextBossSpawnTime = Date.now() + 75000 + (Math.random() * 30000); // 75-105s cooldown

    if (window.AudioSynth) {
      window.AudioSynth.playAlarm();
    }
    if (window.EventSystem) {
      window.EventSystem.breakingTicker = `🔥 INFLUENCER ALERT: ${this.activeBoss.name} IS LIVE!`;
    }

    return this.activeBoss;
  }

  counterBribe(simState) {
    if (!this.activeBoss || simState.cash < this.activeBoss.bribeCost) return false;
    simState.cash -= this.activeBoss.bribeCost;
    simState.cash += this.activeBoss.bribeRewardCash;
    simState.tension = Math.max(0, simState.tension - 6.0);
    simState.serverTemp = Math.max(30, simState.serverTemp - 4.0);

    const bossName = this.activeBoss.name;
    this.resolveBoss('BRIBED', simState);

    if (window.AudioSynth) window.AudioSynth.playCashChime();
    if (window.EventSystem) {
      window.EventSystem.breakingTicker = `FEED LOG: ${bossName} accepted corporate sponsorship and pacified!`;
    }
    return true;
  }

  counterQuoteSwarm(simState) {
    if (!this.activeBoss || simState.watts < this.activeBoss.swarmCostWatts) return false;
    simState.watts -= this.activeBoss.swarmCostWatts;
    simState.watts += this.activeBoss.swarmRewardWatts;
    simState.tension = Math.min(100, simState.tension + 3.0);
    simState.serverTemp += 2.0;

    const bossName = this.activeBoss.name;
    this.resolveBoss('SWARMED', simState);

    if (window.AudioSynth) window.AudioSynth.playRageCrunch();
    if (window.EventSystem) {
      window.EventSystem.breakingTicker = `FEED LOG: Counter-meme swarm overwhelmed ${bossName}! Huge Watts harvested!`;
    }
    return true;
  }

  counterSuperShadowban(simState) {
    if (!this.activeBoss || simState.cash < 40) return false;
    simState.cash -= 40;
    simState.tension = Math.max(0, simState.tension - 10.0);
    simState.serverTemp = Math.max(30, simState.serverTemp - 12.0);

    const bossName = this.activeBoss.name;
    this.resolveBoss('SHADOWBANNED', simState);

    if (window.AudioSynth) window.AudioSynth.playShadowban();
    if (window.EventSystem) {
      window.EventSystem.breakingTicker = `FEED LOG: Super-Shadowban deployed! ${bossName} throttled to oblivion.`;
    }
    return true;
  }

  resolveBoss(outcome, simState) {
    this.activeBoss = null;
    this.bossTimer = 0;
  }
}

window.BossManager = new BossManager();
window.BOSS_PROFILES = BOSS_PROFILES;
