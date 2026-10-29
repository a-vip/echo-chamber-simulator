/**
 * The Echo Chamber Simulator - Core Simulation Engine (Balanced Pacing)
 * Real-time mathematical balancing act between Dopamine Harvesting,
 * Server Thermodynamics, and Global Civilization Tension.
 * 
 * Re-calibrated for deliberate, strategic pacing so players have ample time
 * to read satirical posts and observe systemic consequences.
 */

class SimulationEngine {
  constructor() {
    this.resetSimulation(false);
  }

  resetSimulation(isPrestige = false) {
    this.watts = 250; // Starting Neuro-Watts
    this.cash = 150;  // Starting Dopamine Dimes ($)
    this.tension = 55.0; // Society Tension (0 - 100%) - Near Goldilocks Zone (65-92%)
    this.serverTemp = 36.0; // Starting Temp in Celsius
    this.maxServerTemp = 100.0;
    this.coolingRate = 2.4; // °C natural cooling per second
    this.activeZombies = 840000000; // 840 Million Daily Active Addicts
    
    // Algorithmic Levers (Balanced defaults)
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
      rot_alpha: 55,
      rot_boomer: 55,
      cosmic_flat: 30,
      cosmic_sim: 30
    };

    this.goldilocksActive = false;
    this.rotZoneMultiplier = 1.0;
    this.rotZoneStreakSec = 0;
    this.gameTimeSec = 0;
    this.day = 1;
    this.dayLengthSec = 90; // 90 seconds per game day
    this.gameSpeed = 1.0; // 0 = Pause, 0.5 = Chill, 1.0 = Normal, 2.0 = Fast
    this.paused = false;
    this.gameOver = null;
    this.activeEnding = null;
    this.endlessMode = false;

    // Post queue & reader friendliness
    this.activeFeed = [];
    this.pendingPosts = [];
    this.isFeedHovered = false;
    this.feedMaxItems = 12;
    this.spawnTimer = 0;
    this.spawnIntervalSec = 15.0; // Engaging & readable 15.0s base interval
    this.feedStreamMode = 'auto'; // 'auto' | 'manual'

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

  setGameSpeed(speed) {
    this.gameSpeed = Math.max(0, Math.min(3.0, speed));
    this.paused = (this.gameSpeed === 0);
  }

  tick(rawDeltaSec) {
    if (this.paused || this.gameOver) return;

    // Apply game speed factor
    const deltaSec = rawDeltaSec * this.gameSpeed;
    if (deltaSec <= 0) return;

    this.gameTimeSec += deltaSec;
    this.day = Math.floor(this.gameTimeSec / this.dayLengthSec) + 1;

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
      this.rotZoneMultiplier = 5.0 * upg.rotZoneMult;
      this.rotZoneStreakSec += deltaSec;
      if (this.rotZoneStreakSec >= 45 && window.AchievementSystem) {
        window.AchievementSystem.unlock('rot_zone_survivor');
      }
    } else {
      this.goldilocksActive = false;
      this.rotZoneMultiplier = 1.0;
      this.rotZoneStreakSec = 0;
    }

    // 1. Calculate Passive Harvest Rate
    const avgFactionPolarization = Object.values(this.factionTensions).reduce((a, b) => a + b, 0) / 12;
    const baseHarvest = (avgFactionPolarization * 0.8) * (this.echoSiloing / 50) * (this.rageBias / 50);
    const effectiveHarvestPerSec = (baseHarvest + upg.passiveWatts) * this.rotZoneMultiplier * upg.harvestMult * prestigeMult;
    
    this.watts += effectiveHarvestPerSec * deltaSec;
    this.cash += (upg.passiveCash * upg.adRevMult) * deltaSec;

    // 2. Server Thermodynamics Calculation (Balanced with lively organic fluctuations)
    // Dynamic fan activity & compute load creates subtle, live temperature breathing (~34 - 38°C baseline)
    const thermalJitter = (Math.sin(this.gameTimeSec * 2.3) * 0.15) + (Math.cos(this.gameTimeSec * 4.7) * 0.1);
    const heatGeneration = ((this.rageBias / 50) * 1.9) + ((this.echoSiloing / 50) * 0.5) + (effectiveHarvestPerSec * 0.0001);
    const naturalCooling = this.coolingRate;
    const tempDelta = (heatGeneration - naturalCooling + thermalJitter) * deltaSec;
    this.serverTemp = Math.max(32.0, Math.min(this.maxServerTemp + 10, this.serverTemp + tempDelta));

