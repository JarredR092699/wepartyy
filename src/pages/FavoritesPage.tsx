import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Box,
  Tabs,
  Tab,
  Alert,
  Button,
  Divider
} from '@mui/material';
import { 
  Favorite as FavoriteIcon,
  SentimentDissatisfied as EmptyIcon,
  Add as AddIcon
} from '@mui/icons-material';
import Layout from '../components/Layout';
import ServiceCard from '../components/ServiceCard';
import { useFavorites } from '../contexts/FavoritesContext';
import { useAuth } from '../contexts/AuthContext';
import { 
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

type ServiceType = 'venue' | 'dj' | 'catering' | 'entertainment' | 'photography' | 'decoration' | 'audioVisual' | 'furniture' | 'barService' | 'security';

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { favorites } = useFavorites();
  const { isAuthenticated } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('all');

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  // Get service data by ID and type
  const getServiceById = (id: string, type: ServiceType) => {
    switch (type) {
      case 'venue':
        return venues.find(item => item.id === id);
      case 'dj':
        return djs.find(item => item.id === id);
      case 'catering':
        return cateringServices.find(item => item.id === id);
      case 'entertainment':
        return entertainment.find(item => item.id === id);
      case 'photography':
        return photography.find(item => item.id === id);
      case 'decoration':
        return decoration.find(item => item.id === id);
      case 'audioVisual':
        return audioVisual.find(item => item.id === id);
      case 'furniture':
        return furniture.find(item => item.id === id);
      case 'barService':
        return barServices.find(item => item.id === id);
      case 'security':
        return security.find(item => item.id === id);
      default:
        return null;
    }
  };

  // Get all favorite services with their data
  const getFavoriteServices = () => {
    return favorites.map(favorite => ({
      ...favorite,
      data: getServiceById(favorite.id, favorite.type)
    })).filter(item => item.data !== undefined);
  };

  // Filter favorite services by type
  const getFilteredFavorites = () => {
    const allFavorites = getFavoriteServices();
    if (currentTab === 'all') {
      return allFavorites;
    }
    return allFavorites.filter(item => item.type === currentTab);
  };

  const filteredFavorites = getFilteredFavorites();

  // If not logged in, redirect to login
  if (!isAuthenticated) {
    return (
      <Layout title="Favorites">
        <Container maxWidth="md">
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            minHeight: '50vh',
            textAlign: 'center',
            py: 4
          }}>
            <Typography variant="h5" gutterBottom>
              Please log in to view your favorites
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/login')}
              sx={{ mt: 2 }}
            >
              Log In
            </Button>
          </Box>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout title="My Favorites">
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <FavoriteIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h5" component="h1">
              My Favorites
            </Typography>
          </Box>

          {/* Filter tabs */}
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ mb: 3 }}
          >
            <Tab label="All" value="all" />
            <Tab label="Venues" value="venue" />
            <Tab label="DJs" value="dj" />
            <Tab label="Catering" value="catering" />
            <Tab label="Entertainment" value="entertainment" />
            <Tab label="Photography" value="photography" />
            <Tab label="Decoration" value="decoration" />
          </Tabs>

          {filteredFavorites.length > 0 ? (
            <Grid container spacing={2}>
              {filteredFavorites.map(favorite => (
                favorite.data && (
                  <Grid item xs={12} sm={6} md={4} key={`${favorite.type}-${favorite.id}`}>
                    <ServiceCard 
                      service={favorite.data} 
                      type={favorite.type} 
                      onClick={() => navigate(`/service/${favorite.type}/${favorite.id}`)}
                    />
                  </Grid>
                )
              ))}
            </Grid>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              py: 6,
              textAlign: 'center'
            }}>
              <EmptyIcon fontSize="large" color="action" sx={{ mb: 2, fontSize: '4rem', opacity: 0.3 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No favorites found
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {currentTab !== 'all' 
                  ? `You haven't added any ${currentTab}s to your favorites yet.`
                  : "You haven't added any services to your favorites yet."}
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => navigate('/find-service')}
                startIcon={<AddIcon />}
                sx={{ mt: 2 }}
              >
                Find Services
              </Button>
            </Box>
          )}
        </Box>
      </Container>
    </Layout>
  );
};

export default FavoritesPage; 