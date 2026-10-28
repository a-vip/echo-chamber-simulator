/**
 * The Echo Chamber Simulator - Satirical Content Matrix & Post Generator
 * Spans gender wars, political extremes, pet supremacy, diet cults, brainrot, and cosmic conspiracies.
 */

const FACTIONS = {
  gender_alpha: {
    id: 'gender_alpha',
    name: 'Manosphere / Sigma Grinders',
    rivalId: 'gender_femme',
    rivalName: 'Femosphere / Divine Femmes',
    theme: '#3b82f6', // Electric Blue
    badge: '👑 ALPHA',
    icon: '🗿',
    tensionWeight: 1.2
  },
  gender_femme: {
    id: 'gender_femme',
    name: 'Femosphere / Divine Femmes',
    rivalId: 'gender_alpha',
    rivalName: 'Manosphere / Sigma Grinders',
    theme: '#ec4899', // Hot Pink
    badge: '✨ DIVINE',
    icon: '💅',
    tensionWeight: 1.2
  },
  tech_corp: {
    id: 'tech_corp',
    name: 'Techno-Feudal Hyper-Corporatists',
    rivalId: 'tech_luddite',
    rivalName: 'Neo-Luddite Mud Monks',
    theme: '#10b981', // Neon Mint
    badge: '⚡ TECH-LORD',
    icon: '🤖',
    tensionWeight: 1.1
  },
  tech_luddite: {
    id: 'tech_luddite',
    name: 'Neo-Luddite Mud Monks',
    rivalId: 'tech_corp',
    rivalName: 'Techno-Feudal Hyper-Corporatists',
    theme: '#854d0e', // Earthy Bronze
    badge: '🪵 MOSS-GANG',
    icon: '🍄',
    tensionWeight: 1.1
  },
  pet_cat: {
    id: 'pet_cat',
    name: 'Feline Overlord Zealots',
    rivalId: 'pet_dog',
    rivalName: 'Canine Tactical Goodboys',
    theme: '#a855f7', // Mystic Purple
    badge: '🐾 PURR-REICH',
    icon: '🐱',
    tensionWeight: 0.9
  },
  pet_dog: {
    id: 'pet_dog',
    name: 'Canine Tactical Goodboys',
    rivalId: 'pet_cat',
    rivalName: 'Feline Overlord Zealots',
    theme: '#f59e0b', // Amber
    badge: '🦴 GOODBOY-K9',
    icon: '🐕',
    tensionWeight: 0.9
  },
  diet_carnivore: {
    id: 'diet_carnivore',
    name: 'Raw Marrow Ancestral Chads',
    rivalId: 'diet_vegan',
    rivalName: 'Sunlight-Breatharian Ascetics',
    theme: '#ef4444', // Blood Crimson
    badge: '🥩 PRIMAL',
    icon: '🍖',
    tensionWeight: 1.0
  },
  diet_vegan: {
    id: 'diet_vegan',
    name: 'Sunlight-Breatharian Ascetics',
    rivalId: 'diet_carnivore',
    rivalName: 'Raw Marrow Ancestral Chads',
    theme: '#84cc16', // Acid Lime
    badge: '🌱 SUN-VIBE',
    icon: '🥗',
    tensionWeight: 1.0
  },
  rot_alpha: {
    id: 'rot_alpha',
    name: 'Gen-Alpha Brainrot Nihilists',
    rivalId: 'rot_boomer',
    rivalName: 'Boomer Facebook Sentinels',
    theme: '#06b6d4', // Cyan
    badge: '🚽 GYATT-CORE',
    icon: '🌀',
    tensionWeight: 1.3
  },
  rot_boomer: {
    id: 'rot_boomer',
    name: 'Boomer Facebook Sentinels',
    rivalId: 'rot_alpha',
    rivalName: 'Gen-Alpha Brainrot Nihilists',
    theme: '#eab308', // Retro Gold
    badge: '🇺🇸 PATRIOT-CAPS',
    icon: '🦅',
    tensionWeight: 1.3
  },
  cosmic_flat: {
    id: 'cosmic_flat',
    name: 'Antarctic Ice-Wall Truthers',
    rivalId: 'cosmic_sim',
    rivalName: 'Simulation Glitch Cult',
    theme: '#0284c7', // Ice Blue
    badge: '🧊 ICE-WALL',
    icon: '🧭',
    tensionWeight: 0.8
  },
  cosmic_sim: {
    id: 'cosmic_sim',
    name: 'Simulation Glitch Cult',
    rivalId: 'cosmic_flat',
    rivalName: 'Antarctic Ice-Wall Truthers',
    theme: '#6366f1', // Indigo Cyber
    badge: '👾 NPC-DETECT',
    icon: '💾',
    tensionWeight: 0.8
  }
};

