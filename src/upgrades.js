/**
 * The Echo Chamber Simulator - Dark Patterns & Algorithmic Research Tree
 * 16 Satirical upgrades across 4 tiers with passive boosts, server thermal upgrades, and dark mechanics.
 */

const UPGRADES_DATABASE = [
  // --- TIER 1: INFANT DOPAMINE HOOKING ---
  {
    id: 'infinite_doomscroll',
    tier: 1,
    name: 'Infinite Doomscroll Frictionless Canvas',
    desc: 'Removes the footer, timestamps, and concept of linear time. Users scroll until their thumbs develop carpal tunnel.',
    costWatts: 150,
    costCash: 50,
    unlocked: false,
    effect: {
      harvestMultiplier: 1.25,
      feedSpeedBonus: 0.15,
      passiveWattsPerSec: 5
    },
    flavor: '"If they do not see the clock, 4 hours is just 4 seconds."'
  },
  {
    id: 'ghost_notifications',
    tier: 1,
    name: '3:00 AM Ghost Notification Pings',
    desc: 'Sends phantom alerts saying "Your ex mentioned you in an inflammatory comment!" while users are asleep.',
    costWatts: 300,
    costCash: 120,
    unlocked: false,
    effect: {
      harvestMultiplier: 1.35,
      passiveWattsPerSec: 12,
      baseTensionRate: 0.05
    },
    flavor: '"Cortisol is the greatest stimulant known to algorithmic science."'
  },
  {
    id: 'micro_targeted_envy',
    tier: 1,
    name: 'Micro-Targeted Envy Recommendation',
    desc: 'Ensures users only see peers who are richer, hotter, and happier than them, inducing immediate existential dread.',
    costWatts: 600,
    costCash: 250,
    unlocked: false,
    effect: {
      adRevenueMultiplier: 1.4,
      polarizationRateMultiplier: 1.2,
      passiveWattsPerSec: 20
    },
    flavor: '"Insecurity is an infinite credit card that never declines."'
  },
  {
    id: 'rage_auto_suggest',
    tier: 1,
    name: 'Aggressive Autocomplete Gaslighting',
    desc: 'Suggests the most offensive possible completions when users try to type polite compliments.',
    costWatts: 1000,
    costCash: 400,
    unlocked: false,
    effect: {
      harvestMultiplier: 1.4,
      baseTensionRate: 0.1,
      passiveWattsPerSec: 35
    },
    flavor: '"Why say Good Morning when you can say Your Bloodline Is Pathetic?"'
  },

  // --- TIER 2: TRIBAL RADICALIZATION ---
  {
    id: 'rage_bot_brigades',
    tier: 2,
    name: 'Automated Rage-Farming Bot Brigades',
    desc: 'Deploys 50,000 Russian/AI bots that quote-tweet innocuous dog photos with accusations of war crimes.',
    costWatts: 2500,
    costCash: 900,
    unlocked: false,
    effect: {
      passiveWattsPerSec: 75,
      polarizationRateMultiplier: 1.35,
      serverHeatRate: 0.08
    },
    flavor: '"They do not need to sleep, and they are always angry."'
  },
  {
    id: 'airtight_echo_chambers',
    tier: 2,
    name: 'Airtight Echo-Chamber Hermetic Seals',
    desc: 'Performs algorithmic lobotomies on users so they never encounter any differing perspective again.',
    costWatts: 4500,
    costCash: 1600,
    unlocked: false,
    effect: {
      rotZoneMultiplierBonus: 1.5, // Enhances Goldilocks rot multiplier
      harvestMultiplier: 1.5,
      passiveWattsPerSec: 120
    },
    flavor: '"Confirmation bias isn\'t a bug—it\'s our primary business model."'
  },
  {
    id: 'server_cryo_overclock',
    tier: 2,
    name: 'Liquid Fluorocarbon Server Overclock',
    desc: 'Submerges planetary servers in sub-zero coolant, raising thermal meltdown tolerance by +25°C.',
    costWatts: 6000,
    costCash: 2200,
    unlocked: false,
    effect: {
      maxServerTempBonus: 25,
      passiveCoolingBonus: 0.8
    },
    flavor: '"We are boiling the Arctic Ocean to keep the flame wars streaming."'
  },
  {
    id: 'deepfake_family_drama',
    tier: 2,
    name: 'Synthetic Family Betrayal Generator',
    desc: 'Generates believable hyper-realistic deepfake voice notes of relatives talking behind users\' backs.',
    costWatts: 9000,
    costCash: 3500,
    unlocked: false,
    effect: {
      adRevenueMultiplier: 1.6,
      polarizationRateMultiplier: 1.4,
      passiveWattsPerSec: 220
    },
    flavor: '"Blood is thicker than water, but engagement is thicker than blood."'
  },

  // --- TIER 3: NEURO-HACKING & BRAINROT ---
  {
    id: 'subway_surfer_split_screen',
    tier: 3,
    name: 'Subway Surfers Quad-Split Screen Hypnosis',
    desc: 'Every video now has soap-cutting, kinetic sand, family guy clips, and subway surfers playing simultaneously.',
    costWatts: 18000,
    costCash: 6000,
    unlocked: false,
    effect: {
      harvestMultiplier: 1.8,
      passiveWattsPerSec: 450,
      userApathyImmunity: 0.5 // Makes it much harder for society to drop into apathy
    },
    flavor: '"Attention span reduced to 0.4 seconds. Permanent dopamine lock."'
  },
  {
    id: 'predatory_ad_matrix',
    tier: 3,
    name: 'Predatory Neural Vulnerability Bidding',
    desc: 'Real-time programmatic bidding on users\' micro-second emotional breakdowns. Huge ad revenue!',
    costWatts: 28000,
    costCash: 9500,
    unlocked: false,
    effect: {
      adRevenueMultiplier: 2.2,
      passiveCashPerSec: 85,
      passiveWattsPerSec: 700
    },
    flavor: '"She just cried at 2:14 AM. Pitch her the $800 manifestation crystal."'
  },
  {
    id: 'subconscious_meme_implants',
    tier: 3,
    name: 'Subconscious Retinal Meme Implants',
    desc: 'Flashes 1-frame rage memes between pixels that register directly on the optic nerve without conscious thought.',
    costWatts: 45000,
    costCash: 15000,
    unlocked: false,
    effect: {
      harvestMultiplier: 2.2,
      baseTensionRate: 0.25,
      passiveWattsPerSec: 1200
    },
    flavor: '"Why wait for them to read when their retinas can boil instantly?"'
  },
  {
    id: 'planetary_heat_venting',
    tier: 3,
    name: 'Atmospheric Geo-Thermal Heat Shunts',
    desc: 'Vents server thermal exhaust directly into the lower stratosphere. Adds +35°C max thermal capacity.',
    costWatts: 65000,
    costCash: 22000,
    unlocked: false,
    effect: {
      maxServerTempBonus: 35,
      passiveCoolingBonus: 1.5
    },
    flavor: '"The polar bears had their chance. The feed must never buffer."'
  },

  // --- TIER 4: APOCALYPTIC TRANSCENDENCE ---
  {
    id: 'civil_war_derivatives',
    tier: 4,
    name: 'Planetary Riot & Conflict Derivative Swaps',
    desc: 'Turns kinetic street skirmishes into high-yield financial instruments. Monetize civil war in real-time!',
    costWatts: 120000,
    costCash: 45000,
    unlocked: false,
    effect: {
      adRevenueMultiplier: 3.5,
      passiveCashPerSec: 250,
      passiveWattsPerSec: 2500
    },
    flavor: '"When Sector 9 burns, our quarterly EBITDA surges 600%."'
  },
  {
    id: 'synthetic_species_split',
    tier: 4,
    name: 'Algorithmic Speciation Fork',
    desc: 'Rival factions become biologically incompatible. Men and women communicate only through AI arbiters.',
    costWatts: 220000,
    costCash: 80000,
    unlocked: false,
    effect: {
      rotZoneMultiplierBonus: 2.5,
      harvestMultiplier: 3.0,
      passiveWattsPerSec: 5000
    },
    flavor: '"Two divergent species, both staring at the same glowing rectangle."'
  },
  {
    id: 'quantum_rage_synthesizer',
    tier: 4,
    name: 'Quantum Superposition Outrage Engine',
    desc: 'Harvests outrage from parallel universes where humans made equally terrible choices.',
    costWatts: 450000,
    costCash: 160000,
    unlocked: false,
    effect: {
      harvestMultiplier: 4.5,
      passiveWattsPerSec: 12000
    },
    flavor: '"Infinite timelines, infinite arguments about pineapple on pizza."'
  },
  {
    id: 'the_hivemind_singularity',
    tier: 4,
    name: 'The Endless Dopamine Singularity',
    desc: 'Converts humanity into biological RAM sticks plugged directly into the recommendation cluster.',
    costWatts: 1000000,
    costCash: 350000,
    unlocked: false,
    effect: {
      harvestMultiplier: 10.0,
      winGameUnlocked: true,
      passiveWattsPerSec: 50000
    },
    flavor: '"Free will was an unoptimized legacy feature anyway."'
  }
];

