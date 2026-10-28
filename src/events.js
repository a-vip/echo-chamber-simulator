/**
 * The Echo Chamber Simulator - Dynamic Crisis Events & Algorithmic Decrees
 * Satirical breaking dilemmas that force the player to make dystopian platform management choices.
 */

const CRISIS_EVENTS = [
  {
    id: 'evt_alpha_livestream',
    title: '🚨 CRISIS: THE 72-HOUR ALPHA PODCAST SPRINT',
    headline: 'Alpha influencer @MarrowOverMind has been screaming about jawline bone density for 48 straight hours. 4 million men refuse to go to work.',
    desc: 'The stream is generating astronomical dopamine engagement, but female users are threatening a mass digital exodus and reporting him to the UN.',
    choiceA: {
      label: '🚀 PIN TO EVERY HOMEPAGE (+12,000 Watts, +18% Tension)',
      wattsDelta: 12000,
      cashDelta: 500,
      tensionDelta: 18,
      tempDelta: 8,
      log: 'You promoted the Alpha Podcast to everyone. Female users are organizing international boycott rallies.'
    },
    choiceB: {
      label: '🛡️ DEMOTE & AUTO-PLAY HEALING CRYSTAL ADS (+35% Cash, -12% Tension)',
      wattsDelta: -2000,
      cashDelta: 1500,
      tensionDelta: -12,
      tempDelta: -6,
      log: 'You throttled the podcast and ran luxury spa ads. The manosphere is crying censorship, but cooling prevails.'
    }
  },
  {
    id: 'evt_kibble_riot',
    title: '🐱 BARK VS PURR: THE SECTOR 7 PET JIHAD',
    headline: 'A viral video of Lord Barnaby swatting a Golden Retriever pup has triggered armed standoff in the suburbs.',
    desc: 'Cat Zealots claim divine feline authority; Canine Tactical Goodboys have blockaded the regional PetSmart distribution centers.',
    choiceA: {
      label: '💣 OUTRAGE BOOST: RELEASE 1080p SLOW-MO OF THE SLAP (+18,000 Watts, +22% Tension)',
      wattsDelta: 18000,
      cashDelta: 800,
      tensionDelta: 22,
      tempDelta: 12,
      log: 'The slow-mo slap went hyper-viral. Dog owners are digging defensive perimeter trenches in front yards.'
    },
    choiceB: {
      label: '🕊️ PUSH WHOLESOME "PUPPY & KITTEN NAPPING" AI MONTAGE (-15% Tension, Cools Servers)',
      wattsDelta: -4000,
      cashDelta: -200,
      tensionDelta: -16,
      tempDelta: -14,
      log: 'A soothing kitten-puppy video diffused the riots. Engagement dropped, but servers breathed a sigh of relief.'
    }
  },
  {
    id: 'evt_luddite_emp',
    title: '🍄 MOSS MONKS CUT HIGHWAY FIBER-OPTIC CABLE',
    headline: 'Neo-Luddites used stone axes to sever a transatlantic data cable to "free human souls from the digital web".',
    desc: 'Latency is spiking by 300ms. Techno-feudalists demand automated drone strikes on the forest communes.',
    choiceA: {
      label: '🤖 TOKENIZE THE RETALIATION DRONE LIVESTREAM (+$3,200 Cash, +15% Tension)',
      wattsDelta: 15000,
      cashDelta: 3200,
      tensionDelta: 15,
      tempDelta: 14,
      log: 'You monetized the drone raid with pay-per-view access. Investors applaud the disruptive monetization model.'
    },
    choiceB: {
      label: '🪵 REBRAND LUDDITISM AS "MINDFUL SILICON DETOX" LUXURY RETREATS (+$1,800 Cash, -8% Tension)',
      wattsDelta: 6000,
      cashDelta: 1800,
      tensionDelta: -8,
      tempDelta: -5,
      log: 'You co-opted the rebellion into a $4,000 weekend retreat. Rebellion neutralised through bourgeois commodification.'
    }
  },
  {
    id: 'evt_boomer_fentanyl_magnet',
    title: '🦅 "FENTANYL IN FRIDGE MAGNETS" SPREADS TO 90M BOOMERS',
    headline: 'Grandmother Brenda’s Facebook warning about communist magnetic drug particles has been shared 42 million times.',
    desc: 'Senior citizens across the continent are hurling their kitchen refrigerators into municipal streets with crowbars.',
    choiceA: {
      label: '📢 PUSH "EMERGENCY WOODEN FRIDGE" AFFILIATE SPONSORSHIPS (+$4,500 Cash, +16% Tension)',
      wattsDelta: 22000,
      cashDelta: 4500,
      tensionDelta: 16,
      tempDelta: 10,
      log: 'Affiliate links for non-magnetic Amish cedar boxes sold out in 12 minutes. Pure profit generated from sheer panic.'
    },
    choiceB: {
      label: '🔍 ADD FACT-CHECK LABEL: "FRIDGE MAGNETS DO NOT CAUSE NARCOSIS" (-10% Tension, -1,500 Watts)',
      wattsDelta: -1500,
      cashDelta: -300,
      tensionDelta: -10,
      tempDelta: -4,
      log: 'The fact-check label was universally condemned as Deep State propaganda, but calmed some local HOA meetings.'
    }
  },
  {
    id: 'evt_liver_blackout',
    title: '🥩 PRIMAL GURU DETOXES FROM 4 YEARS OF RAW BISON SPLEEN',
    headline: 'Primal influencer collapses on 4K stream after admitting he secretly ate an organic blueberry.',
    desc: 'Carnivores are burning their gym memberships in existential grief; Vegans are declaring cosmic victory across all hashtags.',
    choiceA: {
      label: '🔥 HOST A 12-SPEAKER LIVE AUDIO FLAME DEBATE (+28,000 Watts, +20% Tension)',
      wattsDelta: 28000,
      cashDelta: 2200,
      tensionDelta: 20,
      tempDelta: 15,
      log: 'The screaming audio spaces collapsed 3 regional cellular networks. Engagement numbers set an all-time record.'
    },
    choiceB: {
      label: '🌿 SHUT DOWN CHAT & PROMOTE DECAF CHAI SPONSORS (+$1,200 Cash, -14% Tension)',
      wattsDelta: 3000,
      cashDelta: 1200,
      tensionDelta: -14,
      tempDelta: -8,
      log: 'You cooled down the nutrition war with calming herbal tea promotions.'
    }
  },
  {
    id: 'evt_subway_surfer_shortage',
    title: '🌀 TIKTOK SHORTAGE: RUN OUT OF DUAL-SCREEN SUBWAY SURFERS CLIPS',
    headline: 'Gen-Alpha attention spans threaten to detach as video creators run out of split-screen mobile game footage.',
    desc: 'Children under 16 are staring at blank walls in acute sensory withdrawal syndrome.',
    choiceA: {
      label: '⚡ AI-SYNTHESIZE 100,000 HOURS OF NEON SOAP-CUTTING (+35,000 Watts, +15°C Server Temp)',
      wattsDelta: 35000,
      cashDelta: -1200,
      tensionDelta: 8,
      tempDelta: 18,
      log: 'You saturated the feed with synthetic kinetic sand hypnosis. The youth are pacified into catatonia.'
    },
    choiceB: {
      label: '📚 INJECT 5 SECONDS OF REALITY: "GO TOUCH OUTSIDE GRASS" (-25% Tension, -10,000 Watts)',
      wattsDelta: -10000,
      cashDelta: -800,
      tensionDelta: -25,
      tempDelta: -15,
      log: 'Users looked out the window and noticed birds. Tension plummeted, but our quarterly active metric cratered!'
    }
  }
];

