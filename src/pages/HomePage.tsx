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
  const recommendedServices = [...currentServiceCategory.data].sort(() => Math.random() - 0.5).slice(0, 4); // Random for mock
  const topRatedServices = [...currentServiceCategory.data].sort((a, b) => b.rating - a.rating).slice(0, 4);
  const nearbyServices = [...currentServiceCategory.data].sort((a, b) => {
    // Handle sorting by distance safely across different service types
    const distanceA = 'distance' in a ? a.distance : 0;
    const distanceB = 'distance' in b ? b.distance : 0;
    return distanceA - distanceB;
  }).slice(0, 4);
  
  // Check if user is an event organizer
  const isEventOrganizer = isAuthenticated && currentUser?.role === 'eventOrganizer';
  
  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setServiceTab(newValue);
  };
  
  // Section Header component
  const SectionHeader = ({ icon, title }: { icon: React.ReactNode, title: string }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 4 }}>
      {icon}
      <Typography variant="h5" component="h2" fontWeight="600" sx={{ ml: 1 }}>
        {title}
      </Typography>
      <Box sx={{ flexGrow: 1 }} />
      <Button 
        endIcon={<ArrowForwardIcon />}
        onClick={() => navigate('/find-service')}
        size="small"
      >
        View All
      </Button>
    </Box>
  );
  
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
        <SectionHeader 
          icon={<RecommendIcon color="primary" />} 
          title={`Recommended ${currentServiceCategory.label}`} 
        />
        <Grid container spacing={2}>
          {recommendedServices.map((service) => (
            <Grid item xs={12} sm={6} md={3} key={service.id}>
              <ServiceCard 
                service={service} 
                type={currentServiceCategory.value as any}
                onClick={() => navigate(`/service/${currentServiceCategory.value}/${service.id}`)} 
              />
            </Grid>
          ))}
        </Grid>
        
        {/* Top Rated Services */}
        <SectionHeader 
          icon={<StarIcon color="primary" />} 
          title={`Top Rated ${currentServiceCategory.label}`} 
        />
        <Grid container spacing={2}>
          {topRatedServices.map((service) => (
            <Grid item xs={12} sm={6} md={3} key={service.id}>
              <ServiceCard 
                service={service} 
                type={currentServiceCategory.value as any}
                onClick={() => navigate(`/service/${currentServiceCategory.value}/${service.id}`)} 
              />
            </Grid>
          ))}
        </Grid>
        
        {/* Nearby Services */}
        <SectionHeader 
          icon={<LocationIcon color="primary" />} 
          title={`${currentServiceCategory.label} Near You`} 
        />
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {nearbyServices.map((service) => (
            <Grid item xs={12} sm={6} md={3} key={service.id}>
              <ServiceCard 
                service={service} 
                type={currentServiceCategory.value as any}
                onClick={() => navigate(`/service/${currentServiceCategory.value}/${service.id}`)} 
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Layout>
  );
};

export default HomePage; 