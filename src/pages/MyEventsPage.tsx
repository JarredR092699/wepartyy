import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Tabs,
  Tab,
  Divider,
  Card,
  CardContent,
  CardActions,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  ListItemIcon,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  Event as EventIcon,
  Message as MessageIcon,
  Settings as SettingsIcon,
  MoreVert as MoreVertIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  EventBusy as EventBusyIcon,
  DateRange as DateRangeIcon,
  History as HistoryIcon,
  EventAvailable as EventAvailableIcon,
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateCalendar, PickersDay, PickersDayProps, DatePicker } from '@mui/x-date-pickers';
import { format, parseISO, isToday, isSameDay, addDays, eachDayOfInterval, isSameMonth, startOfMonth, endOfMonth, getDay, addMonths, isWithinInterval, startOfDay } from 'date-fns';

import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { UserRole, Event, venues, djs, cateringServices } from '../data/mockData';

// Interface for event requests
interface EventRequest {
  id: string;
  eventId: string;
  eventName: string;
  date: string;
  clientName: string;
  status: 'pending' | 'accepted' | 'declined';
  message?: string;
}

// Interface for messages
interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  eventId?: string;
  eventName?: string;
  content: string;
  timestamp: string;
  read: boolean;
}

// Mock data for event requests
const mockEventRequests: EventRequest[] = [
  {
    id: 'req1',
    eventId: 'e1',
    eventName: 'Spring Conference',
    date: '2025-03-15',
    clientName: 'Alex Johnson',
    status: 'pending',
    message: 'We would love to have your services at our event. Please let us know if you are available.'
  },
  {
    id: 'req2',
    eventId: 'e2',
    eventName: 'Tech Expo',
    date: '2025-03-22',
    clientName: 'Maria Rodriguez',
    status: 'accepted',
  },
  {
    id: 'req3',
    eventId: 'e3',
    eventName: 'Corporate Retreat',
    date: '2025-03-28',
    clientName: 'John Smith',
    status: 'declined',
    message: 'Unfortunately, I am already booked for another event on this date.'
  }
];

// Mock data for messages
const mockMessages: Message[] = [
  {
    id: 'msg1',
    senderId: 'u2',
    senderName: 'Alex Johnson',
    receiverId: 'u1',
    eventId: 'e1',
    eventName: 'Spring Conference',
    content: 'Hi, I have a question about your availability for our event.',
    timestamp: '2025-03-10T14:30:00Z',
    read: true
  },
  {
    id: 'msg2',
    senderId: 'u3',
    senderName: 'Maria Rodriguez',
    receiverId: 'u1',
    eventId: 'e2',
    eventName: 'Tech Expo',
    content: 'Looking forward to working with you at our event!',
    timestamp: '2025-03-12T10:15:00Z',
    read: false
  }
];

// Mock upcoming events
const mockUpcomingEvents = [
  {
    id: 'e1',
    name: 'Spring Conference',
    date: '2025-03-15',
    venue: 'Skyline Convention Center',
    client: 'Alex Johnson',
    status: 'confirmed'
  },
  {
    id: 'e2',
    name: 'Tech Expo',
    date: '2025-03-22',
    venue: 'Innovation Hub',
    client: 'Maria Rodriguez',
    status: 'confirmed'
  },
  {
    id: 'e3',
    name: 'Corporate Retreat',
    date: '2025-03-28',
    venue: 'Tampa Bay Resort',
    client: 'John Smith',
    status: 'pending'
  }
];

// Mock past events
const mockPastEvents = [
  {
    id: 'p1',
    name: 'Winter Gala',
    date: '2024-12-15',
    venue: 'Grand Ballroom',
    client: 'Emily Chen',
    status: 'completed'
  },
  {
    id: 'p2',
    name: 'Product Launch',
    date: '2024-11-22',
    venue: 'Downtown Convention Center',
    client: 'Michael Brown',
    status: 'completed'
  },
  {
    id: 'p3',
    name: 'Charity Fundraiser',
    date: '2024-10-05',
    venue: 'Bayside Hotel',
    client: 'Sarah Wilson',
    status: 'completed'
  }
];

// Interface for calendar events
interface CalendarEvent {
  id: string;
  date: Date;
  title: string;
  type: 'event' | 'unavailable' | 'available';
  recurring?: boolean;
}

// Create a context for the calendar to share state
interface CalendarContextType {
  selectedDate: Date | null;
  calendarEvents: CalendarEvent[];
  currentMonth: Date;
}

const CalendarContext = React.createContext<CalendarContextType | undefined>(undefined);

