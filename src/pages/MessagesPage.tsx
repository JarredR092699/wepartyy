import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  TextField,
  IconButton,
  Divider,
  Badge,
  InputAdornment,
  CircularProgress,
  Tabs,
  Tab,
  Alert
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { users, User } from '../data/mockData';

// Define message interface
interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: Date;
  read: boolean;
  attachments?: string[];
}

// Define conversation interface
interface Conversation {
  id: string;
  participants: string[];
  lastMessage: Message;
  unreadCount: number;
}

// Mock data for conversations and messages
const mockConversations: Conversation[] = [
  {
    id: 'conv1',
    participants: ['u1', 'u3'], // client and DJ
    lastMessage: {
      id: 'msg3',
      senderId: 'u3',
      recipientId: 'u1',
      content: 'Yes, I\'m available on that date. Would you like to discuss the music selection?',
      timestamp: new Date(2025, 2, 15, 14, 30), // March 15, 2025
      read: false
    },
    unreadCount: 1
  },
  {
    id: 'conv2',
    participants: ['u1', 'u4'], // client and caterer
    lastMessage: {
      id: 'msg7',
      senderId: 'u1',
      recipientId: 'u4',
      content: 'Do you offer vegetarian options for the menu?',
      timestamp: new Date(2025, 2, 12, 10, 15), // March 12, 2025
      read: true
    },
    unreadCount: 0
  },
  {
    id: 'conv3',
    participants: ['u1', 'u2'], // client and venue
    lastMessage: {
      id: 'msg10',
      senderId: 'u2',
      recipientId: 'u1',
      content: 'We can accommodate up to 150 guests for your event.',
      timestamp: new Date(2025, 2, 10, 16, 45), // March 10, 2025
      read: true
    },
    unreadCount: 0
  }
];

// Mock messages for each conversation
const mockMessages: { [key: string]: Message[] } = {
  'conv1': [
    {
      id: 'msg1',
      senderId: 'u1',
      recipientId: 'u3',
      content: 'Hi, I\'m interested in booking you for my event on March 21st, 2025.',
      timestamp: new Date(2025, 2, 15, 10, 0), // March 15, 2025
      read: true
    },
    {
      id: 'msg2',
      senderId: 'u3',
      recipientId: 'u1',
      content: 'Hello! Thanks for reaching out. What kind of event is it?',
      timestamp: new Date(2025, 2, 15, 10, 15), // March 15, 2025
      read: true
    },
    {
      id: 'msg3',
      senderId: 'u3',
      recipientId: 'u1',
      content: 'Yes, I\'m available on that date. Would you like to discuss the music selection?',
      timestamp: new Date(2025, 2, 15, 14, 30), // March 15, 2025
      read: false
    }
  ],
  'conv2': [
    {
      id: 'msg4',
      senderId: 'u1',
      recipientId: 'u4',
      content: 'Hello, I\'m planning an event for March 22nd, 2025 and I\'m interested in your catering services.',
      timestamp: new Date(2025, 2, 12, 9, 0), // March 12, 2025
      read: true
    },
    {
      id: 'msg5',
      senderId: 'u4',
      recipientId: 'u1',
      content: 'Hi there! We\'d be happy to cater your event. What kind of cuisine are you interested in?',
      timestamp: new Date(2025, 2, 12, 9, 30), // March 12, 2025
      read: true
    },
    {
      id: 'msg6',
      senderId: 'u1',
      recipientId: 'u4',
      content: 'We\'re thinking of a Mediterranean theme. What options do you have?',
      timestamp: new Date(2025, 2, 12, 10, 0), // March 12, 2025
      read: true
    },
    {
      id: 'msg7',
      senderId: 'u1',
      recipientId: 'u4',
      content: 'Do you offer vegetarian options for the menu?',
      timestamp: new Date(2025, 2, 12, 10, 15), // March 12, 2025
      read: true
    }
  ],
  'conv3': [
    {
      id: 'msg8',
      senderId: 'u1',
      recipientId: 'u2',
      content: 'I\'m interested in booking your venue for a corporate event on March 28th, 2025. What\'s your capacity?',
      timestamp: new Date(2025, 2, 10, 15, 0), // March 10, 2025
      read: true
    },
    {
      id: 'msg9',
      senderId: 'u2',
      recipientId: 'u1',
      content: 'Thank you for your interest! Our venue has several spaces available. How many guests are you expecting?',
      timestamp: new Date(2025, 2, 10, 16, 0), // March 10, 2025
      read: true
    },
    {
      id: 'msg10',
      senderId: 'u2',
      recipientId: 'u1',
      content: 'We can accommodate up to 150 guests for your event.',
      timestamp: new Date(2025, 2, 10, 16, 45), // March 10, 2025
      read: true
    }
  ]
};

const MessagesPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [showConversationList, setShowConversationList] = useState(true);
  
  // Check if mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Load messages when active conversation changes
  useEffect(() => {
    if (activeConversation) {
      const conversationMessages = mockMessages[activeConversation] || [];
      setMessages(conversationMessages);
      
      // Mark messages as read
      const updatedConversations = conversations.map(conv => {
        if (conv.id === activeConversation) {
          return { ...conv, unreadCount: 0 };
        }
        return conv;
      });
      
      setConversations(updatedConversations);
      
      // On mobile, hide conversation list when a conversation is selected
      if (isMobileView) {
        setShowConversationList(false);
      }
    }
  }, [activeConversation, isMobileView]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Handle conversation click
  const handleConversationClick = (conversationId: string) => {
    setActiveConversation(conversationId);
  };
  
  // Handle back to list (mobile view)
  const handleBackToList = () => {
    setShowConversationList(true);
  };
  
  // Handle send message
  const handleSendMessage = () => {
    if (newMessage.trim() && activeConversation && currentUser) {
      const conversation = conversations.find(conv => conv.id === activeConversation);
      if (!conversation) return;
      
      const recipientId = conversation.participants.find(id => id !== currentUser.id);
      if (!recipientId) return;
      
      const newMsg: Message = {
        id: `msg${Date.now()}`,
        senderId: currentUser.id,
        recipientId,
        content: newMessage,
        timestamp: new Date(),
        read: false
      };
      
      // Add message to current conversation
      setMessages(prev => [...prev, newMsg]);
      
      // Update last message in conversations list
      const updatedConversations = conversations.map(conv => {
        if (conv.id === activeConversation) {
          return {
            ...conv,
            lastMessage: newMsg,
            unreadCount: 0 // Reset unread count for current user
          };
        }
        return conv;
      });
      
      setConversations(updatedConversations);
      setNewMessage('');
    }
  };
  
  // Filter conversations based on search query and tab
  const filteredConversations = conversations.filter(conv => {
    // Get the other participant (not the current user)
    const otherParticipantId = conv.participants.find(id => id !== currentUser?.id);
    if (!otherParticipantId) return false;
    
    const otherParticipant = users.find(user => user.id === otherParticipantId);
    if (!otherParticipant) return false;
    
    // Filter by search query
    const matchesSearch = otherParticipant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by tab (0 = All, 1 = Unread)
    const matchesTab = tabValue === 0 || (tabValue === 1 && conv.unreadCount > 0);
    
    return matchesSearch && matchesTab;
  });
  
  // Get user details by ID
  const getUserById = (userId: string): User | undefined => {
    return users.find(user => user.id === userId);
  };
  
  // Format timestamp
  const formatMessageTime = (date: Date): string => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };
  
  // Update the empty state when no conversations are available
  const renderEmptyState = () => (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: '100%',
        p: 3,
        textAlign: 'center'
      }}
    >
      <SendIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        No messages yet
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center">
        Your messages with service providers and clients will appear here.
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
        You can start a conversation from a service provider's profile or when booking an event.
      </Typography>
    </Box>
  );
  
  if (!currentUser) {
    return null;
  }
  
  return (
    <Layout title="Messages">
      <Container maxWidth="lg" sx={{ mt: 2 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            display: 'flex', 
            height: 'calc(100vh - 140px)',
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
          {/* Conversation List */}
          {(showConversationList || !isMobileView) && (
            <Box 
              sx={{ 
                width: isMobileView ? '100%' : 320, 
                borderRight: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" gutterBottom>
                  Messages
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                />
                <Tabs 
                  value={tabValue} 
                  onChange={handleTabChange}
                  variant="fullWidth"
                  sx={{ mt: 2 }}
                >
                  <Tab label="All" />
                  <Tab 
                    label={
                      <Badge 
                        color="error" 
                        badgeContent={conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)}
                        max={99}
                      >
                        Unread
                      </Badge>
                    } 
                  />
                </Tabs>
              </Box>
              
              <List sx={{ overflow: 'auto', flexGrow: 1 }}>
                {filteredConversations.length > 0 ? (
                  filteredConversations.map(conversation => {
                    const otherParticipantId = conversation.participants.find(id => id !== currentUser.id);
                    const otherParticipant = otherParticipantId ? getUserById(otherParticipantId) : undefined;
                    
                    if (!otherParticipant) return null;
                    
                    return (
                      <React.Fragment key={conversation.id}>
                        <ListItem 
                          onClick={() => handleConversationClick(conversation.id)}
                          sx={{ 
                            bgcolor: activeConversation === conversation.id ? 'action.selected' : 'inherit',
                            '&:hover': {
                              bgcolor: 'action.hover'
                            },
                            cursor: 'pointer'
                          }}
                        >
                          <ListItemAvatar>
                            <Badge 
                              color="error" 
                              variant="dot" 
                              invisible={conversation.unreadCount === 0}
                              overlap="circular"
                              anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                              }}
                            >
                              <Avatar 
                                src={otherParticipant.avatar} 
                                alt={otherParticipant.name}
                              >
                                {otherParticipant.name.charAt(0)}
                              </Avatar>
                            </Badge>
                          </ListItemAvatar>
                          <ListItemText 
                            primary={
                              <Typography 
                                variant="subtitle2" 
                                fontWeight={conversation.unreadCount > 0 ? 'bold' : 'normal'}
                              >
                                {otherParticipant.name}
                              </Typography>
                            }
                            secondary={
                              <Typography 
                                variant="body2" 
                                color="text.secondary" 
                                noWrap
                                fontWeight={conversation.unreadCount > 0 ? 'bold' : 'normal'}
                              >
                                {conversation.lastMessage.senderId === currentUser.id ? 'You: ' : ''}
                                {conversation.lastMessage.content}
                              </Typography>
                            }
                          />
                          <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{ ml: 1, alignSelf: 'flex-start', mt: 1 }}
                          >
                            {formatMessageTime(conversation.lastMessage.timestamp)}
                          </Typography>
                        </ListItem>
                        <Divider component="li" />
                      </React.Fragment>
                    );
                  })
                ) : (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {searchQuery ? 'No conversations match your search.' : 'No conversations found.'}
                    </Typography>
                  </Box>
                )}
              </List>
            </Box>
          )}
          
          {/* Message Thread */}
          {(!showConversationList || !isMobileView) && (
            <Box 
              sx={{ 
                flexGrow: 1, 
                display: 'flex', 
                flexDirection: 'column',
                bgcolor: 'background.default'
              }}
            >
              {activeConversation ? (
                <>
                  {/* Conversation Header */}
                  <Box 
                    sx={{ 
                      p: 2, 
                      borderBottom: '1px solid', 
                      borderColor: 'divider',
                      display: 'flex',
                      alignItems: 'center',
                      bgcolor: 'background.paper'
                    }}
                  >
                    {isMobileView && (
                      <IconButton 
                        edge="start" 
                        color="inherit" 
                        onClick={handleBackToList}
                        sx={{ mr: 1 }}
                      >
                        <ArrowBackIcon />
                      </IconButton>
                    )}
                    
                    {(() => {
                      const conversation = conversations.find(conv => conv.id === activeConversation);
                      if (!conversation) return null;
                      
                      const otherParticipantId = conversation.participants.find(id => id !== currentUser.id);
                      const otherParticipant = otherParticipantId ? getUserById(otherParticipantId) : undefined;
                      
                      if (!otherParticipant) return null;
                      
                      return (
                        <>
                          <Avatar 
                            src={otherParticipant.avatar} 
                            alt={otherParticipant.name}
                            sx={{ mr: 2 }}
                          >
                            {otherParticipant.name.charAt(0)}
                          </Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle1">
                              {otherParticipant.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {otherParticipant.role.charAt(0).toUpperCase() + otherParticipant.role.slice(1)}
                            </Typography>
                          </Box>
                          <IconButton>
                            <MoreVertIcon />
                          </IconButton>
                        </>
                      );
                    })()}
                  </Box>
                  
                  {/* Messages */}
                  <Box 
                    sx={{ 
                      p: 2, 
                      flexGrow: 1, 
                      overflow: 'auto',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    {messages.map((message, index) => {
                      const isCurrentUser = message.senderId === currentUser.id;
                      const sender = getUserById(message.senderId);
                      const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId;
                      
                      return (
                        <Box 
                          key={message.id}
                          sx={{ 
                            display: 'flex', 
                            justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                            mb: 1.5
                          }}
                        >
                          {!isCurrentUser && showAvatar && (
                            <Avatar 
                              src={sender?.avatar} 
                              alt={sender?.name}
                              sx={{ mr: 1, width: 36, height: 36 }}
                            >
                              {sender?.name.charAt(0)}
                            </Avatar>
                          )}
                          
                          {!isCurrentUser && !showAvatar && (
                            <Box sx={{ width: 36, mr: 1 }} />
                          )}
                          
                          <Box 
                            sx={{ 
                              maxWidth: '70%',
                              p: 1.5,
                              borderRadius: 2,
                              bgcolor: isCurrentUser ? 'primary.main' : 'background.paper',
                              color: isCurrentUser ? 'primary.contrastText' : 'text.primary',
                              boxShadow: 1
                            }}
                          >
                            <Typography variant="body1">
                              {message.content}
                            </Typography>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                display: 'block', 
                                textAlign: 'right',
                                mt: 0.5,
                                color: isCurrentUser ? 'primary.light' : 'text.secondary'
                              }}
                            >
                              {formatMessageTime(message.timestamp)}
                            </Typography>
                          </Box>
                        </Box>
                      );
                    })}
                    <div ref={messageEndRef} />
                  </Box>
                  
                  {/* Message Input */}
                  <Box 
                    sx={{ 
                      p: 2, 
                      borderTop: '1px solid', 
                      borderColor: 'divider',
                      bgcolor: 'background.paper',
                      display: 'flex'
                    }}
                  >
                    <IconButton size="small" sx={{ mr: 1 }}>
                      <AttachFileIcon />
                    </IconButton>
                    <TextField
                      fullWidth
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      variant="outlined"
                      size="small"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <IconButton 
                      color="primary" 
                      sx={{ ml: 1 }}
                      onClick={handleSendMessage}
                      disabled={newMessage.trim() === ''}
                    >
                      <SendIcon />
                    </IconButton>
                  </Box>
                </>
              ) : filteredConversations.length === 0 ? (
                renderEmptyState()
              ) : (
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    height: '100%',
                    p: 3
                  }}
                >
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No conversation selected
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    Select a conversation from the list or start a new one from a vendor's profile.
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Paper>
      </Container>
    </Layout>
  );
};

export default MessagesPage; 