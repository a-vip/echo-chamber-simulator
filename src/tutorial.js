/**
 * The Echo Chamber Simulator - Interactive Tutorial System
 * Step-by-step interactive onboarding explaining the core gameplay loop,
 * the Goldilocks Rot Zone, post actions, sliders, and disaster mechanics.
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
      <p class="mb-2 text-amber-300">
        <strong>Your mission is NOT to make people happy, nor to find the truth.</strong>
      </p>
      <p class="text-zinc-300">
        Your goal is to harvest maximum <strong>Neuro-Watts (⚡)</strong> and <strong>Ad Revenue ($)</strong> by keeping the population engaged in endless ideological civil wars.
      </p>
    `,
    targetHighlight: null
  },
  {
    step: 2,
    title: '☢️ THE GOLDILOCKS ROT ZONE (65% - 92%)',
    icon: '📊',
    subtitle: 'The Golden Rule of Feed Management',
    content: `
      <p class="mb-2">
        Look at the <strong>Civilization Tension</strong> bar at the top/right:
      </p>
      <ul class="space-y-1.5 text-xs font-mono mb-2">
        <li class="text-emerald-400">🌿 <strong>0% - 20% (Apathy):</strong> People touch grass and log off. You get fired by shareholders!</li>
        <li class="text-amber-400">☢️ <strong>65% - 92% (GOLDILOCKS ZONE):</strong> Pure algorithmic bliss! Harvesting operates at a <strong>5.0x Multiplier</strong>.</li>
        <li class="text-rose-500">⚔️ <strong>100% (Civil War):</strong> Factions take up weapons and smash the power grid!</li>
      </ul>
      <p class="text-zinc-300">
        Keep society balanced inside the <strong>Goldilocks Rot Zone</strong> to maximize profits without triggering global collapse!
      </p>
    `,
    targetHighlight: '#hud-tension-val'
  },
  {
    step: 3,
    title: '📱 THE INFINITE FEED & FACTION WARS',
    icon: '💬',
    subtitle: 'Satirical Battlegrounds Streaming in Real-Time',
    content: `
      <p class="mb-2">
        In the center of your screen, users are posting around the clock across <strong>6 cultural fault lines</strong>:
      </p>
      <div class="grid grid-cols-2 gap-1.5 text-[11px] font-mono text-zinc-300 mb-2">
        <div class="p-1.5 bg-zinc-900 rounded border border-zinc-800">🗿 Manosphere vs 💅 Femosphere</div>
        <div class="p-1.5 bg-zinc-900 rounded border border-zinc-800">🐱 Purr-Reich vs 🐕 Tactical Dogs</div>
        <div class="p-1.5 bg-zinc-900 rounded border border-zinc-800">🤖 Tech-Lords vs 🍄 Mud Monks</div>
        <div class="p-1.5 bg-zinc-900 rounded border border-zinc-800">🥩 Raw Marrow vs 🌱 Sun Ascetics</div>
      </div>
      <p class="text-zinc-300">
        Take time to read the posts! You can even <strong>Pause (⏸)</strong> or slow down the game at any time using the pace controls at the top.
      </p>
    `,
    targetHighlight: '#feed-stream'
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
    targetHighlight: null
  },
  {
    step: 5,
    title: '🌡️ SLIDERS & SERVER CORE HEAT',
    icon: '🌋',
    subtitle: 'Don\'t Let Your Datacenters Melt Into Bedrock',
    content: `
      <p class="mb-2">
        On the left panel, adjust your macro algorithmic dials:
      </p>
      <ul class="space-y-1.5 text-xs font-mono mb-2">
        <li><strong>Echo Chamber Siloing (0-100%):</strong> Isolates factions. High siloing boosts passive harvest rate.</li>
        <li><strong>Ragebait Bias Engine (0-100%):</strong> Pushes anger to the top. Huge dopamine gain, but generates server heat!</li>
      </ul>
      <p class="text-xs text-rose-300 mb-1">
        ⚠️ If <strong>Server Heat reaches 100°C</strong>, your hardware explodes into a planetary supernova!
      </p>
      <p class="text-zinc-400 text-[11px]">
        Keep cash handy to spray <strong>❄️ Cryo-Coolant Spray</strong> when servers overheat!
      </p>
    `,
    targetHighlight: '#bar-temp'
  },
  {
    step: 6,
    title: '🏆 UPGRADES & APOCALYPSE AWARDS',
    icon: '🌌',
    subtitle: 'Every Ending is a Badge of Honor',
    content: `
      <p class="mb-2">
        Open <strong>🔬 Dark Patterns</strong> to research 16 unethical technologies across 4 tiers (Infinite Doomscroll, Deepfake Family Betrayal, Retinal Meme Implants).
      </p>
      <p class="mb-2">
        <strong>Don't fear failure!</strong> Causing a Civil War, Server Meltdown, or Brainrot Singularity unlocks unique <strong>Apocalypse Trophies</strong> in your trophy room!
      </p>
      <p class="text-amber-300 font-bold">
        Plus, you can Reboot the Timeline with a permanent +35% Harvest Prestige boost!
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
  }

  init() {
    this.modal = document.getElementById('modal-tutorial');
    const hasSeen = localStorage.getItem('echo_chamber_tutorial_seen');

    // Auto-launch on first visit
    if (!hasSeen) {
      setTimeout(() => {
        this.start();
      }, 600);
    }
  }

  start() {
    this.currentStep = 0;
    if (!this.modal) this.modal = document.getElementById('modal-tutorial');
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
      if (window.AudioSynth) window.AudioSynth.playClick();
    }
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
  }
}

window.TutorialSystem = new TutorialSystem();

