/**
 * The Echo Chamber Simulator - Interactive Tutorial System (With Live Element Highlighting)
 * Step-by-step interactive onboarding with real visual spotlight bounding boxes,
 * automatic simulation pausing, and contextual interface guidance.
 */

const TUTORIAL_STEPS = [
  {
    step: 1,
    title: '🧠 WELCOME, CHIEF ALGORITHM ARCHITECT',
    icon: '⚡',
    subtitle: 'The Mandate: Monetize Human Outrage',
    content: `
      <p class="mb-2">
        Congratulations on your promotion. You now control the master algorithmic recommendation engine for a deeply neurotic, internet-addicted human civilization.
      </p>
      <p class="mb-2 text-amber-300 font-bold">
        Your mission is NOT to make people happy, nor to find the truth.
      </p>
      <p class="text-zinc-300">
        Your goal is to harvest maximum <strong>Neuro-Watts (⚡)</strong> and <strong>Ad Revenue ($)</strong> by keeping the population polarized in perpetual culture wars.
      </p>
    `,
    targetHighlight: 'header'
  },
  {
    step: 2,
    title: '☢️ THE GOLDILOCKS ROT ZONE (65% - 92%)',
    icon: '📊',
    subtitle: 'The Golden Rule of Feed Management',
    content: `
      <p class="mb-2">
        Look at the <strong>Civilization Tension</strong> & <strong>Server Heat</strong> bars highlighted on the right:
      </p>
      <ul class="space-y-1.5 text-xs font-mono mb-2">
        <li class="text-emerald-400">🌿 <strong>0% - 20% (Apathy):</strong> People touch grass and log off. You get fired by shareholders!</li>
        <li class="text-amber-400">☢️ <strong>65% - 92% (GOLDILOCKS ZONE):</strong> Pure algorithmic bliss! Harvesting operates at a <strong>5.0x Multiplier</strong>.</li>
        <li class="text-rose-500">⚔️ <strong>100% (Civil War):</strong> Factions clash in the streets and smash the power grid!</li>
      </ul>
      <p class="text-zinc-300">
        Keep society balanced inside the <strong>Goldilocks Rot Zone</strong> to maximize profits without triggering global collapse!
      </p>
    `,
    targetHighlight: '#hud-vitals-panel'
  },
  {
    step: 3,
    title: '📱 THE INFINITE FEED & 32-BIT STREET ARENA',
    icon: '💬',
    subtitle: 'Watch Factions Clash in Real-Time',
    content: `
      <p class="mb-2">
        In the center, watch the <strong>Street Arena</strong> above the feed: 32-bit animated pixel characters argue, flex, and rally as tensions escalate!
      </p>
      <p class="mb-2 text-zinc-300">
        Below the arena, the live feed streams satirical posts across 6 culture wars: Manosphere vs Femosphere, Tech-Lords vs Mud-Monks, Cats vs Dogs, and more.
      </p>
      <p class="text-amber-300 font-bold">
        Take all the time you need! You can pause (⏸) at any time, or click "New Posts" when you are ready for more.
      </p>
    `,
    targetHighlight: '#feed-center-container'
  },
  {
    step: 4,
    title: '🎮 THE 4 INTERVENTION BUTTONS',
    icon: '🎛️',
    subtitle: 'Directly Manipulate Every Single Post',
    content: `
      <p class="mb-2">Every card in the feed has 4 quick-action levers:</p>
      <div class="space-y-1.5 text-xs font-mono">
        <div class="p-1.5 bg-blue-950/60 border border-blue-800 rounded">
          <strong class="text-blue-300">🚀 BOOST:</strong> Pushes post to millions. Yields instant Neuro-Watts and slightly raises faction tension.
        </div>
        <div class="p-1.5 bg-rose-950/60 border border-rose-800 rounded">
          <strong class="text-rose-300">🤬 POLARIZE:</strong> Injects an infuriating quote-reply from their rival faction to trigger a comment war!
        </div>
        <div class="p-1.5 bg-emerald-950/60 border border-emerald-800 rounded">
          <strong class="text-emerald-300">💰 AD-FARM:</strong> Plasters a scammy sponsored ad over the post to generate cold hard Cash ($).
        </div>
        <div class="p-1.5 bg-zinc-800 border border-zinc-700 rounded">
          <strong class="text-zinc-300">🛡️ SHADOWBAN:</strong> Quietly throttles the post to cool server heat and decrease tension.
        </div>
      </div>
    `,
    targetHighlight: '#feed-stream'
  },
  {
    step: 5,
    title: '🌡️ SLIDERS, TACTICAL BOTS & CRYO-COOLANT',
    icon: '🌋',
    subtitle: 'Calibrate Levers on the Left Panel',
    content: `
      <p class="mb-2">
        On the left panel, adjust your macro algorithmic dials:
      </p>
      <ul class="space-y-1.5 text-xs font-mono mb-2">
        <li><strong>Echo Chamber Siloing:</strong> Isolates factions into radicalized bubbles for higher passive energy.</li>
        <li><strong>Ragebait Bias Engine:</strong> Prioritizes inflammatory posts for huge dopamine gain, but generates server heat.</li>
      </ul>
      <p class="text-xs text-rose-300 mb-1">
        ⚠️ If <strong>Server Heat reaches 100°C</strong>, your hardware explodes into a planetary supernova!
      </p>
      <p class="text-zinc-400 text-[11px]">
        Keep cash handy to spray <strong>❄️ Cryo-Coolant Spray</strong> when servers overheat!
      </p>
    `,
    targetHighlight: '#left-control-panel'
  },
  {
    step: 6,
    title: '🏆 DARK PATTERNS & ENDLESS PLAY',
    icon: '🌌',
    subtitle: 'Research Tech, Trigger Endings, or Keep Playing!',
    content: `
      <p class="mb-2">
        Open <strong>🔬 Dark Patterns</strong> to research 16 unethical technologies across 4 tiers.
      </p>
      <p class="mb-2 text-zinc-300">
        <strong>Don't fear failure!</strong> Triggering Civil War, Server Meltdown, or Brainrot Singularity unlocks unique <strong>Apocalypse Trophies</strong> and Timeline Prestiges (+35% permanent harvest)!
      </p>
      <p class="text-emerald-400 font-bold">
        And don't worry: when an ending occurs, you can click "CONTINUE EXPERIMENT (SANDBOX)" to keep managing your world forever!
      </p>
    `,
    targetHighlight: '#btn-open-upgrades'
  }
];

