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

    // 1. DEEP OCEAN BASE (32-bit Retro Nautical Grid)
    ctx.fillStyle = '#061325';
    ctx.fillRect(0, 0, w, h);

    // Ocean depth contour bands & subtle animated wave ripples
    ctx.fillStyle = '#0a1d38';
    for (let wy = 18; wy < h; wy += 14) {
      const wShift = Math.sin(this.pulsePhase + wy * 0.1) * 3;
      ctx.fillRect(0, wy, w, 2);
      ctx.fillStyle = 'rgba(14, 165, 233, 0.12)';
      for (let wx = 8; wx < w; wx += 28) {
        ctx.fillRect(wx + wShift, wy, 8, 1);
      }
      ctx.fillStyle = '#0a1d38';
    }

    // 2. OVERWORLD CONTINENTS & ARCHIPELAGOS (32-bit pixel landmasses)
    const islands = [
      // Sector 1: Silicon Peninsula (North-West)
      { cx: 45, cy: 38, rx: 22, ry: 14, col: '#1e3a5f', coast: '#38bdf8' },
      // Sector 2: Metro Megacity (Center-West)
      { cx: 105, cy: 56, rx: 26, ry: 16, col: '#14532d', coast: '#4ade80' },
      // Sector 3: Suburbia Belt (East)
      { cx: 175, cy: 44, rx: 28, ry: 15, col: '#166534', coast: '#86efac' },
      // Sector 4: Ancestral Valley (North-Center)
      { cx: 130, cy: 26, rx: 20, ry: 12, col: '#78350f', coast: '#f59e0b' },
      // Sector 5: Sub-Zero Datacenter (Far-East Glaciers)
      { cx: 225, cy: 24, rx: 24, ry: 13, col: '#0f766e', coast: '#67e8f9' }
    ];

    islands.forEach(isl => {
      // Coastline shallow water reef
      ctx.fillStyle = 'rgba(2, 132, 199, 0.25)';
      ctx.beginPath();
      ctx.ellipse(isl.cx, isl.cy, isl.rx + 3, isl.ry + 2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Landmass body
      ctx.fillStyle = isl.col;
      ctx.beginPath();
      ctx.ellipse(isl.cx, isl.cy, isl.rx, isl.ry, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pixel dither highlight on land
      ctx.fillStyle = isl.coast;
      ctx.globalAlpha = 0.25;
      ctx.fillRect(isl.cx - 6, isl.cy - 3, 12, 3);
      ctx.globalAlpha = 1.0;
    });

    // 3. RETRO TACTICAL OVERWORLD SECTORS & OUTPOSTS
    this.sectors.forEach((sec, idx) => {
      let totalTension = 0;
      sec.factions.forEach(fId => {
        totalTension += (simState.factionTensions[fId] || 50);
      });
      const avgTension = totalTension / sec.factions.length;

      let statusColor = '#22c55e'; // Green: Calm
      let beaconGlow = '#4ade80';
      const isSelected = (this.activeSectorBriefing && this.activeSectorBriefing.id === sec.id);

      if (avgTension >= 80) {
        statusColor = '#ef4444'; // Red: Active Riot
        beaconGlow = '#f87171';
      } else if (avgTension >= 65) {
        statusColor = '#f59e0b'; // Amber: Unrest
        beaconGlow = '#fbbf24';
      }

      // 3D Pixel Outpost Tower Body
      ctx.fillStyle = '#09090b';
      ctx.fillRect(sec.x - 4, sec.y - 4, 8, 8);
      ctx.fillStyle = '#334155';
      ctx.fillRect(sec.x - 3, sec.y - 3, 6, 6);

      // Glowing status crystal on tower roof
      ctx.fillStyle = statusColor;
      ctx.fillRect(sec.x - 2, sec.y - 2, 4, 4);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(sec.x - 1, sec.y - 1, 2, 2);

      // Flashing warning beacon pulse ring
      if (avgTension >= 65) {
        const pulseR = 7 + Math.sin(this.pulsePhase * 3 + idx) * 3;
        ctx.strokeStyle = beaconGlow;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(sec.x, sec.y, pulseR, 0, Math.PI * 2);
        ctx.stroke();

        // Mini smoke/spark particles if severe riot
        if (avgTension >= 80) {
          ctx.fillStyle = Math.random() < 0.5 ? '#ef4444' : '#f59e0b';
          const sparkY = sec.y - 6 - (Math.random() * 4);
          ctx.fillRect(sec.x - 1 + (Math.random() * 3 - 1), sparkY, 2, 2);
        }
      }

      // Selected Target Reticle (32-bit RPG crosshair)
      if (isSelected) {
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 1;
        // 4 corner crosshair brackets
        const bSize = 8;
        ctx.strokeRect(sec.x - bSize, sec.y - bSize, bSize * 2, bSize * 2);
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(sec.x - 1, sec.y - bSize - 2, 2, 2);
        ctx.fillRect(sec.x - 1, sec.y + bSize + 1, 2, 2);
      }

      // Sector ID Plate
      ctx.fillStyle = '#09090b';
      ctx.fillRect(sec.x + 6, sec.y - 4, 18, 9);
      ctx.strokeStyle = statusColor;
      ctx.lineWidth = 1;
      ctx.strokeRect(sec.x + 6, sec.y - 4, 18, 9);
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 7px monospace';
      ctx.fillText(`S${idx + 1}`, sec.x + 8, sec.y + 3);
    });

    // 4. RETRO COMPASS ROSE (Top-Right)
    const crX = w - 18;
    const crY = 24;
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(crX, crY, 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(crX - 1, crY - 7, 2, 6); // North pointer
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 6px monospace';
    ctx.fillText('N', crX - 2, crY - 8);

    // 5. 32-BIT ORNATE LOCATION RIBBON BANNER (Top of Canvas)
    const locName = this.activeSectorBriefing 
      ? this.activeSectorBriefing.name.toUpperCase() 
      : 'SECTOR RADAR ACTIVE';

    // Banner background with golden filigree edge
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, w, 15);
    ctx.fillStyle = '#a16207';
    ctx.fillRect(0, 14, w, 1);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(0, 15, w, 1);

    // Golden corner studs
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(2, 2, 2, 2);
    ctx.fillRect(w - 4, 2, 2, 2);

    // Banner Text: Name of active location & coordinate status
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 8px monospace';
    ctx.fillText(`📍 ${locName}`, 8, 10);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '7px monospace';
    ctx.fillText(`[GRID 32-BIT]`, w - 70, 10);

    // 6. UPDATE BRIEFING CONTAINER UNDER CANVAS
    const briefingEl = document.getElementById('map-briefing-text');
    if (briefingEl && this.activeSectorBriefing) {
      let tSum = 0;
      this.activeSectorBriefing.factions.forEach(f => tSum += (simState.factionTensions[f] || 50));
      const tAvg = Math.round(tSum / this.activeSectorBriefing.factions.length);
      briefingEl.innerHTML = `
        <div class="flex items-center justify-between text-[11px] font-mono border-b border-zinc-800 pb-1 mb-1">
          <span class="text-amber-300 font-bold tracking-wider">🗺️ ${this.activeSectorBriefing.name}</span>
          <span class="px-1.5 py-0.2 rounded font-bold ${tAvg >= 80 ? 'bg-red-950 text-red-300 border border-red-800' : (tAvg >= 65 ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800')}">
            ${tAvg}% TENSION
          </span>
        </div>
        <p class="text-[10px] text-zinc-300 font-sans italic leading-snug">${this.activeSectorBriefing.riotDesc}</p>
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

