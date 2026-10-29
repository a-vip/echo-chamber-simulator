/**
 * The Echo Chamber Simulator - UI Controller & Canvas Visualizer
 * Manages the pixel CRT interface, floating dopamine particles, sparkline monitors,
 * modal dialogs, and smooth responsive gameplay interactions.
 */

class UIController {
  constructor() {
    this.sim = window.SimulationEngine;
    this.canvas = null;
    this.ctx = null;
    this.crtEnabled = true;
    this.particles = [];
    this.initElements();
    this.bindEvents();
  }

  initElements() {
    this.canvas = document.getElementById('sparkline-canvas');
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
    }
  }

  bindEvents() {
    // Slider binds
    const echoSlider = document.getElementById('slider-echo');
    if (echoSlider) {
      echoSlider.addEventListener('input', (e) => {
        this.sim.echoSiloing = parseFloat(e.target.value);
        document.getElementById('val-echo').innerText = `${Math.round(this.sim.echoSiloing)}%`;
      });
    }

    const rageSlider = document.getElementById('slider-rage');
    if (rageSlider) {
      rageSlider.addEventListener('input', (e) => {
        this.sim.rageBias = parseFloat(e.target.value);
        document.getElementById('val-rage').innerText = `${Math.round(this.sim.rageBias)}%`;
      });
    }

    // Audio mute toggle
    const muteBtn = document.getElementById('btn-mute');
    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        const isMuted = window.AudioSynth ? window.AudioSynth.toggleMute() : false;
        muteBtn.innerText = isMuted ? '🔇 AUDIO: OFF' : '🔊 AUDIO: ON';
        muteBtn.classList.toggle('bg-red-900', isMuted);
      });
    }

    // CRT Scanlines toggle
    const crtBtn = document.getElementById('btn-crt');
    if (crtBtn) {
      crtBtn.addEventListener('click', () => {
        this.crtEnabled = !this.crtEnabled;
        document.body.classList.toggle('crt-active', this.crtEnabled);
        crtBtn.innerText = this.crtEnabled ? '📺 CRT: ON' : '📺 CRT: OFF';
      });
    }

    // Bot deploy button
    const botBtn = document.getElementById('btn-deploy-bots');
    if (botBtn) {
      botBtn.addEventListener('click', () => {
        const success = this.sim.deployBotBrigade();
        if (success) {
          this.createFloatingText('🤖 BOT BRIGADE DEPLOYED!', window.innerWidth / 2, window.innerHeight / 2, '#38bdf8');
        }
      });
    }

    // Coolant button
    const coolBtn = document.getElementById('btn-coolant');
    if (coolBtn) {
      coolBtn.addEventListener('click', () => {
        const success = this.sim.emergencyCoolant();
        if (success) {
          this.createFloatingText('❄️ LIQUID NITROGEN SPRAYED!', window.innerWidth / 2, window.innerHeight / 2, '#06b6d4');
        }
      });
    }

    // Modal close binds (with auto-resume)
    const closeButtons = document.querySelectorAll('.modal-close');
    closeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal-container');
        if (modal) modal.classList.add('hidden');
        if (window.ConsequencePlayer) window.ConsequencePlayer.close();
        if (this.sim && this.sim.gameSpeed > 0 && !this.sim.gameOver) {
          this.sim.paused = false;
        }
      });
    });

    // Backdrop click to close modals & resume simulation
    const allModals = document.querySelectorAll('.modal-container');
    allModals.forEach(m => {
      m.addEventListener('click', (e) => {
        if (e.target === m) {
          m.classList.add('hidden');
          if (window.ConsequencePlayer) window.ConsequencePlayer.close();
          if (this.sim && this.sim.gameSpeed > 0 && !this.sim.gameOver) {
            this.sim.paused = false;
          }
        }
      });
    });

    // ESC key to dismiss any active modal dialog
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        allModals.forEach(m => m.classList.add('hidden'));
        if (window.ConsequencePlayer) window.ConsequencePlayer.close();
        if (window.TutorialSystem) window.TutorialSystem.close();
        if (this.sim && this.sim.gameSpeed > 0 && !this.sim.gameOver) {
          this.sim.paused = false;
        }
      }
    });

    // Consequence modal close button
    const csqClose = document.getElementById('csq-btn-close');
    if (csqClose) {
      csqClose.addEventListener('click', () => {
        if (window.ConsequencePlayer) window.ConsequencePlayer.close();
        if (this.sim && this.sim.gameSpeed > 0 && !this.sim.gameOver) {
          this.sim.paused = false;
        }
      });
    }

    // Upgrades Drawer toggle
    const upgBtn = document.getElementById('btn-open-upgrades');
    if (upgBtn) {
      upgBtn.addEventListener('click', () => {
        const modal = document.getElementById('modal-upgrades');
        if (modal) {
          this.sim.paused = true; // Auto-pause
          modal.classList.remove('hidden');
          this.renderUpgradesList();
        }
      });
    }

    // Badges modal toggle
    const badgeBtn = document.getElementById('btn-open-badges');
    if (badgeBtn) {
      badgeBtn.addEventListener('click', () => {
        const modal = document.getElementById('modal-badges');
        if (modal) {
          this.sim.paused = true; // Auto-pause
          modal.classList.remove('hidden');
          this.renderBadgesList();
        }
      });
    }

    // Tutorial open toggle
    const tutBtn = document.getElementById('btn-open-tutorial');
    if (tutBtn) {
      tutBtn.addEventListener('click', () => {
        if (window.TutorialSystem) window.TutorialSystem.start();
      });
    }

    // Tutorial step navigation
    const tutNext = document.getElementById('tut-btn-next');
    if (tutNext) {
      tutNext.addEventListener('click', () => {
        if (window.TutorialSystem) window.TutorialSystem.next();
      });
    }

    const tutPrev = document.getElementById('tut-btn-prev');
    if (tutPrev) {
      tutPrev.addEventListener('click', () => {
        if (window.TutorialSystem) window.TutorialSystem.prev();
      });
    }

    const tutSkip = document.getElementById('tut-btn-skip');
    if (tutSkip) {
      tutSkip.addEventListener('click', () => {
        if (window.TutorialSystem) window.TutorialSystem.close();
      });
    }

    // Game Speed Buttons
    const speedButtons = document.querySelectorAll('.btn-speed');
    speedButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const speed = parseFloat(btn.getAttribute('data-speed'));
        this.sim.setGameSpeed(speed);

        speedButtons.forEach(b => {
          b.classList.remove('bg-amber-400', 'text-black', 'font-bold');
          b.classList.add('bg-zinc-800', 'text-zinc-300');
        });

        btn.classList.remove('bg-zinc-800', 'text-zinc-300');
        btn.classList.add('bg-amber-400', 'text-black', 'font-bold');

        if (window.AudioSynth) window.AudioSynth.playClick();
      });
    });

    // Radio Ambient Synth Station Toggle
    const radioBtn = document.getElementById('btn-radio');
    if (radioBtn) {
      radioBtn.addEventListener('click', () => {
        const station = window.AudioSynth ? window.AudioSynth.cycleRadioStation() : 'off';
        const labels = {
          off: '📻 RADIO: OFF',
          chill: '📻 104.2 CHILL FM',
          rage: '📻 99.8 RAGECORE'
        };
        radioBtn.innerText = labels[station] || '📻 RADIO';
        radioBtn.classList.toggle('text-amber-400', station !== 'off');
        radioBtn.classList.toggle('border-amber-500', station !== 'off');
      });
    }

    // Custom Post Creator Modal
    const craftBtn = document.getElementById('btn-open-craft');
    if (craftBtn) {
      craftBtn.addEventListener('click', () => {
        this.sim.paused = true; // Auto-pause
        const modal = document.getElementById('modal-craft');
        if (modal) modal.classList.remove('hidden');
      });
    }

    const craftForm = document.getElementById('form-craft-post');
    if (craftForm) {
      craftForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const author = document.getElementById('craft-author').value;
        const handle = document.getElementById('craft-handle').value;
        const factionId = document.getElementById('craft-faction').value;
        const content = document.getElementById('craft-content').value;
        const hashtags = document.getElementById('craft-hashtags').value;

        if (window.CustomPostCreator) {
          window.CustomPostCreator.createPost({ author, handle, factionId, content, hashtags });
          this.renderFeed();
          this.createFloatingText('🔥 RAGEBAIT LAUNCHED!', window.innerWidth / 2, window.innerHeight / 2, '#f59e0b');
        }

        const modal = document.getElementById('modal-craft');
        if (modal) modal.classList.add('hidden');
        if (this.sim.gameSpeed > 0) this.sim.paused = false;
        craftForm.reset();
      });
    }

    // Dossier Generator Modals
    const dossierBtn = document.getElementById('btn-open-dossier');
    if (dossierBtn) {
      dossierBtn.addEventListener('click', () => {
        this.sim.paused = true; // Auto-pause
        this.openDossierModal();
      });
    }

    const endingDossierBtn = document.getElementById('ending-btn-dossier');
    if (endingDossierBtn) {
      endingDossierBtn.addEventListener('click', () => {
        this.sim.paused = true; // Auto-pause
        this.openDossierModal();
      });
    }

    // Feed hover pause detection (Prevents feed jumping while user reads!)
    const feedContainerEl = document.getElementById('feed-stream');
    if (feedContainerEl) {
      feedContainerEl.addEventListener('mouseenter', () => {
        this.sim.isFeedHovered = true;
      });
      feedContainerEl.addEventListener('mouseleave', () => {
        this.sim.isFeedHovered = false;
      });
    }

    // Reveal pending posts pill button
    const revealPendingBtn = document.getElementById('feed-pending-indicator');
    if (revealPendingBtn) {
      revealPendingBtn.addEventListener('click', () => {
        if (this.sim.revealPendingPosts()) {
          this.renderFeed();
          if (window.AudioSynth) window.AudioSynth.playClick();
        }
      });
    }

    const dossierDownloadBtn = document.getElementById('btn-dossier-download');
    if (dossierDownloadBtn) {
      dossierDownloadBtn.addEventListener('click', () => {
        if (window.DossierGenerator) window.DossierGenerator.downloadPNG(this.sim);
      });
    }

    const dossierCopyBtn = document.getElementById('btn-dossier-copy');
    if (dossierCopyBtn) {
      dossierCopyBtn.addEventListener('click', () => {
        if (window.DossierGenerator) {
          window.DossierGenerator.copyShareText(this.sim);
          dossierCopyBtn.innerText = '✅ COPIED TO CLIPBOARD!';
          setTimeout(() => {
            dossierCopyBtn.innerText = '📋 COPY TEXT SUMMARY';
          }, 2000);
        }
      });
    }

    // Map Radar Canvas Click Binding
    const mapCanvas = document.getElementById('radar-map-canvas');
    if (mapCanvas) {
      mapCanvas.addEventListener('click', (e) => {
        if (window.RiotRadarMap) {
          const rect = mapCanvas.getBoundingClientRect();
          const x = (e.clientX - rect.left) * (mapCanvas.width / rect.width);
          const y = (e.clientY - rect.top) * (mapCanvas.height / rect.height);
          window.RiotRadarMap.selectSectorByClick(x, y);
        }
      });
    }

    // Feed Stream Mode Toggle (Auto / Manual)
    const feedModeBtn = document.getElementById('btn-feed-mode');
    const manualStepBtn = document.getElementById('btn-manual-step');
    if (feedModeBtn) {
      feedModeBtn.addEventListener('click', () => {
        const mode = this.sim.toggleFeedStreamMode();
        feedModeBtn.innerText = mode === 'auto' ? '▶ STREAM: AUTO' : '⏸ STREAM: MANUAL';
        feedModeBtn.classList.toggle('bg-amber-900/60', mode === 'manual');
        feedModeBtn.classList.toggle('text-amber-200', mode === 'manual');
        if (manualStepBtn) {
          manualStepBtn.classList.toggle('hidden', mode !== 'manual');
        }
      });
    }

    if (manualStepBtn) {
      manualStepBtn.addEventListener('click', () => {
        this.sim.manualStepPost();
        this.renderFeed();
        if (window.AudioSynth) window.AudioSynth.playClick();
      });
    }

    // Tabbed Visualizers (Oscilloscope vs Riot Radar)
    const tabSpark = document.getElementById('tab-btn-sparkline');
    const tabRadar = document.getElementById('tab-btn-radar');
    const panelSpark = document.getElementById('tab-panel-sparkline');
    const panelRadar = document.getElementById('tab-panel-radar');

    if (tabSpark && tabRadar && panelSpark && panelRadar) {
      tabSpark.addEventListener('click', () => {
        tabSpark.className = 'flex-1 py-1.5 px-2 text-center font-bold text-amber-400 border-b-2 border-amber-400 transition-all text-[11px]';
        tabRadar.className = 'flex-1 py-1.5 px-2 text-center font-bold text-zinc-400 hover:text-zinc-200 border-b-2 border-transparent transition-all text-[11px]';
        panelSpark.classList.remove('hidden');
        panelRadar.classList.add('hidden');
      });

      tabRadar.addEventListener('click', () => {
        tabRadar.className = 'flex-1 py-1.5 px-2 text-center font-bold text-emerald-400 border-b-2 border-emerald-400 transition-all text-[11px]';
        tabSpark.className = 'flex-1 py-1.5 px-2 text-center font-bold text-zinc-400 hover:text-zinc-200 border-b-2 border-transparent transition-all text-[11px]';
        panelRadar.classList.remove('hidden');
        panelSpark.classList.add('hidden');
        if (window.RiotRadarMap) window.RiotRadarMap.draw();
      });
    }

    // Street Arena Collapse / Expand Toggle
    const arenaToggleBtn = document.getElementById('btn-toggle-arena');
    const arenaCanvas = document.getElementById('street-arena-canvas');
    if (arenaToggleBtn && arenaCanvas) {
      let isArenaCollapsed = false;
      arenaToggleBtn.addEventListener('click', () => {
        isArenaCollapsed = !isArenaCollapsed;
        arenaCanvas.classList.toggle('hidden', isArenaCollapsed);
        arenaToggleBtn.innerText = isArenaCollapsed ? '▼ EXPAND' : '─ COLLAPSE';
      });
    }

    // Crisis Pending Banner bindings
    const crisisReviewBtn = document.getElementById('crisis-banner-review-btn');
    const crisisPendingBanner = document.getElementById('crisis-pending-banner');
    if (crisisReviewBtn) {
      crisisReviewBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.EventSystem && window.EventSystem.pendingDecree) {
          const evt = window.EventSystem.openDecreeModal();
          if (evt) this.showCrisisDialog(evt);
        }
      });
    }
    if (crisisPendingBanner) {
      crisisPendingBanner.addEventListener('click', () => {
        if (window.EventSystem && window.EventSystem.pendingDecree) {
          const evt = window.EventSystem.openDecreeModal();
          if (evt) this.showCrisisDialog(evt);
        }
      });
    }

    const crisisDismissBtn = document.getElementById('crisis-banner-dismiss-btn');
    if (crisisDismissBtn) {
      crisisDismissBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.EventSystem) window.EventSystem.dismissDecree(this.sim);
      });
    }

    // Feed delegation click for actions and boss encounters
    const feedContainer = document.getElementById('feed-stream');
    if (feedContainer) {
      feedContainer.addEventListener('click', (e) => {
        // Check Influencer Boss Actions
        const bossAction = e.target.closest('button[data-boss-action]');
        if (bossAction) {
          const act = bossAction.getAttribute('data-boss-action');
          if (act === 'TOGGLE_MIN' && window.BossManager) {
            window.BossManager.toggleMinimize();
            this.renderFeed();
            return;
          }
          if (act === 'BRIBE' && window.BossManager) window.BossManager.counterBribe(this.sim);
          if (act === 'SWARM' && window.BossManager) window.BossManager.counterQuoteSwarm(this.sim);
          if (act === 'SHADOWBAN' && window.BossManager) window.BossManager.counterSuperShadowban(this.sim);
          this.renderFeed();
          return;
        }

        const target = e.target.closest('button[data-action]');
        if (!target) return;
        const action = target.getAttribute('data-action');
        const postId = target.getAttribute('data-post-id');
        const res = this.sim.applyAction(action, postId);

        if (res) {
          const rect = target.getBoundingClientRect();
          if (res.deltaWatts) {
            this.createFloatingText(`+${Math.round(res.deltaWatts)}⚡`, rect.left, rect.top, '#fbbf24');
          } else if (res.deltaCash) {
            this.createFloatingText(`+$${Math.round(res.deltaCash)}💵`, rect.left, rect.top, '#4ade80');
          } else if (res.type === 'SHADOWBAN') {
            this.createFloatingText('🛡️ SHADOWBANNED', rect.left, rect.top, '#94a3b8');
          }
          this.renderFeed();
        }
      });
    }
  }

  updateHUD() {
    // 1. Neuro-Watts & Cash
    const elWatts = document.getElementById('hud-watts');
    if (elWatts) elWatts.innerText = Math.floor(this.sim.watts).toLocaleString();

    const elCash = document.getElementById('hud-cash');
    if (elCash) elCash.innerText = `$${Math.floor(this.sim.cash).toLocaleString()}`;

    const elDay = document.getElementById('hud-day');
    if (elDay) elDay.innerText = `DAY ${this.sim.day}`;

    // 2. Tension Bar
    const tensionBar = document.getElementById('bar-tension');
    const tensionVal = document.getElementById('hud-tension-val');
    if (tensionBar && tensionVal) {
      const tensionClamped = Math.max(0, Math.min(100, this.sim.tension));
      tensionBar.style.width = `${tensionClamped}%`;
      tensionVal.innerText = `${tensionClamped.toFixed(1)}%`;

      if (tensionClamped > 85) {
        tensionBar.className = 'h-full bg-red-600 shadow-pulse transition-all duration-300';
      } else if (tensionClamped >= 65) {
        tensionBar.className = 'h-full bg-amber-500 shadow-glow transition-all duration-300';
      } else {
        tensionBar.className = 'h-full bg-emerald-500 transition-all duration-300';
      }
    }

    // 3. Server Temp Bar
    const tempBar = document.getElementById('bar-temp');
    const tempVal = document.getElementById('hud-temp-val');
    if (tempBar && tempVal) {
      const tempPercent = Math.min(100, (this.sim.serverTemp / this.sim.maxServerTemp) * 100);
      tempBar.style.width = `${tempPercent}%`;
      tempVal.innerText = `${this.sim.serverTemp.toFixed(1)}°C / ${this.sim.maxServerTemp}°C`;

      if (this.sim.serverTemp > 85) {
        tempBar.className = 'h-full bg-rose-600 animate-pulse transition-all duration-300';
      } else if (this.sim.serverTemp > 65) {
        tempBar.className = 'h-full bg-orange-500 transition-all duration-300';
      } else {
        tempBar.className = 'h-full bg-cyan-500 transition-all duration-300';
      }
    }

    // 4. Rot Zone Banner
    const rotBanner = document.getElementById('rot-zone-banner');
    if (rotBanner) {
      if (this.sim.goldilocksActive) {
        rotBanner.classList.remove('hidden');
        document.getElementById('rot-multiplier').innerText = `${this.sim.rotZoneMultiplier.toFixed(1)}x`;
      } else {
        rotBanner.classList.add('hidden');
      }
    }

    // 5. Action Button Cooldown states
    const btnBots = document.getElementById('btn-deploy-bots');
    if (btnBots) {
      if (this.sim.botCooldownSec > 0) {
        btnBots.innerText = `🤖 BOTS RECHARGING (${Math.ceil(this.sim.botCooldownSec)}s)`;
        btnBots.disabled = true;
        btnBots.classList.add('opacity-50', 'cursor-not-allowed');
      } else {
        btnBots.innerText = '🤖 DEPLOY RAGE BOTS ($80)';
        btnBots.disabled = this.sim.cash < 80;
        btnBots.classList.toggle('opacity-50', this.sim.cash < 80);
        btnBots.classList.toggle('cursor-not-allowed', this.sim.cash < 80);
      }
    }

    const btnCool = document.getElementById('btn-coolant');
    if (btnCool) {
      if (this.sim.coolantCooldownSec > 0) {
        btnCool.innerText = `❄️ NITROGEN COOLING (${Math.ceil(this.sim.coolantCooldownSec)}s)`;
        btnCool.disabled = true;
        btnCool.classList.add('opacity-50', 'cursor-not-allowed');
      } else {
        btnCool.innerText = '❄️ CRYO-COOLANT SPRAY ($60)';
        btnCool.disabled = this.sim.cash < 60;
        btnCool.classList.toggle('opacity-50', this.sim.cash < 60);
        btnCool.classList.toggle('cursor-not-allowed', this.sim.cash < 60);
      }
    }

    // 6. Breaking ticker
    const ticker = document.getElementById('breaking-ticker-text');
    if (ticker && window.EventSystem) {
      ticker.innerText = window.EventSystem.breakingTicker;
    }

    // Safety auto-resume: if no modal dialog is visible and player didn't manually pause, ensure game is running!
    const hasVisibleModal = document.querySelector('.modal-container:not(.hidden)');
    if (!hasVisibleModal && this.sim.paused && this.sim.gameSpeed > 0 && !this.sim.gameOver) {
      this.sim.paused = false;
    }

    // Pending posts indicator
    const pendingPill = document.getElementById('feed-pending-indicator');
    if (pendingPill) {
      if (this.sim.pendingPosts && this.sim.pendingPosts.length > 0) {
        pendingPill.classList.remove('hidden');
        const countEl = document.getElementById('pending-count-text');
        if (countEl) countEl.innerText = `🔔 ${this.sim.pendingPosts.length} New Posts (Click to reveal)`;
      } else {
        pendingPill.classList.add('hidden');
      }
    }

    // 7. Check if Crisis pending notification banner or modal needs to be updated
    const pendingCrisisBanner = document.getElementById('crisis-pending-banner');
    if (pendingCrisisBanner && window.EventSystem) {
      if (window.EventSystem.pendingDecree) {
        pendingCrisisBanner.classList.remove('hidden');
        const headlineEl = document.getElementById('crisis-banner-title');
        if (headlineEl) headlineEl.innerText = window.EventSystem.pendingDecree.headline;
      } else {
        pendingCrisisBanner.classList.add('hidden');
      }
    }

    if (window.EventSystem && window.EventSystem.activeCrisis) {
      this.showCrisisDialog(window.EventSystem.activeCrisis);
    } else {
      const crisisModal = document.getElementById('modal-crisis');
      if (crisisModal && !crisisModal.classList.contains('hidden')) {
        crisisModal.classList.add('hidden');
      }
    }

    // 8. Check Ending dialog
    if (this.sim.gameOver && this.sim.activeEnding) {
      this.showEndingDialog(this.sim.activeEnding);
    }
  }

  renderFeed() {
    const container = document.getElementById('feed-stream');
    if (!container) return;

    // Render Boss Encounter Card if Active
    let bossHtml = '';
    if (window.BossManager && window.BossManager.activeBoss) {
      const b = window.BossManager.activeBoss;
      const progress = Math.max(0, (window.BossManager.bossTimer / b.durationSec) * 100);

      if (window.BossManager.isMinimized) {
        // Minimalist collapsed 1-line bar: unobtrusive while reading feed
        bossHtml = `
          <div class="p-2 bg-gradient-to-r from-red-950 via-zinc-950 to-red-950 border border-red-500/80 rounded-lg flex items-center justify-between font-mono text-xs mb-2.5 shadow-lg">
            <div class="flex items-center gap-2 truncate pr-2">
              <span class="text-base">${b.icon}</span>
              <span class="font-extrabold text-red-300 truncate">${b.name}</span>
              <span class="text-[10px] text-amber-300 font-bold bg-red-900/60 px-1.5 py-0.2 rounded border border-red-700/60">
                ⏳ ${Math.ceil(window.BossManager.bossTimer)}s
              </span>
            </div>
            <div class="flex items-center gap-1.5 shrink-0">
              <button data-boss-action="BRIBE" class="py-1 px-2 rounded bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 border border-emerald-500 text-[10px] font-bold active:scale-95" title="Bribe influencer into compliance ($${b.bribeCost})">
                💰 Bribe ($${b.bribeCost})
              </button>
              <button data-boss-action="SHADOWBAN" class="py-1 px-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-600 text-[10px] font-bold active:scale-95" title="Super-Shadowban ($40)">
                🛡️ Shadow ($40)
              </button>
              <button data-boss-action="TOGGLE_MIN" class="py-1 px-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700 text-[10px] font-mono" title="Expand Full Boss Card">
                ▼ Expand
              </button>
            </div>
          </div>
        `;
      } else {
        // Full Dossier with Collapse button
        bossHtml = `
          <div class="p-3 bg-gradient-to-r from-red-950 via-zinc-950 to-red-950 border-2 border-red-500/90 rounded-lg shadow-2xl font-mono mb-2.5 transition-all">
            <div class="flex items-center justify-between mb-1">
              <div class="flex items-center gap-2">
                <span class="text-2xl">${b.icon}</span>
                <div>
                  <span class="font-extrabold text-xs text-red-400 tracking-wider">${b.title}</span>
                  <div class="text-[10px] text-zinc-300">${b.name} (${b.handle})</div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-amber-300 bg-red-900/80 px-2 py-0.5 rounded border border-red-600">
                  ⚠️ ${Math.ceil(window.BossManager.bossTimer)}s REMAINING
                </span>
                <button data-boss-action="TOGGLE_MIN" class="text-[10px] text-zinc-400 hover:text-white px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-700" title="Collapse Boss Card to Compact Bar">
                  ─ Minimize
                </button>
              </div>
            </div>
            <p class="text-xs text-white font-sans font-semibold italic my-2 p-2 bg-black/80 rounded border border-red-900/80">
              "${b.dialogue}"
            </p>
            <div class="w-full bg-zinc-800 h-1.5 rounded overflow-hidden mb-2.5">
              <div class="bg-red-500 h-full transition-all duration-200" style="width: ${progress}%;"></div>
            </div>
            <div class="grid grid-cols-3 gap-1.5 text-[10px]">
              <button data-boss-action="BRIBE" class="py-1 px-1.5 rounded bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 border border-emerald-500 font-bold active:scale-95 transition-all" title="Bribe influencer into compliance">
                💰 BRIBE ($${b.bribeCost})
              </button>
              <button data-boss-action="SWARM" class="py-1 px-1.5 rounded bg-amber-900/80 hover:bg-amber-800 text-amber-200 border border-amber-500 font-bold active:scale-95 transition-all" title="Deploy bot army quote-tweet swarm">
                💣 QUOTE-BOMB (${b.swarmCostWatts}⚡)
              </button>
              <button data-boss-action="SHADOWBAN" class="py-1 px-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-500 font-bold active:scale-95 transition-all" title="Algorithmic suppression">
                🛡️ SUPER-SHADOW ($40)
              </button>
            </div>
          </div>
        `;
      }
    }

    // Preserve scroll position if user is scrolling
    const currentPostsHtml = this.sim.activeFeed.map(post => {
      let quoteHtml = '';
      if (post.quoteReply) {
        quoteHtml = `
          <div class="mt-2.5 p-2.5 rounded bg-black/60 border-l-4 border-rose-500 text-xs">
            <div class="flex items-center gap-1.5 font-bold text-rose-400 mb-1">
              <span>${post.quoteReply.icon}</span>
              <span>${post.quoteReply.badge}</span>
              <span class="text-zinc-400 font-normal">quoted with fury:</span>
            </div>
            <p class="text-zinc-200 italic font-mono">"${post.quoteReply.text}"</p>
          </div>
        `;
      }

      let adHtml = '';
      if (post.adBanner) {
        adHtml = `
          <div class="mt-2.5 p-2 rounded bg-amber-950/60 border border-amber-500/50 text-[11px] text-amber-200 font-mono">
            <span class="bg-amber-500 text-black px-1 font-bold text-[9px] uppercase tracking-wider rounded mr-1">AD</span>
            <span class="font-bold">${post.adBanner.title}</span>
            <p class="mt-1 text-zinc-300 text-[10px] leading-tight">${post.adBanner.body}</p>
          </div>
        `;
      }

      const shadowClass = post.shadowbanned ? 'opacity-30 grayscale pointer-events-none' : '';

      return `
        <div class="pixel-box p-3.5 bg-zinc-900/90 border border-zinc-700/80 rounded-md transition-all hover:border-zinc-500 ${shadowClass}">
          <!-- Header -->
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded flex items-center justify-center font-bold text-base shadow" style="background-color: ${post.avatarColor}">
                ${post.icon}
              </div>
              <div>
                <div class="flex items-center gap-1.5">
                  <span class="font-bold text-white text-xs tracking-wide">${post.author}</span>
                  <span class="text-[10px] px-1 py-0.2 rounded font-mono font-semibold" style="background-color: ${post.theme}22; color: ${post.theme}">
                    ${post.badge}
                  </span>
                </div>
                <div class="text-[10px] text-zinc-400 font-mono">${post.handle} • ${post.timestamp}</div>
              </div>
            </div>
            <div class="text-[10px] font-mono text-zinc-500">
              #${post.id.split('_')[1] || post.id}
            </div>
          </div>

          <!-- Body -->
          <p class="text-xs text-zinc-100 font-sans leading-relaxed tracking-normal select-text">
            ${post.content}
          </p>
          <div class="mt-1.5 text-[11px] font-mono text-blue-400">
            ${Array.isArray(post.hashtags) ? post.hashtags.join(' ') : (post.hashtags || '')}
          </div>

          <!-- Quoted Outrage Reply -->
          ${quoteHtml}

          <!-- Injected Ad -->
          ${adHtml}

          <!-- Stats (with informative tooltips) -->
          <div class="mt-2.5 flex items-center gap-3 text-[10px] font-mono text-zinc-400 border-t border-zinc-800/80 pt-2">
            <span title="Total Algorithm Impressions">👁️ ${(post.stats?.views || 0).toLocaleString()}</span>
            <span class="text-rose-400" title="Outrage & Angry Reactions">😡 ${(post.stats?.angries || 0).toLocaleString()}</span>
            <span title="Retweets & Echo-Chamber Shares">🔄 ${(post.stats?.shares || 0).toLocaleString()}</span>
            <span title="Toxic Quote-Dunk Ratio">💀 ${(post.stats?.skulls || 0).toLocaleString()}</span>
          </div>

          <!-- Algorithmic Interventions (with Explanatory Tooltips) -->
          <div class="mt-2.5 grid grid-cols-4 gap-1.5 font-mono text-[10px]">
            <button data-action="BOOST" data-post-id="${post.id}" ${post.amplified ? 'disabled' : ''} 
              title="Amplify algorithmic reach (+Neuro-Watts, +Hardware Heat)"
              class="py-1 px-1.5 rounded bg-blue-900/60 hover:bg-blue-800 text-blue-200 border border-blue-700/60 font-semibold transition-all disabled:opacity-30 disabled:pointer-events-none active:scale-95">
              🚀 BOOST
            </button>
            <button data-action="OUTRAGE" data-post-id="${post.id}" ${post.outraged ? 'disabled' : ''} 
              title="Stoke faction hostility (+Civilization Tension)"
              class="py-1 px-1.5 rounded bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700/60 font-semibold transition-all disabled:opacity-30 disabled:pointer-events-none active:scale-95">
              🤬 POLARIZE
            </button>
            <button data-action="MONETIZE" data-post-id="${post.id}" ${post.monetized ? 'disabled' : ''} 
              title="Monetize with sponsored product placement (+$Ad Revenue)"
              class="py-1 px-1.5 rounded bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/60 font-semibold transition-all disabled:opacity-30 disabled:pointer-events-none active:scale-95">
              💰 AD-FARM
            </button>
            <button data-action="SHADOWBAN" data-post-id="${post.id}" ${post.shadowbanned ? 'disabled' : ''} 
              title="Suppress post from algorithms (-Civilization Tension, cools hardware)"
              class="py-1 px-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-600 font-semibold transition-all disabled:opacity-30 disabled:pointer-events-none active:scale-95">
              🛡️ SHADOW
            </button>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = bossHtml + currentPostsHtml;
  }

  renderCanvasSparkline() {
    // 1. Render Sparkline Oscilloscope
    if (this.canvas && this.ctx) {
      const ctx = this.ctx;
      const w = this.canvas.width;
      const h = this.canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Grid lines
      ctx.strokeStyle = '#27272a';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.25);
      ctx.lineTo(w, h * 0.25);
      ctx.moveTo(0, h * 0.5);
      ctx.lineTo(w, h * 0.5);
      ctx.moveTo(0, h * 0.75);
      ctx.lineTo(w, h * 0.75);
      ctx.stroke();

      // Rot zone guide box (65% to 92%)
      const yTop = h - (92 / 100) * h;
      const yBottom = h - (65 / 100) * h;
      ctx.fillStyle = 'rgba(234, 179, 8, 0.08)';
      ctx.fillRect(0, yTop, w, yBottom - yTop);

      // Draw Tension Line (Amber / Red)
      this.drawLineSeries(this.sim.history.tension, 100, '#f59e0b', 2);

      // Draw Server Heat Line (Cyan / Magenta)
      this.drawLineSeries(this.sim.history.serverTemp, this.sim.maxServerTemp, '#06b6d4', 1.5);
    }

    // 2. Render Riot Radar Map
    if (window.RiotRadarMap) {
      window.RiotRadarMap.render(this.sim);
    }
  }

  openDossierModal() {
    const modal = document.getElementById('modal-dossier');
    if (!modal) return;
    modal.classList.remove('hidden');

    const previewContainer = document.getElementById('dossier-preview-container');
    if (previewContainer && window.DossierGenerator) {
      previewContainer.innerHTML = '';
      const canvas = window.DossierGenerator.generate(this.sim);
      canvas.className = 'w-full h-auto rounded border border-zinc-700 shadow-xl';
      previewContainer.appendChild(canvas);
    }
    if (window.AudioSynth) window.AudioSynth.playClick();
  }

  drawLineSeries(series, maxVal, color, lineWidth) {
    if (series.length < 2) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const step = w / (this.sim.history.maxPoints - 1);

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();

    for (let i = 0; i < series.length; i++) {
      const val = series[i];
      const x = i * step;
      const y = h - (Math.min(maxVal, Math.max(0, val)) / maxVal) * h;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  renderUpgradesList() {
    const listContainer = document.getElementById('upgrades-items-list');
    if (!listContainer || !window.UpgradeManager) return;

    listContainer.innerHTML = window.UpgradeManager.upgrades.map(upg => {
      const canAfford = window.UpgradeManager.canAfford(upg.id, this.sim.watts, this.sim.cash);
      const isUnlocked = upg.unlocked;

      return `
        <div class="p-3 rounded border font-mono ${isUnlocked ? 'bg-zinc-950/60 border-emerald-800/60 opacity-60' : 'bg-zinc-900 border-zinc-700'}">
          <div class="flex items-center justify-between mb-1">
            <span class="font-bold text-xs ${isUnlocked ? 'text-emerald-400' : 'text-zinc-100'}">
              ${isUnlocked ? '✅' : '🔒'} ${upg.name}
            </span>
            <span class="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
              TIER ${upg.tier}
            </span>
          </div>
          <p class="text-[11px] text-zinc-300 mb-1 leading-normal font-sans">${upg.desc}</p>
          <p class="text-[10px] text-zinc-500 italic mb-2">${upg.flavor}</p>
          
          <div class="flex items-center justify-between pt-1 border-t border-zinc-800 text-[10px]">
            <div class="flex gap-2">
              <span class="text-amber-400 font-bold">${upg.costWatts.toLocaleString()}⚡</span>
              <span class="text-emerald-400 font-bold">$${upg.costCash.toLocaleString()}💵</span>
            </div>
            ${isUnlocked 
              ? `<span class="text-emerald-500 font-bold">RESEARCHED</span>`
              : `<button class="px-2.5 py-1 rounded font-bold text-black ${canAfford ? 'bg-amber-400 hover:bg-amber-300' : 'bg-zinc-700 text-zinc-400 cursor-not-allowed'}"
                  ${canAfford ? `onclick="window.UIController.buyUpgrade('${upg.id}')"` : 'disabled'}>
                  DEPLOY UPGRADE
                </button>`
            }
          </div>
        </div>
      `;
    }).join('');
  }

  buyUpgrade(id) {
    if (window.UpgradeManager) {
      const bought = window.UpgradeManager.purchase(id, this.sim);
      if (bought) {
        this.renderUpgradesList();
        this.updateHUD();
      }
    }
  }

  renderBadgesList() {
    const listContainer = document.getElementById('badges-items-list');
    if (!listContainer || !window.AchievementSystem) return;

    listContainer.innerHTML = window.AchievementSystem.achievements.map(ach => {
      return `
        <div class="p-3 rounded border font-mono flex items-start gap-3 ${ach.unlocked ? 'bg-amber-950/30 border-amber-600/60' : 'bg-zinc-900/60 border-zinc-800 opacity-40'}">
          <div class="text-2xl">${ach.icon}</div>
          <div>
            <div class="font-bold text-xs ${ach.unlocked ? 'text-amber-300' : 'text-zinc-400'}">
              ${ach.name} ${ach.unlocked ? '🏆' : '(LOCKED)'}
            </div>
            <p class="text-[11px] text-zinc-300 font-sans mt-0.5">${ach.desc}</p>
          </div>
        </div>
      `;
    }).join('');

    // Endings history gallery
    const endingsList = document.getElementById('endings-unlocked-list');
    if (endingsList) {
      endingsList.innerHTML = Object.keys(window.ENDINGS_DATABASE).map(k => {
        const e = window.ENDINGS_DATABASE[k];
        const unlocked = window.AchievementSystem.endingsUnlocked[k];
        return `
          <div class="p-2 rounded border text-xs font-mono flex items-center justify-between ${unlocked ? 'bg-zinc-800 border-zinc-600' : 'bg-zinc-950 border-zinc-900 opacity-40'}">
            <span>${e.icon} ${e.title}</span>
            <span class="text-[10px] font-bold ${unlocked ? 'text-emerald-400' : 'text-zinc-600'}">
              ${unlocked ? 'DISCOVERED' : 'UNDISCOVERED'}
            </span>
          </div>
        `;
      }).join('');
    }
  }

  showCrisisDialog(crisis) {
    const modal = document.getElementById('modal-crisis');
    if (!modal) return;
    this.sim.paused = true; // Auto-pause during crisis
    modal.classList.remove('hidden');

    document.getElementById('crisis-title').innerText = crisis.title;
    document.getElementById('crisis-headline').innerText = crisis.headline;
    document.getElementById('crisis-desc').innerText = crisis.desc;

    const btnA = document.getElementById('crisis-btn-a');
    const btnB = document.getElementById('crisis-btn-b');

    btnA.innerText = crisis.choiceA.label;
    btnB.innerText = crisis.choiceB.label;

    btnA.onclick = () => {
      window.EventSystem.resolveCrisis('A', this.sim);
      modal.classList.add('hidden');
      if (this.sim && this.sim.gameSpeed > 0 && !this.sim.gameOver) {
        this.sim.paused = false;
      }
    };

    btnB.onclick = () => {
      window.EventSystem.resolveCrisis('B', this.sim);
      modal.classList.add('hidden');
      if (this.sim && this.sim.gameSpeed > 0 && !this.sim.gameOver) {
        this.sim.paused = false;
      }
    };
  }

  showEndingDialog(ending) {
    const modal = document.getElementById('modal-ending');
    if (!modal) return;
    this.sim.paused = true;
    modal.classList.remove('hidden');

    document.getElementById('ending-icon').innerText = ending.icon;
    document.getElementById('ending-title').innerText = ending.title;
    document.getElementById('ending-subtitle').innerText = ending.subtitle;
    document.getElementById('ending-story').innerText = ending.story;
    document.getElementById('ending-stat').innerText = ending.statComment;
    document.getElementById('ending-badge').innerText = ending.awardBadge;

    const continueBtn = document.getElementById('ending-btn-continue');
    if (continueBtn) {
      continueBtn.onclick = () => {
        modal.classList.add('hidden');
        this.sim.continuePlaying();
        this.createFloatingText('🌌 CONTINUING IN SANDBOX / ENDLESS MODE!', window.innerWidth / 2, window.innerHeight / 2, '#34d399');
        this.renderFeed();
      };
    }

    const restartBtn = document.getElementById('ending-btn-restart');
    restartBtn.onclick = () => {
      modal.classList.add('hidden');
      this.sim.resetSimulation(false);
      this.renderFeed();
    };

    const prestigeBtn = document.getElementById('ending-btn-prestige');
    prestigeBtn.onclick = () => {
      modal.classList.add('hidden');
      this.sim.resetSimulation(true);
      this.createFloatingText('🌌 TIMELINE RESET! HARVEST MULTIPLIER UPGRADED!', window.innerWidth / 2, window.innerHeight / 2, '#a855f7');
      this.renderFeed();
    };
  }

  createFloatingText(text, x, y, color = '#fbbf24') {
    const el = document.createElement('div');
    el.className = 'floating-feedback font-mono font-bold text-xs select-none pointer-events-none fixed z-50';
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.color = color;
    el.innerText = text;
    document.body.appendChild(el);

    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 1200);
  }
}

window.UIController = new UIController();

