/**
 * WebSocket Hook for Consumer Pulse
 * 
 * Provides real-time news updates via WebSocket connection
 * Features:
 * - Auto-reconnection
 * - Event handling for news updates
 * - Connection status management
 * - Error handling
 */

'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';

const useWebSocket = (url = null) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  // Determine WebSocket URL
  const getSocketUrl = useCallback(() => {
    if (url) return url;
    
    if (typeof window !== 'undefined') {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.hostname;
      
      // Development
      if (host === 'localhost' || host === '127.0.0.1') {
        return 'http://localhost:5000';
      }
      
      // Production
      return 'https://baltar-inc-1.onrender.com';
    }
    
    return 'https://baltar-inc-1.onrender.com';
  }, [url]);

  // Initialize WebSocket connection
  const initializeSocket = useCallback(() => {
    try {
      const socketUrl = getSocketUrl();
      console.log('🔌 Connecting to WebSocket:', socketUrl);

      const newSocket = io(socketUrl, {
        transports: ['websocket', 'polling'],
        timeout: 20000,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: maxReconnectAttempts
      });

      // Connection events
      newSocket.on('connect', () => {
        console.log('✅ WebSocket connected');
        setIsConnected(true);
        setConnectionError(null);
        reconnectAttempts.current = 0;
        
        // Join general news room
        newSocket.emit('join-room', 'news-updates');
      });

      newSocket.on('disconnect', (reason) => {
        console.log('❌ WebSocket disconnected:', reason);
        setIsConnected(false);
        
        // Auto-reconnect if not manually disconnected
        if (reason !== 'io client disconnect') {
          handleReconnect();
        }
      });

      newSocket.on('connect_error', (error) => {
        console.error('❌ WebSocket connection error:', error);
        setConnectionError(error.message);
        setIsConnected(false);
        handleReconnect();
      });

      // News events
      newSocket.on('news:new-article', (article) => {
        console.log('📰 New article received:', article.title);
        setLastUpdate({ type: 'new-article', data: article, timestamp: new Date() });
      });

      newSocket.on('news:bulk-update', (update) => {
        console.log('📰 Bulk update received:', update.count, 'articles');
        setLastUpdate({ type: 'bulk-update', data: update, timestamp: new Date() });
      });

      newSocket.on('live-update', (update) => {
        console.log('📡 Live update received:', update.category, update.articles.length, 'articles');
        setLastUpdate({ type: 'live-update', data: update, timestamp: new Date() });
      });

      newSocket.on('breaking-news', (article) => {
        console.log('🚨 Breaking news received:', article.title);
        setLastUpdate({ type: 'breaking-news', data: article, timestamp: new Date() });
      });

      newSocket.on('news:api-status', (status) => {
        console.log('📊 API status update received');
        setLastUpdate({ type: 'api-status', data: status, timestamp: new Date() });
      });

      newSocket.on('notification', (notification) => {
        console.log('📢 Notification received:', notification.message);
        setLastUpdate({ type: 'notification', data: notification, timestamp: new Date() });
      });

      newSocket.on('heartbeat', (data) => {
        // Silent heartbeat - just update connection status
        setIsConnected(true);
      });

      setSocket(newSocket);
      return newSocket;

    } catch (error) {
      console.error('❌ Error initializing WebSocket:', error);
      setConnectionError(error.message);
      handleReconnect();
    }
  }, [getSocketUrl]);

  // Handle reconnection
  const handleReconnect = useCallback(() => {
    if (reconnectAttempts.current >= maxReconnectAttempts) {
      console.log('❌ Max reconnection attempts reached');
      setConnectionError('Failed to reconnect after multiple attempts');
      return;
    }

    reconnectAttempts.current++;
    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
    
    console.log(`🔄 Attempting to reconnect in ${delay}ms (attempt ${reconnectAttempts.current}/${maxReconnectAttempts})`);
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    reconnectTimeoutRef.current = setTimeout(() => {
      initializeSocket();
    }, delay);
  }, [initializeSocket]);

  // Manual reconnect function
  const reconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
    }
    reconnectAttempts.current = 0;
    setConnectionError(null);
    initializeSocket();
  }, [socket, initializeSocket]);

  // Emit event to server
  const emit = useCallback((event, data) => {
    if (socket && isConnected) {
      socket.emit(event, data);
      return true;
    }
    console.warn('⚠️ Cannot emit - WebSocket not connected');
    return false;
  }, [socket, isConnected]);

  // Join a specific room
  const joinRoom = useCallback((room) => {
    return emit('join-room', room);
  }, [emit]);

  // Leave a specific room
  const leaveRoom = useCallback((room) => {
    return emit('leave-room', room);
  }, [emit]);

  // Request current status
  const requestStatus = useCallback(() => {
    return emit('request-status');
  }, [emit]);

  // Initialize on mount
  useEffect(() => {
    initializeSocket();

    // Cleanup on unmount
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socket) {
        socket.disconnect();
      }
    };
  }, [initializeSocket]);

  return {
    socket,
    isConnected,
    connectionError,
    lastUpdate,
    reconnect,
    emit,
    joinRoom,
    leaveRoom,
    requestStatus,
    reconnectAttempts: reconnectAttempts.current,
    maxReconnectAttempts
  };
};

export default useWebSocket;
