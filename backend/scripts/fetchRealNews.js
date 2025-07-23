#!/usr/bin/env node

/**
 * Fetch Real News Articles
 * 
 * This script fetches real news articles from NewsData.io API to replace sample data
 */

const UnifiedNewsService = require('../services/unifiedNewsService');

async function fetchRealNews() {
  console.log('📰 Fetching Real News Articles');
  console.log('==============================\n');

  const newsService = new UnifiedNewsService();

  try {
    // Clear existing sample data first
    console.log('🧹 Clearing sample data...');
    const deleted = await newsService.prisma.newsArticle.deleteMany({
      where: {
        sourceUrl: {
          contains: 'example.com'
        }
      }
    });
    console.log(`   ✅ Removed ${deleted.count} sample articles\n`);

    // Fetch real articles
    console.log('🌐 Fetching real articles from NewsData.io...');
    const result = await newsService.fetchAndProcessTopStories();

    if (result.success) {
      console.log('\n🎉 Real news fetch completed successfully!');
      console.log(`📊 Results:`);
      console.log(`   ✅ Articles saved: ${result.savedCount}`);
      console.log(`   🔍 Duplicates skipped: ${result.duplicateCount}`);
      console.log(`   ❌ Errors: ${result.errorCount}`);
      
      // Show sample of real articles
      console.log('\n📰 Sample of fetched articles:');
      const sampleArticles = await newsService.prisma.newsArticle.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        select: {
          title: true,
          sourceUrl: true,
          author: true
        }
      });

      sampleArticles.forEach((article, index) => {
        console.log(`   ${index + 1}. "${article.title}"`);
        console.log(`      Source: ${article.sourceUrl}`);
        console.log(`      Author: ${article.author}\n`);
      });

      console.log('🌐 You can now visit http://localhost:3001/consumer-pulse');
      console.log('   to see real news articles with actual source links!');

    } else {
      console.error('❌ Failed to fetch real news:', result.message);
    }

  } catch (error) {
    console.error('❌ Error fetching real news:', error.message);
    
    // If NewsData.io fails, try a simple test
    console.log('\n🔧 Testing NewsData.io API directly...');
    try {
      const axios = require('axios');
      const response = await axios.get('https://newsdata.io/api/1/latest', {
        params: {
          apikey: 'pub_e153bfe8af5b43be88dd4602c4a716d3',
          language: 'en',
          size: 5
        },
        timeout: 15000
      });

      if (response.data.status === 'success') {
        console.log(`✅ NewsData.io API is working! Received ${response.data.results.length} articles`);
        console.log('Sample article:');
        const sample = response.data.results[0];
        console.log(`   Title: ${sample.title}`);
        console.log(`   Source: ${sample.link}`);
        console.log(`   Description: ${sample.description?.substring(0, 100)}...`);
      }
    } catch (apiError) {
      console.error('❌ NewsData.io API test failed:', apiError.message);
    }
  } finally {
    await newsService.prisma.$disconnect();
  }
}

// Run the script
fetchRealNews().catch(error => {
  console.error('💥 Unhandled error:', error);
  process.exit(1);
});
