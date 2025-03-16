import React from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Box, 
  Chip,
  Rating
} from '@mui/material';
import { Event } from '../data/mockData';

interface EventCardProps {
  event: Event;
  onClick?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  // Placeholder image if the event image is not available
  const imageSrc = event.image || 'https://via.placeholder.com/300x150';
  
  return (
    <Card 
      sx={{ 
        maxWidth: '100%', 
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: onClick ? 'translateY(-4px)' : 'none',
        }
      }} 
      onClick={onClick}
    >
      <CardMedia
        component="img"
        height="140"
        image={imageSrc}
        alt={event.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {event.name}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {event.date}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
            {event.attendees} attendees
          </Typography>
          {event.isPublic && (
            <Chip 
              label="Public" 
              size="small" 
              color="primary" 
              sx={{ height: 20, fontSize: '0.7rem' }} 
            />
          )}
        </Box>
        
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            overflow: 'hidden',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
          }}
        >
          {event.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default EventCard; 