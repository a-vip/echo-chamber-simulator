/**
 * The Echo Chamber Simulator - 32-bit Animated Pixel Characters & Street Arena
 * Renders charming retro pixel characters representing each faction interacting,
 * arguing, protesting, and clashing in a live animated pixel city street!
 */

class FactionCharacter {
  constructor(type, x, arenaWidth) {
    this.type = type;
    this.x = x;
    this.arenaWidth = arenaWidth;
    this.speed = (Math.random() * 25 + 15) * (Math.random() < 0.5 ? 1 : -1);
    this.yBob = 0;
    this.animTime = Math.random() * 10;
    this.state = 'walk'; // 'walk', 'argue', 'celebrate', 'rage'
    this.speechBubble = null;
    this.speechTimer = 0;
    this.targetChar = null;
  }

  update(deltaSec, characters, simState) {
    this.animTime += deltaSec * 8;
    this.yBob = Math.sin(this.animTime) * 2;

    if (this.speechTimer > 0) {
      this.speechTimer -= deltaSec;
      if (this.speechTimer <= 0) this.speechBubble = null;
    }

    // State machine
    if (this.state === 'walk') {
      this.x += this.speed * deltaSec;
      if (this.x < 15) { this.x = 15; this.speed = Math.abs(this.speed); }
      if (this.x > this.arenaWidth - 25) { this.x = this.arenaWidth - 25; this.speed = -Math.abs(this.speed); }

      // Check proximity to opposing faction
      for (const other of characters) {
        if (other !== this && Math.abs(other.x - this.x) < 32) {
          if (this.isRival(other.type)) {
            // Chance to start a street argument
            if (Math.random() < 0.04 && this.speechTimer <= 0) {
              this.startArgument(other);
              break;
            }
          }
        }
      }
    } else if (this.state === 'argue') {
      // Face each other
      if (this.targetChar) {
        this.speed = this.targetChar.x > this.x ? 1 : -1;
      }
      if (this.speechTimer <= 0) {
        this.state = 'walk';
        this.speed = (Math.random() * 25 + 15) * (Math.random() < 0.5 ? 1 : -1);
      }
    }
  }

  isRival(otherType) {
    const rivals = {
      alpha_bro: 'divine_femme',
      divine_femme: 'alpha_bro',
      lord_cat: 'tactical_dog',
      tactical_dog: 'lord_cat',
      tech_lord: 'mud_monk',
      mud_monk: 'tech_lord',
      skibidi_rot: 'patriot_boomer',
      patriot_boomer: 'skibidi_rot'
    };
    return rivals[this.type] === otherType;
  }

  startArgument(other) {
    this.state = 'argue';
    other.state = 'argue';
    this.targetChar = other;
    other.targetChar = this;

    const phrases = {
      alpha_bro: ["GRIND, KING!", "CHOP WOOD!", "NO EYE CONTACT!", "MARROW TIME!"],
      divine_femme: ["SPRINKLE SPRINKLE💅", "WHERE IS THE $350?", "LOW VIBES!", "CORD CUT!"],
      lord_cat: ["BOW DOWN, PEASANT!", "SWAT!", "DOGS ARE NOISE!", "HISSSS!"],
      tactical_dog: ["WOOF WOOF!", "TACTICAL BARK!", "CAT SLANDER!", "DEFEND YARD!"],
      tech_lord: ["BUY THE TOKEN!", "AI WILL REPLACE YOU!", "100x LEVERAGE!", "CRYPTO LUNGS!"],
      mud_monk: ["SMASH THE ROUTER!", "EAT MOSS!", "NO WIFI!", "RETURN TO DIRT!"],
      skibidi_rot: ["NEGATIVE 50k AURA💀", "FANUM TAX!", "SUBWAY SURFERS!", "SKIBIDI RIXX!"],
      patriot_boomer: ["BACK IN 1972!", "BUY A LAWNMOWER!", "KIDS ON PHONES!", "RESPECT WORK!"]
    };

    const myPhrases = phrases[this.type] || ["ARGUMENT!"];
    const otherPhrases = phrases[other.type] || ["COUNTER!"];

    this.speechBubble = myPhrases[Math.floor(Math.random() * myPhrases.length)];
    this.speechTimer = 3.5;

    other.speechBubble = otherPhrases[Math.floor(Math.random() * otherPhrases.length)];
    other.speechTimer = 3.5;
  }

