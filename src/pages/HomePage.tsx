import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Container,
  Paper,
  Divider,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import { 
  Add as AddIcon, 
  Search as SearchIcon,
  Celebration as CelebrationIcon,
  ArrowForward as ArrowForwardIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
  Recommend as RecommendIcon,
  LocalOffer as LocalOfferIcon
} from '@mui/icons-material';
import Layout from '../components/Layout';
import EventCard from '../components/EventCard';
import ServiceCard from '../components/ServiceCard';
import ServiceRow from '../components/ServiceRow';
import { useAuth } from '../contexts/AuthContext';
import { 
  events, 
  venues, 
  djs, 
  cateringServices, 
  entertainment,
  photography,
  decoration,
  audioVisual,
  furniture,
  barServices,
  security
} from '../data/mockData';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const [serviceTab, setServiceTab] = useState<number>(0);
  
  // Service categories
  const serviceCategories = [
    { label: 'Venues', value: 'venue', data: venues },
    { label: 'DJs', value: 'dj', data: djs },
    { label: 'Caterers', value: 'catering', data: cateringServices },
    { label: 'Entertainment', value: 'entertainment', data: entertainment },
    { label: 'Photography', value: 'photography', data: photography },
    { label: 'Decoration', value: 'decoration', data: decoration },
    { label: 'Audio/Visual', value: 'audioVisual', data: audioVisual },
    { label: 'Furniture', value: 'furniture', data: furniture },
    { label: 'Bar Service', value: 'barService', data: barServices },
    { label: 'Security', value: 'security', data: security }
  ];
  
  // Get current service category
  const currentServiceCategory = serviceCategories[serviceTab];
  
  // Sort services by different criteria
  const recommendedServices = [...currentServiceCategory.data].sort(() => Math.random() - 0.5).slice(0, 8); // Show more items
  const topRatedServices = [...currentServiceCategory.data].sort((a, b) => b.rating - a.rating).slice(0, 8);
  const nearbyServices = [...currentServiceCategory.data].sort((a, b) => {
    // Handle sorting by distance safely across different service types
    const distanceA = 'distance' in a ? a.distance : 0;
    const distanceB = 'distance' in b ? b.distance : 0;
    return distanceA - distanceB;
  }).slice(0, 8);
  
  // Check if user is an event organizer
  const isEventOrganizer = isAuthenticated && currentUser?.role === 'eventOrganizer';
  
  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setServiceTab(newValue);
  };
  
  return (
    <Layout title="WeParty">
      <Container maxWidth="md">
        {/* Hero Section */}
        <Box 
          sx={{ 
            textAlign: 'center', 
            py: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Plan Your Perfect Event
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Find the best venues, DJs, and catering services all in one place.
          </Typography>
          
          {/* Main Action Buttons */}
          <Box sx={{ mt: 3, width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button 
              variant="contained" 
              size="large" 
              fullWidth
              startIcon={<AddIcon />}
              onClick={() => navigate('/create-event')}
              sx={{ py: 1.5 }}
            >
              Create an Event
            </Button>
            
            <Button 
              variant="outlined" 
              size="large" 
              fullWidth
              startIcon={<SearchIcon />}
              onClick={() => navigate('/find-service')}
              sx={{ py: 1.5 }}
            >
              Find a Service
            </Button>
            
            <Button 
              variant="outlined" 
              size="large" 
              fullWidth
              startIcon={<LocalOfferIcon />}
              onClick={() => {}}
              sx={{ py: 1.5 }}
            >
              Discover Our Packages
            </Button>
          </Box>
        </Box>
        
        {/* Service content - always show */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 4 }}>
          <Tabs 
            value={serviceTab} 
            onChange={handleTabChange} 
            variant="scrollable"
            scrollButtons="auto"
            aria-label="service categories"
          >
            {serviceCategories.map((category, index) => (
              <Tab key={index} label={category.label} />
            ))}
          </Tabs>
        </Box>
        
        {/* Recommended Services */}
        <ServiceRow
          icon={<RecommendIcon color="primary" />}
          title={`Recommended ${currentServiceCategory.label}`}
          services={recommendedServices}
          serviceType={currentServiceCategory.value}
          viewAllText={`View All ${currentServiceCategory.label}`}
          viewAllLink={`/services/${currentServiceCategory.value}`}
        />
        
        {/* Top Rated Services */}
        <ServiceRow
          icon={<StarIcon color="primary" />}
          title={`Top Rated ${currentServiceCategory.label}`}
          services={topRatedServices}
          serviceType={currentServiceCategory.value}
          viewAllText={`View All ${currentServiceCategory.label}`}
          viewAllLink={`/services/${currentServiceCategory.value}`}
        />
        
        {/* Nearby Services */}
        <ServiceRow
          icon={<LocationIcon color="primary" />}
          title={`${currentServiceCategory.label} Near You`}
          services={nearbyServices}
          serviceType={currentServiceCategory.value}
          viewAllText={`View All ${currentServiceCategory.label}`}
          viewAllLink={`/services/${currentServiceCategory.value}`}
        />
      </Container>
    </Layout>
  );
};

export default HomePage; 