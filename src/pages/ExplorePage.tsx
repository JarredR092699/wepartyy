import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Divider
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  MusicNote as MusicIcon,
  Restaurant as RestaurantIcon
} from '@mui/icons-material';
import Layout from '../components/Layout';
import ServiceCard from '../components/ServiceCard';
import { venues, djs, cateringServices } from '../data/mockData';

const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  
  // Get top rated services
  const topVenues = [...venues].sort((a, b) => b.rating - a.rating).slice(0, 2);
  const topDJs = [...djs].sort((a, b) => b.rating - a.rating).slice(0, 2);
  const topCatering = [...cateringServices].sort((a, b) => b.rating - a.rating).slice(0, 2);
  
  // Navigate to find service page with specific tab
  const navigateToService = (serviceType: number) => {
    navigate('/find-service', { state: { initialTab: serviceType } });
  };
  
  return (
    <Layout title="Explore">
      <Container maxWidth="md">
        {/* Categories Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom>
            Categories
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Card 
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  }
                }}
                onClick={() => navigateToService(0)}
              >
                <CardMedia
                  component="div"
                  sx={{
                    height: 140,
                    bgcolor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <LocationIcon sx={{ fontSize: 60, color: 'white' }} />
                </CardMedia>
                <CardContent>
                  <Typography variant="h6" component="div" align="center">
                    Venues
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    Find the perfect location for your event
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Card 
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  }
                }}
                onClick={() => navigateToService(1)}
              >
                <CardMedia
                  component="div"
                  sx={{
                    height: 140,
                    bgcolor: 'secondary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <MusicIcon sx={{ fontSize: 60, color: 'white' }} />
                </CardMedia>
                <CardContent>
                  <Typography variant="h6" component="div" align="center">
                    DJs
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    Book talented DJs for your party
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Card 
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  }
                }}
                onClick={() => navigateToService(2)}
              >
                <CardMedia
                  component="div"
                  sx={{
                    height: 140,
                    bgcolor: 'success.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <RestaurantIcon sx={{ fontSize: 60, color: 'white' }} />
                </CardMedia>
                <CardContent>
                  <Typography variant="h6" component="div" align="center">
                    Catering
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    Delicious food for your guests
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
        
        <Divider sx={{ my: 4 }} />
        
        {/* Top Venues Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h2" fontWeight="bold">
              Top Venues
            </Typography>
            
            <Button 
              variant="text" 
              onClick={() => navigateToService(0)}
            >
              See All
            </Button>
          </Box>
          
          <Grid container spacing={2}>
            {topVenues.map((venue) => (
              <Grid item xs={12} sm={6} key={venue.id}>
                <ServiceCard 
                  service={venue} 
                  type="venue" 
                  onClick={() => {
                    // In a real app, this would navigate to the venue details page
                    console.log(`Clicked on venue: ${venue.id}`);
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
        
        {/* Top DJs Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h2" fontWeight="bold">
              Top DJs
            </Typography>
            
            <Button 
              variant="text" 
              onClick={() => navigateToService(1)}
            >
              See All
            </Button>
          </Box>
          
          <Grid container spacing={2}>
            {topDJs.map((dj) => (
              <Grid item xs={12} sm={6} key={dj.id}>
                <ServiceCard 
                  service={dj} 
                  type="dj" 
                  onClick={() => {
                    // In a real app, this would navigate to the DJ details page
                    console.log(`Clicked on DJ: ${dj.id}`);
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
        
        {/* Top Catering Services Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h2" fontWeight="bold">
              Top Catering Services
            </Typography>
            
            <Button 
              variant="text" 
              onClick={() => navigateToService(2)}
            >
              See All
            </Button>
          </Box>
          
          <Grid container spacing={2}>
            {topCatering.map((catering) => (
              <Grid item xs={12} sm={6} key={catering.id}>
                <ServiceCard 
                  service={catering} 
                  type="catering" 
                  onClick={() => {
                    // In a real app, this would navigate to the catering details page
                    console.log(`Clicked on catering: ${catering.id}`);
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Layout>
  );
};

export default ExplorePage; 