/**
 * WebSocket Service for Consumer Pulse
 * 
 * Handles real-time communication for news updates
 * Features:
 * - Real-time news article broadcasting
 * - API status updates
 * - Client connection management
 * - Event-based architecture
 */

const { Server } = require('socket.io');
const { config } = require('../config/newsApiConfig');

class WebSocketService {
  constructor() {
    this.io = null;
    this.connectedClients = new Set();
    this.events = config.websocket.events;
  }

  /**
   * Initialize WebSocket server
   */
  initialize(server) {
    this.io = new Server(server, {
      cors: {
        origin: [
          "http://localhost:3000",
          "https://baltar-inc.vercel.app",
          "https://baltar-inc-1.onrender.com"
        ],
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ['websocket', 'polling']
    });

    this.setupEventHandlers();
    console.log('🔌 WebSocket service initialized');
  }

  /**
   * Setup event handlers
   */
  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`👤 Client connected: ${socket.id}`);
      this.connectedClients.add(socket.id);

      // Send current status to new client
      this.sendApiStatus(socket);

      // Handle client events
      socket.on('disconnect', () => {
        console.log(`👤 Client disconnected: ${socket.id}`);
        this.connectedClients.delete(socket.id);
      });

      socket.on('request-status', () => {
        this.sendApiStatus(socket);
      });

      socket.on('join-room', (room) => {
        socket.join(room);
        console.log(`👤 Client ${socket.id} joined room: ${room}`);
      });

      socket.on('leave-room', (room) => {
        socket.leave(room);
        console.log(`👤 Client ${socket.id} left room: ${room}`);
      });
    });
  }

  /**
   * Broadcast new article to all clients
   */
  broadcastNewArticle(article) {
    if (!this.io) return;

    const articleData = {
      id: article.id,
      title: article.title,
      summary: article.summary,
      author: article.author,
      sourceUrl: article.sourceUrl,
      imageUrl: article.imageUrl,
      category: article.category,
      sentiment: article.sentiment,
      sentimentScore: article.sentimentScore,
      publishedAt: article.publishedAt,
      source: article.source,
      createdAt: article.createdAt
    };

    this.io.emit(this.events.newArticle, articleData);
    console.log(`📡 Broadcasted new article: ${article.title.substring(0, 50)}...`);
  }

  /**
   * Broadcast bulk update to all clients
   */
  broadcastBulkUpdate(articles) {
    if (!this.io || !articles.length) return;

    const articlesData = articles.map(article => ({
      id: article.id,
      title: article.title,
      summary: article.summary,
      author: article.author,
      sourceUrl: article.sourceUrl,
      imageUrl: article.imageUrl,
      category: article.category,
      sentiment: article.sentiment,
      sentimentScore: article.sentimentScore,
      publishedAt: article.publishedAt,
      source: article.source,
      createdAt: article.createdAt
    }));

    this.io.emit(this.events.bulkUpdate, {
      articles: articlesData,
      count: articles.length,
      timestamp: new Date()
    });

    console.log(`📡 Broadcasted bulk update: ${articles.length} articles`);
  }

  /**
   * Broadcast API status update
   */
  broadcastApiStatus(statusData) {
    if (!this.io) return;

    this.io.emit(this.events.apiStatus, {
      ...statusData,
      timestamp: new Date(),
      connectedClients: this.connectedClients.size
    });

    console.log(`📡 Broadcasted API status update`);
  }

  /**
   * Send API status to specific client
   */
  sendApiStatus(socket) {
    // This will be populated by the unified news service
    const statusData = {
      providers: {
        newsdata: { status: 'active', dailyCount: 0, limit: 200 },
        newsapi: { status: 'active', dailyCount: 0, limit: 1000 },
        finlight: { status: 'active', monthlyCount: 0, limit: 5000 },
        currents: { status: 'active', dailyCount: 0, limit: 600 }
      },
      totalArticles: 0,
      lastUpdate: new Date(),
      connectedClients: this.connectedClients.size
    };

    socket.emit(this.events.apiStatus, statusData);
  }

  /**
   * Broadcast to specific room
   */
  broadcastToRoom(room, event, data) {
    if (!this.io) return;
    this.io.to(room).emit(event, data);
  }

  /**
   * Send notification to all clients
   */
  sendNotification(message, type = 'info') {
    if (!this.io) return;

    this.io.emit('notification', {
      message,
      type, // 'info', 'success', 'warning', 'error'
      timestamp: new Date()
    });

    console.log(`📢 Sent notification: ${message}`);
  }

  /**
   * Get connection statistics
   */
  getStats() {
    return {
      connectedClients: this.connectedClients.size,
      isInitialized: !!this.io,
      events: this.events
    };
  }

  /**
   * Broadcast live news update with category
   */
  broadcastLiveUpdate(category, articles) {
    if (!this.io || !articles.length) return;

    const updateData = {
      category,
      articles: articles.map(article => ({
        id: article.id,
        title: article.title,
        summary: article.summary,
        imageUrl: article.imageUrl,
        category: article.category,
        sentiment: article.sentiment,
        publishedAt: article.publishedAt,
        source: article.source
      })),
      timestamp: new Date()
    };

    // Broadcast to all clients
    this.io.emit('live-update', updateData);
    
    // Also broadcast to category-specific room
    this.io.to(`category-${category}`).emit('category-update', updateData);

    console.log(`📡 Broadcasted live update for ${category}: ${articles.length} articles`);
  }

  /**
   * Broadcast breaking news alert
   */
  broadcastBreakingNews(article) {
    if (!this.io) return;

    const breakingNewsData = {
      id: article.id,
      title: article.title,
      summary: article.summary,
      imageUrl: article.imageUrl,
      sourceUrl: article.sourceUrl,
      category: article.category,
      sentiment: article.sentiment,
      publishedAt: article.publishedAt,
      source: article.source,
      isBreaking: true,
      timestamp: new Date()
    };

    this.io.emit('breaking-news', breakingNewsData);
    console.log(`🚨 Broadcasted breaking news: ${article.title.substring(0, 50)}...`);
  }

  /**
   * Send heartbeat to maintain connections
   */
  sendHeartbeat() {
    if (!this.io) return;

    this.io.emit('heartbeat', {
      timestamp: new Date(),
      connectedClients: this.connectedClients.size
    });
  }

  /**
   * Start heartbeat interval
   */
  startHeartbeat() {
    setInterval(() => {
      this.sendHeartbeat();
    }, 30000); // Every 30 seconds

    console.log('💓 WebSocket heartbeat started');
  }

  /**
   * Cleanup and close connections
   */
  close() {
    if (this.io) {
      this.io.close();
      this.connectedClients.clear();
      console.log('🔌 WebSocket service closed');
    }
  }
}

// Create singleton instance
const websocketService = new WebSocketService();

module.exports = websocketService;
