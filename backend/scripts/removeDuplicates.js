const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class DuplicateRemover {
  constructor() {
    this.duplicatesFound = 0;
    this.duplicatesRemoved = 0;
    this.errors = 0;
  }

  /**
   * Extract meaningful keywords from text
   */
  extractKeyWords(text) {
    if (!text) return [];
    
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
      'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those',
      'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your',
      'his', 'her', 'its', 'our', 'their', 'from', 'up', 'about', 'into', 'over', 'after'
    ]);

    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word))
      .slice(0, 20);
  }

  /**
   * Calculate similarity between two arrays of words
   */
  calculateSimilarity(words1, words2) {
    if (words1.length === 0 || words2.length === 0) return 0;

    const set1 = new Set(words1);
    const set2 = new Set(words2);
    
    const intersection = new Set([...set1].filter(word => set2.has(word)));
    const union = new Set([...set1, ...set2]);
    
    return intersection.size / union.size;
  }

  /**
   * Find and remove exact duplicates (same title or same URL)
   */
  async removeExactDuplicates() {
    console.log('🔍 Finding exact duplicates...');

    try {
      // Find articles with duplicate titles (case-insensitive)
      const titleDuplicates = await prisma.$queryRaw`
        SELECT LOWER(title) as lower_title, COUNT(*) as count, 
               ARRAY_AGG(id ORDER BY "createdAt" ASC) as ids
        FROM "NewsArticle" 
        GROUP BY LOWER(title) 
        HAVING COUNT(*) > 1
      `;

      console.log(`📊 Found ${titleDuplicates.length} groups of title duplicates`);

      for (const group of titleDuplicates) {
        const ids = group.ids;
        const keepId = ids[0]; // Keep the oldest article
        const removeIds = ids.slice(1); // Remove the rest

        console.log(`🗑️  Removing ${removeIds.length} duplicate(s) of: "${group.lower_title}"`);
        
        for (const removeId of removeIds) {
          try {
            await prisma.newsArticle.delete({
              where: { id: removeId }
            });
            this.duplicatesRemoved++;
          } catch (error) {
            console.error(`❌ Error removing article ${removeId}:`, error.message);
            this.errors++;
          }
        }
        
        this.duplicatesFound += removeIds.length;
      }

      // Find articles with duplicate source URLs
      const urlDuplicates = await prisma.$queryRaw`
        SELECT "sourceUrl", COUNT(*) as count, 
               ARRAY_AGG(id ORDER BY "createdAt" ASC) as ids
        FROM "NewsArticle" 
        WHERE "sourceUrl" IS NOT NULL AND "sourceUrl" != ''
        GROUP BY "sourceUrl" 
        HAVING COUNT(*) > 1
      `;

      console.log(`📊 Found ${urlDuplicates.length} groups of URL duplicates`);

      for (const group of urlDuplicates) {
        const ids = group.ids;
        const keepId = ids[0]; // Keep the oldest article
        const removeIds = ids.slice(1); // Remove the rest

        console.log(`🗑️  Removing ${removeIds.length} duplicate(s) with URL: ${group.sourceUrl}`);
        
        for (const removeId of removeIds) {
          try {
            // Check if this article wasn't already deleted in title cleanup
            const exists = await prisma.newsArticle.findUnique({
              where: { id: removeId }
            });

            if (exists) {
              await prisma.newsArticle.delete({
                where: { id: removeId }
              });
              this.duplicatesRemoved++;
            }
          } catch (error) {
            console.error(`❌ Error removing article ${removeId}:`, error.message);
            this.errors++;
          }
        }
        
        this.duplicatesFound += removeIds.length;
      }

    } catch (error) {
      console.error('❌ Error in exact duplicate removal:', error.message);
      this.errors++;
    }
  }

  /**
   * Find and remove similar articles (fuzzy matching)
   */
  async removeSimilarDuplicates() {
    console.log('🔍 Finding similar duplicates...');

    try {
      // Get all remaining articles ordered by creation date
      const articles = await prisma.newsArticle.findMany({
        orderBy: { createdAt: 'asc' },
        select: {
          id: true,
          title: true,
          summary: true,
          createdAt: true
        }
      });

      console.log(`📊 Analyzing ${articles.length} articles for similarity...`);

      const toRemove = new Set();

      for (let i = 0; i < articles.length; i++) {
        if (toRemove.has(articles[i].id)) continue;

        const currentArticle = articles[i];
        const currentTitleWords = this.extractKeyWords(currentArticle.title);
        const currentSummaryWords = this.extractKeyWords(currentArticle.summary || '');

        for (let j = i + 1; j < articles.length; j++) {
          if (toRemove.has(articles[j].id)) continue;

          const compareArticle = articles[j];
          const compareTitleWords = this.extractKeyWords(compareArticle.title);
          const compareSummaryWords = this.extractKeyWords(compareArticle.summary || '');

          const titleSimilarity = this.calculateSimilarity(currentTitleWords, compareTitleWords);
          const summarySimilarity = this.calculateSimilarity(currentSummaryWords, compareSummaryWords);

          // If similarity is high, mark the newer article for removal
          if (titleSimilarity > 0.7 || summarySimilarity > 0.8) {
            console.log(`🔍 Similar articles found:`);
            console.log(`   Keep: "${currentArticle.title}"`);
            console.log(`   Remove: "${compareArticle.title}"`);
            console.log(`   Similarity - Title: ${Math.round(titleSimilarity * 100)}%, Summary: ${Math.round(summarySimilarity * 100)}%`);
            
            toRemove.add(compareArticle.id);
            this.duplicatesFound++;
          }
        }
      }

      // Remove the similar duplicates
      console.log(`🗑️  Removing ${toRemove.size} similar duplicates...`);
      
      for (const articleId of toRemove) {
        try {
          await prisma.newsArticle.delete({
            where: { id: articleId }
          });
          this.duplicatesRemoved++;
        } catch (error) {
          console.error(`❌ Error removing similar article ${articleId}:`, error.message);
          this.errors++;
        }
      }

    } catch (error) {
      console.error('❌ Error in similar duplicate removal:', error.message);
      this.errors++;
    }
  }

  /**
   * Main function to remove all duplicates
   */
  async removeDuplicates() {
    console.log('🚀 Starting duplicate removal process...\n');

    const startTime = Date.now();

    // Get initial count
    const initialCount = await prisma.newsArticle.count();
    console.log(`📊 Initial article count: ${initialCount}\n`);

    // Step 1: Remove exact duplicates
    await this.removeExactDuplicates();
    
    const afterExactCount = await prisma.newsArticle.count();
    console.log(`\n📊 After exact duplicate removal: ${afterExactCount} articles\n`);

    // Step 2: Remove similar duplicates
    await this.removeSimilarDuplicates();

    const finalCount = await prisma.newsArticle.count();
    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);

    console.log('\n✅ Duplicate removal completed!');
    console.log('📊 Summary:');
    console.log(`   Initial articles: ${initialCount}`);
    console.log(`   Final articles: ${finalCount}`);
    console.log(`   Duplicates found: ${this.duplicatesFound}`);
    console.log(`   Duplicates removed: ${this.duplicatesRemoved}`);
    console.log(`   Errors: ${this.errors}`);
    console.log(`   Articles saved: ${initialCount - finalCount}`);
    console.log(`   Duration: ${duration} seconds`);
  }
}

// Run the duplicate removal
async function main() {
  try {
    const remover = new DuplicateRemover();
    await remover.removeDuplicates();
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute if run directly
if (require.main === module) {
  main();
}

module.exports = DuplicateRemover;
