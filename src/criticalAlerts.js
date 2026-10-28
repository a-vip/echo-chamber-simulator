/**
 * The Echo Chamber Simulator - Critical Polarization & Radicalization Alerts
 * Monitors when specific echo chambers hit critical mass (75%, 85%, 95%)
 * and triggers visual banner warnings and pixel mob reactions.
 */

class CriticalAlertSystem {
  constructor() {
    this.triggeredMilestones = new Set();
    this.activeToast = null;
    this.toastTimer = 0;
  }

  check(simState) {
    if (!simState || simState.paused || simState.gameOver) return;

    const thresholds = [75, 85, 95];
    const factions = Object.keys(simState.factionTensions);

    for (const fId of factions) {
      const val = simState.factionTensions[fId];
      for (const t of thresholds) {
        const key = `${fId}_${t}`;
        if (val >= t && !this.triggeredMilestones.has(key)) {
          this.triggeredMilestones.add(key);
          this.triggerAlert(fId, t, simState);
          return; // Trigger one at a time
        }
      }
    }
  }

  triggerAlert(factionId, threshold, simState) {
    const faction = window.FACTIONS ? window.FACTIONS[factionId] : null;
    const name = faction ? faction.name.split('/')[0].trim() : factionId;
    const icon = faction ? faction.icon : '⚠️';

    const messages = {
      gender_alpha: `🗿 CRITICAL MASS (${threshold}%): The Manosphere has locked into hermetic echo chamber! Millions of men deleting social apps and stockpiling bone marrow!`,
      gender_femme: `💅 RADICALIZATION PEAK (${threshold}%): Divine Femmes organize nationwide walkouts demanding $500 dinner mandates!`,
      pet_cat: `🐱 FELINE JIHAD (${threshold}%): Lord Barnaby's cadres declare canine curfew in residential districts!`,
      pet_dog: `🐕 TACTICAL BARK SURGE (${threshold}%): Canine defense pods deploy ballistic armor to protect dog parks!`,
      tech_corp: `🤖 TECHNO-FEUDAL LOCKOUT (${threshold}%): Algorithms now charge 0.05 SOL to unlock household front doors!`,
      tech_luddite: `🍄 MOSS UPRISING (${threshold}%): Neo-Luddite mobs sever regional fiber cables with stone adzes!`,
      rot_alpha: `🚽 BRAINROT TSUNAMI (${threshold}%): 98% of teenagers speak exclusively in Subway Surfers dialogue!`,
      rot_boomer: `🦅 LAWNMOWER PANIC (${threshold}%): HOA meetings nationwide escalate into physical lawn edger duels!`
    };

    const text = messages[factionId] || `⚠️ ${name} has reached ${threshold}% critical radicalization! Polarization cascading!`;

    // Show slide-in toast
    this.showToast({
      icon,
      title: `⚡ ECHO CHAMBER AT ${threshold}% CRITICAL MASS`,
      body: text,
      color: threshold >= 85 ? '#ef4444' : '#f59e0b'
    });

    // Animate sprite street arena
    if (window.StreetArena) {
      window.StreetArena.triggerRally(factionId);
    }

    if (window.AudioSynth) {
      window.AudioSynth.playAlarm();
    }
  }

  showToast({ icon, title, body, color }) {
    let toast = document.getElementById('polarization-toast');
    if (!toast) return;

    toast.classList.remove('hidden', 'translate-y-24', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
    toast.style.borderColor = color;

    document.getElementById('toast-icon').innerText = icon;
    document.getElementById('toast-title').innerText = title;
    document.getElementById('toast-body').innerText = body;

    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.classList.add('translate-y-24', 'opacity-0');
      setTimeout(() => toast.classList.add('hidden'), 400);
    }, 6000);
  }
}

window.CriticalAlertSystem = new CriticalAlertSystem();