class TutorialSystem {
  constructor() {
    this.currentStep = 0;
    this.totalSteps = TUTORIAL_STEPS.length;
    this.modal = null;
    this.spotlightBox = null;
  }

  init() {
    this.modal = document.getElementById('modal-tutorial');
    this.spotlightBox = document.getElementById('tutorial-spotlight-box');
    const hasSeen = localStorage.getItem('echo_chamber_tutorial_seen');

    if (!hasSeen) {
      setTimeout(() => {
        this.start();
      }, 700);
    }
  }

  start() {
    this.currentStep = 0;
    if (!this.modal) this.modal = document.getElementById('modal-tutorial');
    if (!this.spotlightBox) this.spotlightBox = document.getElementById('tutorial-spotlight-box');

    // Auto pause simulation during tutorial
    if (window.SimulationEngine) {
      window.SimulationEngine.paused = true;
    }

    if (this.modal) {
      this.modal.classList.remove('hidden');
      this.render();
      if (window.AudioSynth) window.AudioSynth.playClick();
    }
  }

  close() {
    if (this.modal) {
      this.modal.classList.add('hidden');
      localStorage.setItem('echo_chamber_tutorial_seen', 'true');
    }
    if (this.spotlightBox) {
      this.spotlightBox.classList.add('hidden');
    }

    // Unpause simulation if not explicitly paused by user
    if (window.SimulationEngine && window.SimulationEngine.gameSpeed > 0) {
      window.SimulationEngine.paused = false;
    }

    if (window.AudioSynth) window.AudioSynth.playClick();
  }

  next() {
    if (this.currentStep < this.totalSteps - 1) {
      this.currentStep++;
      this.render();
      if (window.AudioSynth) window.AudioSynth.playClick();
    } else {
      this.close();
    }
  }

  prev() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.render();
      if (window.AudioSynth) window.AudioSynth.playClick();
    }
  }

  render() {
    const data = TUTORIAL_STEPS[this.currentStep];
    if (!data) return;

    document.getElementById('tut-icon').innerText = data.icon;
    document.getElementById('tut-title').innerText = data.title;
    document.getElementById('tut-subtitle').innerText = data.subtitle;
    document.getElementById('tut-body').innerHTML = data.content;
    document.getElementById('tut-progress').innerText = `STEP ${data.step} OF ${this.totalSteps}`;

    const prevBtn = document.getElementById('tut-btn-prev');
    const nextBtn = document.getElementById('tut-btn-next');

    if (prevBtn) {
      prevBtn.style.visibility = this.currentStep === 0 ? 'hidden' : 'visible';
    }

    if (nextBtn) {
      if (this.currentStep === this.totalSteps - 1) {
        nextBtn.innerText = '🚀 START PLAYING';
        nextBtn.className = 'px-4 py-2 rounded bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-black font-extrabold text-xs transition-all';
      } else {
        nextBtn.innerText = 'NEXT ➔';
        nextBtn.className = 'px-4 py-2 rounded bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs transition-all';
      }
    }

    // Apply Live Element Spotlight
    this.updateSpotlight(data.targetHighlight);
  }

  updateSpotlight(selector) {
    if (!this.spotlightBox) this.spotlightBox = document.getElementById('tutorial-spotlight-box');
    if (!this.spotlightBox) return;

    if (!selector) {
      this.spotlightBox.classList.add('hidden');
      return;
    }

    const target = document.querySelector(selector);
    if (!target) {
      this.spotlightBox.classList.add('hidden');
      return;
    }

    const rect = target.getBoundingClientRect();
    this.spotlightBox.classList.remove('hidden');
    this.spotlightBox.style.left = `${Math.max(4, rect.left - 6)}px`;
    this.spotlightBox.style.top = `${Math.max(4, rect.top - 6)}px`;
    this.spotlightBox.style.width = `${rect.width + 12}px`;
    this.spotlightBox.style.height = `${rect.height + 12}px`;
  }
}

window.TutorialSystem = new TutorialSystem();
