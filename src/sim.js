/**
 * The Echo Chamber Simulator - Core Simulation Engine
 * Drives the real-time mathematical balancing act between Dopamine Harvesting,
 * Server Thermodynamics, and Global Civilization Tension.
 */

class SimulationEngine {
  constructor() {
    this.resetSimulation(false);
  }

  resetSimulation(isPrestige = false) {
    this.watts = 100; // Starting Neuro-Watts
    this.cash = 50;   // Starting Dopamine Dimes ($)
    this.tension = 50; // Society Tension (0 - 100%)
    this.serverTemp = 42.0; // Starting Temp in Celsius
    this.maxServerTemp = 100.0;
    this.coolingRate = 1.2; // °C passive cooling per second
    this.activeZombies = 840000000; // 840 Million Daily Active Addicts
    
    // Algorithmic Levers
    this.echoSiloing = 50; // 0 - 100%
    this.rageBias = 50;    // 0 - 100%

    // Faction tension meters (0 - 100)
    this.factionTensions = {
      gender_alpha: 50,
      gender_femme: 50,
      tech_corp: 40,
      tech_luddite: 40,
      pet_cat: 45,
      pet_dog: 45,
      diet_carnivore: 35,
      diet_vegan: 35,
      rot_alpha: 60,
      rot_boomer: 60,
      cosmic_flat: 30,
      cosmic_sim: 30
    };

    this.goldilocksActive = false;
    this.rotZoneMultiplier = 1.0;
    this.rotZoneStreakSec = 0;
    this.gameTimeSec = 0;
    this.day = 1;
    this.paused = false;
    this.gameOver = null;
    this.activeEnding = null;

    // Post queue in memory
    this.activeFeed = [];
    this.feedMaxItems = 12;
    this.spawnTimer = 0;
    this.spawnIntervalSec = 3.5; // New post every 3.5s base

    // Stats history for sparkline charts
    this.history = {
      tension: [],
      serverTemp: [],
      wattsRate: [],
      maxPoints: 40
    };

    // Bot deployment cooldown
    this.botCooldownSec = 0;
    this.coolantCooldownSec = 0;

    if (isPrestige) {
      if (window.AchievementSystem) {
        window.AchievementSystem.prestigeReset();
      }
      if (window.UpgradeManager) {
        window.UpgradeManager.reset();
      }
    }

    // Seed initial posts
    this.seedInitialFeed();
  }

  seedInitialFeed() {
    this.activeFeed = [];
    if (window.PostGenerator) {
      for (let i = 0; i < 4; i++) {
        this.activeFeed.push(window.PostGenerator.generatePost());
      }
    }
  }