    // Update audio hum based on server strain
    if (window.AudioSynth) {
      window.AudioSynth.updateServerTempHum(this.serverTemp / this.maxServerTemp);
    }

    // 3. Society Tension Drift (Gentle, with subtle cultural fluctuations so bars are visibly alive)
    const tensionJitter = (Math.sin(this.gameTimeSec * 1.8) * 0.04);
    const tensionDrift = (((this.rageBias - 50) * 0.02) + ((this.echoSiloing - 50) * 0.015)) * upg.polarizationMult;
    this.tension = Math.max(0, Math.min(100, this.tension + ((tensionDrift + tensionJitter) * deltaSec)));

    // 4. Feed Spawning Loop (Gentle 15-second base interval, adjusted slightly by siloing)
    if (this.feedStreamMode === 'auto') {
      this.spawnTimer += deltaSec;
      const effectiveInterval = Math.max(8.0, this.spawnIntervalSec - (this.echoSiloing * 0.04));
      if (this.spawnTimer >= effectiveInterval) {
        this.spawnTimer = 0;
        this.spawnNewPost();
      }
    }

    // Auto-reveal buffered posts smoothly when user un-hovers feed
    if (!this.isFeedHovered && this.pendingPosts.length > 0) {
      this.revealPendingPosts();
    }

    // 5. Update Sparkline history once per second
    if (Math.floor(this.gameTimeSec) % 1 === 0 && (!this.lastChartTick || this.gameTimeSec - this.lastChartTick >= 1.0)) {
      this.lastChartTick = this.gameTimeSec;
      this.recordHistory(effectiveHarvestPerSec);
    }

    // 6. Check Random Crisis Events & Influencer Bosses
    if (window.EventSystem) {
      window.EventSystem.checkEventTrigger(this);
    }
    if (window.BossManager) {
      window.BossManager.tick(deltaSec, this);
    }
    if (window.CriticalAlertSystem) {
      window.CriticalAlertSystem.check(this);
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
    
    // If user is hovering/reading the feed, hold in buffer to avoid jarring scroll jumps!
    if (this.isFeedHovered) {
      this.pendingPosts.unshift(newPost);
      if (this.pendingPosts.length > 8) this.pendingPosts.pop();
    } else {
      this.activeFeed.unshift(newPost);
      if (this.activeFeed.length > this.feedMaxItems) {
        this.activeFeed.pop();
      }
    }
  }

  revealPendingPosts() {
    if (!this.pendingPosts || !this.pendingPosts.length) return false;
    while (this.pendingPosts.length) {
      const p = this.pendingPosts.pop();
      this.activeFeed.unshift(p);
      if (this.activeFeed.length > this.feedMaxItems) {
        this.activeFeed.pop();
      }
    }
    return true;
  }

  toggleFeedStreamMode() {
    this.feedStreamMode = this.feedStreamMode === 'auto' ? 'manual' : 'auto';
    return this.feedStreamMode;
  }

  manualStepPost() {
    this.spawnNewPost();
    if (this.pendingPosts.length > 0) {
      this.revealPendingPosts();
    }
  }

  continuePlaying() {
    this.gameOver = null;
    this.activeEnding = null;
    this.endlessMode = true;
    this.tension = 80.0;
    this.serverTemp = 55.0;
    this.paused = false;
    if (window.AudioSynth) window.AudioSynth.playAchievementFanfare();
  }