const POST_TEMPLATES = {
  gender_alpha: [
    {
      author: 'SigmaJawline_99',
      handle: '@MarrowOverMind',
      avatarColor: '#1e3a8a',
      content: "Rule #814: If a female smiles at you in an elevator, do NOT smile back. That smile is a calculated dopamine tax to siphon your testosterone. Stare at the ceiling button. Grind in silence.",
      hashtags: '#SigmaMindset #TestosteroneRetention #NoEyeContact'
    },
    {
      author: 'GigaChad_Trad',
      handle: '@AncientPatriarch',
      avatarColor: '#1d4ed8',
      content: "Modern women want 'communication' and 'mutual respect'. Bro, our great-grandfathers communicated entirely through stoic grunts and chopping firewood while women baked sourdough. Society peaked in 1842.",
      hashtags: '#ReturnToTrad #SourdoughEra #AlphaChronicles'
    },
    {
      author: 'PodcastBro_Vance',
      handle: '@HighValueHustle',
      avatarColor: '#2563eb',
      content: "If she has more than 3 exes, she has emotionally bankrupted 3 men. You don't buy a used Honda with 400k miles on the transmission, King. Know your equity.",
      hashtags: '#HighValueMen #ResidualValue #FinanceYourRomance'
    },
    {
      author: 'JawlineOptimizer',
      handle: '@MewingSinceBirth',
      avatarColor: '#0284c7',
      content: "She asked me what I bring to the table. Bro, I AM THE TABLE. I am the chairs, the mahogany varnish, and the 4:00 AM cold shower. She brings lukewarm matcha lattes and astrological excuses.",
      hashtags: '#StayToxic #MewingGang #Unapologetic'
    }
  ],
  gender_femme: [
    {
      author: 'DivineEmpress_Siren',
      handle: '@HighFrequencyQueen',
      avatarColor: '#be185d',
      content: "Sprinkle sprinkle babes 💅 If he invites you to 'walk in the park' for a first date, call the police. You are a sacred deity in a meat suit, not an obedient golden retriever. Minimum dinner cost is $350 or he is blocking your crown chakra.",
      hashtags: '#SprinkleSprinkle #DarkFeminine #DivineStandards'
    },
    {
      author: 'ManifestingBaddie',
      handle: '@KarmicDebtCollector',
      avatarColor: '#db2777',
      content: "Men with podcasts are low-vibrational energetic parasites. If he owns a microphone without a radio license, burn sage and block his contact info on all 7 spiritual planes.",
      hashtags: '#SirenEnergy #ProtectYourPeace #ChakraDetox'
    },
    {
      author: 'SoftLifeSupreme',
      handle: '@UnbotheredGoddess',
      avatarColor: '#f43f5e',
      content: "Expecting a woman to touch a door handle is emotional assault in the 5th dimension. If he doesn't telekinetically open the elevator doors with his American Express black card, he's a dusty karmic test.",
      hashtags: '#SoftLifeOnly #DustyDetection #PrincessTreatment'
    },
    {
      author: 'AuraCleanser_Mia',
      handle: '@CordCutter777',
      avatarColor: '#e11d48',
      content: "Just cancelled a date because his zodiac moon sign indicated he doesn't tip 35% on acai bowls. The universe is removing obstacles, sisters! Stay elevated.",
      hashtags: '#ZodiacWarning #FrequencyUpgrade #HighValueFemme'
    }
  ],
  tech_corp: [
    {
      author: 'Satoshi_Maximus',
      handle: '@SovereignCloudLord',
      avatarColor: '#065f46',
      content: "Unpopular truth: Clean air and municipal tap water should be tokenized on Solana. If you can't afford the subscription tier for breathable oxygen, that's just natural market discipline at work.",
      hashtags: '#TechnoFeudalism #SolanaBreathe #FreeMarketLungs'
    },
    {
      author: 'PromptWhisperer_CEO',
      handle: '@AutonomousCapital',
      avatarColor: '#047857',
      content: "Just fired our entire HR and customer support staff and replaced them with a 3-line Python script linked to Gemini. Stock is up 42%. Humans are obsolete latency bags.",
      hashtags: '#AIRevolution #EfficiencyMaxxing #NoHumansNeeded'
    },
    {
      author: 'NeuralPlug_Evangelist',
      handle: '@BrainChipSyndicate',
      avatarColor: '#059669',
      content: "Why sleep 8 hours when you can install our synthetic REM-stimulator and trade crypto memecoins directly in your REM cycles? Biological limits are a loser's cope.",
      hashtags: '#Transhumanism #SleepIsWeakness #NeuroGrind'
    }
  ],
  tech_luddite: [
    {
      author: 'Brother_Moss',
      handle: '@SmashTheModems',
      avatarColor: '#713f12',
      content: "Every notification chime from a smartphone chips away a fragment of your ancestral human soul. Throw your iPhone into a river. Marry an oak tree. Eat damp soil before sunrise.",
      hashtags: '#RejectSilicon #ReturnToMud #AnarchoPrimitivism'
    },
    {
      author: 'AcornHarvester',
      handle: '@ClayPotEnthusiast',
      avatarColor: '#854d0e',
      content: "5G towers are broadcasting micro-frequencies designed to suppress your desire to forage wild garlic. We are weaving tin-foil cloaks in Sector 4. Join the resistance.",
      hashtags: '#ModemSmashers #WildGarlicTruth #UnplugNow'
    },
    {
      author: 'BarkWhisperer',
      handle: '@NoElectricityClub',
      avatarColor: '#a16207',
      content: "Your electric toothbrush is an undercover surveillance node feeding your gum health data to the Pentagon. Use a pinecone. Sleep on jagged rocks.",
      hashtags: '#PineconeHygiene #LowTechOnly #DirtPill'
    }
  ],
  pet_cat: [
    {
      author: 'BastetReborn',
      handle: '@CatSupremacyNow',
      avatarColor: '#6b21a8',
      content: "Dogs are pathetic, loud, submissive hostage victims who panic if you leave the room for 4 seconds. A cat looks at you with ancient pharaonic disdain because it knows you are temporary. Felines rule.",
      hashtags: '#CatsAreGods #DogsAreNoise #PharaohVibes'
    },
    {
      author: 'NineLivesFeline',
      handle: '@ToxoplasmosisPatriot',
      avatarColor: '#7e22ce',
      content: "Scientific fact: Dog owners have 85% lower emotional stability and require an animal to wag its tail at a piece of cardboard. My cat pushed my laptop off the desk to teach me non-attachment.",
      hashtags: '#EnlightenedFeline #CatLogic #Detachment'
    },
    {
      author: 'HisRoyalPaws',
      handle: '@ApexPredatorWhiskers',
      avatarColor: '#9333ea',
      content: "Dog parks smell like damp despair and obedience. In this house, Lord Barnaby feasts on organic raw duck and screams at 3:15 AM to remind the ghosts who pays the mortgage.",
      hashtags: '#LordBarnaby #FelineDominion #BowDown'
    }
  ],
  pet_dog: [
    {
      author: 'TacticalK9_Chief',
      handle: '@ManBestFriend1776',
      avatarColor: '#b45309',
      content: "Cats are toxoplasmosis-ridden sociopaths that will eat your eyeballs 6 minutes after your cardiac arrest. A tactical Labrador will take a bullet for your child and retrieve a mallard from icy waters. Debate closed.",
      hashtags: '#DogPill #LoyaltyAboveAll #TacticalGoodboy'
    },
    {
      author: 'BusterTheRetrieverDad',
      handle: '@GoldenPawsOnly',
      avatarColor: '#d97706',
      content: "If you don't greet your dog with 15 minutes of baby talk and belly rubs after returning from the mailbox, you have no soul. Cats don't even know your legal name.",
      hashtags: '#GoldenEnergy #PureHeart #CatSlander'
    },
    {
      author: 'PackLeader_Hank',
      handle: '@BarkDefenseForce',
      avatarColor: '#f59e0b',
      content: "Cat owners live in sensory deprivation chambers filled with shredded cardboard and arrogance. Dogs built the modern world. Show some respect.",
      hashtags: '#WorkingBreeds #CaninePride #BarkBack'
    }
  ],
  diet_carnivore: [
    {
      author: 'PrimalChieftain',
      handle: '@RawLiverDynasty',
      avatarColor: '#991b1b',
      content: "Bro, broccoli is a defensive chemical weapon engineered by plants to give you estrogen and ruin your warrior posture. I just chewed 3 lbs of frozen bison spleen in the gym parking lot. Peak vitality.",
      hashtags: '#CarnivorePill #SeedOilTerrorism #EatTheSpleen'
    },
    {
      author: 'AncestralGains',
      handle: '@BoneMarrowOnly',
      avatarColor: '#b91c1c',
      content: "Our ancestors did not hunt woolly mammoths with obsidian spears so you could sip oat milk through a paper straw that melts in 30 seconds. Put down the tofu, embrace the tallow.",
      hashtags: '#TallowGang #PrimalEnergy #OatMilkScam'
    }
  ],
  diet_vegan: [
    {
      author: 'PranicAscetic',
      handle: '@BreatharianGlow',
      avatarColor: '#3f6212',
      content: "Eating dead flesh literally absorbs the panic hormones and traumatic astral debris of the bovine astral field. I subsist entirely on filtered moonlight, spirulina drops, and vocal hums.",
      hashtags: '#VibrationalNutrition #DeadCorpseDetox #SolarDiet'
    },
    {
      author: 'ChlorophyllSaint',
      handle: '@CeleryJuiceEnlightenment',
      avatarColor: '#4d7c0f',
      content: "Cooked food is essentially ash for your mitochondria. If your lunch wasn't photosynthesizing 10 minutes ago, you are eating necrotic matter. Awaken your gut biome, people.",
      hashtags: '#LiveVibrations #PlantPurity #MitochondrialLight'
    }
  ],
  rot_alpha: [
    {
      author: 'Skibidi_Overlord0',
      handle: '@KaiCenatSub4Sub',
      avatarColor: '#0e7490',
      content: "Bro got caught fanum taxing the grimace shake in Ohio with negative 50,000 aura 💀💀 blud thought he had that rizzler rizz no cap ong fr fr. Chat is this cooked???",
      hashtags: '#SkibidiRizz #OhioMoment #AuraLoss #GyattMaxxing'
    },
    {
      author: 'SigmaMewing_Baby',
      handle: '@SubwaySurfersDualScreen',
      avatarColor: '#0891b2',
      content: "My teacher was lecturing about the Industrial Revolution without soap-cutting ASMR gameplay underneath her face. Literally unwatchable. Zero retention. Baby Gronk would never.",
      hashtags: '#BrainRotElite #SoapCutting #SubwaySurfersOrSleep'
    }
  ],
  rot_boomer: [
    {
      author: 'Patriot_Bob_1954',
      handle: '@RealAmericanEagle76',
      avatarColor: '#a16207',
      content: "NOBODY WANTS TO WORK ANYMORE!! BACK IN 1972 I BOUGHT A 4 BEDROOM HOUSE WITH A PAPER ROUTE AND SOME ELBOW GREASE! TODAY KIDS CANNOT EVEN OPERATE A LAWN MOWER BECAUSE OF PHONES!! SHARE IF YOU AGREE!!",
      hashtags: '#HardWork #RealAmericans #MillennialsAreSoft'
    },
    {
      author: 'Brenda_LiveLaughLove',
      handle: '@BlessingsAndMinions',
      avatarColor: '#ca8a04',
      content: "WARNING TO ALL GRANDMOTHERS: TEENAGERS ARE PUTTING FENTANYL AND TIK TOK DANCES INTO REFRIGERATOR MAGNETS! CALL YOUR CONGRESSMAN! GOD BLESS THE POLICE!!",
      hashtags: '#WarningAlert #GodBless #MinionMeme #ShareWith10People'
    }
  ],
  cosmic_flat: [
    {
      author: 'IceWallSentry',
      handle: '@AntarcticaIsGuarded',
      avatarColor: '#0369a1',
      content: "Why are independent citizens banned from sailing beyond 60 degrees South latitude under the Antarctic Treaty? Because the ICE WALL holds the water in! NASA is a Hollywood CGI animation studio with a budget. Wake up!",
      hashtags: '#FlatEarthTruth #IceWallEvidence #WaterIsFlat'
    }
  ],
  cosmic_sim: [
    {
      author: 'MatrixGlitchHunter',
      handle: '@Sector4RenderingBug',
      avatarColor: '#4338ca',
      content: "I stared at a pigeon for 25 minutes today and its walking animation desynced at frame 14. We are running on an unpatched quantum server. The admins are cutting RAM to save costs.",
      hashtags: '#SimulationConfirmed #LowFPSReality #PigeonGlitch'
    }
  ]
};

