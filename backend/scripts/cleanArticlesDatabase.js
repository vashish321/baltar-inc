#!/usr/bin/env node

/**
 * Clean Articles Database Script
 * 
 * This script removes all articles from the database to prepare for Currents API integration
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanArticlesDatabase() {
  console.log('🧹 Consumer Pulse - Database Cleanup');
  console.log('====================================\n');

  try {
    // Get current article count
    const currentCount = await prisma.newsArticle.count();
    console.log(`📊 Current articles in database: ${currentCount}`);

    if (currentCount === 0) {
      console.log('✨ Database is already clean - no articles to remove!');
      return;
    }

    // Confirm cleanup
    console.log('\n⚠️  WARNING: This will permanently delete ALL articles from the database!');
    console.log('🔄 Preparing for Currents API integration...\n');

    // Delete all article analytics first (foreign key constraint)
    console.log('🗑️  Step 1: Removing article analytics...');
    const analyticsDeleted = await prisma.articleAnalytics.deleteMany({});
    console.log(`   ✅ Deleted ${analyticsDeleted.count} analytics records`);

    // Delete all news articles
    console.log('🗑️  Step 2: Removing all news articles...');
    const articlesDeleted = await prisma.newsArticle.deleteMany({});
    console.log(`   ✅ Deleted ${articlesDeleted.count} articles`);

    // Verify cleanup
    const finalCount = await prisma.newsArticle.count();
    console.log(`\n📊 Final article count: ${finalCount}`);

    if (finalCount === 0) {
      console.log('\n🎉 Database cleanup completed successfully!');
      console.log('✨ Ready for Currents API integration');
      console.log('🚀 Next steps:');
      console.log('   1. Implement Currents API service');
      console.log('   2. Set up 2-hour scheduling');
      console.log('   3. Configure duplicate detection');
    } else {
      console.log('\n⚠️  Warning: Some articles may still remain in the database');
    }

  } catch (error) {
    console.error('\n❌ Error during database cleanup:', error.message);
    
    if (error.code === 'P2003') {
      console.log('\n💡 Tip: Foreign key constraint error. Trying to delete related records first...');
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
cleanArticlesDatabase().catch(error => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});
