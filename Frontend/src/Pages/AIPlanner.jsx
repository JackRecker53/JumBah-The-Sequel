import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Chip,
  InputAdornment,
  Fab,
  CircularProgress
} from '@mui/material';
import {
  Send as SendIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import Header from '../components/pagecomponents/header';
import Sidebar from '../components/pagecomponents/sidebar';
import maduIcon from '../assets/images/madu-icon-C6gC6UIY.png';
import apiService from '../services/api';
import './AIPlanner.css';

const sabahanPrompts = [
  "MaduAI, bah. Pintar ni.",
  "Jawapan ngam-ngam, manis macam madu.",
  "Otak AI, hati Sabahan.",
  "Bijak punya AI, untuk kau saja.",
  "Oi! Saya MaduAI. Apa cerita? Kasi tau saya apa kau mau cari.",
  "Selamat datang! Saya MaduAI. Tanya saja apa-apa, boleh bah kalau kau!",
  "Macam madu dari Gunung Kinabalu, saya sini untuk kasi jawapan yang paling 'fresh'. Kau tanya, saya jawab.",
  "Jangan pusing-pusing kepala sudah. Kasi MaduAI tolong kau cari. Senang cerita.",
  "Kau ada soalan? Saya ada jawapan manis. Terus kita settle, nda payah lama-lama.",
  "Info yang kau mau, saya kasi yang paling mantap. Macam tu lah, kan?",
  "Adui, susah betul soalan kau... Tapi relax, saya MaduAI. Confirm boleh jawab punya!",
  "Saya ni AI, tapi kalau sembang macam orang sebelah rumah kau saja, kan? Nah, tanya sudah.",
  "Kau jangan risau, saya bukan kaleng-kaleng punya AI. Ini original Sabahan tech, bah!",
];

const getRandomPrompt = () => sabahanPrompts[Math.floor(Math.random() * sabahanPrompts.length)];

const AIPlanner = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: getRandomPrompt(),
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userId] = useState('user_' + Math.random().toString(36).substr(2, 9));
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isBackendOnline, setIsBackendOnline] = useState(true);
  const [lastHealthCheck, setLastHealthCheck] = useState(new Date());
  const messagesEndRef = useRef(null);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Function to load chat history from backend
  const loadChatHistory = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/ai/history/${userId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.history.length > 0) {
          // Convert backend history to frontend format
          const formattedHistory = [];
          let currentChat = null;
          
          data.history.forEach((entry, index) => {
            if (!currentChat || index % 10 === 0) { // Group every 10 messages into a chat
              currentChat = {
                id: Math.floor(index / 10) + 1,
                title: entry.user_message.length > 30 ? 
                  entry.user_message.substring(0, 30) + '...' : 
                  entry.user_message,
                lastMessage: entry.ai_response.length > 50 ? 
                  entry.ai_response.substring(0, 50) + '...' : 
                  entry.ai_response,
                timestamp: new Date(entry.timestamp).toLocaleDateString(),
                active: false,
                messages: []
              };
              formattedHistory.push(currentChat);
            }
            
            // Add user message
            currentChat.messages.push({
              id: currentChat.messages.length + 1,
              text: entry.user_message,
              sender: 'user',
              timestamp: new Date(entry.timestamp).toLocaleTimeString()
            });
            
            // Add AI response
            currentChat.messages.push({
              id: currentChat.messages.length + 1,
              text: entry.ai_response,
              sender: 'ai',
              timestamp: new Date(entry.timestamp).toLocaleTimeString()
            });
          });
          
          if (formattedHistory.length > 0) {
            setChatHistory(formattedHistory);
            // Set the most recent chat as active
            const mostRecentChat = formattedHistory[formattedHistory.length - 1];
            mostRecentChat.active = true;
            setCurrentChatId(mostRecentChat.id);
            setMessages(mostRecentChat.messages);
          }
        } else {
          // No history, create default chat
          createNewChat();
        }
      } else {
        console.error('Failed to load chat history');
        createNewChat();
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      createNewChat();
    }
  };

  // Function to create a new chat
  const createNewChat = () => {
    const newChatId = chatHistory.length + 1;
    const newChat = {
      id: newChatId,
      title: 'New Chat',
      lastMessage: 'Start a conversation...',
      timestamp: 'Now',
      active: true,
      messages: [
        {
          id: 1,
          text: getRandomPrompt(),
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString()
        }
      ]
    };

    // Deactivate all other chats
    const updatedHistory = chatHistory.map(chat => ({ ...chat, active: false }));
    updatedHistory.push(newChat);
    
    setChatHistory(updatedHistory);
    setCurrentChatId(newChatId);
    setMessages(newChat.messages);
  };

  // Function to update current chat in history
  const updateCurrentChatInHistory = (newMessages) => {
    setChatHistory(prev => 
      prev.map(chat => {
        if (chat.id === currentChatId) {
          const lastMessage = newMessages[newMessages.length - 1];
          return {
            ...chat,
            title: newMessages.length > 2 ? 
              (newMessages[1].text.length > 30 ? 
                newMessages[1].text.substring(0, 30) + '...' : 
                newMessages[1].text) : 
              'New Chat',
            lastMessage: lastMessage.text.length > 50 ? 
              lastMessage.text.substring(0, 50) + '...' : 
              lastMessage.text,
            timestamp: lastMessage.timestamp,
            messages: newMessages
          };
        }
        return chat;
      })
    );
  };

  // Function to delete chat history
  const deleteChat = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/ai/history/${userId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Clear all chat history from frontend
        setChatHistory([]);
        setMessages([]);
        setCurrentChatId(null);
        
        // Create a new chat to start fresh
        createNewChat();
        
        console.log('Chat history deleted successfully');
      } else {
        console.error('Failed to delete chat history');
      }
    } catch (error) {
      console.error('Error deleting chat history:', error);
    }
  };

  // Function to check backend health
  const checkBackendHealth = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/health', {
        method: 'GET',
        timeout: 5000, // 5 second timeout
      });
      
      if (response.ok) {
        setIsBackendOnline(true);
      } else {
        setIsBackendOnline(false);
      }
      setLastHealthCheck(new Date());
    } catch (error) {
      console.log('Backend health check failed:', error);
      setIsBackendOnline(false);
      setLastHealthCheck(new Date());
    }
  };

  // Periodic health check
  useEffect(() => {
    // Initial health check
    checkBackendHealth();
    
    // Load chat history on component mount
    loadChatHistory();
    
    // Set up interval for periodic checks (every 30 seconds)
    const healthCheckInterval = setInterval(checkBackendHealth, 30000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(healthCheckInterval);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() && !isLoading) {
      const userMessage = {
        id: messages.length + 1,
        text: inputMessage,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString()
      };
      
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      updateCurrentChatInHistory(newMessages);
      
      const currentMessage = inputMessage;
      setInputMessage('');
      setIsLoading(true);
      
      try {
        const response = await apiService.chatWithAI({
          message: currentMessage,
          user_id: userId,
          context: "You are MaduAI, a friendly AI travel assistant specializing in Sabah, Malaysia. Help users plan their trips, provide local insights, and suggest activities, accommodations, and attractions in Sabah."
        });
        
        if (response.success) {
          const aiResponse = {
            id: newMessages.length + 1,
            text: response.response,
            sender: 'ai',
            timestamp: new Date().toLocaleTimeString()
          };
          const finalMessages = [...newMessages, aiResponse];
          setMessages(finalMessages);
          updateCurrentChatInHistory(finalMessages);
        } else {
          throw new Error(response.error || 'Failed to get AI response');
        }
      } catch (error) {
        console.error('Error sending message:', error);
        const errorResponse = {
          id: newMessages.length + 1,
          text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString()
        };
        const finalMessages = [...newMessages, errorResponse];
        setMessages(finalMessages);
        updateCurrentChatInHistory(finalMessages);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleChatSelect = (chatId) => {
    const selectedChat = chatHistory.find(chat => chat.id === chatId);
    if (selectedChat) {
      setChatHistory(prev => 
        prev.map(chat => ({ ...chat, active: chat.id === chatId }))
      );
      setCurrentChatId(chatId);
      setMessages(selectedChat.messages);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header onSidebarToggle={handleSidebarToggle} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <Box className="ai-planner-container">
        {/* Chat History Sidebar */}
        <Paper className="chat-history-sidebar" elevation={2}>
          <Box className="chat-history-header">
            <Typography variant="h6" className="chat-history-title">
              Chat History
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Fab size="small" color="primary" className="new-chat-btn" onClick={createNewChat}>
                <AddIcon />
              </Fab>
              {chatHistory.length > 0 && (
                <Fab 
                  size="small" 
                  color="error" 
                  className="delete-chat-btn" 
                  onClick={deleteChat}
                  title="Delete all chat history"
                >
                  <DeleteIcon />
                </Fab>
              )}
            </Box>
          </Box>
          
          <Box className="search-container">
            <TextField
              fullWidth
              size="small"
              placeholder="Search conversations..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                )
              }}
              className="search-field"
            />
          </Box>
          
          <List className="chat-history-list">
            {chatHistory.length === 0 ? (
              <ListItem>
                <ListItemText
                  primary="No chat history"
                  secondary="Start a new conversation by clicking the + button"
                  sx={{ textAlign: 'center', color: 'text.secondary' }}
                />
              </ListItem>
            ) : (
              chatHistory.map((chat) => (
                <ListItem
                  key={chat.id}
                  className={`chat-history-item ${chat.active ? 'active' : ''}`}
                  onClick={() => handleChatSelect(chat.id)}
                >
                  <ListItemAvatar>
                    <Avatar className="chat-avatar">
                      <img src={maduIcon} alt="Madu" style={{ width: '100%', height: '100%' }} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={chat.title}
                    secondary={
                      <Box component="span">
                        <Typography variant="body2" component="span" className="last-message" sx={{ display: 'block' }}>
                          {chat.lastMessage}
                        </Typography>
                        <Typography variant="caption" component="span" className="timestamp" sx={{ display: 'block' }}>
                          {chat.timestamp}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))
            )}
          </List>
        </Paper>

        {/* Main Chat Area */}
        <Box className="main-chat-area">
          {/* Chat Header */}
          <Paper className="chat-header" elevation={1}>
            <Box className="chat-header-content">
              <Avatar className="madu-avatar">
                <img src={maduIcon} alt="Madu" style={{ width: '100%', height: '100%' }} />
              </Avatar>
              <Box className="chat-info">
                <Typography variant="h6" className="chat-title">
                  MaduAI: Your personal Guide, tapi yang boleh sembang macam kawan-kawan
                </Typography>
                <Box className="status-container">
                  <Chip 
                    label={isBackendOnline ? "Online" : "Offline"} 
                    size="small" 
                    className={isBackendOnline ? "online-status" : "offline-status"} 
                  />
                  <Typography variant="caption" className="status-text">
                    {isBackendOnline ? "Ready to help with your adventures!" : "Backend unavailable"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* Messages Area */}
          <Box className="messages-container">
            {messages.map((message) => (
              <Box
                key={message.id}
                className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
              >
                {message.sender === 'ai' && (
                  <Avatar className="message-avatar">
                    <img src={maduIcon} alt="Madu" style={{ width: '100%', height: '100%' }} />
                  </Avatar>
                )}
                <Box className="message-content">
                  <Paper className="message-bubble" elevation={1}>
                    <Typography variant="body1">{message.text}</Typography>
                  </Paper>
                  <Typography variant="caption" className="message-timestamp">
                    {message.timestamp}
                  </Typography>
                </Box>
              </Box>
            ))}
            {isLoading && (
              <Box className="message ai-message">
                <Avatar className="message-avatar">
                  <img src={maduIcon} alt="Madu" style={{ width: '100%', height: '100%' }} />
                </Avatar>
                <Box className="message-content">
                  <Paper className="message-bubble" elevation={1}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={16} />
                      <Typography variant="body1" sx={{ fontStyle: 'italic' }}>Madu is thinking...</Typography>
                    </Box>
                  </Paper>
                </Box>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Paper className="input-area" elevation={2}>
            <Box className="input-container">
              <Avatar className="input-avatar">
                <img src={maduIcon} alt="Madu" style={{ width: '100%', height: '100%' }} />
              </Avatar>
              <TextField
                fullWidth
                multiline
                maxRows={4}
                placeholder="Ask Madu about your Sabah adventure..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="message-input"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim() || isLoading}
                        className="send-button"
                      >
                        {isLoading ? <CircularProgress size={20} /> : <SendIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default AIPlanner;