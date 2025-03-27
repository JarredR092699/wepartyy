import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Box,
  Button,
  Chip,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import {
  Public as PublicIcon,
  Lock as LockIcon,
  Event as EventIcon,
  LocationOn as LocationIcon,
  Group as GroupIcon,
  AccessTime as TimeIcon,
  Home as VenueIcon,
  MusicNote as DjIcon,
  Restaurant as CateringIcon,
  PhotoCamera as PhotographyIcon,
  Celebration as EntertainmentIcon,
  ColorLens as DecorationIcon,
  Speaker as AudioVisualIcon,
  Chair as FurnitureIcon,
  LocalBar as BarServiceIcon,
  Security as SecurityIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { format, parseISO } from 'date-fns';
import { getUserId, getUserDisplayName } from '../utils/userUtils';

// Event details page component
const EventDetailsPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  
  // State variables
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Fetch event data
  useEffect(() => {
    if (!eventId) return;
    
    setLoading(true);
    try {
      // In a real app, this would be an API call to fetch event data
      const allEvents = JSON.parse(localStorage.getItem('all-events') || '[]');
      const foundEvent = allEvents.find((e: any) => e.id === eventId);
      
      if (foundEvent) {
        setEvent(foundEvent);
      } else {
        setError('Event not found');
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      setError('Failed to load event details');
    } finally {
      setLoading(false);
    }
  }, [eventId]);
  
  // Check if current user is the event owner
  const isEventOwner = isAuthenticated && currentUser && event?.createdBy === getUserId(currentUser);
  
  // Check if current user is a participant
  const isParticipant = isAuthenticated && currentUser && 
    event?.participants?.some((p: any) => p.userId === getUserId(currentUser));
  
  // Check if current user has a pending request
  const hasPendingRequest = isAuthenticated && currentUser && 
    event?.pendingRequests?.some((r: any) => r.userId === getUserId(currentUser));
  
  // Handle join button click
  const handleJoinClick = () => {
    if (!isAuthenticated) {
      // Redirect to login
      navigate('/login', { state: { redirectUrl: `/event/${eventId}` } });
      return;
    }
    
    if (event.isPublic) {
      // For public events, join directly
      joinEvent();
    } else {
      // For private events, open request dialog
      setJoinDialogOpen(true);
    }
  };
  
  // Join event directly (for public events)
  const joinEvent = () => {
    if (!currentUser) return;
    
    try {
      // In a real app, this would be an API call
      const allEvents = JSON.parse(localStorage.getItem('all-events') || '[]');
      const updatedEvents = allEvents.map((e: any) => {
        if (e.id === eventId) {
          // Add user to participants if not already there
          if (!e.participants.some((p: any) => p.userId === getUserId(currentUser))) {
            return {
              ...e,
              participants: [
                ...e.participants,
                {
                  userId: getUserId(currentUser),
                  name: getUserDisplayName(currentUser),
                  joinedAt: new Date().toISOString()
                }
              ]
            };
          }
        }
        return e;
      });
      
      localStorage.setItem('all-events', JSON.stringify(updatedEvents));
      
      // Update local state
      setEvent(updatedEvents.find((e: any) => e.id === eventId));
      
      setSnackbarMessage('You have successfully joined this event!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error joining event:', error);
      setSnackbarMessage('Failed to join the event. Please try again.');
      setSnackbarOpen(true);
    }
  };
  
  // Submit join request (for private events)
  const submitJoinRequest = () => {
    if (!currentUser) return;
    
    try {
      // In a real app, this would be an API call
      const allEvents = JSON.parse(localStorage.getItem('all-events') || '[]');
      const updatedEvents = allEvents.map((e: any) => {
        if (e.id === eventId) {
          // Add request if not already there
          if (!e.pendingRequests.some((r: any) => r.userId === getUserId(currentUser))) {
            return {
              ...e,
              pendingRequests: [
                ...e.pendingRequests,
                {
                  userId: getUserId(currentUser),
                  name: getUserDisplayName(currentUser),
                  message: requestMessage,
                  requestedAt: new Date().toISOString()
                }
              ]
            };
          }
        }
        return e;
      });
      
      localStorage.setItem('all-events', JSON.stringify(updatedEvents));
      
      // Update local state
      setEvent(updatedEvents.find((e: any) => e.id === eventId));
      
      setSnackbarMessage('Your request to join has been sent!');
      setSnackbarOpen(true);
      setJoinDialogOpen(false);
    } catch (error) {
      console.error('Error submitting request:', error);
      setSnackbarMessage('Failed to submit your request. Please try again.');
      setSnackbarOpen(true);
    }
  };
  
  // Format date display
  const formatEventDate = () => {
    if (!event) return '';
    
    if (event.isMultiDay && event.dateRange?.start && event.dateRange?.end) {
      return `${format(parseISO(event.dateRange.start), 'MMMM d, yyyy')} - ${format(parseISO(event.dateRange.end), 'MMMM d, yyyy')}`;
    } else if (event.date) {
      return format(parseISO(event.date), 'MMMM d, yyyy');
    } else if (event.selectedDates && event.selectedDates.length > 0) {
      // Multiple selected dates
      return `${event.selectedDates.length} dates selected`;
    }
    
    return 'Date information not available';
  };
  
  // If loading
  if (loading) {
    return (
      <Layout title="Event Details">
        <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>Loading event details...</Typography>
        </Container>
      </Layout>
    );
  }
  
  // If error or event not found
  if (error || !event) {
    return (
      <Layout title="Event Details">
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || 'Event not found'}
          </Alert>
          <Button variant="contained" onClick={() => navigate('/')}>
            Return to Home
          </Button>
        </Container>
      </Layout>
    );
  }
  
  // Get service name by ID
  const getServiceName = (serviceType: string, serviceId: string) => {
    // This would get the service name from the actual services list in a real app
    return `${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)} Service`;
  };
  
  // Get service icon based on type
  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'venue': return <VenueIcon />;
      case 'dj': return <DjIcon />;
      case 'catering': return <CateringIcon />;
      case 'entertainment': return <EntertainmentIcon />;
      case 'photography': return <PhotographyIcon />;
      case 'decoration': return <DecorationIcon />;
      case 'audioVisual': return <AudioVisualIcon />;
      case 'furniture': return <FurnitureIcon />;
      case 'barService': return <BarServiceIcon />;
      case 'security': return <SecurityIcon />;
      default: return <EventIcon />;
    }
  };
  
  return (
    <Layout title={event.eventName || 'Event Details'}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Event Header */}
        <Paper sx={{ p: 3, mb: 3, position: 'relative' }}>
          <Typography variant="h4" gutterBottom>{event.eventName}</Typography>
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EventIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">{formatEventDate()}</Typography>
              </Box>
            </Grid>
            
            {event.startTime && event.endTime && (
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TimeIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    {format(parseISO(`2023-01-01T${event.startTime}`), 'h:mm a')} - 
                    {format(parseISO(`2023-01-01T${event.endTime}`), 'h:mm a')}
                  </Typography>
                </Box>
              </Grid>
            )}
            
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <GroupIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">{event.attendees} attendees</Typography>
              </Box>
            </Grid>
          </Grid>
          
          {event.description && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="body1">{event.description}</Typography>
            </Box>
          )}
          
          {/* Action buttons */}
          {!isEventOwner && !isParticipant && !hasPendingRequest && (
            <Box sx={{ mt: 3 }}>
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                onClick={handleJoinClick}
              >
                Join Event
              </Button>
            </Box>
          )}
          
          {hasPendingRequest && (
            <Box sx={{ mt: 3 }}>
              <Alert severity="info">
                Your request to join this event is pending approval from the organizer.
              </Alert>
            </Box>
          )}
          
          {isParticipant && (
            <Box sx={{ mt: 3 }}>
              <Alert severity="success">
                You are registered for this event!
              </Alert>
            </Box>
          )}
          
          {isEventOwner && (
            <Box sx={{ mt: 3 }}>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => navigate('/my-events')}
              >
                Manage Event
              </Button>
            </Box>
          )}
        </Paper>
        
        {/* Event Details */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>Event Details</Typography>
          
          {/* Services Section */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>Services</Typography>
            
            <Grid container spacing={2}>
              {/* Venue */}
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <VenueIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="subtitle1">Venue</Typography>
                  </Box>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {event.useCustomVenue 
                      ? `Custom: ${event.customVenue.name}`
                      : getServiceName('venue', event.venueId)
                    }
                  </Typography>
                  {event.useCustomVenue && event.customVenue.location && (
                    <Typography variant="body2" color="text.secondary">
                      Location: {event.customVenue.location}
                    </Typography>
                  )}
                </Paper>
              </Grid>
              
              {/* DJ */}
              {(event.djId || event.useCustomDJ) && (
                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <DjIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="subtitle1">DJ</Typography>
                    </Box>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      {event.useCustomDJ 
                        ? `Custom: ${event.customDJ.name}`
                        : getServiceName('dj', event.djId)
                      }
                    </Typography>
                    {event.useCustomDJ && event.customDJ.genres && (
                      <Typography variant="body2" color="text.secondary">
                        Genres: {event.customDJ.genres.join(', ')}
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              )}
              
              {/* Catering */}
              {(event.cateringId || event.useCustomCatering) && (
                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CateringIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="subtitle1">Catering</Typography>
                    </Box>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      {event.useCustomCatering 
                        ? `Custom: ${event.customCatering.name}`
                        : getServiceName('catering', event.cateringId)
                      }
                    </Typography>
                    {event.useCustomCatering && event.customCatering.cuisineType && (
                      <Typography variant="body2" color="text.secondary">
                        Cuisine: {event.customCatering.cuisineType.join(', ')}
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              )}
              
              {/* Other services - display only if selected */}
              {['entertainment', 'photography', 'decoration', 'audioVisual', 'furniture', 'barService', 'security']
                .filter(serviceType => 
                  event[`${serviceType}Id`] || event[`useCustom${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}`]
                )
                .map(serviceType => {
                  const capitalizedServiceType = serviceType.charAt(0).toUpperCase() + serviceType.slice(1);
                  const isCustom = event[`useCustom${capitalizedServiceType}`];
                  const customService = event[`custom${capitalizedServiceType}`];
                  
                  return (
                    <Grid item xs={12} sm={6} key={serviceType}>
                      <Paper sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {getServiceIcon(serviceType)}
                          <Typography variant="subtitle1" sx={{ ml: 1 }}>
                            {capitalizedServiceType}
                          </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                          {isCustom 
                            ? `Custom: ${customService.name}`
                            : getServiceName(serviceType, event[`${serviceType}Id`])
                          }
                        </Typography>
                        {isCustom && customService.description && (
                          <Typography variant="body2" color="text.secondary">
                            {customService.description.length > 100 
                              ? customService.description.substring(0, 100) + '...'
                              : customService.description
                            }
                          </Typography>
                        )}
                      </Paper>
                    </Grid>
                  );
                })
              }
            </Grid>
          </Box>
          
          {/* Participants Section (only visible to participants and organizer) */}
          {(isParticipant || isEventOwner) && event.participants && event.participants.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Participants ({event.participants.length})
              </Typography>
              
              <List>
                {event.participants.map((participant: any) => (
                  <ListItem key={participant.userId}>
                    <ListItemAvatar>
                      <Avatar>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={participant.name}
                      secondary={`Joined: ${format(new Date(participant.joinedAt), 'MMM d, yyyy')}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Paper>
      </Container>
      
      {/* Join Request Dialog for private events */}
      <Dialog open={joinDialogOpen} onClose={() => setJoinDialogOpen(false)}>
        <DialogTitle>Request to Join Event</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This is a private event. Please provide a brief message to the organizer about why you'd like to join.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Message (optional)"
            fullWidth
            multiline
            rows={3}
            value={requestMessage}
            onChange={(e) => setRequestMessage(e.target.value)}
            placeholder="Hi! I'd like to join your event because..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setJoinDialogOpen(false)}>Cancel</Button>
          <Button onClick={submitJoinRequest} variant="contained">
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Layout>
  );
};

export default EventDetailsPage; 