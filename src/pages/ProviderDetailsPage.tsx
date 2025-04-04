import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Chip,
  Button,
  Divider,
  Rating,
  Card,
  CardContent,
  CardMedia,
  Tabs,
  Tab,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  CircularProgress,
  styled
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Language as WebsiteIcon,
  AttachMoney as MoneyIcon,
  EventAvailable as EventAvailableIcon,
  Star as StarIcon,
  PhotoLibrary as PhotoLibraryIcon,
  VerifiedUser as VerifiedIcon,
  ArrowBack as ArrowBackIcon,
  MusicNote as MusicIcon,
  Restaurant as RestaurantIcon,
  Theaters as EntertainmentIcon,
  PhotoCamera as PhotographyIcon,
  Brush as DecorationIcon,
  Speaker as AudioVisualIcon,
  Chair as FurnitureIcon,
  LocalBar as BarServiceIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import Layout from '../components/Layout';
import MessageButton from '../components/MessageButton';
import { 
  allDJs, 
  allVenues, 
  allCaterers, 
  allEntertainment,
  allPhotographers,
  allDecorators,
  allAudioVisual,
  allFurniture,
  allBarServices,
  allSecurity,
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

// Type for reviews
interface Review {
  id: string;
  userName: string;
  userImage?: string;
  rating: number;
  text: string;
  date: string;
}

// Mock reviews data generator
const generateMockReviews = (serviceId: string): Review[] => {
  const reviewsCount = Math.floor(Math.random() * 8) + 3; // 3-10 reviews
  const reviews: Review[] = [];
  
  const reviewTexts = [
    "Absolutely amazing service! Would recommend to everyone.",
    "Great experience overall. Very professional and reliable.",
    "Good value for money. The service was exactly what we needed.",
    "Excellent communication throughout the process.",
    "They went above and beyond our expectations.",
    "Very responsive and accommodating to our needs.",
    "The quality was top-notch. Will definitely use again.",
    "A bit pricey but worth every penny for the quality provided.",
    "Loved working with them! Made our event special.",
    "Very punctual and organized. No complaints at all."
  ];
  
  const names = [
    "Emma Thompson", "James Wilson", "Sophia Chen", "Michael Johnson",
    "Olivia Martinez", "William Taylor", "Isabella Brown", "David Garcia",
    "Mia Smith", "Jacob Rodriguez", "Charlotte Lee", "Ethan Anderson"
  ];
  
  for (let i = 0; i < reviewsCount; i++) {
    const randomRating = Math.floor(Math.random() * 2) + 4; // 4-5 stars most likely
    const randomTextIndex = Math.floor(Math.random() * reviewTexts.length);
    const randomNameIndex = Math.floor(Math.random() * names.length);
    
    // Generate a random date in the past year
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 365));
    
    reviews.push({
      id: `review-${serviceId}-${i}`,
      userName: names[randomNameIndex],
      rating: randomRating,
      text: reviewTexts[randomTextIndex],
      date: format(date, 'MMM d, yyyy')
    });
  }
  
  return reviews;
};

// Mock photos data generator
const generateMockPhotos = (serviceId: string, type: string): string[] => {
  const photosCount = Math.floor(Math.random() * 6) + 3; // 3-8 photos
  const photos: string[] = [];
  
  for (let i = 0; i < photosCount; i++) {
    // Use placeholder images with specific seed to stay consistent
    photos.push(`https://picsum.photos/seed/${serviceId}-${i}/800/600`);
  }
  
  return photos;
};

