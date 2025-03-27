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
import ServiceRow from '../components/ServiceRow';
import { venues, djs, cateringServices } from '../data/mockData';

const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  
  // Get top rated services - getting more items for scrolling
  const topVenues = [...venues].sort((a, b) => b.rating - a.rating).slice(0, 6);
  const topDJs = [...djs].sort((a, b) => b.rating - a.rating).slice(0, 6);
  const topCatering = [...cateringServices].sort((a, b) => b.rating - a.rating).slice(0, 6);
  
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
                    Great music and entertainment
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
        <ServiceRow 
          icon={<LocationIcon color="primary" />}
          title="Top Venues"
          services={topVenues}
          serviceType="venue"
          viewAllText="View All Venues"
          viewAllLink="/services/venue" 
        />
        
        {/* Top DJs Section */}
        <ServiceRow 
          icon={<MusicIcon color="primary" />}
          title="Top DJs"
          services={topDJs}
          serviceType="dj"
          viewAllText="View All DJs"
          viewAllLink="/services/dj" 
        />
        
        {/* Top Catering Services Section */}
        <ServiceRow 
          icon={<RestaurantIcon color="primary" />}
          title="Top Catering Services"
          services={topCatering}
          serviceType="catering"
          viewAllText="View All Catering Services"
          viewAllLink="/services/catering" 
        />
      </Container>
    </Layout>
  );
};

export default ExplorePage; 