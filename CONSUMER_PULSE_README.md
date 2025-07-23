# Consumer Pulse - Market Research & Surveys Platform

## Overview

Consumer Pulse is a comprehensive market research and survey platform that provides businesses with real-time consumer insights, sentiment analysis, and automated data analytics. The platform features live polling, AI-powered sentiment analysis, automated news content generation, and API access for businesses.

## Features Implemented

### ✅ Live Polling & Consumer Surveys
- **Interactive Survey Forms**: Multi-question surveys with various question types (multiple choice, text, rating)
- **Real-time Polling**: Live polls with instant results and vote tracking
- **Response Management**: Anonymous and registered user responses
- **IP-based Duplicate Prevention**: Prevents multiple votes from same IP address

### ✅ AI-Powered Sentiment Analysis
- **Multi-Provider Support**: Local rule-based, OpenAI, and Hugging Face sentiment analysis
- **Batch Processing**: Analyze multiple texts efficiently
- **Confidence Scoring**: Provides confidence levels for sentiment predictions
- **Real-time Analysis**: Automatic sentiment analysis on survey responses and articles

### ✅ Automated Data Analysis & Reports
- **Survey Analytics**: Completion rates, response counts, sentiment scoring
- **Poll Analytics**: Vote distributions, engagement metrics
- **AI-Generated Insights**: Automated insights generation from survey data
- **Demographic Analysis**: Response pattern analysis and segmentation

### ✅ API Access for Businesses
- **Secure API Keys**: SHA-256 hashed API key management
- **Rate Limiting**: Configurable request limits per API tier
- **Usage Tracking**: Detailed API usage analytics and monitoring
- **Multiple Access Tiers**: FREE, BASIC, PREMIUM, ENTERPRISE tiers

### ✅ News Scraping & Content Generation
- **Automated News Scraping**: Scrapes from Reuters, BBC, and other sources
- **AI Content Enhancement**: Adds market research perspective to news articles
- **SEO Optimization**: Strategic keyword placement for traffic direction
- **Scheduled Scraping**: Configurable automatic content generation

### ✅ Analytics Dashboard
- **Real-time Metrics**: Live dashboard with key performance indicators
- **Data Visualization**: Charts, graphs, and trend analysis
- **Sentiment Overview**: Market sentiment breakdown and analysis
- **Business Intelligence**: Actionable insights for decision making

## Technical Architecture

### Backend (Node.js + Express)
```
backend/
├── services/
│   ├── consumerPulseService.js    # Core business logic
│   ├── aiService.js               # AI integration & sentiment analysis
│   └── newsScrapingService.js     # News scraping & content generation
├── routes/
│   └── consumerPulseRoutes.js     # API endpoints
└── prisma/
    └── schema.prisma              # Database models
```

### Frontend (Next.js + React)
```
apps/app/
├── consumer-pulse/                # Main Consumer Pulse page
├── consumer-pulse-surveys/        # Survey interface
├── consumer-pulse-polling/        # Live polling interface
├── consumer-pulse-analytics/      # Analytics dashboard
└── components/ConsumerPulseComponent/
    ├── SurveyComponent/          # Survey forms and responses
    ├── PollingComponent/         # Live polling interface
    └── AnalyticsComponent/       # Dashboard and charts
```

### Database Models (Prisma)
- **Survey**: Survey definitions and settings
- **SurveyResponse**: User responses to surveys
- **Poll**: Live poll definitions
- **PollVote**: Individual poll votes
- **NewsArticle**: Generated and scraped articles
- **SurveyAnalytics**: Automated analytics data
- **ArticleAnalytics**: Article performance metrics
- **APIKey**: Business API access management
- **APIUsage**: API usage tracking
- **ConsumerPulseUser**: User management

## API Endpoints

### Public Endpoints
```
GET  /api/consumer-pulse/surveys           # Get active surveys
POST /api/consumer-pulse/surveys/:id/responses  # Submit survey response
GET  /api/consumer-pulse/polls             # Get active polls
POST /api/consumer-pulse/polls/:id/vote    # Submit poll vote
GET  /api/consumer-pulse/articles          # Get published articles
```

### Admin Endpoints (Require Authentication)
```
POST /api/consumer-pulse/surveys           # Create survey
PATCH /api/consumer-pulse/surveys/:id/status  # Update survey status
POST /api/consumer-pulse/polls             # Create poll
POST /api/consumer-pulse/articles          # Create article
POST /api/consumer-pulse/api-keys          # Generate API key
POST /api/consumer-pulse/scrape-news       # Trigger news scraping
POST /api/consumer-pulse/start-auto-scraping  # Start automatic scraping
```