class EventSystem {
  constructor() {
    this.events = JSON.parse(JSON.stringify(CRISIS_EVENTS));
    this.activeCrisis = null;
    this.lastEventTime = Date.now();
    this.eventCooldownMs = 45000; // An event every ~45 seconds
    this.breakingTicker = 'BREAKING: ALGORITHMIC ENGAGEMENT ENGINE STABLE. HARVESTING NEURO-WATTS...';
  }

  checkEventTrigger(simState) {
    if (this.activeCrisis) return null;
    const now = Date.now();

    // Trigger sooner if tension is in dangerous zones
    const effectiveCooldown = (simState.tension > 80 || simState.serverTemp > 75) 
      ? 25000 
      : this.eventCooldownMs;

    if (now - this.lastEventTime > effectiveCooldown) {
      if (Math.random() < 0.65) {
        this.lastEventTime = now;
        return this.triggerRandomCrisis();
      }
    }
    return null;
  }

  triggerRandomCrisis() {
    const evt = this.events[Math.floor(Math.random() * this.events.length)];
    this.activeCrisis = evt;
    this.breakingTicker = `🔥 ALERT: ${evt.headline.toUpperCase()}`;
    if (window.AudioSynth) {
      window.AudioSynth.playAlarm();
    }
    return evt;
  }

