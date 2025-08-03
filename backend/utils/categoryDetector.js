/**
 * Advanced Category Detection Utility for News Articles
 * 
 * Provides comprehensive keyword-based categorization with scoring system
 * to accurately classify news articles into appropriate categories.
 */

class CategoryDetector {
  constructor() {
    // Define comprehensive keyword sets for each category
    this.categoryKeywords = {
      crypto: [
        'crypto', 'bitcoin', 'ethereum', 'blockchain', 'cryptocurrency', 'btc', 'eth',
        'dogecoin', 'litecoin', 'ripple', 'cardano', 'solana', 'binance', 'coinbase',
        'defi', 'nft', 'web3', 'metaverse', 'mining', 'wallet', 'exchange', 'token',
        'altcoin', 'stablecoin', 'satoshi', 'hodl', 'doge', 'shiba', 'polygon',
        'chainlink', 'uniswap', 'opensea', 'metamask', 'ledger', 'trezor'
      ],
      
      financial: [
        'stock', 'market', 'trading', 'investment', 'finance', 'financial', 'economy',
        'economic', 'bank', 'banking', 'wall street', 'nasdaq', 'dow jones', 's&p 500',
        'earnings', 'revenue', 'profit', 'loss', 'shares', 'dividend', 'portfolio',
        'inflation', 'interest rate', 'fed', 'federal reserve', 'gdp', 'recession',
        'bull market', 'bear market', 'ipo', 'merger', 'acquisition', 'forex', 'currency',
        'bond', 'commodity', 'gold', 'silver', 'oil', 'futures', 'options', 'etf',
        'mutual fund', 'hedge fund', 'venture capital', 'private equity', 'valuation'
      ],
      
      technology: [
        'technology', 'tech', 'ai', 'artificial intelligence', 'machine learning',
        'software', 'hardware', 'computer', 'internet', 'digital', 'cyber', 'data',
        'cloud', 'startup', 'silicon valley', 'google', 'apple', 'microsoft', 'amazon',
        'facebook', 'meta', 'twitter', 'tesla', 'spacex', 'innovation', 'robotics',
        'automation', 'algorithm', 'programming', 'coding', 'app', 'mobile', 'smartphone',
        'tablet', 'laptop', 'processor', 'chip', 'semiconductor', 'quantum', 'virtual reality',
        'augmented reality', 'iot', 'internet of things', 'cybersecurity', 'hacking'
      ],
      
      health: [
        'health', 'medical', 'medicine', 'doctor', 'hospital', 'patient', 'disease',
        'virus', 'covid', 'pandemic', 'vaccine', 'treatment', 'therapy', 'drug',
        'pharmaceutical', 'clinical', 'research', 'study', 'cancer', 'diabetes',
        'heart', 'mental health', 'wellness', 'fitness', 'nutrition', 'diet',
        'surgery', 'diagnosis', 'symptom', 'epidemic', 'outbreak', 'immunity',
        'antibody', 'gene', 'genetic', 'dna', 'biotech', 'biotechnology'
      ],
      
      sports: [
        'sport', 'sports', 'football', 'basketball', 'baseball', 'soccer', 'tennis',
        'golf', 'hockey', 'olympics', 'fifa', 'nfl', 'nba', 'mlb', 'nhl', 'uefa',
        'championship', 'tournament', 'match', 'game', 'player', 'team', 'coach',
        'athlete', 'stadium', 'league', 'season', 'playoff', 'world cup',
        'super bowl', 'world series', 'finals', 'premier league', 'la liga',
        'bundesliga', 'serie a', 'champions league', 'euro', 'copa america'
      ]
    };
  }

  /**
   * Determine article category based on content with comprehensive keyword matching
   * @param {Object} article - Article object with title, description, content, etc.
   * @returns {string} - Category name or 'general' if no match
   */
  determineCategory(article) {
    // Combine all text fields for analysis
    const textFields = [
      article.title || '',
      article.description || '',
      article.summary || '',
      article.content || '',
      article.tags || '',
      (article.source && typeof article.source === 'string') ? article.source : ''
    ];
    
    const text = textFields.join(' ').toLowerCase();
    
    // Calculate scores for each category
    const categoryScores = {};
    Object.keys(this.categoryKeywords).forEach(category => {
      categoryScores[category] = this.calculateKeywordScore(text, this.categoryKeywords[category]);
    });
    
    // Find category with highest score
    const maxScore = Math.max(...Object.values(categoryScores));
    if (maxScore > 0) {
      const bestCategory = Object.keys(categoryScores).find(
        category => categoryScores[category] === maxScore
      );
      return bestCategory;
    }
    
    return 'general';
  }

  /**
   * Calculate keyword match score for category determination
   * @param {string} text - Text to analyze
   * @param {Array} keywords - Keywords to search for
   * @returns {number} - Score based on keyword matches
   */
  calculateKeywordScore(text, keywords) {
    let score = 0;
    keywords.forEach(keyword => {
      // Create regex for whole word matching
      const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) {
        // Weight longer keywords higher and count multiple occurrences
        const keywordWeight = keyword.length > 5 ? 2 : 1;
        const frequencyBonus = matches.length;
        score += frequencyBonus * keywordWeight;
      }
    });
    return score;
  }

  /**
   * Get category distribution for debugging
   * @param {Object} article - Article object
   * @returns {Object} - Scores for each category
   */
  getCategoryScores(article) {
    const textFields = [
      article.title || '',
      article.description || '',
      article.summary || '',
      article.content || '',
      article.tags || ''
    ];
    
    const text = textFields.join(' ').toLowerCase();
    
    const categoryScores = {};
    Object.keys(this.categoryKeywords).forEach(category => {
      categoryScores[category] = this.calculateKeywordScore(text, this.categoryKeywords[category]);
    });
    
    return categoryScores;
  }
}

module.exports = CategoryDetector;
