import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box
} from '@mui/material';
import { Chat as ChatIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

// Simplified recipient type
interface RecipientInfo {
  id: string;
  name: string;
}

interface MessageButtonProps {
  recipient: RecipientInfo;
  variant?: 'text' | 'outlined' | 'contained';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  prefilledMessage?: string;
}

// Mock function to create a new conversation (in a real app, this would be an API call)
const createConversation = (senderId: string, recipientId: string, initialMessage: string) => {
  // This is a mock implementation
  console.log(`Creating conversation between ${senderId} and ${recipientId} with message: ${initialMessage}`);
  
  // In a real app, this would create a conversation in the database
  // and return the conversation ID
  
  return `conv_${Date.now()}`;
};

const MessageButton: React.FC<MessageButtonProps> = ({
  recipient,
  variant = 'outlined',
  size = 'medium',
  fullWidth = false,
  color = 'primary',
  prefilledMessage = ''
}) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [message, setMessage] = useState(prefilledMessage);
  const [error, setError] = useState('');
  
  const handleOpenDialog = () => {
    if (!currentUser) {
      // Redirect to login if not logged in
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }
    
    setDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setError('');
  };
  
  const handleSendMessage = () => {
    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }
    
    if (!currentUser) {
      setError('You must be logged in to send messages');
      return;
    }
    
    // Create a new conversation
    const conversationId = createConversation(currentUser.id, recipient.id, message);
    
    // Close the dialog
    handleCloseDialog();
    
    // Navigate to the messages page
    navigate('/messages');
  };
  
  return (
    <>
      <Button
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        color={color}
        startIcon={<ChatIcon />}
        onClick={handleOpenDialog}
      >
        Message
      </Button>
      
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Message to {recipient.name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2, mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Send a message to {recipient.name} about their services or to ask questions.
            </Typography>
          </Box>
          
          <TextField
            autoFocus
            label="Your message"
            multiline
            rows={4}
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            error={!!error}
            helperText={error}
            placeholder={`Hi ${recipient.name}, I'm interested in your services...`}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSendMessage} 
            variant="contained" 
            color="primary"
            disabled={!message.trim()}
          >
            Send Message
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MessageButton; 