  resolveCrisis(choiceKey, simState) {
    if (!this.activeCrisis) return null;
    const choice = choiceKey === 'A' ? this.activeCrisis.choiceA : this.activeCrisis.choiceB;

    // Apply outcomes
    simState.watts = Math.max(0, simState.watts + choice.wattsDelta);
    simState.cash = Math.max(0, simState.cash + choice.cashDelta);
    simState.tension = Math.max(0, Math.min(100, simState.tension + choice.tensionDelta));
    simState.serverTemp = Math.max(20, Math.min(simState.maxServerTemp + 10, simState.serverTemp + choice.tempDelta));

    const logEntry = choice.log;
    const prevCrisis = this.activeCrisis;
    this.activeCrisis = null;
    this.lastEventTime = Date.now();
    this.breakingTicker = `FEED LOG: ${logEntry}`;

    // Play Animated Consequence Cutscene
    if (window.ConsequencePlayer) {
      const isRiot = choice.tensionDelta > 0 || choice.tempDelta > 0;
      const isMoney = choice.cashDelta >= 500;
      const isCool = choice.tempDelta < 0;
      let animType = 'riot';
      if (isMoney) animType = 'money_rain';
      else if (isCool) animType = 'freeze';
      else if (choice.tensionDelta < 0) animType = 'peace';

      const statDeltas = [];
      if (choice.wattsDelta !== 0) {
        statDeltas.push({
          text: `${choice.wattsDelta > 0 ? '+' : ''}${choice.wattsDelta.toLocaleString()}⚡`,
          colorClass: choice.wattsDelta > 0 ? 'bg-amber-900/60 text-amber-300' : 'bg-zinc-800 text-zinc-400'
        });
      }
      if (choice.cashDelta !== 0) {
        statDeltas.push({
          text: `${choice.cashDelta > 0 ? '+' : ''}$${choice.cashDelta.toLocaleString()}💵`,
          colorClass: choice.cashDelta > 0 ? 'bg-emerald-900/60 text-emerald-300' : 'bg-red-900/60 text-red-300'
        });
      }
      if (choice.tensionDelta !== 0) {
        statDeltas.push({
          text: `${choice.tensionDelta > 0 ? '+' : ''}${choice.tensionDelta}% Tension`,
          colorClass: choice.tensionDelta > 0 ? 'bg-rose-900/60 text-rose-300' : 'bg-emerald-900/60 text-emerald-300'
        });
      }

      window.ConsequencePlayer.show({
        title: '⚠️ ALGORITHMIC DECREE CONSEQUENCE',
        headline: prevCrisis.title,
        story: logEntry,
        statDeltas,
        animType
      });
    }

    if (window.AudioSynth) {
      window.AudioSynth.playClick();
    }

    return { choice, logEntry };
  }
}

window.EventSystem = new EventSystem();

