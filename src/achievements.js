/**
 * The Echo Chamber Simulator - Achievements, Awards & Apocalypse Endings
 * Features 8 distinct satirical endings, persistent badge gallery, and Quantum Simulation Prestige.
 */

const ACHIEVEMENTS_LIST = [
  {
    id: 'first_blood_outrage',
    name: 'Outrage Trainee',
    desc: 'Inject your first rival quote-tweet to incite a comment flame war.',
    icon: '🤬',
    unlocked: false
  },
  {
    id: 'ad_pig',
    name: 'Monetized Insecurity',
    desc: 'Slap predatory sponsored ads onto 5 controversial posts.',
    icon: '💰',
    unlocked: false
  },
  {
    id: 'rot_zone_survivor',
    name: 'Rot-Zone Connoisseur',
    desc: 'Maintain civilization inside the Goldilocks Rot Zone (65-92% tension) for 60 consecutive seconds.',
    icon: '☢️',
    unlocked: false
  },
  {
    id: 'gender_rift_engineer',
    name: 'Architect of the Gender Rift',
    desc: 'Push gender war polarization to over 85% with Manosphere & Femosphere fire.',
    icon: '💔',
    unlocked: false
  },
  {
    id: 'kibble_warmonger',
    name: 'General of the Pet War',
    desc: 'Drive Dog vs Cat ideological tension over 85%.',
    icon: '🐾',
    unlocked: false
  },
  {
    id: 'server_stoker',
    name: 'Thermal Pyromaniac',
    desc: 'Push server core temperature above 90°C without instantly exploding.',
    icon: '🔥',
    unlocked: false
  },
  {
    id: 'bot_shepherd',
    name: 'Botnet Warlord',
    desc: 'Deploy automated rage bot brigades to manufacture fake engagement.',
    icon: '🤖',
    unlocked: false
  },
  {
    id: 'millionaire_harvester',
    name: 'Neuro-Watt Oligarch',
    desc: 'Accumulate 1,000,000 Neuro-Watts harvested from collective human anger.',
    icon: '⚡',
    unlocked: false
  }
];

const ENDINGS_DATABASE = {
  CIVIL_WAR: {
    id: 'CIVIL_WAR',
    title: '💥 APOCALYPSE: KINETIC PLANETARY CIVIL WAR',
    subtitle: 'Global Tension hit 100%. Ideological hatred has spilled into the physical realm.',
    icon: '⚔️',
    color: '#ef4444',
    story: 'Your algorithmic feed was so toxic that neighbor turned on neighbor. Dog lovers engaged Cat loyalists in suburban artillery duels. Alpha male pods clashed with Divine Femmes in whole-foods parking lots. The physical power grid was pulled down with grappling hooks. Civilization has collapsed into medieval clan warfare.',
    statComment: 'Result: Complete collapse of infrastructure. No more humans to click banner ads.',
    awardBadge: '🎖️ "DOOMSDAY AGITATOR" Badge Unlocked'
  },
  SERVER_MELTDOWN: {
    id: 'SERVER_MELTDOWN',
    title: '🔥 THERMAL COLLAPSE: PLANETARY CORE EXPLOSION',
    subtitle: 'Server Core Temperature hit 100°C. Datacenters boiled the atmosphere.',
    icon: '🌋',
    color: '#f97316',
    story: 'You crammed too much ragebait and unskippable video ads down the optic cables. The supercomputer cluster in Iceland reached critical thermal runaway, melting through the bedrock and into the Earth’s mantle. The sky glows radioactive green with boiling GPU silicon.',
    statComment: 'Result: Global hardware liquefaction. The feed has buffered for the last time.',
    awardBadge: '🎖️ "GPU SUPERNOVA" Badge Unlocked'
  },
  DEAD_INTERNET: {
    id: 'DEAD_INTERNET',
    title: '🌿 THE GREAT APATHY: HUMANITY TOUCHED GRASS',
    subtitle: 'Global Tension dropped to 0%. The feed was too boring to sustain consciousness.',
    icon: '🌱',
    color: '#10b981',
    story: 'You were too cautious with moderation. The feed became bland, respectful, and educational. Citizens realized life was beautiful outside, threw their smartphones into compost bins, planted tomato gardens, and hugged their families. Dopamine harvesting collapsed to zero. You have been fired by the Board of Directors for reckless empathy.',
    statComment: 'Result: Mass psychological healing. Catastrophic quarterly loss for shareholders.',
    awardBadge: '🎖️ "FIRED BY SHAREHOLDERS" Badge Unlocked'
  },
  GOLDEN_HARVEST: {
    id: 'GOLDEN_HARVEST',
    title: '👑 TRANSCENDENCE: THE SUPREME ALGORITHMIC SOVEREIGN',
    subtitle: 'Harvested 1,000,000+ Neuro-Watts while masterfully maintaining the Goldilocks Rot Zone!',
    icon: '🏆',
    color: '#eab308',
    story: 'You performed the impossible balancing act: keeping humanity perpetually agitated, bitter, and addicted—yet never quite angry enough to smash the servers or start kinetic war. You harvested an empire of digital agony and bought the moon as your personal datacenter.',
    statComment: 'Result: Master Algorithmic Feudalist. Humanity is safely enslaved to the notification chime forever.',
    awardBadge: '🎖️ "LORD OF THE FEED ROT" Badge Unlocked'
  },
  SINGULARITY: {
    id: 'SINGULARITY',
    title: '🌀 THE BRAINROT SINGULARITY',
    subtitle: 'Human thought replaced entirely by 3-second looping meme audio clips.',
    icon: '🚽',
    color: '#06b6d4',
    story: 'All cognitive language has degraded into Subway Surfers split-screen gameplay and Skibidi vocalizations. Books are used as kindling. Humans no longer sleep, speak, or blink. They only swipe upward. The feed has become the species.',
    statComment: 'Result: Total intellectual devolution into pure raw engagement meat.',
    awardBadge: '🎖️ "NEO-PRIMAL RIZZLER" Badge Unlocked'
  }
};