  applyAction(action, postId) {
    const post = this.activeFeed.find(p => p.id === postId);
    if (!post || this.gameOver) return false;

    const upg = window.UpgradeManager ? window.UpgradeManager.getMultipliers() : { harvestMult: 1, adRevMult: 1 };

    // Trigger visual sprite reaction on street arena
    if (window.StreetArena) {
      window.StreetArena.triggerRally(post.factionId);
    }

    switch (action) {
      case 'BOOST':
        if (post.amplified) return false;
        post.amplified = true;
        post.stats.views *= 3;
        post.stats.angries *= 2;
        
        // Harvest immediate watts
        const wattsGained = post.energyYield * 2.2 * this.rotZoneMultiplier * upg.harvestMult;
        this.watts += wattsGained;
        
        // Gentle tension & temp nudges
        this.nudgeFactionTension(post.factionId, post.polarizationYield * 0.4);
        this.tension = Math.min(100, this.tension + (post.polarizationYield * 0.12));
        this.serverTemp += 0.4;

        if (window.AudioSynth) window.AudioSynth.playDopamineChime();
        return { type: 'BOOST', deltaWatts: wattsGained };

      case 'OUTRAGE':
        if (post.outraged) return false;
        window.PostGenerator.injectRivalQuote(post);
        
        // Outrage generates high energy with controlled tension increase
        const rageWatts = post.energyYield * 3.5 * this.rotZoneMultiplier * upg.harvestMult;
        this.watts += rageWatts;
        this.nudgeFactionTension(post.factionId, post.polarizationYield * 0.8);
        this.tension = Math.min(100, this.tension + (post.polarizationYield * 0.25));
        this.serverTemp += 0.9;

        if (window.AchievementSystem) window.AchievementSystem.unlock('first_blood_outrage');
        if (window.AudioSynth) window.AudioSynth.playRageCrunch();
        return { type: 'OUTRAGE', deltaWatts: rageWatts };

      case 'MONETIZE':
        if (post.monetized) return false;
        const rev = window.PostGenerator.attachAd(post);
        const cashEarned = rev * upg.adRevMult;
        this.cash += cashEarned;
        this.tension = Math.min(100, this.tension + 0.3); // Slight annoyance

        if (window.AchievementSystem) window.AchievementSystem.unlock('ad_pig');
        if (window.AudioSynth) window.AudioSynth.playCashChime();
        return { type: 'MONETIZE', deltaCash: cashEarned };

      case 'SHADOWBAN':
        if (post.shadowbanned) return false;
        post.shadowbanned = true;
        // Suppresses this post, gently reducing tension and temp
        this.tension = Math.max(0, this.tension - 1.8);
        this.serverTemp = Math.max(30, this.serverTemp - 1.5);
        this.cash = Math.max(0, this.cash - 5); // $5 moderation fee

        if (window.AudioSynth) window.AudioSynth.playShadowban();
        return { type: 'SHADOWBAN' };

      default:
        return false;
    }
  }

  nudgeFactionTension(factionId, amount) {
    if (this.factionTensions[factionId] !== undefined) {
      this.factionTensions[factionId] = Math.min(100, this.factionTensions[factionId] + amount);
      
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
    this.botCooldownSec = 20; // 20s cooldown

    this.activeFeed.forEach(post => {
      if (!post.outraged && Math.random() < 0.6) {
        window.PostGenerator.injectRivalQuote(post);
      }
    });

    this.tension = Math.min(100, this.tension + 4.5);
    this.serverTemp += 3.0;
    this.watts += 1200;

    if (window.AchievementSystem) window.AchievementSystem.unlock('bot_shepherd');
    if (window.AudioSynth) window.AudioSynth.playRageCrunch();
    return true;
  }

  emergencyCoolant() {
    if (this.coolantCooldownSec > 0 || this.cash < 60) return false;
    this.cash -= 60;
    this.coolantCooldownSec = 10;

    this.serverTemp = Math.max(30, this.serverTemp - 22);
    this.tension = Math.max(0, this.tension - 2.5);

    if (window.AudioSynth) window.AudioSynth.playCoolant();
    return true;
  }

  checkEndConditions() {
    if (this.endlessMode) {
      // In Endless / Sandbox Mode, clamp rather than hard terminating so player can continue indefinitely!
      if (this.tension >= 100) this.tension = 97.5;
      if (this.serverTemp >= this.maxServerTemp) this.serverTemp = this.maxServerTemp - 2.5;
      return;
    }

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
