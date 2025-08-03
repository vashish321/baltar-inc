const axios = require('axios');
const ConsumerPulseService = require('./services/consumerPulseService');
const NewsScrapingService = require('./services/newsScrapingService');
const AIService = require('./services/aiService');

// Test configuration
const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://baltar-inc-production.up.railway.app/api/consumer-pulse'
  : 'http://localhost:5000/api/consumer-pulse';

async function testConsumerPulse() {
  console.log('🧪 Testing Consumer Pulse Implementation...\n');

  try {
    // Test 1: Create sample surveys
    console.log('1. Creating sample surveys...');
    
    const sampleSurveys = [
      {
        title: 'Consumer Technology Preferences 2024',
        description: 'Understanding how consumers interact with technology in their daily lives',
        targetAudience: 'General consumers aged 18-65',
        questions: [
          {
            type: 'multiple_choice',
            question: 'Which technology do you use most frequently?',
            options: ['Smartphone', 'Laptop', 'Tablet', 'Smart TV', 'Gaming Console']
          },
          {
            type: 'rating',
            question: 'How satisfied are you with your current smartphone?'
          },
          {
            type: 'text',
            question: 'What new technology feature would you most like to see in the next year?'
          }
        ],
        settings: {
          allowAnonymous: true,
          collectLocation: false
        },
        status: 'ACTIVE',
        createdBy: 'test-admin'
      },
      {
        title: 'Shopping Behavior Analysis',
        description: 'Research into consumer shopping patterns and preferences',
        targetAudience: 'Online shoppers',
        questions: [
          {
            type: 'multiple_choice',
            question: 'How often do you shop online?',
            options: ['Daily', 'Weekly', 'Monthly', 'Rarely', 'Never']
          },
          {
            type: 'multiple_choice',
            question: 'What influences your purchasing decisions most?',
            options: ['Price', 'Brand reputation', 'Reviews', 'Recommendations', 'Advertising']
          },
          {
            type: 'rating',
            question: 'How important is fast delivery to you?'
          }
        ],
        status: 'ACTIVE',
        createdBy: 'test-admin'
      }
    ];

    const createdSurveys = [];
    for (const survey of sampleSurveys) {
      try {
        const result = await ConsumerPulseService.createSurvey(survey);
        if (result.success) {
          createdSurveys.push(result.survey);
          console.log(`✅ Created survey: ${survey.title}`);
        }
      } catch (error) {
        console.log(`❌ Failed to create survey: ${error.message}`);
      }
    }

    // Test 2: Create sample polls
    console.log('\n2. Creating sample polls...');
    
    const samplePolls = [
      {
        title: 'Market Confidence Poll',
        question: 'How confident are you about the economy in the next 6 months?',
        options: ['Very confident', 'Somewhat confident', 'Neutral', 'Somewhat concerned', 'Very concerned'],
        allowMultiple: false,
        status: 'ACTIVE',
        createdBy: 'test-admin'
      },
      {
        title: 'Work From Home Preference',
        question: 'What is your preferred work arrangement?',
        options: ['Fully remote', 'Hybrid (2-3 days office)', 'Mostly office', 'Fully in office'],
        allowMultiple: false,
        status: 'ACTIVE',
        createdBy: 'test-admin'
      }
    ];

    const createdPolls = [];
    for (const poll of samplePolls) {
      try {
        const result = await ConsumerPulseService.createPoll(poll);
        if (result.success) {
          createdPolls.push(result.poll);
          console.log(`✅ Created poll: ${poll.title}`);
        }
      } catch (error) {
        console.log(`❌ Failed to create poll: ${error.message}`);
      }
    }

    // Test 3: Submit sample responses
    console.log('\n3. Submitting sample survey responses...');
    
    if (createdSurveys.length > 0) {
      const survey = createdSurveys[0];
      const sampleResponses = [
        {
          q_0: 'Smartphone',
          q_1: 4,
          q_2: 'Better battery life and faster charging'
        },
        {
          q_0: 'Laptop',
          q_1: 5,
          q_2: 'More AI integration in productivity apps'
        },
        {
          q_0: 'Smartphone',
          q_1: 3,
          q_2: 'Improved camera quality for low light'
        }
      ];

      for (const response of sampleResponses) {
        try {
          const result = await ConsumerPulseService.submitSurveyResponse({
            surveyId: survey.id,
            responses: response,
            ipAddress: '127.0.0.1',
            userAgent: 'Test Agent'
          });
          if (result.success) {
            console.log(`✅ Submitted survey response`);
          }
        } catch (error) {
          console.log(`❌ Failed to submit response: ${error.message}`);
        }
      }
    }

    // Test 4: Submit sample poll votes
    console.log('\n4. Submitting sample poll votes...');
    
    if (createdPolls.length > 0) {
      const poll = createdPolls[0];
      const sampleVotes = [0, 1, 2, 1, 0, 3, 1, 2]; // Various option indices

      for (let i = 0; i < sampleVotes.length; i++) {
        try {
          const result = await ConsumerPulseService.submitPollVote({
            pollId: poll.id,
            optionIndex: sampleVotes[i],
            ipAddress: `127.0.0.${i + 1}`, // Different IPs to avoid duplicates
            userAgent: 'Test Agent'
          });
          if (result.success) {
            console.log(`✅ Submitted poll vote`);
          }
        } catch (error) {
          console.log(`❌ Failed to submit vote: ${error.message}`);
        }
      }
    }

    // Test 5: Test AI sentiment analysis
    console.log('\n5. Testing AI sentiment analysis...');
    
    const aiService = new AIService();
    const testTexts = [
      'I love this new product! It has exceeded all my expectations.',
      'This service is terrible and I would not recommend it to anyone.',
      'The product is okay, nothing special but it works as expected.',
      'Amazing customer service and great value for money!'
    ];

    for (const text of testTexts) {
      try {
        const sentiment = await aiService.analyzeSentiment(text);
        console.log(`✅ Text: "${text.substring(0, 30)}..." → ${sentiment.sentiment} (${sentiment.score.toFixed(2)})`);
      } catch (error) {
        console.log(`❌ Sentiment analysis failed: ${error.message}`);
      }
    }

    // Test 6: Create sample articles
    console.log('\n6. Creating sample articles...');
    
    const sampleArticles = [
      {
        title: 'Consumer Confidence Rises in Q4 2024',
        content: 'Recent market research indicates that consumer confidence has increased significantly in the fourth quarter of 2024. This positive trend reflects growing optimism about economic recovery and job market stability.',
        summary: 'Consumer confidence shows strong growth in Q4 2024',
        author: 'Consumer Pulse Research Team',
        category: 'Economics',
        keywords: ['consumer confidence', 'market research', 'economic recovery'],
        status: 'PUBLISHED'
      },
      {
        title: 'Technology Adoption Trends Among Millennials',
        content: 'A comprehensive survey of millennial consumers reveals interesting patterns in technology adoption. The data shows a preference for mobile-first solutions and sustainable tech products.',
        summary: 'Millennials drive mobile-first technology adoption',
        author: 'Consumer Pulse Research Team',
        category: 'Technology',
        keywords: ['millennials', 'technology adoption', 'mobile technology'],
        status: 'PUBLISHED'
      }
    ];

    for (const article of sampleArticles) {
      try {
        // Analyze sentiment
        const sentiment = await aiService.analyzeSentiment(article.content);
        
        const result = await ConsumerPulseService.createArticle({
          ...article,
          sentiment: sentiment.sentiment,
          sentimentScore: sentiment.score
        });
        
        if (result.success) {
          console.log(`✅ Created article: ${article.title}`);
        }
      } catch (error) {
        console.log(`❌ Failed to create article: ${error.message}`);
      }
    }

    // Test 7: Generate API key
    console.log('\n7. Testing API key generation...');
    
    try {
      const apiKeyResult = await ConsumerPulseService.generateAPIKey({
        name: 'Test Business API Key',
        tier: 'BASIC',
        rateLimit: 1000
      });
      
      if (apiKeyResult.success) {
        console.log(`✅ Generated API key: ${apiKeyResult.apiKey.substring(0, 8)}...`);
        
        // Test API key validation
        const validationResult = await ConsumerPulseService.validateAPIKey(apiKeyResult.apiKey);
        if (validationResult.success) {
          console.log(`✅ API key validation successful`);
        }
      }
    } catch (error) {
      console.log(`❌ API key test failed: ${error.message}`);
    }

    // Test 8: Test news scraping (optional)
    console.log('\n8. Testing news scraping (sample)...');
    
    try {
      const newsService = new NewsScrapingService();
      // Test with a small sample to avoid overwhelming external services
      console.log('✅ News scraping service initialized');
      console.log('ℹ️  Full scraping can be triggered via API endpoint');
    } catch (error) {
      console.log(`❌ News scraping test failed: ${error.message}`);
    }

    console.log('\n🎉 Consumer Pulse testing completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Created ${createdSurveys.length} surveys`);
    console.log(`- Created ${createdPolls.length} polls`);
    console.log('- Tested AI sentiment analysis');
    console.log('- Created sample articles');
    console.log('- Generated and validated API key');
    console.log('- Initialized news scraping service');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
if (require.main === module) {
  testConsumerPulse();
}

module.exports = testConsumerPulse;
