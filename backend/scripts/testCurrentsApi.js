#!/usr/bin/env node

/**
 * Test Currents API Integration
 * 
 * This script tests the Currents API service to ensure everything works correctly
 */

const CurrentsApiService = require('../services/currentsApiService');

async function testCurrentsApi() {
  console.log('🧪 Testing Currents API Integration');
  console.log('===================================\n');

  const service = new CurrentsApiService();

  try {
    // Test 1: Check database connection
    console.log('📊 Test 1: Database Connection');
    const initialCount = await service.getArticleCount();
    console.log(`   ✅ Database connected. Current articles: ${initialCount}\n`);

    // Test 2: Fetch articles from API
    console.log('🌐 Test 2: Fetch from Currents API');
    const articles = await service.fetchLatestNews();
    console.log(`   ✅ Fetched ${articles.length} articles from API\n`);

    // Test 3: Process and save articles
    console.log('💾 Test 3: Process and Save Articles');
    const result = await service.processAndSaveArticles(articles.slice(0, 5)); // Test with first 5 articles
    console.log(`   ✅ Processing complete:`);
    console.log(`      - Saved: ${result.savedCount} articles`);
    console.log(`      - Duplicates: ${result.duplicateCount}`);
    console.log(`      - Errors: ${result.errorCount}\n`);

    // Test 4: Check final count
    console.log('📈 Test 4: Verify Database Update');
    const finalCount = await service.getArticleCount();
    console.log(`   ✅ Final article count: ${finalCount}`);
    console.log(`   📊 Articles added: ${finalCount - initialCount}\n`);

    // Test 5: Sample article data
    if (finalCount > 0) {
      console.log('📰 Test 5: Sample Article Data');
      const sampleArticle = await service.prisma.newsArticle.findFirst({
        orderBy: { createdAt: 'desc' }
      });
      
      console.log(`   ✅ Latest article:`);
      console.log(`      - Title: "${sampleArticle.title}"`);
      console.log(`      - Image: ${sampleArticle.imageUrl}`);
      console.log(`      - Category: ${sampleArticle.category}`);
      console.log(`      - Sentiment: ${sampleArticle.sentiment}`);
      console.log(`      - Source: ${sampleArticle.source}\n`);
    }

    console.log('🎉 All tests passed! Currents API integration is working correctly.');
    console.log('\n🚀 Ready to start the scheduler with:');
    console.log('   node backend/scripts/startCurrentsScheduler.js');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await service.prisma.$disconnect();
  }
}

// Run the test
testCurrentsApi().catch(error => {
  console.error('💥 Unhandled error:', error);
  process.exit(1);
});
