#!/usr/bin/env node

/**
 * Add Sample Articles for Testing
 * 
 * This script adds sample articles to test the new Consumer Pulse interface
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const sampleArticles = [
  {
    title: "Microsoft Poaches More Google DeepMind AI Talent",
    content: "Microsoft's artificial intelligence group has been growing under Mustafa Suleyman, a co-founder of the DeepMind research lab Google acquired years ago. The tech giant continues to expand its AI capabilities as competition in the sector intensifies.",
    summary: "Microsoft's AI division grows as it recruits talent from Google's DeepMind research lab.",
    sourceUrl: "https://example.com/microsoft-ai-talent",
    category: "TECHNOLOGY",
    imageUrl: "https://image.cnbcfm.com/api/v1/image/108127104-1743809465782-gettyimages-2207890592-MICROSOFT_COPILOT.jpeg?v=1753148442&w=1920&h=1080",
    keywords: JSON.stringify(["technology", "ai", "microsoft", "google"]),
    author: "Jordan Novet",
    sentiment: "POSITIVE",
    sentimentScore: 0.7,
    status: "PUBLISHED"
  },
  {
    title: "Coca-Cola Releases Trump-Approved Cane Sugar Version",
    content: "Coca-Cola confirmed that it will release a new Coke made with cane sugar. The announcement follows a social media post from President Donald Trump last week in which he claimed he persuaded the company to replace high-fructose corn syrup.",
    summary: "Coca-Cola announces new cane sugar version following Trump's social media influence.",
    sourceUrl: "https://example.com/coca-cola-cane-sugar",
    category: "BUSINESS",
    imageUrl: "/consumer-pulse-banner.svg",
    keywords: JSON.stringify(["business", "coca-cola", "trump", "food"]),
    author: "Jordan Valinsky",
    sentiment: "NEUTRAL",
    sentimentScore: 0.1,
    status: "PUBLISHED"
  },
  {
    title: "House Speaker Starts August Recess Early to Avoid Jeffrey Epstein Votes",
    content: "U.S. Speaker of the House Mike Johnson speaks to reporters at the U.S. Capitol. Congressional Lawmakers have returned to work on Capitol Hill after the weekend. The decision comes amid growing pressure for transparency regarding Epstein-related documents.",
    summary: "House Speaker Mike Johnson initiates early recess to sidestep controversial Epstein-related voting.",
    sourceUrl: "https://example.com/house-speaker-recess",
    category: "POLITICS",
    imageUrl: "/consumer-pulse-banner.svg",
    keywords: JSON.stringify(["politics", "congress", "epstein", "transparency"]),
    author: "Dan Mangan",
    sentiment: "NEGATIVE",
    sentimentScore: -0.4,
    status: "PUBLISHED"
  },
  {
    title: "FDA's New Top Drug Regulator Hails from Industry",
    content: "This is the web edition of D.C. Diagnosis, STAT's twice-weekly newsletter about the politics and policy of health and medicine. The appointment raises questions about potential conflicts of interest in pharmaceutical regulation.",
    summary: "New FDA drug regulator's industry background sparks conflict of interest concerns.",
    sourceUrl: "https://example.com/fda-regulator-industry",
    category: "HEALTH",
    imageUrl: "/consumer-pulse-banner.svg",
    keywords: JSON.stringify(["health", "fda", "pharmaceuticals", "regulation"]),
    author: "John Wilkerson",
    sentiment: "NEUTRAL",
    sentimentScore: -0.1,
    status: "PUBLISHED"
  },
  {
    title: "Jannik Sinner Beats Carlos Alcaraz to Win First Wimbledon Title",
    content: "Jannik Sinner beats 2-time defending champion Carlos Alcaraz to win his first Wimbledon title in a thrilling final match. The victory marks a significant milestone in Sinner's tennis career and ends Alcaraz's championship streak.",
    summary: "Jannik Sinner defeats defending champion Carlos Alcaraz for maiden Wimbledon victory.",
    sourceUrl: "https://example.com/sinner-wimbledon-win",
    category: "SPORTS",
    imageUrl: "/consumer-pulse-banner.svg",
    keywords: JSON.stringify(["sports", "tennis", "wimbledon", "sinner", "alcaraz"]),
    author: "Tennis Reporter",
    sentiment: "POSITIVE",
    sentimentScore: 0.8,
    status: "PUBLISHED"
  },
  {
    title: "China's Problem With Competition: There's Too Much of It",
    content: "China faces an unusual economic challenge - excessive competition in many sectors leading to price wars and reduced profitability. This oversupply situation affects everything from electric vehicles to solar panels, creating global market disruptions.",
    summary: "China grapples with oversupply and excessive competition across multiple industries.",
    sourceUrl: "https://example.com/china-competition-problem",
    category: "WORLD",
    imageUrl: "/consumer-pulse-banner.svg",
    keywords: JSON.stringify(["world", "china", "economy", "competition"]),
    author: "New York Times",
    sentiment: "NEUTRAL",
    sentimentScore: 0.0,
    status: "PUBLISHED"
  }
];

async function addSampleArticles() {
  console.log('📰 Adding Sample Articles for Consumer Pulse Testing');
  console.log('===================================================\n');

  try {
    // Check current count
    const currentCount = await prisma.newsArticle.count();
    console.log(`📊 Current articles in database: ${currentCount}`);

    // Add sample articles
    console.log('➕ Adding sample articles...\n');
    
    for (const [index, article] of sampleArticles.entries()) {
      try {
        const savedArticle = await prisma.newsArticle.create({
          data: {
            ...article,
            publishedAt: new Date(Date.now() - (index * 60 * 60 * 1000)), // Stagger by hours
            scrapedAt: new Date(),
          }
        });
        
        console.log(`   ✅ Added: "${savedArticle.title}"`);
      } catch (error) {
        console.error(`   ❌ Failed to add article ${index + 1}: ${error.message}`);
      }
    }

    // Final count
    const finalCount = await prisma.newsArticle.count();
    console.log(`\n📊 Final article count: ${finalCount}`);
    console.log(`➕ Articles added: ${finalCount - currentCount}`);

    console.log('\n🎉 Sample articles added successfully!');
    console.log('🌐 You can now test the Consumer Pulse interface at:');
    console.log('   http://localhost:3000/consumer-pulse');

  } catch (error) {
    console.error('❌ Error adding sample articles:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
addSampleArticles().catch(error => {
  console.error('💥 Unhandled error:', error);
  process.exit(1);
});
