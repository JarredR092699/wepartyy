import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Container,
  Paper
} from '@mui/material';
import { 
  Add as AddIcon, 
  Search as SearchIcon 
} from '@mui/icons-material';
import Layout from '../components/Layout';
import EventCard from '../components/EventCard';
import { events } from '../data/mockData';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  
  // Filter only public events for the featured section
  const featuredEvents = events.filter(event => event.isPublic);
  
  return (
    <Layout title="WeParty">
      <Container maxWidth="sm">
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
          <Box sx={{ mt: 3, width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
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
          </Box>
        </Box>
        
        {/* Featured Events Section */}
        <Box sx={{ mt: 4, mb: 2 }}>
          <Typography variant="h5" component="h2" gutterBottom fontWeight="600">
            Featured Events
          </Typography>
          
          <Grid container spacing={2}>
            {featuredEvents.map((event) => (
              <Grid item xs={12} sm={6} key={event.id}>
                <EventCard 
                  event={event} 
                  onClick={() => {
                    // In a real app, this would navigate to the event details page
                    console.log(`Clicked on event: ${event.id}`);
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

export default HomePage; 