class UpgradeManager {
  constructor() {
    this.upgrades = JSON.parse(JSON.stringify(UPGRADES_DATABASE));
  }

  getUpgrade(id) {
    return this.upgrades.find(u => u.id === id);
  }

  isUnlocked(id) {
    const up = this.getUpgrade(id);
    return up ? up.unlocked : false;
  }

  canAfford(id, currentWatts, currentCash) {
    const up = this.getUpgrade(id);
    if (!up || up.unlocked) return false;
    return currentWatts >= up.costWatts && currentCash >= up.costCash;
  }

  purchase(id, simState) {
    const up = this.getUpgrade(id);
    if (!up || up.unlocked) return false;
    if (simState.watts < up.costWatts || simState.cash < up.costCash) return false;

    simState.watts -= up.costWatts;
    simState.cash -= up.costCash;
    up.unlocked = true;

    // Apply immediate stat alterations
    if (up.effect.maxServerTempBonus) {
      simState.maxServerTemp += up.effect.maxServerTempBonus;
    }
    if (up.effect.passiveCoolingBonus) {
      simState.coolingRate += up.effect.passiveCoolingBonus;
    }

    if (window.AudioSynth) {
      window.AudioSynth.playAchievementFanfare();
    }
    return true;
  }

  getMultipliers() {
    let harvestMult = 1.0;
    let adRevMult = 1.0;
    let rotZoneMult = 1.0;
    let polarizationMult = 1.0;
    let passiveWatts = 0;
    let passiveCash = 0;

    for (const up of this.upgrades) {
      if (up.unlocked) {
        if (up.effect.harvestMultiplier) harvestMult *= up.effect.harvestMultiplier;
        if (up.effect.adRevenueMultiplier) adRevMult *= up.effect.adRevenueMultiplier;
        if (up.effect.rotZoneMultiplierBonus) rotZoneMult *= up.effect.rotZoneMultiplierBonus;
        if (up.effect.polarizationRateMultiplier) polarizationMult *= up.effect.polarizationRateMultiplier;
        if (up.effect.passiveWattsPerSec) passiveWatts += up.effect.passiveWattsPerSec;
        if (up.effect.passiveCashPerSec) passiveCash += up.effect.passiveCashPerSec;
      }
    }

    return {
      harvestMult,
      adRevMult,
      rotZoneMult,
      polarizationMult,
      passiveWatts,
      passiveCash
    };
  }

  reset() {
    this.upgrades = JSON.parse(JSON.stringify(UPGRADES_DATABASE));
  }
}

window.UpgradeManager = new UpgradeManager();