const RIVAL_QUOTE_REPLIES = {
  gender_alpha: [
    "Look at this broke beta cope. Go buy another course on how to breathe air, lil bro 💀",
    "Imagine paying $400 for a podcast mic just to cry about women having opinions.",
    "Babe, your hairline is receding faster than your credit score. Sit down."
  ],
  gender_femme: [
    "She demands a billionaire while her only skill is drinking iced matcha and having panic attacks.",
    "Modern women: $0 net worth, 4 credit cards maxed, demands an oil tycoon to fund her 'soft life'.",
    "Enjoy your 17 cats and cold sourdough in 2045, queen."
  ],
  tech_corp: [
    "Enjoy drinking synthetic sludge from a tube while your corporate overlord tracks your blinks.",
    "Bro has never felt moss between his toes and it shows. Unplug your router and cry.",
    "You sold your kidney to buy a JPG of a monkey and now you lecture us on economics."
  ],
  tech_luddite: [
    "Sent from an iPhone hidden inside a hollowed-out turnip. Classic mud monk hypocrisy.",
    "Have fun dying of a toothache at age 29 because you refused penicillin to honor the dirt gods.",
    "The blockchain doesn't care about your acorns, peasant."
  ],
  pet_cat: [
    "Your dog drinks out of the toilet bowl and panics when a leaf blows by. Peak intellect.",
    "Dog owners need an animal to suffer from Stockholm syndrome to feel validated.",
    "A cat doesn't need to bark at the wind to prove it has a purpose."
  ],
  pet_dog: [
    "Your cat would use your fresh corpse as a scratching post without missing a nap.",
    "Imagine adopting an animal whose entire personality is ignoring you.",
    "Good luck getting your cat to guard your house against anything bigger than a moth."
  ],
  diet_carnivore: [
    "Enjoy colon cancer and scurvy at 32, liver king junior. Have some fiber.",
    "Chewing on raw goat testicles isn't a personality trait, bro.",
    "Your breath probably smells like a medieval battlefield."
  ],
  diet_vegan: [
    "You look like a Victorian ghost who survived solely on rainwater and damp parchment.",
    "Plants literally produce toxins so they don't get eaten, but go off, salad warrior.",
    "Bro is fainting after typing a 2-sentence tweet."
  ],
  rot_alpha: [
    "Grandpa go take your blood pressure medication, Facebook is down the hall.",
    "Bro has zero rizz, negative aura, and still uses punctuation on the internet.",
    "Ok boomer, go complain about the lawn mower to the HOA."
  ],
  rot_boomer: [
    "I literally have no idea what language this toddler is speaking. Pray for our schools.",
    "In my day, children were sent to the coal mines and they were GRATEFUL!!",
    "Turn off the iPad and go pick up a shovel!!"
  ],
  cosmic_flat: [
    "Bro thinks penguins are military sentinels guarding an ice barrier. Seek psychiatric aid.",
    "Take a flight to Australia and explain time zones to us with your pizza crust model.",
    "Every telescope on earth is laughing at you."
  ],
  cosmic_sim: [
    "Bro got rejected by a girl and convinced himself she was an unrendered NPC.",
    "The only glitch is your employment status. Touch grass immediately.",
    "Not everything is the matrix, sometimes you're just socially awkward."
  ]
};

