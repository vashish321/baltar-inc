const NewsScrapingService = require('./services/newsScrapingService');

async function triggerScraping() {
  console.log('🔄 Starting news scraping...');
  
  try {
    const newsService = new NewsScrapingService();
    const result = await newsService.scrapeAndGenerateContent();
    
    console.log('✅ Scraping completed!');
    console.log(`📊 Results:`, result);
    
    if (result.success) {
      console.log(`📰 Scraped: ${result.scraped} articles`);
      console.log(`🤖 Generated: ${result.generated} enhanced articles`);
      console.log(`💾 Saved: ${result.saved} articles to database`);
    }
  } catch (error) {
    console.error('❌ Scraping failed:', error);
  }
  
  process.exit(0);
}

triggerScraping();
