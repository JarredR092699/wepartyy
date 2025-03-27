import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  InputAdornment,
  Chip,
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Slider,
  Checkbox,
  FormGroup,
  FormControlLabel,
  IconButton,
  Badge,
  Tooltip,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Event as EventIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Add as AddIcon,
  Close as CloseIcon,
  CalendarMonth as CalendarIcon,
  AccessTime as TimeIcon,
  Tag as TagIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

import Layout from '../components/Layout';
import { events, venues, djs, cateringServices, eventAttendees, eventRatings, Event } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { getUserId } from '../utils/userUtils';

// Define filter state interface
interface FilterState {
  searchQuery: string;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  location: string;
  eventTags: string[];
  priceRange: [number, number];
  venueTypes: string[];
  djGenres: string[];
  onlyFreeEvents: boolean;
  sortBy: 'date' | 'price' | 'rating' | 'popularity';
}

const DiscoverEventsPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // State for filtered events
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Initialize filter state
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    dateRange: {
      start: null,
      end: null
    },
    location: '',
    eventTags: [],
    priceRange: [0, 200],
    venueTypes: [],
    djGenres: [],
    onlyFreeEvents: false,
    sortBy: 'date'
  });
  
  // Get all unique event tags from events
  const allEventTags = Array.from(
    new Set(
      events
        .filter(event => event.eventTags)
        .flatMap(event => event.eventTags || [])
    )
  );
  
  // Get all venue types
  const allVenueTypes = Array.from(
    new Set(
      venues.map(venue => venue.type)
    )
  );
  
  // Get all DJ genres
  const allDjGenres = Array.from(
    new Set(
      djs.flatMap(dj => dj.genres)
    )
  );
  
  // Filter events based on current filters
  useEffect(() => {
    // All events are now public, so we don't filter by isPublic anymore
    let result = events;
    
    // Apply search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(event => 
        event.name.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        (event.eventTags && event.eventTags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    // Apply date range filter
    if (filters.dateRange.start) {
      result = result.filter(event => {
        const eventDate = parseISO(event.date);
        return eventDate >= filters.dateRange.start!;
      });
    }
    
    if (filters.dateRange.end) {
      result = result.filter(event => {
        const eventDate = parseISO(event.date);
        return eventDate <= filters.dateRange.end!;
      });
    }
    
    // Apply location filter
    if (filters.location) {
      const locationQuery = filters.location.toLowerCase();
      result = result.filter(event => 
        event.location?.toLowerCase().includes(locationQuery)
      );
    }
    
    // Apply event tags filter
    if (filters.eventTags.length > 0) {
      result = result.filter(event => 
        event.eventTags && 
        filters.eventTags.some(tag => event.eventTags?.includes(tag))
      );
    }
    
    // Apply price filter
    result = result.filter(event => 
      (event.ticketPrice || 0) >= filters.priceRange[0] && 
      (event.ticketPrice || 0) <= filters.priceRange[1]
    );
    
    // Apply free events filter
    if (filters.onlyFreeEvents) {
      result = result.filter(event => !event.ticketPrice || event.ticketPrice === 0);
    }
    
    // Apply venue type filter
    if (filters.venueTypes.length > 0) {
      result = result.filter(event => {
        const eventVenue = venues.find(venue => venue.id === event.venue);
        return eventVenue && filters.venueTypes.includes(eventVenue.type);
      });
    }
    
    // Apply DJ genre filter
    if (filters.djGenres.length > 0) {
      result = result.filter(event => {
        const eventDj = djs.find(dj => dj.id === event.dj);
        return eventDj && eventDj.genres.some(genre => filters.djGenres.includes(genre));
      });
    }
    
    // Apply sorting
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'date':
          return parseISO(a.date).getTime() - parseISO(b.date).getTime();
        case 'price':
          return (a.ticketPrice || 0) - (b.ticketPrice || 0);
        case 'rating': {
          const aRatings = eventRatings.filter(rating => rating.eventId === a.id);
          const bRatings = eventRatings.filter(rating => rating.eventId === b.id);
          const aAvgRating = aRatings.length > 0 
            ? aRatings.reduce((sum, r) => sum + r.rating, 0) / aRatings.length 
            : 0;
          const bAvgRating = bRatings.length > 0 
            ? bRatings.reduce((sum, r) => sum + r.rating, 0) / bRatings.length 
            : 0;
          return bAvgRating - aAvgRating;
        }
        case 'popularity':
          return b.attendees - a.attendees;
        default:
          return 0;
      }
    });
    
    setFilteredEvents(result);
  }, [filters]);
  
  // Handle filter changes
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({
      ...prev,
      searchQuery: event.target.value
    }));
  };
  
  const handleDateRangeChange = (type: 'start' | 'end', date: Date | null) => {
    setFilters(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [type]: date
      }
    }));
  };
  
  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({
      ...prev,
      location: event.target.value
    }));
  };
  
  const handleTagToggle = (tag: string) => {
    setFilters(prev => {
      const newTags = prev.eventTags.includes(tag)
        ? prev.eventTags.filter(t => t !== tag)
        : [...prev.eventTags, tag];
      
      return {
        ...prev,
        eventTags: newTags
      };
    });
  };
  
  const handlePriceRangeChange = (event: React.ChangeEvent<Event>, newValue: number | number[]) => {
    setFilters(prev => ({
      ...prev,
      priceRange: newValue as [number, number]
    }));
  };
  
  const handleFreeEventsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({
      ...prev,
      onlyFreeEvents: event.target.checked
    }));
  };
  
  const handleVenueTypeChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    setFilters(prev => ({
      ...prev,
      venueTypes: value
    }));
  };
  
  const handleDjGenreChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    setFilters(prev => ({
      ...prev,
      djGenres: value
    }));
  };
  
  const handleSortChange = (event: SelectChangeEvent) => {
    setFilters(prev => ({
      ...prev,
      sortBy: event.target.value as FilterState['sortBy']
    }));
  };
  
  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      dateRange: {
        start: null,
        end: null
      },
      location: '',
      eventTags: [],
      priceRange: [0, 200],
      venueTypes: [],
      djGenres: [],
      onlyFreeEvents: false,
      sortBy: 'date'
    });
  };
  
  // Handle join event
  const handleJoinEvent = (eventId: string) => {
    if (!currentUser) {
      setSnackbarMessage('Please log in to join events');
      setSnackbarOpen(true);
      return;
    }
    
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    // Check if user is already attending or has a pending request
    const existingAttendee = eventAttendees.find(
      (a: { eventId: string; userId: string; status?: string }) => a.eventId === eventId && a.userId === getUserId(currentUser)
    );
    
    if (existingAttendee) {
      if (existingAttendee.status === 'approved') {
        setSnackbarMessage('You are already attending this event');
      } else if (existingAttendee.status === 'pending') {
        setSnackbarMessage('Your request to join this event is pending approval');
      } else if (existingAttendee.status === 'declined') {
        setSnackbarMessage('Your request to join this event was declined');
      }
      setSnackbarOpen(true);
      return;
    }
    
    // Check if event is at capacity
    const approvedAttendees = eventAttendees.filter(
      a => a.eventId === eventId && a.status === 'approved'
    ).length;
    
    if (approvedAttendees >= event.capacity) {
      setSnackbarMessage('This event is at full capacity');
      setSnackbarOpen(true);
      return;
    }
    
    // In a real app, this would make an API call to join the event
    // For now, we'll just show a success message
    if (event.joinApprovalRequired) {
      setSnackbarMessage('Request to join sent! Waiting for approval from event creator');
    } else {
      setSnackbarMessage('You have successfully joined the event!');
    }
    setSnackbarOpen(true);
  };
  
  // Render event card
  const renderEventCard = (event: Event) => {
    const eventVenue = venues.find(venue => venue.id === event.venue);
    const eventDj = djs.find(dj => dj.id === event.dj);
    const eventRatingsList = eventRatings.filter(rating => rating.eventId === event.id);
    const avgRating = eventRatingsList.length > 0
      ? eventRatingsList.reduce((sum, r) => sum + r.rating, 0) / eventRatingsList.length
      : 0;
    
    // Check if event is at capacity
    const approvedAttendees = eventAttendees.filter(
      a => a.eventId === event.id && a.status === 'approved'
    ).length;
    const isAtCapacity = approvedAttendees >= event.capacity;
    
    // Check if current user is attending
    const userAttendance = currentUser && eventAttendees.find(
      (a: { eventId: string; userId: string; status?: string }) => a.eventId === event.id && a.userId === getUserId(currentUser)
    );
    
    return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardMedia
          component="img"
          height="140"
          image={event.image || '/events/default.jpg'}
          alt={event.name}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="div" gutterBottom>
            {event.name}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <CalendarIcon fontSize="small" color="action" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {format(parseISO(event.date), 'EEEE, MMMM d, yyyy')}
            </Typography>
          </Box>
          
          {event.time && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TimeIcon fontSize="small" color="action" sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {event.time}
              </Typography>
            </Box>
          )}
          
          {event.location && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationIcon fontSize="small" color="action" sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {event.location}
              </Typography>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <PeopleIcon fontSize="small" color="action" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {approvedAttendees} / {event.capacity} attendees
            </Typography>
          </Box>
          
          {event.ticketPrice !== undefined && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <MoneyIcon fontSize="small" color="action" sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {event.ticketPrice === 0 ? 'Free' : `$${event.ticketPrice}`}
              </Typography>
            </Box>
          )}
          
          {avgRating > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <StarIcon fontSize="small" color="warning" sx={{ mr: 0.5 }} />
              <Typography variant="body2" color="text.secondary">
                {avgRating.toFixed(1)} ({eventRatingsList.length} {eventRatingsList.length === 1 ? 'review' : 'reviews'})
              </Typography>
            </Box>
          )}
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 1 }}>
            {event.description.length > 100 
              ? `${event.description.substring(0, 100)}...` 
              : event.description}
          </Typography>
          
          {event.eventTags && event.eventTags.length > 0 && (
            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {event.eventTags.map(tag => (
                <Chip 
                  key={tag} 
                  label={tag} 
                  size="small" 
                  variant="outlined"
                  onClick={() => handleTagToggle(tag)}
                />
              ))}
            </Box>
          )}
        </CardContent>
        
        <Divider />
        
        <CardActions>
          <Button 
            size="small" 
            onClick={() => navigate(`/events/${event.id}`)}
          >
            View Details
          </Button>
          
          <Box sx={{ flexGrow: 1 }} />
          
          {userAttendance ? (
            <Tooltip title={
              userAttendance.status === 'approved' 
                ? 'You are attending this event' 
                : userAttendance.status === 'pending'
                ? 'Your request is pending'
                : 'Your request was declined'
            }>
              <Chip 
                label={
                  userAttendance.status === 'approved' 
                    ? 'Attending' 
                    : userAttendance.status === 'pending'
                    ? 'Pending'
                    : 'Declined'
                }
                color={
                  userAttendance.status === 'approved' 
                    ? 'success' 
                    : userAttendance.status === 'pending'
                    ? 'warning'
                    : 'error'
                }
                size="small"
              />
            </Tooltip>
          ) : (
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => handleJoinEvent(event.id)}
              disabled={isAtCapacity}
              color="primary"
            >
              {isAtCapacity ? 'Full' : event.joinApprovalRequired ? 'Request to Join' : 'Join'}
            </Button>
          )}
        </CardActions>
      </Card>
    );
  };
  
  return (
    <Layout title="Discover Events">
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Discover Events
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Find and join public events in your area
          </Typography>
        </Box>
        
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TextField
              fullWidth
              placeholder="Search events by name, description, or tags"
              variant="outlined"
              value={filters.searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
              sx={{ mr: 2 }}
            />
            
            <Button
              variant={showFilters ? "contained" : "outlined"}
              startIcon={<FilterIcon />}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
            </Button>
          </Box>
          
          {showFilters && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <DatePicker
                        label="From Date"
                        value={filters.dateRange.start}
                        onChange={(date) => handleDateRangeChange('start', date)}
                        slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                      />
                      <DatePicker
                        label="To Date"
                        value={filters.dateRange.end}
                        onChange={(date) => handleDateRangeChange('end', date)}
                        slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                      />
                    </Box>
                  </LocalizationProvider>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Location"
                    variant="outlined"
                    size="small"
                    value={filters.location}
                    onChange={handleLocationChange}
                    placeholder="Filter by location"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationIcon />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Venue Type</InputLabel>
                    <Select
                      multiple
                      value={filters.venueTypes}
                      onChange={handleVenueTypeChange}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {(selected as string[]).map((value) => (
                            <Chip key={value} label={value} size="small" />
                          ))}
                        </Box>
                      )}
                    >
                      {allVenueTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>DJ Genre</InputLabel>
                    <Select
                      multiple
                      value={filters.djGenres}
                      onChange={handleDjGenreChange}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {(selected as string[]).map((value) => (
                            <Chip key={value} label={value} size="small" />
                          ))}
                        </Box>
                      )}
                    >
                      {allDjGenres.map((genre) => (
                        <MenuItem key={genre} value={genre}>
                          {genre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography gutterBottom>Price Range</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ mr: 2 }}>
                      ${filters.priceRange[0]}
                    </Typography>
                    <Slider
                      value={filters.priceRange}
                      onChange={(event, newValue) => {
                        setFilters(prev => ({
                          ...prev,
                          priceRange: newValue as [number, number]
                        }));
                      }}
                      valueLabelDisplay="auto"
                      min={0}
                      max={200}
                      sx={{ mx: 2 }}
                    />
                    <Typography variant="body2" sx={{ ml: 2 }}>
                      ${filters.priceRange[1]}
                    </Typography>
                  </Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={filters.onlyFreeEvents}
                        onChange={handleFreeEventsChange}
                      />
                    }
                    label="Show only free events"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Typography gutterBottom>Event Tags</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {allEventTags.map(tag => (
                      <Chip
                        key={tag}
                        label={tag}
                        onClick={() => handleTagToggle(tag)}
                        color={filters.eventTags.includes(tag) ? "primary" : "default"}
                        variant={filters.eventTags.includes(tag) ? "filled" : "outlined"}
                      />
                    ))}
                  </Box>
                </Grid>
                
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <FormControl sx={{ minWidth: 200 }} size="small">
                    <InputLabel>Sort By</InputLabel>
                    <Select
                      value={filters.sortBy}
                      onChange={handleSortChange}
                      label="Sort By"
                    >
                      <MenuItem value="date">Date (Soonest First)</MenuItem>
                      <MenuItem value="price">Price (Low to High)</MenuItem>
                      <MenuItem value="rating">Rating (High to Low)</MenuItem>
                      <MenuItem value="popularity">Popularity</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <Button
                    variant="outlined"
                    onClick={handleResetFilters}
                    startIcon={<CloseIcon />}
                  >
                    Reset Filters
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}
        </Paper>
        
        {filteredEvents.length > 0 ? (
          <Grid container spacing={3}>
            {filteredEvents.map(event => (
              <Grid item key={event.id} xs={12} sm={6} md={4}>
                {renderEventCard(event)}
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <EventIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No events found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your filters or search criteria
            </Typography>
            <Button
              variant="outlined"
              onClick={handleResetFilters}
              sx={{ mt: 2 }}
            >
              Reset Filters
            </Button>
          </Paper>
        )}
      </Container>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={() => setSnackbarOpen(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Layout>
  );
};

export default DiscoverEventsPage; 