const SPONSORED_ADS = [
  {
    title: 'SPONSORED: ALPHA-MALE TESTOSTERONE GUMMIES',
    body: 'Infused with powdered woolly mammoth tusk and certified wolf saliva. Boost your dominance by 480%! Use code RAGEBAIT for 10% off.',
    sponsor: 'PrimalBioLabs™',
    revenue: 45
  },
  {
    title: 'SPONSORED: MANIFEST YOUR BILLIONAIRE HUSBAND (E-BOOK)',
    body: 'Learn the 7 forbidden ancient frequencies to force hedge fund managers to buy you Tiffany diamonds without speaking. Only $197.',
    sponsor: 'DivineEmpressAcademy™',
    revenue: 55
  },
  {
    title: 'SPONSORED: CRYPTO-BURIAL: MINED IN PARADISE',
    body: 'Tokenize your post-mortem consciousness on Ethereum! Never die—live forever as an unskippable pop-up banner in VR metaverse shopping malls!',
    sponsor: 'EtherGraveCorp™',
    revenue: 70
  },
  {
    title: 'SPONSORED: TACTICAL DOG ARMOR (BALLISTIC GRADE)',
    body: 'Equip your labradoodle with Kevlar padding and infrared thermal goggles for your morning walk around the cul-de-sac.',
    sponsor: 'K9OperatorGear™',
    revenue: 40
  },
  {
    title: 'SPONSORED: SURVIVAL ACORN FLOUR & MUD-SHACK BLUEPRINTS',
    body: 'When the internet collapses tomorrow, will you know how to boil tree bark into edible gruel? Order your doomsday bucket now!',
    sponsor: 'PrepperMossLlc™',
    revenue: 50
  }
];