  draw(ctx) {
    ctx.save();
    const x = Math.round(this.x);
    const y = Math.round(55 + this.yBob);

    // Direction flip
    const facingLeft = this.speed < 0;

    ctx.translate(x, y);
    if (facingLeft) {
      ctx.scale(-1, 1);
    }

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(0, 16, 7, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Render character body based on faction type
    switch (this.type) {
      case 'alpha_bro':
        this.drawAlphaBro(ctx);
        break;
      case 'divine_femme':
        this.drawDivineFemme(ctx);
        break;
      case 'lord_cat':
        this.drawLordCat(ctx);
        break;
      case 'tactical_dog':
        this.drawTacticalDog(ctx);
        break;
      case 'tech_lord':
        this.drawTechLord(ctx);
        break;
      case 'mud_monk':
        this.drawMudMonk(ctx);
        break;
      case 'skibidi_rot':
        this.drawSkibidiRot(ctx);
        break;
      case 'patriot_boomer':
        this.drawPatriotBoomer(ctx);
        break;
      default:
        this.drawAlphaBro(ctx);
    }

    ctx.restore();

    // Draw speech bubble (unflipped)
    if (this.speechBubble) {
      ctx.save();
      ctx.font = 'bold 8px monospace';
      const text = this.speechBubble;
      const textW = ctx.measureText(text).width;
      const bx = x - textW / 2 - 4;
      const by = y - 28;

      ctx.fillStyle = '#09090b';
      ctx.fillRect(bx, by, textW + 8, 14);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1;
      ctx.strokeRect(bx, by, textW + 8, 14);

      // Little tail
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(x - 2, by + 14);
      ctx.lineTo(x + 2, by + 14);
      ctx.lineTo(x, by + 18);
      ctx.fill();

      ctx.fillStyle = '#fef08a';
      ctx.fillText(text, bx + 4, by + 10);
      ctx.restore();
    }
  }

  // Pixel Sprite: Alpha Bro
  drawAlphaBro(ctx) {
    // Legs
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(-4, 6, 3, 8);
    ctx.fillRect(1, 6, 3, 8);
    // Shoes
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-5, 13, 4, 3);
    ctx.fillRect(1, 13, 4, 3);
    // Torso / Blue Tank top
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(-5, -4, 10, 10);
    // Huge muscular arms (Skin)
    ctx.fillStyle = '#fcd34d';
    ctx.fillRect(-8, -2, 3, 7);
    ctx.fillRect(5, -2, 3, 7);
    // Dumbbell in hand
    ctx.fillStyle = '#475569';
    ctx.fillRect(6, 2, 4, 3);
    ctx.fillRect(7, -1, 2, 8);
    // Head & Jawline
    ctx.fillStyle = '#fcd34d';
    ctx.fillRect(-4, -13, 8, 8);
    // Backward red cap
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-5, -15, 10, 4);
    ctx.fillRect(-8, -13, 3, 2); // visor backward
    // Chad sunglasses
    ctx.fillStyle = '#09090b';
    ctx.fillRect(-2, -10, 5, 2);
  }

  // Pixel Sprite: Divine Femme
  drawDivineFemme(ctx) {
    // Shoes / Heels
    ctx.fillStyle = '#ec4899';
    ctx.fillRect(-3, 14, 2, 2);
    ctx.fillRect(2, 14, 2, 2);
    // Legs
    ctx.fillStyle = '#fde68a';
    ctx.fillRect(-3, 8, 2, 6);
    ctx.fillRect(2, 8, 2, 6);
    // Hot Pink Dress
    ctx.fillStyle = '#db2777';
    ctx.fillRect(-5, -2, 10, 11);
    // Iced drink cup
    ctx.fillStyle = '#a7f3d0';
    ctx.fillRect(5, 1, 3, 5);
    ctx.fillStyle = '#10b981';
    ctx.fillRect(6, -1, 1, 2); // straw
    // Head & Face
    ctx.fillStyle = '#fde68a';
    ctx.fillRect(-4, -11, 8, 8);
    // Golden Blonde Flowing Hair
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-6, -13, 12, 4);
    ctx.fillRect(-7, -10, 3, 12);
    // Sunglasses
    ctx.fillStyle = '#18181b';
    ctx.fillRect(-2, -9, 5, 2);
    // Floating purple crystal
    ctx.fillStyle = '#c084fc';
    const cBob = Math.sin(this.animTime * 1.5) * 3;
    ctx.fillRect(-8, -14 + cBob, 3, 3);
  }

  // Pixel Sprite: Lord Cat
  drawLordCat(ctx) {
    // Body / Purple cape
    ctx.fillStyle = '#7e22ce';
    ctx.fillRect(-6, 2, 12, 9);
    // Fur paws
    ctx.fillStyle = '#d4d4d8';
    ctx.fillRect(-5, 10, 3, 5);
    ctx.fillRect(2, 10, 3, 5);
    // Cat Tail
    ctx.fillStyle = '#a1a1aa';
    const tWiggle = Math.sin(this.animTime) * 3;
    ctx.fillRect(-8 + tWiggle, 4, 3, 7);
    // Cat Head
    ctx.fillStyle = '#e4e4e7';
    ctx.fillRect(-5, -6, 10, 8);
    // Pointy Ears
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(-5, -9, 3, 3);
    ctx.fillRect(2, -9, 3, 3);
    // Golden Crown
    ctx.fillStyle = '#eab308';
    ctx.fillRect(-4, -11, 8, 3);
    ctx.fillRect(-4, -13, 2, 2);
    ctx.fillRect(2, -13, 2, 2);
    // Cat Eyes
    ctx.fillStyle = '#10b981';
    ctx.fillRect(-3, -4, 2, 2);
    ctx.fillRect(1, -4, 2, 2);
  }

  // Pixel Sprite: Tactical Dog
  drawTacticalDog(ctx) {
    // Golden Retriever Body
    ctx.fillStyle = '#d97706';
    ctx.fillRect(-6, 0, 13, 10);
    // Tactical Green Harness
    ctx.fillStyle = '#15803d';
    ctx.fillRect(-4, 0, 8, 8);
    // Dog Legs
    ctx.fillStyle = '#b45309';
    ctx.fillRect(-5, 9, 3, 6);
    ctx.fillRect(3, 9, 3, 6);
    // Wagging Tail
    ctx.fillStyle = '#d97706';
    const tailWag = Math.sin(this.animTime * 2) * 4;
    ctx.fillRect(-9, 1 + tailWag, 4, 3);
    // Dog Head
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-3, -7, 9, 8);
    // Floppy Ear
    ctx.fillStyle = '#b45309';
    ctx.fillRect(-4, -6, 3, 6);
    // Green Tactical Goggles
    ctx.fillStyle = '#052e16';
    ctx.fillRect(0, -6, 6, 3);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(1, -5, 4, 1);
  }

  // Pixel Sprite: Tech-Lord
  drawTechLord(ctx) {
    // Cyber Pants
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-3, 6, 2, 8);
    ctx.fillRect(1, 6, 2, 8);
    // Neon Cyan Circuit Jacket
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(-5, -4, 10, 10);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(-1, -4, 2, 8);
    // Floating hologram phone
    ctx.fillStyle = '#22d3ee';
    ctx.fillRect(5, -1, 4, 6);
    // Head
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-4, -12, 8, 8);
    // Cyber Visor / VR Headset
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(-2, -10, 6, 3);
  }

  // Pixel Sprite: Mud Monk
  drawMudMonk(ctx) {
    // Brown burlap robe
    ctx.fillStyle = '#713f12';
    ctx.fillRect(-6, -2, 12, 16);
    // Big Grey Beard
    ctx.fillStyle = '#9ca3af';
    ctx.fillRect(-4, -5, 8, 7);
    // Head with Hood
    ctx.fillStyle = '#5c310c';
    ctx.fillRect(-5, -12, 10, 8);
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-3, -10, 5, 4);
    // Wooden Staff / Stick
    ctx.fillStyle = '#a16207';
    ctx.fillRect(6, -14, 2, 28);
    // Pinecone attached to staff
    ctx.fillStyle = '#451a03';
    ctx.fillRect(5, -16, 4, 4);
  }

  // Pixel Sprite: Skibidi Brainrot Gen-Z
  drawSkibidiRot(ctx) {
    // Baggy jeans
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-4, 6, 3, 8);
    ctx.fillRect(1, 6, 3, 8);
    // Oversized Hoodie
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(-6, -4, 12, 10);
    // Smartphone in hand with screen glow
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(6, 0, 3, 5);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(7, 1, 1, 3);
    // Head
    ctx.fillStyle = '#fde68a';
    ctx.fillRect(-4, -12, 8, 8);
    // Fluffy perm hair / broccoli cut
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-5, -15, 10, 4);
    ctx.fillRect(-6, -13, 3, 4);
  }

  // Pixel Sprite: Boomer Patriot
  drawPatriotBoomer(ctx) {
    // Khaki cargo shorts
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(-4, 5, 3, 6);
    ctx.fillRect(1, 5, 3, 6);
    // White socks & New Balance sneakers
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(-4, 11, 3, 4);
    ctx.fillRect(1, 11, 3, 4);
    // Red polo shirt
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-5, -4, 10, 9);
    // Head & Glasses
    ctx.fillStyle = '#fcd34d';
    ctx.fillRect(-4, -12, 8, 8);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-2, -10, 4, 2);
    // Lawnmower rake / American flag in hand
    ctx.fillStyle = '#64748b';
    ctx.fillRect(-8, -14, 2, 28);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-12, -14, 4, 3);
  }
}

