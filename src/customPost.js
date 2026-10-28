/**
 * The Echo Chamber Simulator - Custom Ragebait Post Creator
 * Allows the player to write and launch their own customized satirical posts into the feed.
 */

class CustomPostCreator {
  constructor() {
    this.customPostsCount = 0;
  }

  createPost({ author, handle, factionId, content, hashtags }) {
    this.customPostsCount++;

    const faction = window.FACTIONS[factionId] || window.FACTIONS.gender_alpha;
    const authorName = author && author.trim() ? author.trim() : 'AnonymousAgent_404';
    const authorHandle = handle && handle.trim() ? (handle.startsWith('@') ? handle : `@${handle}`) : `@AgentOutrage_${this.customPostsCount}`;
    const postContent = content && content.trim() ? content.trim() : 'I have scientifically proven that everyone who disagrees with me is an unrendered NPC.';
    const postTags = hashtags && hashtags.trim() ? hashtags.trim() : '#CustomRage #OrganicOutrage #PureRot';

    const customPost = {
      id: `custom_${this.customPostsCount}_${Date.now()}`,
      factionId: faction.id,
      factionName: faction.name,
      badge: `✍️ CRAFTED`,
      icon: '🔥',
      theme: '#f59e0b',
      author: authorName,
      handle: authorHandle,
      avatarColor: '#b45309',
      content: postContent,
      hashtags: postTags,
      timestamp: 'Just now (Player Craft)',
      stats: {
        views: Math.floor(Math.random() * 40000) + 15000,
        angries: Math.floor(Math.random() * 8000) + 2500,
        shares: Math.floor(Math.random() * 3000) + 800,
        skulls: Math.floor(Math.random() * 2000) + 500
      },
      polarizationYield: 8,
      energyYield: 65,
      monetized: false,
      amplified: false,
      outraged: false,
      shadowbanned: false,
      quoteReply: null,
      adBanner: null,
      isPlayerCrafted: true
    };

    if (window.SimulationEngine) {
      window.SimulationEngine.activeFeed.unshift(customPost);
      if (window.SimulationEngine.activeFeed.length > window.SimulationEngine.feedMaxItems) {
        window.SimulationEngine.activeFeed.pop();
      }
    }

    if (window.AudioSynth) {
      window.AudioSynth.playDopamineChime();
    }

    if (window.EventSystem) {
      window.EventSystem.breakingTicker = `NEW POST INJECTED BY ALGORITHM ARCHITECT: "${authorHandle}"`;
    }

    return customPost;
  }
}

window.CustomPostCreator = new CustomPostCreator();

