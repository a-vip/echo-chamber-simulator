/**
 * The Echo Chamber Simulator - Faction Battle Map & Riot Radar
 * Live retro pixel radar canvas visualizing geopolitical riot flare-ups
 * across 5 planetary sectors driven by real-time faction tensions.
 */

class RiotRadarMap {
  constructor(canvasId = 'radar-map-canvas') {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.pulsePhase = 0;

    this.sectors = [
      {
        id: 'sec_tech',
        name: 'Sector 1: Silicon Peninsula',
        x: 45, y: 38,
        factions: ['tech_corp', 'tech_luddite'],
        riotDesc: 'Luddite stone-axe attacks on fiber hubs'
      },
      {
        id: 'sec_gender',
        name: 'Sector 2: Metro Megacity',
        x: 105, y: 55,
        factions: ['gender_alpha', 'gender_femme'],
        riotDesc: 'Dating app protest marches clashing with gym pods'
      },
      {
        id: 'sec_pets',
        name: 'Sector 3: The Suburbia Belt',
        x: 175, y: 42,
        factions: ['pet_cat', 'pet_dog'],
        riotDesc: 'Dog owners blockading artisanal salmon aisles'
      },
      {
        id: 'sec_diet',
        name: 'Sector 4: Ancestral Valley',
        x: 130, y: 25,
        factions: ['diet_carnivore', 'diet_vegan'],
        riotDesc: 'Raw liver cookouts besieged by celery monks'
      },
      {
        id: 'sec_polar',
        name: 'Sector 5: Sub-Zero Datacenter',
        x: 220, y: 18,
        factions: ['cosmic_flat', 'cosmic_sim'],
        riotDesc: 'Ice-wall truthers attempting to breach server vault'
      }
    ];

    this.activeSectorBriefing = this.sectors[1];
  }

  draw(simState) {
    return this.render(simState || window.SimulationEngine);
  }

  render(simState = window.SimulationEngine) {
    if (!this.canvas || !this.ctx) {
      this.canvas = document.getElementById('radar-map-canvas');
      if (this.canvas) this.ctx = this.canvas.getContext('2d');
      if (!this.ctx) return;
    }
    if (!simState) return;

    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    this.pulsePhase = (this.pulsePhase + 0.05) % (Math.PI * 2);

    // Clear background
    ctx.fillStyle = '#09090b';
    ctx.fillRect(0, 0, w, h);

    // Draw CRT radar grid
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 25) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Radar circular sweep lines
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.15)';
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 45, 0, Math.PI * 2);
    ctx.arc(w / 2, h / 2, 85, 0, Math.PI * 2);
    ctx.stroke();

    // Radar scanning line
    const sweepAngle = this.pulsePhase;
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(w / 2, h / 2);
    ctx.lineTo((w / 2) + Math.cos(sweepAngle) * 95, (h / 2) + Math.sin(sweepAngle) * 95);
    ctx.stroke();

    // Render Sectors
    this.sectors.forEach((sec, idx) => {
      // Calculate sector tension from its factions
      let totalTension = 0;
      sec.factions.forEach(fId => {
        totalTension += (simState.factionTensions[fId] || 50);
      });
      const avgTension = totalTension / sec.factions.length;

      let statusColor = '#10b981'; // Green: Calm
      let statusLabel = 'STABLE';
      let radius = 4;

      if (avgTension >= 80) {
        statusColor = '#ef4444'; // Red: Riots / War
        statusLabel = 'ACTIVE RIOT';
        radius = 7;
      } else if (avgTension >= 65) {
        statusColor = '#f59e0b'; // Amber: Unrest
        statusLabel = 'TENSION HIGH';
        radius = 5.5;
      }

      // Draw pulsating hazard ring if high tension
      if (avgTension >= 65) {
        const pulseR = radius + Math.sin(this.pulsePhase * 2 + idx) * 3;
        ctx.strokeStyle = statusColor;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(sec.x, sec.y, Math.max(1, pulseR), 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw sector node
      ctx.fillStyle = statusColor;
      ctx.beginPath();
      ctx.arc(sec.x, sec.y, radius, 0, Math.PI * 2);
      ctx.fill();

      // Sector label
      ctx.fillStyle = '#a1a1aa';
      ctx.font = '8px monospace';
      ctx.fillText(`S${idx + 1}`, sec.x + 6, sec.y + 3);
    });

    // Update active sector briefing text element
    const briefingEl = document.getElementById('map-briefing-text');
    if (briefingEl && this.activeSectorBriefing) {
      let tSum = 0;
      this.activeSectorBriefing.factions.forEach(f => tSum += (simState.factionTensions[f] || 50));
      const tAvg = Math.round(tSum / this.activeSectorBriefing.factions.length);
      briefingEl.innerHTML = `
        <span class="text-white font-bold">${this.activeSectorBriefing.name}:</span>
        <span class="${tAvg >= 80 ? 'text-red-400 font-bold' : (tAvg >= 65 ? 'text-amber-400' : 'text-emerald-400')}">${tAvg}% Tension</span>
        <p class="text-[10px] text-zinc-400 italic">${this.activeSectorBriefing.riotDesc}</p>
      `;
    }
  }

  selectSectorByClick(canvasX, canvasY) {
    let closest = null;
    let minDist = 999;
    this.sectors.forEach(sec => {
      const dist = Math.hypot(sec.x - canvasX, sec.y - canvasY);
      if (dist < minDist) {
        minDist = dist;
        closest = sec;
      }
    });

    if (closest && minDist < 35) {
      this.activeSectorBriefing = closest;
      if (window.AudioSynth) window.AudioSynth.playClick();
      return closest;
    }
    return null;
  }
}

window.RiotRadarMap = new RiotRadarMap();

