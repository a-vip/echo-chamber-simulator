/**
 * The Echo Chamber Simulator - Animated Consequence Cutscene Player
 * Plays animated 32-bit retro consequences following big crisis decrees and boss resolutions.
 */

class ConsequencePlayer {
  constructor() {
    this.modal = null;
    this.canvas = null;
    this.ctx = null;
    this.animTime = 0;
    this.animType = 'riot'; // 'riot', 'money_rain', 'freeze', 'peace'
    this.rafId = null;
  }

  show({ title, headline, story, statDeltas, animType = 'riot' }) {
    if (!this.modal) this.modal = document.getElementById('modal-consequence');
    if (!this.canvas) this.canvas = document.getElementById('consequence-canvas');
    if (this.canvas) this.ctx = this.canvas.getContext('2d');

    // Auto-pause game
    if (window.SimulationEngine) {
      window.SimulationEngine.paused = true;
    }

    this.animType = animType;
    this.animTime = 0;

    document.getElementById('csq-title').innerText = title || '⚠️ ALGORITHMIC CONSEQUENCE';
    document.getElementById('csq-headline').innerText = headline || 'Immediate societal reaction recorded.';
    document.getElementById('csq-story').innerText = story || 'Your algorithmic decree has cascaded through the optic fiber networks.';

    const deltasContainer = document.getElementById('csq-deltas');
    if (deltasContainer && statDeltas) {
      deltasContainer.innerHTML = statDeltas.map(d => `
        <span class="px-2 py-1 rounded text-xs font-mono font-bold ${d.colorClass}">
          ${d.text}
        </span>
      `).join('');
    }

    if (this.modal) this.modal.classList.remove('hidden');

    this.startAnimation();
  }

  startAnimation() {
    if (this.rafId) cancelAnimationFrame(this.rafId);

    const loop = () => {
      this.animTime += 0.04;
      this.draw();
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  close() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this.modal) this.modal.classList.add('hidden');

    // Resume simulation
    if (window.SimulationEngine) {
      window.SimulationEngine.paused = false;
    }
    if (window.AudioSynth) window.AudioSynth.playClick();
  }

  draw() {
    if (!this.ctx || !this.canvas) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Dark cyber street background
    ctx.fillStyle = '#09090b';
    ctx.fillRect(0, 0, w, h);

    if (this.animType === 'riot') {
      this.drawRiotAnimation(ctx, w, h);
    } else if (this.animType === 'money_rain') {
      this.drawMoneyAnimation(ctx, w, h);
    } else if (this.animType === 'freeze') {
      this.drawFreezeAnimation(ctx, w, h);
    } else {
      this.drawPeaceAnimation(ctx, w, h);
    }
  }

  drawRiotAnimation(ctx, w, h) {
    // Red emergency glow
    ctx.fillStyle = 'rgba(239, 68, 68, 0.12)';
    ctx.fillRect(0, 0, w, h);

    // Ground
    ctx.fillStyle = '#18181b';
    ctx.fillRect(0, h - 30, w, 30);

    // Flashing siren light
    const sirenFlash = Math.sin(this.animTime * 12) > 0;
    ctx.fillStyle = sirenFlash ? '#ef4444' : '#3b82f6';
    ctx.beginPath();
    ctx.arc(w / 2, 25, 8, 0, Math.PI * 2);
    ctx.fill();

    // Burning trash bin / server rack with fire
    ctx.fillStyle = '#3f3f46';
    ctx.fillRect(w / 2 - 12, h - 45, 24, 25);
    // Fire particles
    for (let i = 0; i < 6; i++) {
      const fX = w / 2 - 8 + (i * 3);
      const fY = h - 48 - Math.sin(this.animTime * 10 + i) * 12;
      ctx.fillStyle = i % 2 === 0 ? '#f59e0b' : '#ef4444';
      ctx.fillRect(fX, fY, 4, 8);
    }

    // Two pixel mobs clashing
    // Left mob (Blue faction)
    for (let i = 0; i < 4; i++) {
      const x = 40 + i * 16 + Math.sin(this.animTime * 8 + i) * 3;
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(x, h - 50, 8, 20); // body
      ctx.fillStyle = '#fde68a';
      ctx.fillRect(x + 1, h - 58, 6, 8); // head
      // Pixel protest sign
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(x - 2, h - 68, 12, 8);
      ctx.fillStyle = '#64748b';
      ctx.fillRect(x + 3, h - 60, 2, 12); // sign stick
    }

    // Right mob (Pink / Red faction)
    for (let i = 0; i < 4; i++) {
      const x = w - 90 + i * 16 - Math.sin(this.animTime * 8 + i) * 3;
      ctx.fillStyle = '#ec4899';
      ctx.fillRect(x, h - 50, 8, 20);
      ctx.fillStyle = '#fde68a';
      ctx.fillRect(x + 1, h - 58, 6, 8);
      ctx.fillStyle = '#fbcfe8';
      ctx.fillRect(x - 2, h - 68, 12, 8);
      ctx.fillStyle = '#64748b';
      ctx.fillRect(x + 3, h - 60, 2, 12);
    }

    // Projectile flying across
    const projX = (w / 2) + Math.cos(this.animTime * 5) * 60;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(projX, h - 55, 4, 4);
  }