// Tab Panel component
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`provider-tabpanel-${index}`}
      aria-labelledby={`provider-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

// Main component
const ProviderDetailsPage = () => {
  const { serviceId, serviceType } = useParams<{ serviceId: string, serviceType: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  
  // Tab state
  const [tabValue, setTabValue] = useState(0);
  
  // Service, reviews, and photos state
  const [service, setService] = useState<Venue | DJ | CateringService | Entertainment | Photography | Decoration | AudioVisual | Furniture | BarService | Security | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Rating distribution for analytics
  const [ratingDistribution, setRatingDistribution] = useState<number[]>([0, 0, 0, 0, 0]);
  
  useEffect(() => {
    if (!serviceId || !serviceType) {
      navigate('/find-service');
      return;
    }
    
    // Fetch the service details based on type and ID
    let foundService = null;
    
    switch (serviceType) {
      case 'venue':
        foundService = allVenues.find(venue => venue.id === serviceId);
        break;
      case 'dj':
        foundService = allDJs.find(dj => dj.id === serviceId);
        break;
      case 'catering':
        foundService = allCaterers.find(caterer => caterer.id === serviceId);
        break;
      case 'entertainment':
        foundService = allEntertainment.find(ent => ent.id === serviceId);
        break;
      case 'photography':
        foundService = allPhotographers.find(photo => photo.id === serviceId);
        break;
      case 'decoration':
        foundService = allDecorators.find(deco => deco.id === serviceId);
        break;
      case 'audioVisual':
        foundService = allAudioVisual.find(av => av.id === serviceId);
        break;
      case 'furniture':
        foundService = allFurniture.find(furn => furn.id === serviceId);
        break;
      case 'barService':
        foundService = allBarServices.find(bar => bar.id === serviceId);
        break;
      case 'security':
        foundService = allSecurity.find(sec => sec.id === serviceId);
        break;
      default:
        navigate('/find-service');
        return;
    }
    
    if (!foundService) {
      navigate('/find-service');
      return;
    }
    
    setService(foundService);
    
    // Generate mock reviews and photos
    const serviceReviews = generateMockReviews(serviceId);
    const servicePhotos = generateMockPhotos(serviceId, serviceType);
    
    setReviews(serviceReviews);
    setPhotos(servicePhotos);
    
    // Calculate rating distribution
    const distribution = [0, 0, 0, 0, 0];
    serviceReviews.forEach(review => {
      distribution[Math.floor(review.rating) - 1]++;
    });
    setRatingDistribution(distribution);
    
    setLoading(false);
  }, [serviceId, serviceType, navigate]);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const getServiceTypeIcon = () => {
    switch (serviceType) {
      case 'venue':
        return <LocationIcon sx={{ mr: 1 }} />;
      case 'dj':
        return <MusicIcon sx={{ mr: 1 }} />;
      case 'catering':
        return <RestaurantIcon sx={{ mr: 1 }} />;
      case 'entertainment':
        return <EntertainmentIcon sx={{ mr: 1 }} />;
      case 'photography':
        return <PhotographyIcon sx={{ mr: 1 }} />;
      case 'decoration':
        return <DecorationIcon sx={{ mr: 1 }} />;
      case 'audioVisual':
        return <AudioVisualIcon sx={{ mr: 1 }} />;
      case 'furniture':
        return <FurnitureIcon sx={{ mr: 1 }} />;
      case 'barService':
        return <BarServiceIcon sx={{ mr: 1 }} />;
      case 'security':
        return <SecurityIcon sx={{ mr: 1 }} />;
      default:
        return null;
    }
  };
  
  const formatServiceType = (type: string): string => {
    switch (type) {
      case 'venue':
        return 'Venue';
      case 'dj':
        return 'DJ';
      case 'catering':
        return 'Catering';
      case 'entertainment':
        return 'Entertainment';
      case 'photography':
        return 'Photography';
      case 'decoration':
        return 'Decoration';
      case 'audioVisual':
        return 'Audio Visual';
      case 'furniture':
        return 'Furniture';
      case 'barService':
        return 'Bar Service';
      case 'security':
        return 'Security';
      default:
        return type;
    }
  };
  
  const getServiceDetails = () => {
    if (!service) return null;
    
    switch (serviceType) {
      case 'venue':
        const venue = service as Venue;
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Venue Type</Typography>
              <Typography variant="body1" gutterBottom>{venue.type}</Typography>
              
              <Typography variant="subtitle1" gutterBottom>Size</Typography>
              <Typography variant="body1" gutterBottom>{venue.size}</Typography>
              
              <Typography variant="subtitle1" gutterBottom>Capacity</Typography>
              <Typography variant="body1" gutterBottom>{venue.capacity} people</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Amenities</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {['WiFi', 'Parking', 'Catering', 'Bar', 'Sound System', 'Stage'].map((amenity, index) => (
                  <Chip key={index} label={amenity} size="small" />
                ))}
              </Box>
              
              <Typography variant="subtitle1" gutterBottom>Additional Services</Typography>
              <Typography variant="body1">
                Setup/teardown, chair and table rental, sound system, lighting
              </Typography>
            </Grid>
          </Grid>
        );
        
      case 'dj':
        const dj = service as DJ;
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Music Genres</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {dj.genres.map((genre, index) => (
                  <Chip key={index} label={genre} size="small" />
                ))}
              </Box>
              
              <Typography variant="subtitle1" gutterBottom>Experience</Typography>
              <Typography variant="body1" gutterBottom>{dj.experience} years</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Equipment</Typography>
              <Typography variant="body1" gutterBottom>
                Professional sound system, lighting, microphones, and mixer console
              </Typography>
              
              <Typography variant="subtitle1" gutterBottom>Additional Services</Typography>
              <Typography variant="body1">
                MC services, custom playlist creation, early setup
              </Typography>
            </Grid>
          </Grid>
        );
        
      case 'catering':
        const catering = service as CateringService;
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Cuisine Types</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {catering.cuisineType.map((cuisine, index) => (
                  <Chip key={index} label={cuisine} size="small" />
                ))}
              </Box>
              
              <Typography variant="subtitle1" gutterBottom>Dietary Options</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free'].map((diet, index) => (
                  <Chip key={index} label={diet} size="small" />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Service Options</Typography>
              <Typography variant="body1" gutterBottom>
                Buffet, plated service, food stations, passed appetizers, dessert tables
              </Typography>
              
              <Typography variant="subtitle1" gutterBottom>Additional Services</Typography>
              <Typography variant="body1">
                Waitstaff, bartenders, tableware, linens, setup and cleanup
              </Typography>
            </Grid>
          </Grid>
        );
      
      // Additional cases for other service types would follow the same pattern
      
      default:
        return (
          <Typography variant="body1">
            Details about this service type are not fully implemented yet. 
            Please contact the provider for more information.
          </Typography>
        );
    }
  };
  
  const getRecipient = () => {
    if (!service) return { id: '', name: '' };
    
    return {
      id: service.ownerId || service.id,
      name: service.name
    };
  };
  
  if (loading) {
    return (
      <Layout title={`Loading Provider Details`}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <CircularProgress />
          </Box>
        </Container>
      </Layout>
    );
  }
  
  if (!service) {
    return (
      <Layout title="Provider Not Found">
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Provider Not Found
            </Typography>
            <Typography variant="body1" paragraph>
              The service provider you're looking for doesn't exist or has been removed.
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/find-service')}
            >
              Back to Services
            </Button>
          </Paper>
        </Container>
      </Layout>
    );
  }
  
  const isFavorited = serviceId ? isFavorite(serviceId) : false;
  
  return (
    <Layout title={`${service.name} - ${formatServiceType(serviceType || '')}`}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Back button */}
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        
        {/* Provider header */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3}>
            {/* Provider logo/image */}
            <Grid item xs={12} md={4}>
              <Card elevation={0}>
                <CardMedia
                  component="img"
                  height="240"
                  image={photos[0] || service.image || `https://picsum.photos/seed/${service.id}/400/400`}
                  alt={service.name}
                  sx={{ borderRadius: 2 }}
                />
              </Card>
            </Grid>
            
            {/* Provider info */}
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="h4" component="h1">
                  {service.name}
                </Typography>
                {service.ownerId === 'u3' || service.ownerId === 'u4' ? (
                  <Chip 
                    icon={<VerifiedIcon />} 
                    label="Verified" 
                    color="primary" 
                    size="small" 
                    sx={{ ml: 2 }} 
                  />
                ) : null}
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {getServiceTypeIcon()}
                <Typography variant="h6" color="text.secondary">
                  {formatServiceType(serviceType || '')}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Rating value={service.rating} precision={0.5} readOnly />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {service.rating.toFixed(1)} ({service.reviews} reviews)
                </Typography>
              </Box>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {/* Location */}
                {'location' in service && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <LocationIcon color="action" sx={{ mr: 1, mt: 0.3 }} />
                      <Typography variant="body1">
                        {(service as Venue).location}
                      </Typography>
                    </Box>
                  </Grid>
                )}
                
                {/* Phone */}
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <PhoneIcon color="action" sx={{ mr: 1, mt: 0.3 }} />
                    <Typography variant="body1">
                      (555) 123-4567
                    </Typography>
                  </Box>
                </Grid>
                
                {/* Email */}
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <EmailIcon color="action" sx={{ mr: 1, mt: 0.3 }} />
                    <Typography variant="body1">
                      contact@{service.name.toLowerCase().replace(/\s+/g, '')}services.com
                    </Typography>
                  </Box>
                </Grid>
                
                {/* Website */}
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <WebsiteIcon color="action" sx={{ mr: 1, mt: 0.3 }} />
                    <Typography variant="body1">
                      www.{service.name.toLowerCase().replace(/\s+/g, '')}services.com
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MoneyIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h5" color="primary.main">
                  ${service.price}{serviceType === 'catering' ? '/person' : ''}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color={isFavorited ? "secondary" : "primary"}
                  onClick={() => {
                    if (isFavorited && serviceId) {
                      removeFavorite(serviceId);
                    } else if (serviceId) {
                      addFavorite(serviceId, serviceType || '');
                    }
                  }}
                  startIcon={<StarIcon />}
                >
                  {isFavorited ? "Favorited" : "Add to Favorites"}
                </Button>
                
                {currentUser && (
                  <MessageButton
                    recipient={getRecipient()}
                    variant="outlined"
                    color="primary"
                    prefilledMessage={`Hi, I'm interested in your ${serviceType} service.`}
                  />
                )}
              </Box>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Tabs section */}
        <Paper sx={{ mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="provider details tabs"
            variant="fullWidth"
          >
            <Tab label="Details" id="provider-tab-0" />
            <Tab label="Photos" id="provider-tab-1" />
            <Tab label="Reviews" id="provider-tab-2" />
            <Tab label="Availability" id="provider-tab-3" />
          </Tabs>
          
          {/* Details tab */}
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h6" gutterBottom>
              About {service.name}
            </Typography>
            <Typography variant="body1" paragraph>
              {service.description || `${service.name} is a premium ${formatServiceType(serviceType || '')} service provider with years of experience in the industry. We specialize in creating memorable experiences tailored to your specific needs.`}
            </Typography>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              Service Details
            </Typography>
            {getServiceDetails()}
          </TabPanel>
          
          {/* Photos tab */}
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom>
              Photos Gallery
            </Typography>
            <Grid container spacing={2}>
              {photos.map((photo, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="200"
                      image={photo}
                      alt={`${service.name} photo ${index + 1}`}
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>
          
          {/* Reviews tab */}
          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Typography variant="h6" gutterBottom>
                    Rating Summary
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h3" component="span">
                      {service.rating.toFixed(1)}
                    </Typography>
                    <Box sx={{ ml: 1 }}>
                      <Rating value={service.rating} precision={0.5} readOnly />
                      <Typography variant="body2" color="text.secondary">
                        {service.reviews} reviews
                      </Typography>
                    </Box>
                  </Box>
                  
                  {/* Rating distribution */}
                  {[5, 4, 3, 2, 1].map((star) => (
                    <Box key={star} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" sx={{ width: 30 }}>
                        {star}★
                      </Typography>
                      <Box
                        sx={{
                          flex: 1,
                          mx: 1,
                          height: 10,
                          bgcolor: 'background.paper',
                          borderRadius: 5,
                          overflow: 'hidden'
                        }}
                      >
                        <Box
                          sx={{
                            width: `${(ratingDistribution[star - 1] / reviews.length) * 100}%`,
                            height: '100%',
                            bgcolor: star > 3 ? 'success.main' : star > 1 ? 'warning.main' : 'error.main',
                          }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ width: 30 }}>
                        {ratingDistribution[star - 1]}
                      </Typography>
                    </Box>
                  ))}
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={8}>
                <Typography variant="h6" gutterBottom>
                  Client Reviews
                </Typography>
                
                <List>
                  {reviews.map((review) => (
                    <ListItem
                      key={review.id}
                      alignItems="flex-start"
                      sx={{ 
                        mb: 2, 
                        p: 2, 
                        bgcolor: 'background.default', 
                        borderRadius: 2 
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar>
                          {review.userName.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle1">
                              {review.userName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {review.date}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <>
                            <Rating value={review.rating} size="small" readOnly sx={{ my: 1 }} />
                            <Typography variant="body2" color="text.primary">
                              {review.text}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          </TabPanel>
          
          {/* Availability tab */}
          <TabPanel value={tabValue} index={3}>
            <Typography variant="h6" gutterBottom>
              Available Dates
            </Typography>
            
            {service.availability && service.availability.length > 0 ? (
              <Grid container spacing={2}>
                {service.availability.map((date, index) => (
                  <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        bgcolor: 'background.default',
                        borderRadius: 2
                      }}
                    >
                      <EventAvailableIcon color="primary" />
                      <Typography variant="body1">
                        {format(new Date(date), 'MMM d, yyyy')}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body1" color="text.secondary">
                No upcoming availability. Please contact the provider directly for custom scheduling.
              </Typography>
            )}
            
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Book This Service
              </Typography>
              <Typography variant="body1" paragraph>
                You can book this service by contacting the provider directly or through our platform.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/create-event')}
              >
                Start Planning Your Event
              </Button>
            </Box>
          </TabPanel>
        </Paper>
      </Container>
    </Layout>
  );
};

export default ProviderDetailsPage; 