class StreetArena {
  constructor(canvasId = 'street-arena-canvas') {
    this.canvasId = canvasId;
    this.canvas = null;
    this.ctx = null;
    this.characters = [];
    this.initialized = false;
  }

  init() {
    this.canvas = document.getElementById(this.canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    const w = this.canvas.width;

    // Spawn 8 faction representatives
    const types = [
      'alpha_bro',
      'divine_femme',
      'lord_cat',
      'tactical_dog',
      'tech_lord',
      'mud_monk',
      'skibidi_rot',
      'patriot_boomer'
    ];

    this.characters = types.map((t, idx) => {
      const startX = 30 + idx * ((w - 60) / (types.length - 1));
      return new FactionCharacter(t, startX, w);
    });

    this.initialized = true;
  }

  render(simState, deltaSec) {
    if (!this.initialized) this.init();
    if (!this.canvas || !this.ctx) return;

    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Update characters
    this.characters.forEach(char => char.update(deltaSec, this.characters, simState));

    // Clear background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);

    // City Skyline Backdrop (retro pixel buildings)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(10, 15, 35, 45);
    ctx.fillRect(55, 8, 45, 52);
    ctx.fillRect(115, 18, 50, 42);
    ctx.fillRect(180, 5, 40, 55);
    ctx.fillRect(235, 22, 30, 38);

    // Building window lights (flickering neon)
    ctx.fillStyle = '#fde047';
    for (let i = 0; i < 5; i++) {
      ctx.fillRect(65 + (i % 2) * 15, 18 + Math.floor(i / 2) * 10, 4, 4);
      ctx.fillRect(190 + (i % 2) * 15, 15 + Math.floor(i / 2) * 12, 4, 4);
    }

    // Neon Billboards
    ctx.fillStyle = '#e11d48';
    ctx.font = 'bold 7px monospace';
    ctx.fillText('FEED ROT 24/7', 120, 28);

    ctx.fillStyle = '#06b6d4';
    ctx.fillText('⚡ HARVEST CORP', 185, 14);

    // Ground / Sidewalk
    ctx.fillStyle = '#334155';
    ctx.fillRect(0, 58, w, 22);

    // Pavement curbs and road line
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 72, w, 8);
    ctx.fillStyle = '#f59e0b';
    for (let rx = 10; rx < w; rx += 30) {
      ctx.fillRect(rx, 75, 15, 2);
    }

    // Sort characters by Y bob so they layer naturally
    const sorted = [...this.characters].sort((a, b) => a.yBob - b.yBob);
    sorted.forEach(c => c.draw(ctx));
  }

  // Visual trigger when player boosts or polarizes
  triggerRally(factionId) {
    if (!this.characters.length) return;
    const typeMap = {
      gender_alpha: 'alpha_bro',
      gender_femme: 'divine_femme',
      pet_cat: 'lord_cat',
      pet_dog: 'tactical_dog',
      tech_corp: 'tech_lord',
      tech_luddite: 'mud_monk',
      rot_alpha: 'skibidi_rot',
      rot_boomer: 'patriot_boomer'
    };
    const targetType = typeMap[factionId];
    const match = this.characters.find(c => c.type === targetType);
    if (match) {
      match.yBob = -8; // Jump
      match.speechBubble = '🔥 MORE POWER!';
      match.speechTimer = 2.5;
    }
  }
}

window.StreetArena = new StreetArena();