  tick(deltaSec) {
    if (this.paused || this.gameOver) return;

    this.gameTimeSec += deltaSec;
    this.day = Math.floor(this.gameTimeSec / 45) + 1; // 45 seconds per game day

    // Cooldown timers
    if (this.botCooldownSec > 0) this.botCooldownSec = Math.max(0, this.botCooldownSec - deltaSec);
    if (this.coolantCooldownSec > 0) this.coolantCooldownSec = Math.max(0, this.coolantCooldownSec - deltaSec);

    // Fetch Upgrades Multipliers
    const upg = window.UpgradeManager ? window.UpgradeManager.getMultipliers() : {
      harvestMult: 1.0,
      adRevMult: 1.0,
      rotZoneMult: 1.0,
      polarizationMult: 1.0,
      passiveWatts: 0,
      passiveCash: 0
    };

    const prestigeMult = window.AchievementSystem ? window.AchievementSystem.prestigeMultiplier : 1.0;

    // Check Goldilocks Rot Zone (65% <= Tension <= 92%)
    if (this.tension >= 65 && this.tension <= 92) {
      this.goldilocksActive = true;
      this.rotZoneMultiplier = 4.0 * upg.rotZoneMult;
      this.rotZoneStreakSec += deltaSec;
      if (this.rotZoneStreakSec >= 60 && window.AchievementSystem) {
        window.AchievementSystem.unlock('rot_zone_survivor');
      }
    } else {
      this.goldilocksActive = false;
      this.rotZoneMultiplier = 1.0;
      this.rotZoneStreakSec = 0;
    }

    // 1. Calculate Passive Harvest Rate
    // Base harvest depends on active users and polarization
    const avgFactionPolarization = Object.values(this.factionTensions).reduce((a, b) => a + b, 0) / 12;
    const baseHarvest = (avgFactionPolarization * 1.5) * (this.echoSiloing / 50) * (this.rageBias / 50);
    const effectiveHarvestPerSec = (baseHarvest + upg.passiveWatts) * this.rotZoneMultiplier * upg.harvestMult * prestigeMult;
    
    this.watts += effectiveHarvestPerSec * deltaSec;
    this.cash += (upg.passiveCash * upg.adRevMult) * deltaSec;

    // 2. Server Thermodynamics Calculation
    // Heat increases from Rage bias, feed throughput, and bot brigades
    const heatGeneration = (this.rageBias * 0.08) + (effectiveHarvestPerSec * 0.0012) + (this.echoSiloing * 0.04);
    const naturalCooling = this.coolingRate;
    const tempDelta = (heatGeneration - naturalCooling) * deltaSec;
    this.serverTemp = Math.max(22.0, this.serverTemp + tempDelta);

    // Update audio hum based on server strain
    if (window.AudioSynth) {
      window.AudioSynth.updateServerTempHum(this.serverTemp / this.maxServerTemp);
    }

    // 3. Society Tension Drift
    // If rage bias is high, tension climbs. If echo chambers are low and rage is low, tension cools.
    const tensionDrift = ((this.rageBias - 40) * 0.05 + (this.echoSiloing - 45) * 0.04) * upg.polarizationMult;
    this.tension = Math.max(0, Math.min(100, this.tension + (tensionDrift * deltaSec)));

    // 4. Feed Spawning Loop
    this.spawnTimer += deltaSec;
    const effectiveInterval = Math.max(1.2, this.spawnIntervalSec - (this.echoSiloing * 0.015));
    if (this.spawnTimer >= effectiveInterval) {
      this.spawnTimer = 0;
      this.spawnNewPost();
    }

    // 5. Update Sparkline history once per second
    if (Math.floor(this.gameTimeSec) % 1 === 0 && (!this.lastChartTick || this.gameTimeSec - this.lastChartTick >= 1.0)) {
      this.lastChartTick = this.gameTimeSec;
      this.recordHistory(effectiveHarvestPerSec);
    }

    // 6. Check Random Crisis Events
    if (window.EventSystem) {
      window.EventSystem.checkEventTrigger(this);
    }

    // 7. Check Milestones & End Conditions
    this.checkEndConditions();
  }

  recordHistory(currentRate) {
    this.history.tension.push(this.tension);
    this.history.serverTemp.push(this.serverTemp);
    this.history.wattsRate.push(currentRate);

    if (this.history.tension.length > this.history.maxPoints) {
      this.history.tension.shift();
      this.history.serverTemp.shift();
      this.history.wattsRate.shift();
    }
  }

  spawnNewPost() {
    if (!window.PostGenerator) return;
    const newPost = window.PostGenerator.generatePost();
    
    // Add to top of feed
    this.activeFeed.unshift(newPost);
    if (this.activeFeed.length > this.feedMaxItems) {
      this.activeFeed.pop();
    }
  }

  applyAction(action, postId) {
    const post = this.activeFeed.find(p => p.id === postId);
    if (!post || this.gameOver) return false;

    const upg = window.UpgradeManager ? window.UpgradeManager.getMultipliers() : { harvestMult: 1, adRevMult: 1 };

    switch (action) {
      case 'BOOST':
        if (post.amplified) return false;
        post.amplified = true;
        post.stats.views *= 3;
        post.stats.angries *= 2;
        
        // Harvest immediate watts
        const wattsGained = post.energyYield * 2.5 * this.rotZoneMultiplier * upg.harvestMult;
        this.watts += wattsGained;
        
        // Increase specific faction tension & global tension
        this.nudgeFactionTension(post.factionId, post.polarizationYield);
        this.tension = Math.min(100, this.tension + (post.polarizationYield * 0.4));
        this.serverTemp += 1.8;

        if (window.AudioSynth) window.AudioSynth.playDopamineChime();
        return { type: 'BOOST', deltaWatts: wattsGained };

      case 'OUTRAGE':
        if (post.outraged) return false;
        window.PostGenerator.injectRivalQuote(post);
        
        // Outrage generates massive energy and big spike in tension
        const rageWatts = post.energyYield * 4.0 * this.rotZoneMultiplier * upg.harvestMult;
        this.watts += rageWatts;
        this.nudgeFactionTension(post.factionId, post.polarizationYield * 2);
        this.tension = Math.min(100, this.tension + (post.polarizationYield * 0.9));
        this.serverTemp += 3.5;

        if (window.AchievementSystem) window.AchievementSystem.unlock('first_blood_outrage');
        if (window.AudioSynth) window.AudioSynth.playRageCrunch();
        return { type: 'OUTRAGE', deltaWatts: rageWatts };

      case 'MONETIZE':
        if (post.monetized) return false;
        const rev = window.PostGenerator.attachAd(post);
        const cashEarned = rev * upg.adRevMult;
        this.cash += cashEarned;
        this.tension = Math.min(100, this.tension + 1.5); // Ads annoy users slightly

        if (window.AchievementSystem) window.AchievementSystem.unlock('ad_pig');
        if (window.AudioSynth) window.AudioSynth.playCashChime();
        return { type: 'MONETIZE', deltaCash: cashEarned };

      case 'SHADOWBAN':
        if (post.shadowbanned) return false;
        post.shadowbanned = true;
        // Suppresses this post, reducing tension and temp slightly
        this.tension = Math.max(0, this.tension - 4.5);
        this.serverTemp = Math.max(20, this.serverTemp - 3.0);
        // Costs a small moderation fee
        this.cash = Math.max(0, this.cash - 15);

        if (window.AudioSynth) window.AudioSynth.playShadowban();
        return { type: 'SHADOWBAN' };

      default:
        return false;
    }
  }