  drawMoneyAnimation(ctx, w, h) {
    // Green money glow
    ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
    ctx.fillRect(0, 0, w, h);

    // Falling pixel dollar bills
    for (let i = 0; i < 15; i++) {
      const x = (i * 30 + 15) % w;
      const y = ((this.animTime * 60 + i * 40) % (h + 30)) - 20;
      ctx.fillStyle = '#10b981';
      ctx.fillRect(x, y, 14, 8);
      ctx.fillStyle = '#ecfdf5';
      ctx.font = 'bold 7px monospace';
      ctx.fillText('$', x + 4, y + 7);
    }

    // Vault in center
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(w / 2 - 25, h - 45, 50, 35);
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 2;
    ctx.strokeRect(w / 2 - 25, h - 45, 50, 35);

    // Vault wheel
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.arc(w / 2, h - 28, 7, 0, Math.PI * 2);
    ctx.fill();
  }

  drawFreezeAnimation(ctx, w, h) {
    // Cyan ice frost overlay
    ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
    ctx.fillRect(0, 0, w, h);

    // Falling pixel snowflakes
    for (let i = 0; i < 25; i++) {
      const x = (i * 20 + Math.sin(this.animTime * 2 + i) * 15) % w;
      const y = (this.animTime * 45 + i * 25) % h;
      ctx.fillStyle = '#cffafe';
      ctx.fillRect(x, y, 3, 3);
    }

    // Frozen server rack with icicles
    ctx.fillStyle = '#0e7490';
    ctx.fillRect(w / 2 - 20, h - 55, 40, 45);
    ctx.fillStyle = '#67e8f9';
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(w / 2 - 18 + i * 8, h - 55);
      ctx.lineTo(w / 2 - 14 + i * 8, h - 55);
      ctx.lineTo(w / 2 - 16 + i * 8, h - 45 + (i % 2) * 5);
      ctx.fill();
    }
  }

  drawPeaceAnimation(ctx, w, h) {
    // Peaceful green grass & sunshine
    ctx.fillStyle = 'rgba(34, 197, 94, 0.12)';
    ctx.fillRect(0, 0, w, h);

    // Sun in corner
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(40, 30, 16, 0, Math.PI * 2);
    ctx.fill();

    // Cat & Dog sleeping peacefully together
    ctx.fillStyle = '#d97706';
    ctx.fillRect(w / 2 - 20, h - 25, 20, 12); // Dog
    ctx.fillStyle = '#a855f7';
    ctx.fillRect(w / 2 + 2, h - 23, 16, 10); // Cat cuddled up
    // Zzz bubbles
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '8px monospace';
    const zY = h - 35 - (this.animTime * 15 % 20);
    ctx.fillText('Zzz...', w / 2 - 5, zY);
  }
}

window.ConsequencePlayer = new ConsequencePlayer();