// Custom day component for the calendar
const CustomDay = (props: PickersDayProps<Date> & { 
  isEvent?: boolean; 
  isUnavailable?: boolean;
  isAvailable?: boolean;
}) => {
  const { isEvent, isUnavailable, isAvailable, ...other } = props;
  
  let backgroundColor = 'transparent';
  if (isEvent) backgroundColor = '#90caf9'; // Blue for booked
  if (isUnavailable) backgroundColor = '#ef9a9a'; // Red for unavailable
  if (isAvailable) backgroundColor = '#c8e6c9'; // Green for available
  
  return (
    <PickersDay
      {...other}
      disableMargin
      sx={{
        backgroundColor,
        '&:hover': {
          backgroundColor: isEvent ? '#64b5f6' : isUnavailable ? '#e57373' : '#a5d6a7',
        },
        borderRadius: '50%',
      }}
    />
  );
};

const MyEventsPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // State for event requests and responses
  const [eventRequests, setEventRequests] = useState<EventRequest[]>(mockEventRequests);
  const [upcomingEvents, setUpcomingEvents] = useState(mockUpcomingEvents);
  const [pastEvents, setPastEvents] = useState(mockPastEvents);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  
  // State for event view mode
  const [eventViewMode, setEventViewMode] = useState<'upcoming' | 'past'>('upcoming');
  
  // State for event management menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const menuOpen = Boolean(anchorEl);
  
  // Check if user is logged in and redirect if not
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
  }, [currentUser, navigate]);
  
  // Handle event menu opening
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, eventId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedEventId(eventId);
  };
  
  // Handle event menu closing
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  // Handle event request response
  const handleEventRequestResponse = (requestId: string, accept: boolean) => {
    setEventRequests(eventRequests.map(request => 
      request.id === requestId 
        ? { ...request, status: accept ? 'accepted' : 'declined' } 
        : request
    ));
  };
  
  // Get service type display name
  const getServiceTypeDisplayName = (role: UserRole): string => {
    switch (role) {
      case 'dj':
        return 'DJ Services';
      case 'caterer':
        return 'Catering Services';
      case 'venue':
        return 'Venue Rental';
      case 'photography':
        return 'Photography Services';
      case 'entertainment':
        return 'Entertainment';
      case 'decoration':
        return 'Decoration Services';
      case 'audioVisual':
        return 'Audio Visual Services';
      case 'furniture':
        return 'Furniture Rental';
      case 'barService':
        return 'Bar Services';
      case 'security':
        return 'Security Services';
      default:
        return 'Services';
    }
  };
  
  // Handle event view mode change
  const handleEventViewModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: 'upcoming' | 'past' | null,
  ) => {
    if (newMode !== null) {
      setEventViewMode(newMode);
    }
  };
  
  return (
    <Layout title="WeParty">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
              {currentUser?.name?.charAt(0) || 'U'}
            </Avatar>
            <Box>
              <Typography variant="h5" component="h1">
                Welcome, {currentUser?.name || 'User'}!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currentUser && getServiceTypeDisplayName(currentUser.role)} My Events
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Paper elevation={0} sx={{ p: 2, flex: 1, minWidth: 120, bgcolor: 'info.light', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ color: 'white' }}>
                {eventRequests.filter(r => r.status === 'pending').length}
              </Typography>
              <Typography variant="body2" sx={{ color: 'white' }}>
                New Requests
              </Typography>
            </Paper>
            
            <Paper elevation={0} sx={{ p: 2, flex: 1, minWidth: 120, bgcolor: 'success.light', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ color: 'white' }}>
                {upcomingEvents.filter(e => e.status === 'confirmed').length}
              </Typography>
              <Typography variant="body2" sx={{ color: 'white' }}>
                Confirmed Events
              </Typography>
            </Paper>
            
            <Paper elevation={0} sx={{ p: 2, flex: 1, minWidth: 120, bgcolor: 'warning.light', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ color: 'white' }}>
                {upcomingEvents.filter(e => e.status === 'pending').length}
              </Typography>
              <Typography variant="body2" sx={{ color: 'white' }}>
                Pending Events
              </Typography>
            </Paper>
          </Box>
        </Paper>
        
        <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Event Requests
          </Typography>
          
          {eventRequests.filter(r => r.status === 'pending').length > 0 ? (
            <List>
              {eventRequests
                .filter(request => request.status === 'pending')
                .map(request => (
                <ListItem
                  key={request.id}
                  secondaryAction={
                    <Box>
                      <IconButton 
                        color="success" 
                        onClick={() => handleEventRequestResponse(request.id, true)}
                      >
                        <CheckIcon />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleEventRequestResponse(request.id, false)}
                      >
                        <CloseIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>
                      {request.clientName.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={request.eventName}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {request.clientName}
                        </Typography>
                        {` — ${format(new Date(request.date), 'MMMM d, yyyy')}`}
                        <br />
                        {request.message && (
                          <Typography variant="body2" color="text.secondary">
                            {request.message}
                          </Typography>
                        )}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No pending event requests.
            </Typography>
          )}
        </Paper>
        
        <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              {eventViewMode === 'upcoming' ? 'Upcoming Events' : 'Past Events'}
            </Typography>
            <ToggleButtonGroup
              value={eventViewMode}
              exclusive
              onChange={handleEventViewModeChange}
              aria-label="event view mode"
              size="small"
            >
              <ToggleButton value="upcoming" aria-label="upcoming events">
                <EventAvailableIcon sx={{ mr: 1 }} />
                Upcoming
              </ToggleButton>
              <ToggleButton value="past" aria-label="past events">
                <HistoryIcon sx={{ mr: 1 }} />
                Past
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
          
          {eventViewMode === 'upcoming' ? (
            upcomingEvents.length > 0 ? (
              <Grid container spacing={3}>
                {upcomingEvents.map(event => (
                  <Grid item xs={12} sm={6} md={4} key={event.id}>
                    <Card elevation={1}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Typography variant="h6" component="div">
                            {event.name}
                          </Typography>
                          <IconButton
                            aria-label="more"
                            id={`event-menu-button-${event.id}`}
                            aria-controls={menuOpen ? 'event-menu' : undefined}
                            aria-expanded={menuOpen ? 'true' : undefined}
                            aria-haspopup="true"
                            onClick={(e) => handleMenuOpen(e, event.id)}
                            size="small"
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </Box>
                        
                        <Chip
                          label={event.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                          color={event.status === 'confirmed' ? 'success' : 'warning'}
                          size="small"
                          sx={{ mb: 1 }}
                        />
                        
                        <Typography color="text.secondary" gutterBottom>
                          Date: {format(new Date(event.date), 'MMMM d, yyyy')}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary">
                          Venue: {event.venue}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary">
                          Client: {event.client}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button 
                          size="small" 
                          startIcon={<VisibilityIcon />}
                          onClick={() => navigate(`/event/${event.id}`)}
                        >
                          View Details
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No upcoming events scheduled.
              </Typography>
            )
          ) : (
            // Past events view
            pastEvents.length > 0 ? (
              <Grid container spacing={3}>
                {pastEvents.map(event => (
                  <Grid item xs={12} sm={6} md={4} key={event.id}>
                    <Card elevation={1}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Typography variant="h6" component="div">
                            {event.name}
                          </Typography>
                          <IconButton
                            aria-label="more"
                            id={`event-menu-button-${event.id}`}
                            aria-controls={menuOpen ? 'event-menu' : undefined}
                            aria-expanded={menuOpen ? 'true' : undefined}
                            aria-haspopup="true"
                            onClick={(e) => handleMenuOpen(e, event.id)}
                            size="small"
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </Box>
                        
                        <Chip
                          label="Completed"
                          color="default"
                          size="small"
                          sx={{ mb: 1 }}
                        />
                        
                        <Typography color="text.secondary" gutterBottom>
                          Date: {format(new Date(event.date), 'MMMM d, yyyy')}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary">
                          Venue: {event.venue}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary">
                          Client: {event.client}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button 
                          size="small" 
                          startIcon={<VisibilityIcon />}
                          onClick={() => navigate(`/event/${event.id}`)}
                        >
                          View Details
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No past events found.
              </Typography>
            )
          )}
          
          <Menu
            id="event-menu"
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            MenuListProps={{
              'aria-labelledby': 'event-menu-button',
            }}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={() => {
              navigate(`/event/${selectedEventId}`);
              handleMenuClose();
            }}>
              <ListItemIcon>
                <VisibilityIcon fontSize="small" />
              </ListItemIcon>
              View Details
            </MenuItem>
            {eventViewMode === 'upcoming' && (
              <>
                <MenuItem onClick={handleMenuClose}>
                  <ListItemIcon>
                    <EditIcon fontSize="small" />
                  </ListItemIcon>
                  Edit Event Notes
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <ListItemIcon>
                    <DeleteIcon fontSize="small" color="error" />
                  </ListItemIcon>
                  <Typography color="error">Cancel Event</Typography>
                </MenuItem>
              </>
            )}
          </Menu>
        </Paper>
      </Container>
    </Layout>
  );
};

export default MyEventsPage; 