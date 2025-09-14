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
  MoreVert as MoreVertIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import Header from '../components/pagecomponents/header';
import Sidebar from '../components/pagecomponents/sidebar';
import maduIcon from '../assets/images/madu-icon-C6gC6UIY.png';
import apiService from '../services/api';
import './AIPlanner.css';

const AIPlanner = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm Madu, your AI travel assistant for Sabah! How can I help you plan your adventure today?",
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userId] = useState('user_' + Math.random().toString(36).substr(2, 9));
  const [chatHistory, setChatHistory] = useState([
    { id: 1, title: 'MaduAI', lastMessage: 'Your AI travel assistant for Sabah', timestamp: 'Active now', active: true }
  ]);
  const messagesEndRef = useRef(null);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

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
      
      setMessages(prev => [...prev, userMessage]);
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
            id: messages.length + 2,
            text: response.response,
            sender: 'ai',
            timestamp: new Date().toLocaleTimeString()
          };
          setMessages(prev => [...prev, aiResponse]);
        } else {
          throw new Error(response.error || 'Failed to get AI response');
        }
      } catch (error) {
        console.error('Error sending message:', error);
        const errorResponse = {
          id: messages.length + 2,
          text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, errorResponse]);
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
    setChatHistory(prev => 
      prev.map(chat => ({ ...chat, active: chat.id === chatId }))
    );
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
            <Fab size="small" color="primary" className="new-chat-btn">
              <AddIcon />
            </Fab>
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
            {chatHistory.map((chat) => (
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
            ))}
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
                  Madu - AI Travel Assistant
                </Typography>
                <Box className="status-container">
                  <Chip label="Online" size="small" className="online-status" />
                  <Typography variant="caption" className="status-text">
                    Specialized in Sabah tourism
                  </Typography>
                </Box>
              </Box>
              <IconButton className="chat-options">
                <MoreVertIcon />
              </IconButton>
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