### Business API Endpoints (Require API Key)
```
GET  /api/consumer-pulse/api/surveys       # Access survey data
GET  /api/consumer-pulse/api/polls         # Access poll data
GET  /api/consumer-pulse/api/articles      # Access article data
```

## AI Integration

### Sentiment Analysis Providers
1. **Local Rule-based**: Fast, offline sentiment analysis using keyword matching
2. **OpenAI GPT**: Advanced sentiment analysis with confidence scoring
3. **Hugging Face**: Transformer-based sentiment analysis models

### AI Features
- **Automatic Fallback**: Falls back to local analysis if external APIs fail
- **Batch Processing**: Efficient processing of multiple texts
- **Content Enhancement**: AI-powered article enhancement with market research angles
- **Insights Generation**: Automated survey insights and recommendations

## Environment Variables

### Required for AI Features
```env
# Optional - for enhanced AI features
OPENAI_API_KEY=your_openai_api_key_here
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
```

### Database
```env
DATABASE_URL=your_postgresql_connection_string
```

## Installation & Setup

### 1. Install Dependencies
```bash
cd backend
npm install

cd ../apps
npm install
```

### 2. Database Setup
```bash
cd backend
npx prisma db push
```

### 3. Create Sample Data
```bash
cd backend
node test-consumer-pulse.js
```

### 4. Start Servers
```bash
# Backend (Terminal 1)
cd backend
npm run dev

# Frontend (Terminal 2)
cd apps
npm run dev
```

### 5. Access the Platform
- **Main Consumer Pulse**: http://localhost:3000/consumer-pulse
- **Surveys**: http://localhost:3000/consumer-pulse-surveys
- **Live Polling**: http://localhost:3000/consumer-pulse-polling
- **Analytics Dashboard**: http://localhost:3000/consumer-pulse-analytics

## Usage Examples

### Creating a Survey (Admin)
```javascript
const survey = {
  title: "Consumer Technology Preferences 2024",
  description: "Understanding consumer tech usage",
  questions: [
    {
      type: "multiple_choice",
      question: "Which device do you use most?",
      options: ["Smartphone", "Laptop", "Tablet"]
    },
    {
      type: "rating",
      question: "Rate your satisfaction (1-5)"
    }
  ],
  status: "ACTIVE"
};
```

### API Access for Businesses
```javascript
// Get survey data with API key
const response = await fetch('/api/consumer-pulse/api/surveys', {
  headers: {
    'X-API-Key': 'your_api_key_here'
  }
});
```

### Sentiment Analysis
```javascript
const aiService = new AIService();
const sentiment = await aiService.analyzeSentiment("Great product!");
// Returns: { sentiment: "POSITIVE", score: 0.8, confidence: 0.9 }
```

## Traffic Direction Strategy

### SEO Keywords Integration
- **Market Research**: Integrated into all content
- **Consumer Behavior**: Strategic placement in articles
- **Business Analytics**: Targeted keyword optimization
- **Survey Data**: Content enhancement for search visibility

### Content Strategy
- **News Enhancement**: AI adds market research perspective to trending news
- **Keyword Optimization**: Automatic SEO keyword integration
- **Traffic Funneling**: Strategic internal linking to survey and polling pages
- **Business Value Proposition**: Clear calls-to-action for API access

## Monitoring & Analytics

### Built-in Analytics
- **Response Tracking**: Real-time survey and poll response monitoring
- **Sentiment Trends**: Market sentiment analysis over time
- **API Usage**: Detailed business API usage analytics
- **Content Performance**: Article engagement and traffic metrics

### Business Intelligence
- **Automated Insights**: AI-generated business recommendations
- **Demographic Analysis**: Consumer segment identification
- **Market Trends**: Real-time market sentiment tracking
- **Competitive Intelligence**: Industry trend analysis

## Next Steps & Enhancements

### Potential Improvements
1. **Advanced AI Models**: Integration with Claude, Gemini, or custom models
2. **Real-time Notifications**: WebSocket integration for live updates
3. **Advanced Visualizations**: D3.js charts and interactive dashboards
4. **Mobile App**: React Native mobile application
5. **Enterprise Features**: White-label solutions and custom branding
6. **Machine Learning**: Predictive analytics and trend forecasting

### Scaling Considerations
- **Caching**: Redis integration for improved performance
- **Load Balancing**: Multiple server instances for high traffic
- **CDN Integration**: Global content delivery for faster access
- **Database Optimization**: Query optimization and indexing strategies

## Support & Documentation

For technical support or questions about the Consumer Pulse implementation, please refer to the main project documentation or contact the development team.

---

**Consumer Pulse** - Empowering businesses with real-time consumer insights and market intelligence.