class PostGenerator {
  constructor() {
    this.postCounter = 1000;
  }

  generatePost(biasFactionId = null) {
    this.postCounter++;
    
    // Pick faction (biased or weighted random)
    let factionKey = biasFactionId;
    const factionKeys = Object.keys(POST_TEMPLATES);
    if (!factionKey || !POST_TEMPLATES[factionKey]) {
      factionKey = factionKeys[Math.floor(Math.random() * factionKeys.length)];
    }

    const faction = FACTIONS[factionKey];
    const templates = POST_TEMPLATES[factionKey];
    const template = templates[Math.floor(Math.random() * templates.length)];

    // Initial engagement numbers based on rage factor
    const baseViews = Math.floor(Math.random() * 25000) + 5000;
    const baseAngries = Math.floor(baseViews * (0.05 + Math.random() * 0.15));
    const baseShares = Math.floor(baseViews * 0.04);
    const baseSkulls = Math.floor(baseViews * 0.02);

    return {
      id: `post_${this.postCounter}_${Date.now()}`,
      factionId: faction.id,
      factionName: faction.name,
      badge: faction.badge,
      icon: faction.icon,
      theme: faction.theme,
      author: template.author,
      handle: template.handle,
      avatarColor: template.avatarColor,
      content: template.content,
      hashtags: template.hashtags,
      timestamp: 'Just now',
      stats: {
        views: baseViews,
        angries: baseAngries,
        shares: baseShares,
        skulls: baseSkulls
      },
      polarizationYield: Math.floor(Math.random() * 6) + 4, // 4-10 polarization delta
      energyYield: Math.floor(Math.random() * 25) + 20, // 20-45 Neuro-Watts
      monetized: false,
      amplified: false,
      outraged: false,
      shadowbanned: false,
      quoteReply: null,
      adBanner: null
    };
  }

