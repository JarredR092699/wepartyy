import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Rating,
  Chip,
  Stack,
  Divider,
  CardActions,
  Button,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  MusicNote as MusicIcon,
  Restaurant as RestaurantIcon,
  Place as PlaceIcon,
  Chat as ChatIcon,
  VerifiedUser as VerifiedIcon,
  Theaters as EntertainmentIcon,
  PhotoCamera as PhotographyIcon,
  Brush as DecorationIcon,
  Speaker as AudioVisualIcon,
  Chair as FurnitureIcon,
  LocalBar as BarServiceIcon,
  Security as SecurityIcon,
  AccessTime as TimeIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon
} from '@mui/icons-material';
import { 
  Venue, 
  DJ, 
  CateringService, 
  Entertainment, 
  Photography, 
  Decoration, 
  AudioVisual, 
  Furniture, 
  BarService, 
  Security 
} from '../data/mockData';
import MessageButton from './MessageButton';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';

interface ServiceCardProps {
  service: Venue | DJ | CateringService | Entertainment | Photography | Decoration | AudioVisual | Furniture | BarService | Security;
  type: 'venue' | 'dj' | 'catering' | 'entertainment' | 'photography' | 'decoration' | 'audioVisual' | 'furniture' | 'barService' | 'security';
  onClick?: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, type, onClick }) => {
  // Common properties
  const { name, price, rating, reviews } = service;
  const { currentUser } = useAuth();
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  
  // Get type-specific properties
  const getTypeSpecificInfo = () => {
    switch (type) {
      case 'venue':
        const venue = service as Venue;
        return (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationIcon fontSize="small" color="action" sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {venue.location}
              </Typography>
            </Box>
            
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
              <Chip size="small" label={venue.type} />
              <Chip size="small" label={venue.size} />
            </Stack>
          </>
        );
        
      case 'dj':
        const dj = service as DJ;
        return (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <MusicIcon fontSize="small" color="action" sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary" noWrap>
                {dj.genres.join(', ')}
              </Typography>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {dj.experience} years experience
            </Typography>
          </>
        );
        
      case 'catering':
        const catering = service as CateringService;
        return (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <RestaurantIcon fontSize="small" color="action" sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary" noWrap>
                {catering.cuisineType.join(', ')}
              </Typography>
            </Box>
          </>
        );
        
      case 'entertainment':
        const entertainment = service as Entertainment;
        return (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <EntertainmentIcon fontSize="small" color="action" sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary" noWrap>
                {entertainment.type.join(', ')}
              </Typography>
            </Box>
            
            {entertainment.genre && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <MusicIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary" noWrap>
                  {entertainment.genre.join(', ')}
                </Typography>
              </Box>
            )}
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TimeIcon fontSize="small" color="action" sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {entertainment.duration} hour{entertainment.duration !== 1 ? 's' : ''}
              </Typography>
            </Box>
          </>
        );
        
      case 'photography':
        const photography = service as Photography;
        return (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PhotographyIcon fontSize="small" color="action" sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary" noWrap>
                {photography.type.join(', ')}
              </Typography>
            </Box>
            
            <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap' }}>
              {photography.style.map((style, index) => (
                <Chip key={index} size="small" label={style} sx={{ mb: 0.5 }} />
              ))}
            </Stack>
            
            {photography.priceType === 'package' && photography.packageHours && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TimeIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  {photography.packageHours} hour{photography.packageHours !== 1 ? 's' : ''} included
                </Typography>
              </Box>
            )}
          </>
        );
        
      case 'decoration':
        const decoration = service as Decoration;
        return (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <DecorationIcon fontSize="small" color="action" sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary" noWrap>
                {decoration.type.join(', ')}
              </Typography>
            </Box>
            
            <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap' }}>
              {decoration.style.map((style, index) => (
                <Chip key={index} size="small" label={style} sx={{ mb: 0.5 }} />
              ))}
            </Stack>
          </>
        );
        
      case 'audioVisual':
        const audioVisual = service as AudioVisual;
        return (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AudioVisualIcon fontSize="small" color="action" sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary" noWrap>
                {audioVisual.equipmentTypes.join(', ')}
              </Typography>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {audioVisual.includesTechnician ? 'Includes technician' : 'No technician included'}
            </Typography>
          </>
        );
        
      case 'furniture':
        const furniture = service as Furniture;
        return (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <FurnitureIcon fontSize="small" color="action" sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary" noWrap>
                {furniture.itemTypes.join(', ')}
              </Typography>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {furniture.includesSetup ? 'Includes setup/teardown' : 'Setup not included'}
            </Typography>
          </>
        );
        
      case 'barService':
        const barService = service as BarService;
        return (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <BarServiceIcon fontSize="small" color="action" sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary" noWrap>
                {barService.serviceTypes.join(', ')}
              </Typography>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {barService.includesBartenders ? 'Includes bartenders' : 'Bartenders not included'}
            </Typography>
          </>
        );
        
      case 'security':
        const security = service as Security;
        return (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <SecurityIcon fontSize="small" color="action" sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary" noWrap>
                {security.serviceTypes.join(', ')}
              </Typography>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {security.uniformed ? 'Uniformed staff' : 'Plain clothes staff'}
            </Typography>
          </>
        );
        
      default:
        return null;
    }
  };
  
  // Display distance if available
  const displayDistance = () => {
    if ('distance' in service && service.distance !== undefined) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <PlaceIcon fontSize="small" color="action" sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {service.distance.toFixed(1)} km away
          </Typography>
        </Box>
      );
    }
    return null;
  };

  // Get recipient information for messaging
  const getRecipient = () => {
    // In a real app, this would get the actual user ID of the service owner
    // For now, we'll use the service ID as a placeholder
    return {
      id: service.ownerId || service.id,
      name: name
    };
  };
  
  // Determine if the current user is the owner of this service
  const isOwner = () => {
    return currentUser && service.ownerId === currentUser.id;
  };

  // Check if the service owner is verified
  const isVerified = () => {
    // In a real app, this would check if the owner of this service is verified
    // For now, we'll use a mock implementation
    return service.ownerId === 'u3' || service.ownerId === 'u4'; // Mock verified users
  };
  
  // Get price display based on service type and pricing model
  const getPriceDisplay = () => {
    switch (type) {
      case 'catering':
        return `$${price}/person`;
      case 'entertainment':
        const entertainment = service as Entertainment;
        return `$${price}${entertainment.priceType === 'hourly' ? '/hour' : ' flat rate'}`;
      case 'photography':
        const photography = service as Photography;
        return `$${price}${photography.priceType === 'hourly' ? '/hour' : ' package'}`;
      case 'decoration':
        const decoration = service as Decoration;
        return `$${price}${decoration.priceType === 'package' ? ' package' : ' starting price'}`;
      case 'audioVisual':
        const audioVisual = service as AudioVisual;
        return `$${price}${audioVisual.priceType === 'package' ? ' package' : ' base price'}`;
      case 'furniture':
        const furniture = service as Furniture;
        return `$${price}${furniture.priceType === 'per_item' ? '/item' : ' package'}`;
      case 'barService':
        const barService = service as BarService;
        if (barService.priceType === 'per_person') return `$${price}/person`;
        if (barService.priceType === 'per_hour') return `$${price}/hour`;
        return `$${price} package`;
      case 'security':
        const security = service as Security;
        if (security.priceType === 'per_guard') return `$${price}/guard`;
        if (security.priceType === 'per_hour') return `$${price}/hour`;
        return `$${price} package`;
      default:
        return `$${price}`;
    }
  };

  // Check if this service is favorited
  const isServiceFavorite = isFavorite(service.id);

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        cursor: onClick ? 'pointer' : 'default'
      }}
    >
      <CardContent 
        sx={{ flexGrow: 1 }}
        onClick={onClick}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="h6" component="h2" noWrap sx={{ maxWidth: 'calc(100% - 30px)' }}>
            {name}
          </Typography>
          
          {isVerified() && (
            <Tooltip title="Verified Vendor">
              <VerifiedIcon color="primary" fontSize="small" />
            </Tooltip>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={rating} precision={0.5} readOnly size="small" />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({reviews})
          </Typography>
        </Box>
        
        {getTypeSpecificInfo()}
        
        {displayDistance()}
        
        <Divider sx={{ my: 1 }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <MoneyIcon fontSize="small" color="primary" sx={{ mr: 0.5 }} />
            <Typography variant="h6" color="primary.main">
              {getPriceDisplay()}
            </Typography>
          </Box>
          
          {service.availability && (
            <Typography variant="caption" color="text.secondary">
              {service.availability.length} available dates
            </Typography>
          )}
        </Box>
      </CardContent>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 1 }}>
        {/* Favorite button */}
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            if (isServiceFavorite) {
              removeFavorite(service.id);
            } else {
              addFavorite(service.id, type);
            }
          }}
          color={isServiceFavorite ? 'primary' : 'default'}
          size="small"
        >
          {isServiceFavorite ? <StarIcon /> : <StarBorderIcon />}
        </IconButton>
        
        {/* Only show message button if user is logged in and not the owner */}
        {currentUser && !isOwner() && (
          <MessageButton 
            recipient={getRecipient()} 
            variant="text" 
            size="small" 
            color="primary"
            prefilledMessage={`Hi, I'm interested in your ${type} service.`}
          />
        )}
      </Box>
    </Card>
  );
};

export default ServiceCard; 