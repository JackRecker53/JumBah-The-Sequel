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
import './Styling/AIPlanner.css';

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

// Function to format AI messages with proper styling
const formatMessage = (text) => {
  if (!text) return '';
  
  // First, clean up unknown entities and add proper spacing around emojis
  let formatted = text
    // Remove unknown HTML entities
    .replace(/&[a-zA-Z0-9#]+;/g, '')
    // Add spaces around emojis for better readability
    .replace(/([^\s])([📍💰⭐🕒🍽️🏆🎯💡🗺️📱📅🏛️💬🌤️🍜🥘🏔️🌊🏖️🌴🐒🦋🌺🎉✨])/g, '$1 $2')
    .replace(/([📍💰⭐🕒🍽️🏆🎯💡🗺️📱📅🏛️💬🌤️🍜🥘🏔️🌊🏖️🌴🐒🦋🌺🎉✨])([^\s])/g, '$1 $2')
    
    // Convert markdown-like formatting to HTML
    .replace(/^## (.*$)/gim, '<h2 class="ai-header-2">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="ai-header-3">$1</h3>')
    .replace(/^#### (.*$)/gim, '<h4 class="ai-header-4">$1</h4>')
    
    // Bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="ai-bold">$1</strong>')
    
    // Bullet points
    .replace(/^• (.*$)/gim, '<div class="ai-bullet-point">• $1</div>')
    .replace(/^- (.*$)/gim, '<div class="ai-bullet-point">• $1</div>')
    
    // Numbered lists
    .replace(/^(\d+)\. (.*$)/gim, '<div class="ai-numbered-point">$1. $2</div>')
    
    // Horizontal rules
    .replace(/^---$/gim, '<hr class="ai-hr">')
    
    // Line breaks
    .replace(/\n/g, '<br>')
    
    // Emojis with proper spacing
    .replace(/📍/g, '<span class="ai-emoji emoji-location">📍</span>')
    .replace(/💰/g, '<span class="ai-emoji emoji-money">💰</span>')
    .replace(/⭐/g, '<span class="ai-emoji emoji-star">⭐</span>')
    .replace(/🕒/g, '<span class="ai-emoji emoji-time">🕒</span>')
    .replace(/🍽️/g, '<span class="ai-emoji emoji-food">🍽️</span>')
    .replace(/🏆/g, '<span class="ai-emoji emoji-trophy">🏆</span>')
    .replace(/🎯/g, '<span class="ai-emoji emoji-target">🎯</span>')
    .replace(/💡/g, '<span class="ai-emoji emoji-idea">💡</span>')
    .replace(/🗺️/g, '<span class="ai-emoji emoji-map">🗺️</span>')
    .replace(/📱/g, '<span class="ai-emoji emoji-phone">📱</span>')
    .replace(/📅/g, '<span class="ai-emoji emoji-calendar">📅</span>')
    .replace(/🏛️/g, '<span class="ai-emoji emoji-building">🏛️</span>')
    .replace(/💬/g, '<span class="ai-emoji emoji-chat">💬</span>')
    .replace(/🌤️/g, '<span class="ai-emoji emoji-weather">🌤️</span>')
    .replace(/🍜/g, '<span class="ai-emoji emoji-noodle">🍜</span>')
    .replace(/🥘/g, '<span class="ai-emoji emoji-pot">🥘</span>')
    .replace(/🏔️/g, '<span class="ai-emoji emoji-mountain">🏔️</span>')
    .replace(/🌊/g, '<span class="ai-emoji emoji-wave">🌊</span>')
    .replace(/🏖️/g, '<span class="ai-emoji emoji-beach">🏖️</span>')
    .replace(/🌴/g, '<span class="ai-emoji emoji-palm">🌴</span>')
    .replace(/🐒/g, '<span class="ai-emoji emoji-monkey">🐒</span>')
    .replace(/🦋/g, '<span class="ai-emoji emoji-butterfly">🦋</span>')
    .replace(/🌺/g, '<span class="ai-emoji emoji-flower">🌺</span>')
    .replace(/🎉/g, '<span class="ai-emoji emoji-celebration">🎉</span>')
    .replace(/✨/g, '<span class="ai-emoji emoji-sparkle">✨</span>');
  
  return formatted;
};

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
      const response = await fetch(`http://localhost:8000/api/ai-planner/history/${userId}`);
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
          console.log('No history found, creating default chat');
          createNewChat();
        }
      } else {
        console.error('Failed to load chat history');
        console.log('Creating new chat due to failed history load');
        createNewChat();
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      console.log('Creating new chat due to error');
      createNewChat();
    }
  };

  // Function to create a new chat
  const createNewChat = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log('Creating new chat...');
    
    // Create new chat immediately without waiting for API calls
    const newChatId = Date.now(); // Use timestamp for unique ID
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
    
    // Scroll to bottom of chat history to show new chat
    setTimeout(() => {
      scrollToBottomOfHistory();
    }, 100);
    
    console.log('New chat created:', newChatId);
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

  // Function to delete all chat history
  const deleteAllChats = async () => {
    // Add confirmation dialog
    if (!window.confirm('Are you sure you want to delete all chat history? This action cannot be undone.')) {
      return;
    }

    try {
      console.log('Attempting to delete all chat history for user:', userId);
      const response = await fetch(`http://localhost:8000/api/ai-planner/history/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Delete response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Delete response:', result);
        
        // Clear all chat history from frontend
        setChatHistory([]);
        setMessages([]);
        setCurrentChatId(null);
        
        // Create a new chat to start fresh
        createNewChat();
        
        console.log('All chat history deleted successfully');
        alert('All chat history deleted successfully!');
      } else {
        const errorData = await response.json();
        console.error('Failed to delete chat history:', errorData);
        alert('Failed to delete chat history. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting chat history:', error);
      alert('Error deleting chat history. Please check your connection and try again.');
    }
  };

  // Function to delete individual chat
  const deleteIndividualChat = (chatId) => {
    if (!window.confirm('Are you sure you want to delete this chat? This action cannot be undone.')) {
      return;
    }

    const updatedHistory = chatHistory.filter(chat => chat.id !== chatId);
    setChatHistory(updatedHistory);

    // If we're deleting the current chat, switch to another chat or create new one
    if (currentChatId === chatId) {
      if (updatedHistory.length > 0) {
        const newCurrentChat = updatedHistory[updatedHistory.length - 1];
        setCurrentChatId(newCurrentChat.id);
        setMessages(newCurrentChat.messages);
      } else {
        setCurrentChatId(null);
        setMessages([]);
        createNewChat();
      }
    }

    console.log(`Chat ${chatId} deleted successfully`);
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
    // Create initial chat immediately
    createNewChat();
    
    // Load chat history asynchronously (non-blocking)
    setTimeout(() => {
      loadChatHistory();
    }, 100);
    
    // Initial health check
    checkBackendHealth();
    
    // Set up interval for periodic checks (every 30 seconds)
    const healthCheckInterval = setInterval(checkBackendHealth, 30000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(healthCheckInterval);
  }, []);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  const scrollToBottomOfHistory = () => {
    const historyList = document.querySelector('.chat-history-list');
    if (historyList) {
      historyList.scrollTop = historyList.scrollHeight;
    }
  };

  useEffect(() => {
    // Use setTimeout to ensure DOM is updated before scrolling
    setTimeout(() => {
      scrollToBottom();
    }, 100);
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
      
      <Box className="ai-planner-container" sx={{ flex: 1 }}>
        {/* Chat History Sidebar */}
        <Paper className="chat-history-sidebar" elevation={2}>
          <Box className="chat-history-header">
            <Typography variant="h6" className="chat-history-title">
              Chat History
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Fab 
                size="small" 
                color="primary" 
                className="new-chat-btn" 
                onClick={createNewChat}
                type="button"
              >
                <AddIcon />
              </Fab>
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
                  sx={{ position: 'relative' }}
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
                  <Box 
                    className="chat-item-actions"
                    onClick={(e) => e.stopPropagation()}
                    sx={{ 
                      position: 'absolute', 
                      right: '8px', 
                      top: '50%', 
                      transform: 'translateY(-50%)',
                      opacity: 0,
                      transition: 'opacity 0.2s ease'
                    }}
                  >
                    <IconButton
                      size="small"
                      className="delete-individual-chat-btn"
                      onClick={() => deleteIndividualChat(chat.id)}
                      title="Delete this chat"
                      sx={{
                        color: '#f44336',
                        '&:hover': {
                          backgroundColor: 'rgba(244, 67, 54, 0.1)',
                        }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </ListItem>
              ))
            )}
            <div style={{ marginTop: 'auto', height: '1px' }} />
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
                  MaduAI: Your personal Guide, tapi yang boleh bekurapak macam kawan-kawan
                </Typography>
                <Box className="status-container">
                  <Chip 
                    label={isBackendOnline ? "Online" : "Offline"} 
                    size="small" 
                    className={isBackendOnline ? "online-status" : "offline-status"} 
                  />
                  <Typography variant="caption" className="status-text">
                    {isBackendOnline ? "Ah, hidup si MaduAI!" : "Alaa, MaduAI Tertidur"}
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
                    <div className="formatted-message">
                      {message.sender === 'ai' ? 
                        <div dangerouslySetInnerHTML={{ __html: formatMessage(message.text) }} /> :
                        <Typography variant="body1">{message.text}</Typography>
                      }
                    </div>
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
            <div ref={messagesEndRef} className="scroll-anchor" />
          </Box>

          {/* Quick Prompts */}
          <Box className="quick-prompts-container" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary', fontWeight: 600 }}>
              Quick Prompts:
            </Typography>
            <Box className="quick-prompts" sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {[
                "Can you give me the direction to Imago Shopping Mall?",
                "Give me an itinerary for 3 days trip with a budget of RM5000",
                "Where can I find mee sup yang halal?",
                "Which restaurant can I enjoy the best seafood in Kota Kinabalu?",
                "Where can I watch the sunset in KK?"
              ].map((prompt, index) => (
                <Chip
                  key={index}
                  label={prompt}
                  onClick={() => setInputMessage(prompt)}
                  className="quick-prompt-chip"
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                      transform: 'translateY(-1px)',
                      boxShadow: 2
                    }
                  }}
                />
              ))}
            </Box>
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