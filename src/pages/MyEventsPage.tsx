import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Tabs,
  Tab,
  Button,
  Divider
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import EventCard from '../components/EventCard';
import { events } from '../data/mockData';

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
      id={`events-tabpanel-${index}`}
      aria-labelledby={`events-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const MyEventsPage: React.FC = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  
  // In a real app, these would be filtered based on user data
  // For now, we'll just use the mock data and pretend some are upcoming and some are past
  const upcomingEvents = events.slice(0, 2); // First two events are "upcoming"
  const pastEvents = events.slice(2); // Last event is "past"
  
  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  return (
    <Layout title="My Events">
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h1" fontWeight="bold">
            My Events
          </Typography>
          
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => navigate('/create-event')}
          >
            Create Event
          </Button>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="events tabs"
            >
              <Tab label="Upcoming" />
              <Tab label="Past" />
            </Tabs>
          </Box>
          
          {/* Upcoming Events Tab */}
          <TabPanel value={tabValue} index={0}>
            {upcomingEvents.length > 0 ? (
              <Grid container spacing={3}>
                {upcomingEvents.map((event) => (
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
            ) : (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary" paragraph>
                  You don't have any upcoming events.
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/create-event')}
                >
                  Create Your First Event
                </Button>
              </Box>
            )}
          </TabPanel>
          
          {/* Past Events Tab */}
          <TabPanel value={tabValue} index={1}>
            {pastEvents.length > 0 ? (
              <Grid container spacing={3}>
                {pastEvents.map((event) => (
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
            ) : (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  You don't have any past events.
                </Typography>
              </Box>
            )}
          </TabPanel>
        </Box>
      </Container>
    </Layout>
  );
};

export default MyEventsPage; 