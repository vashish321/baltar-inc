const ConsumerPulseService = require('./services/consumerPulseService');
const AIService = require('./services/aiService');

async function createSampleArticles() {
  console.log('📰 Creating sample articles for Consumer Pulse...');
  
  const aiService = new AIService();
  
  const sampleArticles = [
    {
      title: "Consumer Confidence Surges to 18-Month High Amid Economic Recovery",
      content: `Consumer confidence has reached its highest level in 18 months, according to the latest market research data. The Consumer Pulse Index shows a significant uptick in optimism across all demographic segments.

Market Research Insights:
Recent polling data indicates that 68% of consumers feel more confident about their financial situation compared to six months ago. This surge in confidence is attributed to improved job market conditions and stabilizing inflation rates.

Key findings from our comprehensive survey analysis:
• 72% of respondents plan to increase spending in the next quarter
• Millennials show the highest confidence levels at 74%
• Consumer sentiment toward technology purchases has improved by 23%

Business Implications:
Companies should consider this positive sentiment shift when planning their marketing strategies. Our analytics platform shows increased engagement with consumer surveys, indicating higher willingness to participate in market research.

For businesses seeking detailed consumer insights and real-time sentiment tracking, our Consumer Pulse platform provides comprehensive analytics and demographic breakdowns.`,
      summary: "Consumer confidence reaches 18-month high as economic recovery strengthens, with 68% feeling more optimistic about finances.",
      author: "Consumer Pulse Research Team",
      category: "Economics",
      keywords: ["consumer confidence", "market research", "economic recovery", "consumer sentiment"],
      status: "PUBLISHED",
      imageUrl: "/Trump.jpg"
    },
    {
      title: "Technology Adoption Accelerates Among Gen Z Consumers",
      content: `A comprehensive analysis of technology adoption patterns reveals that Generation Z consumers are driving unprecedented demand for innovative digital solutions.

Consumer Behavior Analysis:
Our latest survey data shows that 89% of Gen Z consumers adopt new technologies within the first six months of release. This represents a 34% increase from previous generations at the same age.

Market Research Findings:
• Mobile-first approach dominates purchasing decisions (94%)
• Social commerce influences 78% of buying behaviors
• Sustainability features impact 65% of tech purchase decisions

Sentiment Analysis Results:
AI-powered sentiment analysis of consumer feedback reveals overwhelmingly positive attitudes toward emerging technologies, with particular enthusiasm for AI-integrated products and sustainable tech solutions.

Business Intelligence:
Companies targeting Gen Z should prioritize mobile optimization and social integration. Our polling data suggests that authentic brand engagement through surveys and feedback collection significantly improves brand loyalty.

Access comprehensive demographic analysis and real-time consumer insights through our Consumer Pulse analytics platform.`,
      summary: "Gen Z leads technology adoption with 89% embracing new innovations within six months of release.",
      author: "Consumer Pulse Research Team",
      category: "Technology",
      keywords: ["Gen Z", "technology adoption", "consumer behavior", "market trends"],
      status: "PUBLISHED",
      imageUrl: "/USAChina.jpg"
    },
    {
      title: "Retail Spending Patterns Shift Toward Experience-Based Purchases",
      content: `Market research reveals a fundamental shift in consumer spending priorities, with experience-based purchases gaining significant traction over material goods.

Consumer Pulse Survey Results:
Our comprehensive polling of 10,000 consumers across major metropolitan areas shows that 61% now prioritize experiences over physical products. This represents a 28% increase from pre-pandemic levels.

Key Market Insights:
• Travel and entertainment spending up 45% year-over-year
• Subscription services see 67% growth in consumer adoption
• Local experience businesses report 52% increase in demand

Sentiment Analysis:
AI-powered analysis of consumer feedback indicates strong positive sentiment toward businesses that offer personalized experiences. Consumers express 73% higher satisfaction with experience-based purchases.

Business Strategy Implications:
Retailers should consider incorporating experiential elements into their offerings. Our analytics show that businesses conducting regular consumer surveys to understand experience preferences see 31% higher customer retention.

For detailed consumer behavior analysis and market intelligence, businesses can access our comprehensive survey platform and real-time sentiment tracking tools.`,
      summary: "Consumer spending shifts toward experiences with 61% prioritizing experiential purchases over material goods.",
      author: "Consumer Pulse Research Team",
      category: "Consumer",
      keywords: ["retail trends", "consumer spending", "experience economy", "market analysis"],
      status: "PUBLISHED",
      imageUrl: "/TradeWar.jpg"
    },
    {
      title: "Sustainable Products Drive 40% of Purchase Decisions in 2024",
      content: `Environmental consciousness has become a dominant factor in consumer decision-making, with sustainability features influencing nearly half of all purchases according to our latest market research.

Consumer Pulse Environmental Survey:
Our comprehensive analysis of consumer behavior patterns reveals that 40% of purchase decisions are now primarily driven by sustainability considerations, marking a 67% increase from 2022 levels.

Market Research Highlights:
• 78% of consumers willing to pay premium for sustainable products
• Eco-friendly packaging influences 84% of purchasing decisions
• Carbon footprint information requested by 69% of survey respondents

Demographic Analysis:
Millennials and Gen Z lead the sustainability movement, with 85% and 91% respectively considering environmental impact in their purchasing decisions. However, our polling data shows growing awareness across all age groups.

Business Intelligence:
Companies that transparently communicate their sustainability efforts see 43% higher consumer trust scores. Regular consumer surveys about environmental preferences help businesses align with evolving values.

Access detailed sustainability sentiment analysis and consumer preference data through our Consumer Pulse platform for comprehensive market intelligence.`,
      summary: "Sustainability drives 40% of consumer purchases as environmental consciousness reaches new heights.",
      author: "Consumer Pulse Research Team",
      category: "Business",
      keywords: ["sustainability", "consumer preferences", "environmental impact", "green products"],
      status: "PUBLISHED",
      imageUrl: "/TrumpChina.jpg"
    },
    {
      title: "Remote Work Preferences Reshape Consumer Spending Habits",
      content: `The continued prevalence of remote work has fundamentally altered consumer spending patterns, creating new market opportunities and challenges for businesses.

Work-From-Home Impact Study:
Our extensive consumer research indicates that remote work arrangements have shifted spending from traditional categories to home improvement, technology, and wellness products.

Consumer Behavior Insights:
• Home office equipment purchases increased 156% since 2020
• Meal delivery services see 89% higher usage among remote workers
• Wellness and fitness subscriptions up 134% in remote-work households

Market Research Data:
Polling results show that 73% of remote workers have permanently altered their spending priorities. Consumer sentiment analysis reveals high satisfaction with work-from-home arrangements, with 82% preferring hybrid or fully remote options.

Economic Implications:
The shift has created new market segments while disrupting traditional retail patterns. Businesses conducting regular surveys about remote work preferences can better anticipate consumer needs.

For comprehensive analysis of changing consumer behaviors and market trends, access our Consumer Pulse platform for real-time insights and demographic breakdowns.`,
      summary: "Remote work reshapes consumer spending with 156% increase in home office purchases and new market priorities.",
      author: "Consumer Pulse Research Team",
      category: "Business",
      keywords: ["remote work", "consumer spending", "work from home", "market trends"],
      status: "PUBLISHED",
      imageUrl: "/Trump.jpg"
    },
    {
      title: "AI-Powered Personalization Drives 58% Increase in Customer Satisfaction",
      content: `Artificial intelligence is revolutionizing customer experiences, with businesses leveraging AI for personalization seeing dramatic improvements in consumer satisfaction and engagement.

AI Personalization Research:
Our comprehensive market analysis reveals that companies implementing AI-driven personalization strategies achieve 58% higher customer satisfaction scores compared to traditional approaches.

Consumer Response Analysis:
• 76% of consumers prefer personalized shopping experiences
• AI-recommended products have 43% higher purchase rates
• Personalized content engagement increases by 67%

Sentiment Analysis Results:
Consumer feedback analysis shows overwhelmingly positive responses to AI personalization when implemented transparently. Trust levels increase by 34% when companies explain their AI usage.

Market Intelligence:
Businesses using AI for consumer insights and survey analysis report 45% better understanding of customer preferences. Real-time sentiment tracking enables rapid response to changing consumer needs.

Technology Adoption Trends:
Our polling data indicates that 82% of consumers are comfortable with AI personalization for improved experiences, representing a significant shift in technology acceptance.

Access advanced AI-powered consumer analytics and personalization insights through our Consumer Pulse platform.`,
      summary: "AI personalization boosts customer satisfaction by 58% as consumers embrace intelligent experiences.",
      author: "Consumer Pulse Research Team",
      category: "Technology",
      keywords: ["artificial intelligence", "personalization", "customer satisfaction", "AI analytics"],
      status: "PUBLISHED",
      imageUrl: "/USAChina.jpg"
    }
  ];

  const createdArticles = [];
  
  for (const article of sampleArticles) {
    try {
      // Analyze sentiment using AI
      const sentiment = await aiService.analyzeSentiment(article.content);
      
      const result = await ConsumerPulseService.createArticle({
        ...article,
        sentiment: sentiment.sentiment,
        sentimentScore: sentiment.score
      });
      
      if (result.success) {
        createdArticles.push(result.article);
        console.log(`✅ Created article: ${article.title}`);
      }
    } catch (error) {
      console.error(`❌ Failed to create article: ${error.message}`);
    }
  }

  console.log(`\n🎉 Successfully created ${createdArticles.length} sample articles!`);
  console.log('📊 Articles are now available on the Consumer Pulse homepage');
  
  return createdArticles;
}

// Run the script
if (require.main === module) {
  createSampleArticles().then(() => {
    process.exit(0);
  }).catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
}

module.exports = createSampleArticles;
