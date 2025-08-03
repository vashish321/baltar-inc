#!/usr/bin/env node

/**
 * Quick Duplicate Removal Script for Consumer Pulse
 * 
 * This script efficiently removes duplicate articles using batch operations
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function quickRemoveDuplicates() {
  console.log('🚀 Quick Duplicate Removal for Consumer Pulse');
  console.log('==============================================\n');

  try {
    // Get initial count
    const initialCount = await prisma.newsArticle.count();
    console.log(`📊 Initial article count: ${initialCount}\n`);

    let totalRemoved = 0;

    // Step 1: Remove exact title duplicates (keep oldest)
    console.log('🔍 Step 1: Removing exact title duplicates...');
    
    // Find all articles grouped by title (case-insensitive)
    const titleGroups = await prisma.$queryRaw`
      SELECT LOWER(title) as lower_title,
             array_agg(id ORDER BY "createdAt" ASC) as ids,
             COUNT(*) as count
      FROM "news_articles"
      GROUP BY LOWER(title)
      HAVING COUNT(*) > 1
    `;

    console.log(`   Found ${titleGroups.length} groups of title duplicates`);

    for (const group of titleGroups) {
      const ids = group.ids;
      const keepId = ids[0]; // Keep the oldest
      const removeIds = ids.slice(1); // Remove the rest

      if (removeIds.length > 0) {
        await prisma.newsArticle.deleteMany({
          where: {
            id: {
              in: removeIds
            }
          }
        });
        totalRemoved += removeIds.length;
        console.log(`   ✅ Removed ${removeIds.length} duplicates of: "${group.lower_title.substring(0, 50)}..."`);
      }
    }

    // Step 2: Remove exact URL duplicates (keep oldest)
    console.log('\n🔍 Step 2: Removing exact URL duplicates...');
    
    const urlGroups = await prisma.$queryRaw`
      SELECT "sourceUrl",
             array_agg(id ORDER BY "createdAt" ASC) as ids,
             COUNT(*) as count
      FROM "news_articles"
      WHERE "sourceUrl" IS NOT NULL AND "sourceUrl" != ''
      GROUP BY "sourceUrl"
      HAVING COUNT(*) > 1
    `;

    console.log(`   Found ${urlGroups.length} groups of URL duplicates`);

    for (const group of urlGroups) {
      const ids = group.ids;
      const keepId = ids[0]; // Keep the oldest
      const removeIds = ids.slice(1); // Remove the rest

      if (removeIds.length > 0) {
        await prisma.newsArticle.deleteMany({
          where: {
            id: {
              in: removeIds
            }
          }
        });
        totalRemoved += removeIds.length;
        console.log(`   ✅ Removed ${removeIds.length} duplicates with URL: ${group.sourceUrl.substring(0, 50)}...`);
      }
    }

    // Step 3: Remove articles with identical title AND summary (keep oldest)
    console.log('\n🔍 Step 3: Removing articles with identical title and summary...');
    
    const titleSummaryGroups = await prisma.$queryRaw`
      SELECT LOWER(title) as lower_title,
             LOWER(COALESCE(summary, '')) as lower_summary,
             array_agg(id ORDER BY "createdAt" ASC) as ids,
             COUNT(*) as count
      FROM "news_articles"
      GROUP BY LOWER(title), LOWER(COALESCE(summary, ''))
      HAVING COUNT(*) > 1
    `;

    console.log(`   Found ${titleSummaryGroups.length} groups of title+summary duplicates`);

    for (const group of titleSummaryGroups) {
      const ids = group.ids;
      const keepId = ids[0]; // Keep the oldest
      const removeIds = ids.slice(1); // Remove the rest

      if (removeIds.length > 0) {
        await prisma.newsArticle.deleteMany({
          where: {
            id: {
              in: removeIds
            }
          }
        });
        totalRemoved += removeIds.length;
        console.log(`   ✅ Removed ${removeIds.length} duplicates with same title+summary`);
      }
    }

    // Get final count
    const finalCount = await prisma.newsArticle.count();
    
    console.log('\n✅ Quick duplicate removal completed!');
    console.log('📊 Summary:');
    console.log(`   Initial articles: ${initialCount}`);
    console.log(`   Final articles: ${finalCount}`);
    console.log(`   Total removed: ${totalRemoved}`);
    console.log(`   Articles saved: ${initialCount - finalCount}`);
    
    if (totalRemoved > 0) {
      console.log('\n🎉 Your Consumer Pulse database is now much cleaner!');
      console.log('💡 The enhanced duplicate detection will prevent future duplicates.');
    } else {
      console.log('\n✨ No duplicates found - your database is already clean!');
    }

  } catch (error) {
    console.error('\n❌ Error during duplicate removal:', error.message);
    
    // Check if it's a table name issue
    if (error.message.includes('relation "NewsArticle" does not exist')) {
      console.log('\n💡 Tip: The table might be named differently. Common alternatives:');
      console.log('   - newsArticle (camelCase)');
      console.log('   - news_article (snake_case)');
      console.log('   - NewsArticles (plural)');
      console.log('\n🔧 Please check your Prisma schema for the correct table name.');
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
quickRemoveDuplicates().catch(error => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});