  nudgeFactionTension(factionId, amount) {
    if (this.factionTensions[factionId] !== undefined) {
      this.factionTensions[factionId] = Math.min(100, this.factionTensions[factionId] + amount);
      
      // Check faction-specific achievements
      if (window.AchievementSystem) {
        if ((factionId === 'gender_alpha' || factionId === 'gender_femme') && this.factionTensions[factionId] >= 85) {
          window.AchievementSystem.unlock('gender_rift_engineer');
        }
        if ((factionId === 'pet_cat' || factionId === 'pet_dog') && this.factionTensions[factionId] >= 85) {
          window.AchievementSystem.unlock('kibble_warmonger');
        }
      }
    }
  }

  deployBotBrigade() {
    if (this.botCooldownSec > 0 || this.cash < 80) return false;
    this.cash -= 80;
    this.botCooldownSec = 15; // 15s cooldown

    // Instantly inject rage replies into all current visible posts
    this.activeFeed.forEach(post => {
      if (!post.outraged && Math.random() < 0.75) {
        window.PostGenerator.injectRivalQuote(post);
      }
    });

    this.tension = Math.min(100, this.tension + 12);
    this.serverTemp += 8;
    this.watts += 1500;

    if (window.AchievementSystem) window.AchievementSystem.unlock('bot_shepherd');
    if (window.AudioSynth) window.AudioSynth.playRageCrunch();
    return true;
  }

  emergencyCoolant() {
    if (this.coolantCooldownSec > 0 || this.cash < 60) return false;
    this.cash -= 60;
    this.coolantCooldownSec = 8;

    this.serverTemp = Math.max(25, this.serverTemp - 28);
    this.tension = Math.max(0, this.tension - 6);

    if (window.AudioSynth) window.AudioSynth.playCoolant();
    return true;
  }

  checkEndConditions() {
    if (this.gameOver) return;

    // 1. Civil War: Tension >= 100%
    if (this.tension >= 100) {
      this.triggerEnding('CIVIL_WAR');
      return;
    }

    // 2. Planetary Server Core Meltdown: Temp >= MaxServerTemp
    if (this.serverTemp >= this.maxServerTemp) {
      this.triggerEnding('SERVER_MELTDOWN');
      return;
    }

    // 3. Dead Internet / Apathy: Tension <= 0%
    if (this.tension <= 0) {
      this.triggerEnding('DEAD_INTERNET');
      return;
    }

    // 4. The Golden Harvest: Harvested 1,000,000 Watts
    if (this.watts >= 1000000) {
      if (window.AchievementSystem) window.AchievementSystem.unlock('millionaire_harvester');
      this.triggerEnding('GOLDEN_HARVEST');
      return;
    }

    // Check temp milestone
    if (this.serverTemp >= 90 && window.AchievementSystem) {
      window.AchievementSystem.unlock('server_stoker');
    }
  }

  triggerEnding(endingKey) {
    this.gameOver = endingKey;
    if (window.AchievementSystem) {
      this.activeEnding = window.AchievementSystem.triggerEnding(endingKey);
    }
    if (window.AudioSynth) {
      window.AudioSynth.playAlarm();
    }
  }
}

window.SimulationEngine = new SimulationEngine();