  injectRivalQuote(post) {
    const faction = FACTIONS[post.factionId];
    if (!faction) return post;
    const rivalKey = faction.rivalId;
    const replies = RIVAL_QUOTE_REPLIES[post.factionId] || ["You are completely unhinged and wrong."];
    const quoteText = replies[Math.floor(Math.random() * replies.length)];
    const rivalFaction = FACTIONS[rivalKey] || faction;

    post.outraged = true;
    post.quoteReply = {
      author: rivalFaction.name.split('/')[0].trim(),
      badge: rivalFaction.badge,
      theme: rivalFaction.theme,
      icon: rivalFaction.icon,
      text: quoteText
    };
    // Outrage doubles energy and triples polarization
    post.energyYield = Math.floor(post.energyYield * 2.8);
    post.polarizationYield = Math.floor(post.polarizationYield * 3.2);
    post.stats.angries = Math.floor(post.stats.angries * 3.5);
    post.stats.shares = Math.floor(post.stats.shares * 2.2);
    return post;
  }

  attachAd(post) {
    const ad = SPONSORED_ADS[Math.floor(Math.random() * SPONSORED_ADS.length)];
    post.monetized = true;
    post.adBanner = ad;
    return ad.revenue;
  }
}

window.FACTIONS = FACTIONS;
window.PostGenerator = new PostGenerator();
window.SPONSORED_ADS = SPONSORED_ADS;
