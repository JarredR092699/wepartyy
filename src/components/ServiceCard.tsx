import React from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Box, 
  Chip,
  Rating,
  Stack
} from '@mui/material';
import { Venue, DJ, CateringService } from '../data/mockData';

type ServiceType = Venue | DJ | CateringService;

interface ServiceCardProps {
  service: ServiceType;
  type: 'venue' | 'dj' | 'catering';
  onClick?: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, type, onClick }) => {
  // Determine image source based on service type
  const getImageSrc = () => {
    if (type === 'venue') {
      return (service as Venue).images?.[0] || 'https://via.placeholder.com/300x150';
    } else {
      return (service as DJ | CateringService).image || 'https://via.placeholder.com/300x150';
    }
  };
  
  // Get appropriate tags based on service type
  const getTags = () => {
    switch (type) {
      case 'venue':
        return [(service as Venue).type, (service as Venue).size, ...(service as Venue).style.slice(0, 2)];
      case 'dj':
        return (service as DJ).genres.slice(0, 3);
      case 'catering':
        return (service as CateringService).cuisineType.slice(0, 3);
      default:
        return [];
    }
  };
  
  // Format price based on service type
  const formatPrice = () => {
    switch (type) {
      case 'venue':
        return `$${(service as Venue).price}`;
      case 'dj':
        return `$${(service as DJ).price}`;
      case 'catering':
        return `$${(service as CateringService).price} per person`;
      default:
        return '';
    }
  };
  
  // Get description based on service type
  const getDescription = () => {
    switch (type) {
      case 'venue':
        return (service as Venue).description;
      case 'dj':
        return (service as DJ).bio;
      case 'catering':
        return (service as CateringService).description;
      default:
        return '';
    }
  };
  
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
        image={getImageSrc()}
        alt={service.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {service.name}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating 
            value={service.rating} 
            precision={0.5} 
            size="small" 
            readOnly 
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
            ({service.reviews})
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.primary" sx={{ fontWeight: 'bold', mb: 1 }}>
          {formatPrice()}
        </Typography>
        
        <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
          {getTags().map((tag, index) => (
            <Chip 
              key={index} 
              label={tag} 
              size="small" 
              variant="outlined"
              sx={{ height: 20, fontSize: '0.7rem' }} 
            />
          ))}
        </Stack>
        
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
          {getDescription()}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ServiceCard; 