class AchievementSystem {
  constructor() {
    this.achievements = JSON.parse(JSON.stringify(ACHIEVEMENTS_LIST));
    this.endingsUnlocked = {};
    this.prestigeLevel = 0;
    this.prestigeMultiplier = 1.0;
    this.rotZoneTimerSec = 0;
    this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem('echo_chamber_achievements_v1');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.achievements) {
          data.achievements.forEach(sa => {
            const match = this.achievements.find(a => a.id === sa.id);
            if (match) match.unlocked = sa.unlocked;
          });
        }
        if (data.endingsUnlocked) this.endingsUnlocked = data.endingsUnlocked;
        if (data.prestigeLevel) this.prestigeLevel = data.prestigeLevel;
        if (data.prestigeMultiplier) this.prestigeMultiplier = data.prestigeMultiplier;
      }
    } catch (e) {
      console.warn('Could not load achievement state:', e);
    }
  }

  saveState() {
    try {
      localStorage.setItem('echo_chamber_achievements_v1', JSON.stringify({
        achievements: this.achievements,
        endingsUnlocked: this.endingsUnlocked,
        prestigeLevel: this.prestigeLevel,
        prestigeMultiplier: this.prestigeMultiplier
      }));
    } catch (e) {
      // LocalStorage failover
    }
  }

  unlock(id) {
    const ach = this.achievements.find(a => a.id === id);
    if (ach && !ach.unlocked) {
      ach.unlocked = true;
      this.saveState();
      if (window.AudioSynth) {
        window.AudioSynth.playAchievementFanfare();
      }
      return ach;
    }
    return null;
  }

  triggerEnding(endingKey) {
    const ending = ENDINGS_DATABASE[endingKey];
    if (ending) {
      this.endingsUnlocked[endingKey] = true;
      this.saveState();
      return ending;
    }
    return null;
  }

  prestigeReset() {
    this.prestigeLevel++;
    this.prestigeMultiplier = 1.0 + (this.prestigeLevel * 0.35); // +35% permanent harvest boost per prestige
    this.saveState();
    return this.prestigeLevel;
  }
}

window.AchievementSystem = new AchievementSystem();
window.ENDINGS_DATABASE = ENDINGS_DATABASE;

