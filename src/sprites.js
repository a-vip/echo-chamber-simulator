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
    this.argumentCooldown = Math.random() * 4;
    this.targetChar = null;
  }

  update(deltaSec, characters, simState) {
    this.animTime += deltaSec * 8;
    this.yBob = Math.sin(this.animTime) * 2;

    if (this.speechTimer > 0) {
      this.speechTimer -= deltaSec;
      if (this.speechTimer <= 0) this.speechBubble = null;
    }

    if (this.argumentCooldown > 0) {
      this.argumentCooldown -= deltaSec;
    }

    // Safety check for NaN
    if (isNaN(this.x)) this.x = Math.random() * (this.arenaWidth - 50) + 25;
    if (isNaN(this.speed) || this.speed === 0) this.speed = (Math.random() * 25 + 15) * (Math.random() < 0.5 ? 1 : -1);

    // State machine
    if (this.state === 'walk') {
      this.x += this.speed * deltaSec;
      if (this.x < 15) { this.x = 15; this.speed = Math.abs(this.speed); }
      if (this.x > this.arenaWidth - 25) { this.x = this.arenaWidth - 25; this.speed = -Math.abs(this.speed); }

      // Check proximity to opposing faction
      for (const other of characters) {
        if (other !== this && Math.abs(other.x - this.x) < 30) {
          if (this.isRival(other.type) && this.argumentCooldown <= 0 && other.argumentCooldown <= 0 && this.speechTimer <= 0) {
            // Chance to start a street argument
            if (Math.random() < 0.05) {
              this.startArgument(other);
              break;
            }
          }
        }
      }
    } else if (this.state === 'argue') {
      // Bob slightly faster during heated argument
      this.yBob = Math.sin(this.animTime * 1.5) * 3;
      if (this.speechTimer <= 0) {
        this.state = 'walk';
        this.speechBubble = null;
        if (!this.speed || Math.abs(this.speed) < 10) {
          this.speed = (Math.random() * 25 + 15) * (Math.random() < 0.5 ? 1 : -1);
        }
      }
    }
  }

  isRival(otherType) {
    const rivals = {
      alpha_bro: ['divine_femme', 'siren_femme'],
      divine_femme: 'alpha_bro',
      siren_femme: 'alpha_bro',
      lord_cat: 'tactical_dog',
      tactical_dog: 'lord_cat',
      tech_lord: 'mud_monk',
      mud_monk: 'tech_lord',
      skibidi_rot: 'patriot_boomer',
      patriot_boomer: 'skibidi_rot'
    };
    const r = rivals[this.type];
    return Array.isArray(r) ? r.includes(otherType) : r === otherType;
  }

  startArgument(other) {
    this.state = 'argue';
    other.state = 'argue';
    this.targetChar = other;
    other.targetChar = this;

    const phrases = {
      alpha_bro: ["GRIND, KING!", "CHOP WOOD!", "NO EYE CONTACT!", "MARROW TIME!"],
      divine_femme: ["SPRINKLE SPRINKLE💅", "WHERE IS THE $350?", "LOW VIBES!", "CORD CUT!"],
      siren_femme: ["MANIFEST $1200💅", "UNBLOCK YOUR CHAKRA!", "HIGH FREQUENCY!", "QUEEN ENERGY!"],
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
    this.speechTimer = 2.6;
    this.argumentCooldown = 9.0; // Prevent repetitive argument loop locking!

    other.speechBubble = otherPhrases[Math.floor(Math.random() * otherPhrases.length)];
    other.speechTimer = 2.6;
    other.argumentCooldown = 9.0;

    // Direct rivals to walk away from each other when walking resumes
    const walkAwaySpeed = (Math.random() * 20 + 20);
    this.speed = this.x < other.x ? -walkAwaySpeed : walkAwaySpeed;
    other.speed = -this.speed;
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
      case 'siren_femme':
        this.drawSirenFemme(ctx);
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

  // Pixel Sprite: Divine Femme (32-bit Stylized Beach & Resort Femsphere Siren)
  drawDivineFemme(ctx) {
    const breath = Math.sin(this.animTime * 1.8) * 0.8;
    const hairSway = Math.sin(this.animTime * 1.2) * 1.5;

    // Palette Definition (32-bit multi-tier shading)
    const cOutline = '#1c130d';       // Deep contour outline
    const cSkinDeep = '#a86544';      // Deep shadow
    const cSkinShadow = '#cb855d';    // Warm shadow
    const cSkinBase = '#ebb28d';      // Mid skin tone
    const cSkinLight = '#f8cfb2';     // Sunlit highlight
    const cSkinSpecular = '#fff1e8';  // Specular gleam

    // Royal Blue Resort Two-Piece Swimwear
    const cSuitDark = '#0f2952';
    const cSuitBase = '#1d4ed8';
    const cSuitLight = '#60a5fa';
    const cSuitGlint = '#93c5fd';

    // Voluminous Golden Caramel Hair
    const cHairShadow = '#3b2210';
    const cHairDeep = '#613919';
    const cHairBase = '#925c27';
    const cHairMid = '#bf823e';
    const cHairLight = '#e5aa59';
    const cHairGlint = '#fce29a';

    // 1. BACK HAIR (Cascading behind shoulders and down back)
    ctx.fillStyle = cHairShadow;
    ctx.fillRect(-7 + hairSway, -14, 14, 18);
    ctx.fillStyle = cHairDeep;
    ctx.fillRect(-6 + hairSway, -12, 12, 17);
    ctx.fillStyle = cHairBase;
    ctx.fillRect(-5 + hairSway, -10, 10, 16);
    ctx.fillStyle = cHairMid;
    ctx.fillRect(2 + hairSway, -8, 5, 14);

    // 2. LEGS & TONED CALVES (with slender 32-bit contour)
    // Left leg
    ctx.fillStyle = cOutline;
    ctx.fillRect(-4, 6, 3, 10);
    ctx.fillRect(-4, 15, 3, 2);
    ctx.fillStyle = cSkinShadow;
    ctx.fillRect(-3, 6, 2, 9);
    ctx.fillStyle = cSkinBase;
    ctx.fillRect(-3, 6, 1, 9);
    ctx.fillStyle = cSkinLight;
    ctx.fillRect(-3, 7, 1, 4);

    // Right leg (subtle feminine stance)
    ctx.fillStyle = cOutline;
    ctx.fillRect(1, 6, 3, 10);
    ctx.fillRect(1, 15, 3, 2);
    ctx.fillStyle = cSkinShadow;
    ctx.fillRect(2, 6, 2, 9);
    ctx.fillStyle = cSkinBase;
    ctx.fillRect(1, 6, 2, 9);
    ctx.fillStyle = cSkinLight;
    ctx.fillRect(1, 7, 1, 5);
    ctx.fillStyle = cSkinSpecular;
    ctx.fillRect(1, 8, 1, 2); // Thigh highlight sheen

    // Delicate golden ankle bracelets / beach sandals
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-4, 14, 3, 1);
    ctx.fillRect(1, 14, 3, 1);

    // 3. HIPS & TWO-PIECE BOTTOM (Slender hourglass silhouette)
    ctx.fillStyle = cOutline;
    ctx.fillRect(-4, 2, 8, 5);
    ctx.fillStyle = cSkinBase;
    ctx.fillRect(-3, 2, 6, 5);

    // Swimwear bottoms
    ctx.fillStyle = cSuitDark;
    ctx.fillRect(-3, 2, 6, 4);
    ctx.fillStyle = cSuitBase;
    ctx.fillRect(-2, 2, 4, 3);
    ctx.fillStyle = cSuitLight;
    ctx.fillRect(-1, 2, 2, 2);
    // Delicate side string ties
    ctx.fillStyle = cSuitGlint;
    ctx.fillRect(-4, 2, 1, 1);
    ctx.fillRect(3, 2, 1, 1);

    // 4. SLENDER MIDRIFF & TORSO (with subtle breathing elevation)
    const torsoY = -4 + breath * 0.5;
    ctx.fillStyle = cOutline;
    ctx.fillRect(-3, torsoY, 6, 7);
    ctx.fillStyle = cSkinShadow;
    ctx.fillRect(-2, torsoY, 5, 6);
    ctx.fillStyle = cSkinBase;
    ctx.fillRect(-2, torsoY, 4, 6);
    ctx.fillStyle = cSkinLight;
    ctx.fillRect(-1, torsoY + 1, 2, 4);
    // Subtle belly button accent
    ctx.fillStyle = cSkinDeep;
    ctx.fillRect(0, torsoY + 4, 1, 1);

    // 5. SWIMWEAR TOP / BIKINI TOP
    ctx.fillStyle = cOutline;
    ctx.fillRect(-4, torsoY, 8, 3);
    ctx.fillStyle = cSuitDark;
    ctx.fillRect(-3, torsoY, 6, 3);
    ctx.fillStyle = cSuitBase;
    ctx.fillRect(-3, torsoY, 3, 2);
    ctx.fillRect(1, torsoY, 3, 2);
    ctx.fillStyle = cSuitLight;
    ctx.fillRect(-2, torsoY, 1, 1);
    ctx.fillRect(2, torsoY, 1, 1);
    // Center ring & delicate halter neck ties
    ctx.fillStyle = '#fcd34d';
    ctx.fillRect(0, torsoY + 1, 1, 1);
    ctx.fillStyle = cSuitLight;
    ctx.fillRect(-1, torsoY - 1, 1, 1);
    ctx.fillRect(1, torsoY - 1, 1, 1);

    // 6. SLENDER ARMS & HAND IN HAIR POSE
    // Left arm (resting on hip)
    ctx.fillStyle = cOutline;
    ctx.fillRect(-5, torsoY + 1, 2, 6);
    ctx.fillStyle = cSkinBase;
    ctx.fillRect(-4, torsoY + 1, 1, 5);
    ctx.fillStyle = cSkinLight;
    ctx.fillRect(-4, torsoY + 2, 1, 3);

    // Right arm (gracefully raised touching voluminous hair)
    ctx.fillStyle = cOutline;
    ctx.fillRect(3, torsoY - 5, 3, 8);
    ctx.fillStyle = cSkinBase;
    ctx.fillRect(4, torsoY - 4, 2, 6);
    ctx.fillStyle = cSkinLight;
    ctx.fillRect(4, torsoY - 3, 1, 4);

    // 7. FACE & HEAD (Delicate feminine 32-bit features)
    const headY = -14 + breath * 0.3;
    ctx.fillStyle = cOutline;
    ctx.fillRect(-3, headY, 6, 7);
    ctx.fillStyle = cSkinShadow;
    ctx.fillRect(-2, headY, 5, 6);
    ctx.fillStyle = cSkinBase;
    ctx.fillRect(-2, headY, 4, 6);
    ctx.fillStyle = cSkinLight;
    ctx.fillRect(-1, headY + 1, 3, 4);

    // Seductive eyes with soft lashes & teal iris
    ctx.fillStyle = cOutline;
    ctx.fillRect(-1, headY + 2, 2, 1);
    ctx.fillStyle = '#0d9488';
    ctx.fillRect(0, headY + 2, 1, 1);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, headY + 2, 1, 1);

    // Rosy cheek blush & lips
    ctx.fillStyle = '#f472b6';
    ctx.fillRect(-2, headY + 4, 1, 1);
    ctx.fillRect(1, headY + 4, 1, 1);
    ctx.fillStyle = '#e11d48';
    ctx.fillRect(0, headY + 5, 1, 1);

    // 8. FRONT VOLUMINOUS FLOWING HAIR & HIGHLIGHTS
    // Top crown volume / styled hair bun
    ctx.fillStyle = cHairShadow;
    ctx.fillRect(-4, headY - 4, 8, 4);
    ctx.fillStyle = cHairBase;
    ctx.fillRect(-3, headY - 3, 6, 3);
    ctx.fillStyle = cHairLight;
    ctx.fillRect(-2, headY - 3, 4, 2);
    ctx.fillStyle = cHairGlint;
    ctx.fillRect(-1, headY - 3, 2, 1);

    // Front locks framing face and flowing over shoulder
    ctx.fillStyle = cHairDeep;
    ctx.fillRect(-4, headY, 2, 10);
    ctx.fillRect(2 + hairSway, headY - 1, 4, 15);
    ctx.fillStyle = cHairBase;
    ctx.fillRect(-4, headY + 1, 1, 8);
    ctx.fillRect(3 + hairSway, headY + 1, 3, 13);
    ctx.fillStyle = cHairLight;
    ctx.fillRect(4 + hairSway, headY + 3, 1, 9);
    ctx.fillStyle = cHairGlint;
    ctx.fillRect(4 + hairSway, headY + 5, 1, 4);

    // Floating celestial aura sparkle (subtle femsphere manifestation diamond)
    const sparkleY = headY - 6 + Math.sin(this.animTime * 2.5) * 2;
    ctx.fillStyle = '#c084fc';
    ctx.fillRect(5, sparkleY, 2, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(5, sparkleY, 1, 1);
  }

  // Pixel Sprite: Siren Femme (Purple-Haired 32-bit Femsphere Co-Star)
  drawSirenFemme(ctx) {
    const breath = Math.sin(this.animTime * 1.8 + 1) * 0.8;
    const hairSway = Math.cos(this.animTime * 1.3) * 1.6;

    // Palette: Sleek amethyst hair & vibrant magenta two-piece beachwear
    const cOutline = '#170e1a';
    const cSkinShadow = '#c27c62';
    const cSkinBase = '#ebb28d';
    const cSkinLight = '#f8cfb2';
    const cSkinGlint = '#fff2e8';

    // Magenta Swimwear
    const cSuitDark = '#701a75';
    const cSuitBase = '#c026d3';
    const cSuitLight = '#e879f9';

    // Deep Amethyst & Lavender Hair
    const cHairShadow = '#2e1065';
    const cHairBase = '#581c87';
    const cHairMid = '#7e22ce';
    const cHairLight = '#a855f7';
    const cHairGlint = '#d8b4fe';

    // Back hair
    ctx.fillStyle = cHairShadow;
    ctx.fillRect(-7 + hairSway, -15, 14, 19);
    ctx.fillStyle = cHairBase;
    ctx.fillRect(-6 + hairSway, -13, 12, 17);
    ctx.fillStyle = cHairMid;
    ctx.fillRect(-4 + hairSway, -11, 9, 15);

    // Toned legs
    ctx.fillStyle = cOutline;
    ctx.fillRect(-4, 6, 3, 10);
    ctx.fillRect(1, 6, 3, 10);
    ctx.fillStyle = cSkinShadow;
    ctx.fillRect(-3, 6, 2, 9);
    ctx.fillRect(2, 6, 2, 9);
    ctx.fillStyle = cSkinBase;
    ctx.fillRect(-3, 6, 1, 9);
    ctx.fillRect(1, 6, 2, 9);
    ctx.fillStyle = cSkinLight;
    ctx.fillRect(1, 7, 1, 4);

    // Two-piece bottoms
    ctx.fillStyle = cOutline;
    ctx.fillRect(-4, 2, 8, 5);
    ctx.fillStyle = cSuitDark;
    ctx.fillRect(-3, 2, 6, 4);
    ctx.fillStyle = cSuitBase;
    ctx.fillRect(-2, 2, 4, 3);
    ctx.fillStyle = cSuitLight;
    ctx.fillRect(-1, 2, 2, 1);

    // Torso with light cardigan drape
    const torsoY = -4 + breath * 0.5;
    ctx.fillStyle = cOutline;
    ctx.fillRect(-3, torsoY, 6, 7);
    ctx.fillStyle = cSkinBase;
    ctx.fillRect(-2, torsoY, 4, 6);
    ctx.fillStyle = cSkinLight;
    ctx.fillRect(-1, torsoY + 1, 2, 4);

    // Magenta top
    ctx.fillStyle = cSuitDark;
    ctx.fillRect(-3, torsoY, 6, 3);
    ctx.fillStyle = cSuitBase;
    ctx.fillRect(-3, torsoY, 3, 2);
    ctx.fillRect(1, torsoY, 3, 2);
    ctx.fillStyle = cSuitLight;
    ctx.fillRect(2, torsoY, 1, 1);

    // Arms
    ctx.fillStyle = cSkinBase;
    ctx.fillRect(-5, torsoY + 1, 2, 6);
    ctx.fillRect(3, torsoY + 1, 2, 6);

    // Head & face
    const headY = -14 + breath * 0.3;
    ctx.fillStyle = cOutline;
    ctx.fillRect(-3, headY, 6, 7);
    ctx.fillStyle = cSkinBase;
    ctx.fillRect(-2, headY, 4, 6);
    ctx.fillStyle = cSkinLight;
    ctx.fillRect(-1, headY + 1, 3, 4);
    ctx.fillStyle = cOutline;
    ctx.fillRect(0, headY + 2, 2, 1);
    ctx.fillStyle = '#ec4899';
    ctx.fillRect(0, headY + 5, 1, 1);

    // Voluminous purple hair top & front
    ctx.fillStyle = cHairShadow;
    ctx.fillRect(-5, headY - 4, 10, 4);
    ctx.fillStyle = cHairMid;
    ctx.fillRect(-4, headY - 3, 8, 3);
    ctx.fillStyle = cHairLight;
    ctx.fillRect(-3, headY - 3, 6, 2);
    ctx.fillStyle = cHairGlint;
    ctx.fillRect(-2, headY - 3, 3, 1);
    ctx.fillStyle = cHairMid;
    ctx.fillRect(-5, headY, 2, 12);
    ctx.fillRect(2 + hairSway, headY, 3, 14);
    ctx.fillStyle = cHairLight;
    ctx.fillRect(3 + hairSway, headY + 2, 1, 10);
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

    // Spawn faction representatives (including both femsphere models)
    const types = [
      'alpha_bro',
      'divine_femme',
      'lord_cat',
      'tactical_dog',
      'siren_femme',
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
    if (!this.canvas) this.canvas = document.getElementById(this.canvasId);
    if (this.canvas && !this.ctx) this.ctx = this.canvas.getContext('2d');
    if (!this.canvas || !this.ctx) return;

    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Update characters
    this.characters.forEach(char => char.update(deltaSec, this.characters, simState));

    // If canvas element is collapsed/hidden, skip rendering
    if (this.canvas.classList.contains('hidden') || this.canvas.offsetHeight === 0) return;

    const time = simState ? simState.gameTimeSec : (performance.now() / 1000);

    // 1. SKY GRADIENT (Deep cyber twilight with stars)
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 48);
    skyGrad.addColorStop(0, '#030712');
    skyGrad.addColorStop(0.6, '#0f172a');
    skyGrad.addColorStop(1, '#1e293b');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, 52);

    // Subtle stars
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    for (let s = 0; s < 12; s++) {
      const sx = (s * 49 + 15) % w;
      const sy = 4 + (s * 7) % 20;
      ctx.fillRect(sx, sy, 1, 1);
    }

    // 2. 3D ISOMETRIC / PERSPECTIVE BUILDINGS & HOUSES (Enhanced architectural depth)
    const buildings = [
      { x: 12, w: 50, h: 42, frontCol: '#1e293b', sideCol: '#0f172a', roofCol: '#334155', type: 'villa' },
      { x: 74, w: 46, h: 48, frontCol: '#78350f', sideCol: '#451a03', roofCol: '#92400e', type: 'brick' },
      { x: 132, w: 58, h: 54, frontCol: '#0f766e', sideCol: '#134e4a', roofCol: '#115e59', type: 'spire' },
      { x: 202, w: 52, h: 44, frontCol: '#1e1b4b', sideCol: '#0f0c29', roofCol: '#312e81', type: 'resort' },
      { x: 266, w: 60, h: 50, frontCol: '#334155', sideCol: '#1e293b', roofCol: '#475569', type: 'office' },
      { x: 338, w: 54, h: 46, frontCol: '#831843', sideCol: '#500724', roofCol: '#9d174d', type: 'brick' },
      { x: 404, w: 50, h: 52, frontCol: '#0c4a6e', sideCol: '#082f49', roofCol: '#0369a1', type: 'spire' },
      { x: 466, w: 56, h: 42, frontCol: '#27272a', sideCol: '#18181b', roofCol: '#3f3f46', type: 'villa' },
      { x: 534, w: 42, h: 48, frontCol: '#713f12', sideCol: '#3f2206', roofCol: '#854d0e', type: 'brick' }
    ];

    buildings.forEach((b, bIdx) => {
      const bTop = 52 - b.h;
      const sideW = 6; // 3D perspective shadow side wall

      // 3D Shadowed Side Wall (Isometric angled perspective depth)
      ctx.fillStyle = b.sideCol;
      ctx.fillRect(b.x + b.w - sideW, bTop, sideW, b.h);

      // Lit Front Facade
      ctx.fillStyle = b.frontCol;
      ctx.fillRect(b.x, bTop, b.w - sideW, b.h);

      // 3D Roof Molding & Cornice
      ctx.fillStyle = b.roofCol;
      ctx.fillRect(b.x - 2, bTop - 3, b.w + 1, 3);
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = 0.15;
      ctx.fillRect(b.x - 2, bTop - 3, b.w - sideW + 2, 1);
      ctx.globalAlpha = 1.0;

      // Rooftop Features (Antennas, AC Compressors, Water Towers)
      if (b.type === 'spire') {
        // Antenna with flashing red aviation beacon
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(b.x + 14, bTop - 12, 2, 9);
        const beacon = Math.sin(time * 5 + bIdx) > 0;
        ctx.fillStyle = beacon ? '#ef4444' : '#7f1d1d';
        ctx.fillRect(b.x + 13, bTop - 14, 4, 2);
      } else if (b.type === 'brick') {
        // 3D Brick Chimney
        ctx.fillStyle = '#78350f';
        ctx.fillRect(b.x + 8, bTop - 8, 6, 5);
        ctx.fillStyle = '#451a03';
        ctx.fillRect(b.x + 12, bTop - 8, 2, 5);
      } else if (b.type === 'villa') {
        // Rooftop AC unit
        ctx.fillStyle = '#64748b';
        ctx.fillRect(b.x + 10, bTop - 6, 8, 3);
        ctx.fillStyle = '#334155';
        ctx.fillRect(b.x + 16, bTop - 6, 2, 3);
      }

      // Lit Multi-Pane Windows (with subtle randomized interior glow)
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          const wx = b.x + 6 + c * 13;
          const wy = bTop + 8 + r * 11;
          if (wx + 7 < b.x + b.w - sideW) {
            // Window frame (dark)
            ctx.fillStyle = '#09090b';
            ctx.fillRect(wx - 1, wy - 1, 8, 7);

            // Lit interior pane
            const isLit = ((bIdx * 7 + r * 3 + c * 5) % 4 !== 0);
            const flicker = Math.sin(time * 2 + bIdx + r) * 0.1;
            ctx.fillStyle = isLit ? (bIdx % 2 === 0 ? '#fef08a' : '#67e8f9') : '#18181b';
            ctx.fillRect(wx, wy, 6, 5);

            // Window cross mullions
            ctx.fillStyle = '#09090b';
            ctx.fillRect(wx + 2, wy, 1, 5);
            ctx.fillRect(wx, wy + 2, 6, 1);
          }
        }
      }
    });

    // 3. NEON BILLBOARDS (32-bit Glowing Signs)
    // Sign 1: Left
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.fillRect(138, 12, 56, 10);
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 1;
    ctx.strokeRect(138, 12, 56, 10);
    ctx.fillStyle = '#22d3ee';
    ctx.font = 'bold 7px monospace';
    ctx.fillText('⚡ ALGO-ROT', 142, 20);

    // Sign 2: Right
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.fillRect(412, 10, 52, 10);
    ctx.strokeStyle = '#ec4899';
    ctx.strokeRect(412, 10, 52, 10);
    ctx.fillStyle = '#f472b6';
    ctx.fillText('DIVINE RESORT', 416, 18);

    // 4. WATERFRONT PROMENADE DOCK & BRICK BULKHEAD (Matching reference visual)
    // Textured brick dock deck
    ctx.fillStyle = '#7f1d1d';
    ctx.fillRect(0, 52, w, 11);

    // Brick paver texture
    ctx.fillStyle = '#991b1b';
    for (let bx = 0; bx < w; bx += 8) {
      ctx.fillRect(bx + 1, 53, 6, 4);
      ctx.fillRect(bx + 5, 58, 6, 4);
    }
    // Heavy wooden/stone bullnose coping edge
    ctx.fillStyle = '#450a0a';
    ctx.fillRect(0, 62, w, 3);
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(0, 62, w, 1);

    // 5. ANIMATED FOREGROUND WATER CANAL WITH WHITE FOAM RIPPLES (from reference)
    // Deep turquoise water base
    ctx.fillStyle = '#0369a1';
    ctx.fillRect(0, 65, w, h - 65);

    // Cyan mid-water wave layers
    ctx.fillStyle = '#06b6d4';
    const waveShift = (time * 28) % 32;
    for (let wx = -32; wx < w + 32; wx += 24) {
      const wy1 = 66 + Math.sin((wx + waveShift) * 0.15) * 1.5;
      ctx.fillRect(wx, Math.round(wy1), 16, 3);
    }

    // Bright aqua wave highlights
    ctx.fillStyle = '#22d3ee';
    for (let wx = -20; wx < w + 20; wx += 28) {
      const wy2 = 70 + Math.cos((wx - waveShift) * 0.18) * 1.2;
      ctx.fillRect(wx, Math.round(wy2), 12, 2);
    }

    // Frothy white shoreline wave foam (matching dock water in reference image)
    ctx.fillStyle = '#ffffff';
    for (let fx = 0; fx < w; fx += 16) {
      const foamOffset = Math.sin(time * 3 + fx * 0.2) * 1.5;
      ctx.fillRect(fx + 2, 65, 8, 1);
      ctx.fillRect(fx + 6, 66 + foamOffset, 4, 1);
    }

    // Promenade Decorative Streetlamps (casting volumetric light cones)
    const lamps = [70, 240, 420];
    lamps.forEach(lx => {
      // Lamp pole
      ctx.fillStyle = '#09090b';
      ctx.fillRect(lx, 32, 2, 21);
      ctx.fillStyle = '#d97706';
      ctx.fillRect(lx - 2, 30, 6, 3);
      // Glowing warm lantern
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(lx - 1, 31, 4, 3);
      // Soft ambient light cone onto promenade
      ctx.fillStyle = 'rgba(254, 240, 138, 0.08)';
      ctx.beginPath();
      ctx.moveTo(lx + 1, 33);
      ctx.lineTo(lx - 14, 53);
      ctx.lineTo(lx + 16, 53);
      ctx.fill();
    });

    // 6. CHARACTERS LAYER (Sorted by yBob for realistic natural depth)
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

// 32-BIT EXPORTED SPRITE ASSET MANIFEST (Ready for external reuse & inspection)
window.SPRITE_ASSETS_32BIT = {
  version: '2.0-32BIT',
  palettes: {
    femsphereSiren: {
      outline: '#1c130d',
      skinShadow: '#cb855d',
      skinBase: '#ebb28d',
      skinLight: '#f8cfb2',
      swimwearBase: '#1d4ed8',
      swimwearLight: '#60a5fa',
      hairBase: '#925c27',
      hairLight: '#e5aa59'
    },
    sirenAmethyst: {
      outline: '#170e1a',
      skinBase: '#ebb28d',
      swimwearBase: '#c026d3',
      hairBase: '#581c87',
      hairLight: '#a855f7'
    },
    waterfront: {
      deepWater: '#0369a1',
      cyanWave: '#06b6d4',
      aquaHighlight: '#22d3ee',
      frothWhite: '#ffffff',
      brickDeck: '#7f1d1d',
      brickPaver: '#991b1b'
    }
  }
};

window.StreetArena = new StreetArena();

