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

const ServiceProviderDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, isVendor } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [eventsForSelectedDate, setEventsForSelectedDate] = useState<CalendarEvent[]>([]);
  const [eventRequests, setEventRequests] = useState<EventRequest[]>(mockEventRequests);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [upcomingEvents, setUpcomingEvents] = useState(mockUpcomingEvents);
  
  // If not a vendor, redirect to homepage
  useEffect(() => {
    if (!isVendor) {
      navigate('/');
    }
  }, [isVendor, navigate]);
  
  // Menu state
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  
  // Dialog states
  const [openUnavailabilityDialog, setOpenUnavailabilityDialog] = useState(false);
  const [unavailabilityDate, setUnavailabilityDate] = useState<Date | null>(null);
  const [openMessageDialog, setOpenMessageDialog] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [selectedMessageEventId, setSelectedMessageEventId] = useState<string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  // Add new state for date range selection and recurring unavailability
  const [isRangeSelection, setIsRangeSelection] = useState(false);
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2025, 2, 1)); // March 2025

  // Add new state for confirmation dialog
  const [confirmUnavailabilityDialog, setConfirmUnavailabilityDialog] = useState(false);
  const [dateToMarkUnavailable, setDateToMarkUnavailable] = useState<Date | null>(null);

  // Initialize calendar events
  useEffect(() => {
    // Convert upcoming events to calendar events
    const events: CalendarEvent[] = upcomingEvents.map(event => ({
      id: event.id,
      title: event.name,
      date: parseISO(event.date),
      type: 'event'
    }));

    // Add some mock unavailable dates for March 2025
    const unavailableDates = [
      new Date(2025, 2, 5),  // March 5, 2025
      new Date(2025, 2, 10), // March 10, 2025
      new Date(2025, 2, 18)  // March 18, 2025
    ];

    const unavailableEvents: CalendarEvent[] = unavailableDates.map((date, index) => ({
      id: `unavailable-${index}`,
      title: 'Unavailable',
      date,
      type: 'unavailable'
    }));
    
    // Add available dates (all days in March 2025 that are not events or unavailable)
    const availableEvents: CalendarEvent[] = [];
    const startOfMarch = new Date(2025, 2, 1);
    const endOfMarch = new Date(2025, 2, 31);
    
    let currentDate = startOfMarch;
    while (currentDate <= endOfMarch) {
      const currentDateCopy = new Date(currentDate);
      
      // Check if this date is already an event or unavailable
      const isEventDate = events.some(event => isSameDay(event.date, currentDateCopy));
      const isUnavailableDate = unavailableEvents.some(event => isSameDay(event.date, currentDateCopy));
      
      if (!isEventDate && !isUnavailableDate) {
        availableEvents.push({
          id: `available-${format(currentDateCopy, 'yyyy-MM-dd')}`,
          title: 'Available',
          date: currentDateCopy,
          type: 'available'
        });
      }
      
      currentDate = addDays(currentDate, 1);
    }

    setCalendarEvents([...events, ...unavailableEvents, ...availableEvents]);
  }, [upcomingEvents]);

  // Update events for selected date when date changes
  useEffect(() => {
    if (selectedDate) {
      const eventsOnDate = calendarEvents.filter(event => 
        isSameDay(event.date, selectedDate)
      );
      setEventsForSelectedDate(eventsOnDate);
    } else {
      setEventsForSelectedDate([]);
    }
  }, [selectedDate, calendarEvents]);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Handle date change in calendar
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  // Handle event menu open
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, eventId: string) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedEventId(eventId);
  };

  // Handle event menu close
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedEventId(null);
  };

  // Handle event request response
  const handleEventRequestResponse = (requestId: string, accept: boolean) => {
    setEventRequests(prevRequests => 
      prevRequests.map(request => 
        request.id === requestId 
          ? { ...request, status: accept ? 'accepted' : 'declined' } 
          : request
      )
    );
  };

  // Handle mark unavailable
  const handleMarkUnavailable = () => {
    setUnavailabilityDate(selectedDate);
    setOpenUnavailabilityDialog(true);
  };

  // Handle confirm unavailability
  const handleConfirmUnavailability = () => {
    if (unavailabilityDate) {
      const newUnavailableEvent: CalendarEvent = {
        id: `unavailable-${Date.now()}`,
        title: 'Unavailable',
        date: unavailabilityDate,
        type: 'unavailable'
      };
      
      setCalendarEvents(prev => [...prev, newUnavailableEvent]);
    }
    setOpenUnavailabilityDialog(false);
  };

  // Handle open message dialog
  const handleOpenMessageDialog = (eventId: string, clientId: string) => {
    setSelectedMessageEventId(eventId);
    setSelectedClientId(clientId);
    setOpenMessageDialog(true);
  };

  // Handle send message
  const handleSendMessage = () => {
    if (messageText.trim() && selectedMessageEventId && selectedClientId && currentUser) {
      const newMessage: Message = {
        id: `m${Date.now()}`,
        senderId: currentUser.id,
        senderName: currentUser.name,
        receiverId: selectedClientId,
        eventId: selectedMessageEventId,
        eventName: upcomingEvents.find(e => e.id === selectedMessageEventId)?.name,
        content: messageText,
        timestamp: new Date().toISOString(),
        read: false
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessageText('');
      setOpenMessageDialog(false);
    }
  };

  // Get service type display name
  const getServiceTypeDisplayName = (role: UserRole): string => {
    switch (role) {
      case 'venue': return 'Venue Provider';
      case 'dj': return 'DJ';
      case 'caterer': return 'Caterer';
      case 'entertainment': return 'Entertainment Provider';
      case 'photography': return 'Photography Provider';
      case 'decoration': return 'Decoration Provider';
      case 'audioVisual': return 'Audio Visual Provider';
      case 'furniture': return 'Furniture Provider';
      case 'barService': return 'Bar Service Provider';
      case 'security': return 'Security Provider';
      case 'multiple': return 'Multiple Service Provider';
      default: return 'Service Provider';
    }
  };

  // Helper functions for calendar functionality
  const isDateEvent = (date: Date) => {
    return calendarEvents.some(event => 
      event.type === 'event' && isSameDay(date, event.date)
    );
  };
  
  const isDateUnavailable = (date: Date) => {
    return calendarEvents.some(event => 
      event.type === 'unavailable' && isSameDay(date, event.date)
    );
  };
  
  const isDateAvailable = (date: Date) => {
    return calendarEvents.some(event => 
      event.type === 'available' && isSameDay(date, event.date)
    );
  };
  
  const handleDateClick = (date: Date) => {
    if (isRangeSelection) {
      if (!rangeStart) {
        // Start of range selection
        setRangeStart(date);
      } else {
        // End of range selection - show confirmation dialog
        setDateToMarkUnavailable(date);
        setConfirmUnavailabilityDialog(true);
      }
    } else {
      // Single date selection - show confirmation dialog
      if (isDateUnavailable(date)) {
        // Remove unavailability and add as available
        const filteredEvents = calendarEvents.filter(event => 
          !(event.type === 'unavailable' && isSameDay(event.date, date))
        );
        
        // Add as available
        const newAvailableEvent = {
          id: `available-${format(date, 'yyyy-MM-dd')}`,
          date,
          title: 'Available',
          type: 'available' as const
        };
        
        setCalendarEvents([...filteredEvents, newAvailableEvent]);
      } else if (!isDateEvent(date)) {
        // Show confirmation dialog
        setDateToMarkUnavailable(date);
        setConfirmUnavailabilityDialog(true);
      }
    }
  };
  
  // Handle confirmation of unavailability for the new dialog
  const handleConfirmUnavailabilityNew = () => {
    if (isRangeSelection && rangeStart && dateToMarkUnavailable) {
      const start = startOfDay(rangeStart);
      const end = startOfDay(dateToMarkUnavailable);
      
      // Ensure start is before end
      const [rangeStartDate, rangeEndDate] = start <= end ? [start, end] : [end, start];
      
      // Create unavailable events for each day in the range
      let currentDate = rangeStartDate;
      const newEvents: CalendarEvent[] = [];
      
      while (currentDate <= rangeEndDate) {
        if (!isDateEvent(currentDate)) {
          newEvents.push({
            id: `unavailable-${format(currentDate, 'yyyy-MM-dd')}`,
            date: new Date(currentDate),
            title: 'Unavailable',
            type: 'unavailable',
            recurring: false
          });
        }
        currentDate = addDays(currentDate, 1);
      }
      
      // Filter out any existing unavailable or available events in this range
      const filteredEvents = calendarEvents.filter(event => {
        if (event.type === 'unavailable' || event.type === 'available') {
          return !isWithinInterval(event.date, { start: rangeStartDate, end: rangeEndDate });
        }
        return true;
      });
      
      setCalendarEvents([...filteredEvents, ...newEvents]);
      setRangeStart(null);
      setIsRangeSelection(false);
    } else if (dateToMarkUnavailable) {
      // Single date selection
      // Remove any available event for this date
      const filteredEvents = calendarEvents.filter(event => 
        !(event.type === 'available' && isSameDay(event.date, dateToMarkUnavailable))
      );
      
      // Add as unavailable
      setCalendarEvents([
        ...filteredEvents,
        {
          id: `unavailable-${format(dateToMarkUnavailable, 'yyyy-MM-dd')}`,
          date: dateToMarkUnavailable,
          title: 'Unavailable',
          type: 'unavailable',
          recurring: false
        }
      ]);
    }
    
    setConfirmUnavailabilityDialog(false);
    setDateToMarkUnavailable(null);
  };
  
  // Cancel unavailability marking
  const handleCancelUnavailability = () => {
    setConfirmUnavailabilityDialog(false);
    setDateToMarkUnavailable(null);
    if (isRangeSelection) {
      setRangeStart(null);
      setIsRangeSelection(false);
    }
  };

  // Render calendar tab
  const renderCalendarTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Calendar</Typography>
            <Button 
              variant={isRangeSelection ? "contained" : "outlined"}
              startIcon={<DateRangeIcon />}
              size="small"
              onClick={() => {
                setIsRangeSelection(!isRangeSelection);
                setRangeStart(null);
              }}
            >
              {isRangeSelection ? "Cancel Range" : "Select Range"}
            </Button>
          </Box>
          
          <CalendarContext.Provider value={{ selectedDate, calendarEvents, currentMonth }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateCalendar 
                value={selectedDate}
                onChange={(newDate) => {
                  setSelectedDate(newDate);
                  if (newDate) {
                    handleDateClick(newDate);
                  }
                }}
                onMonthChange={(newMonth) => setCurrentMonth(newMonth)}
                views={['day']}
                openTo="day"
                slots={{
                  day: (props) => {
                    const isEventDay = isDateEvent(props.day);
                    const isUnavailableDay = isDateUnavailable(props.day);
                    const isAvailableDay = isDateAvailable(props.day);
                    
                    return (
                      <CustomDay
                        {...props}
                        isEvent={isEventDay}
                        isUnavailable={isUnavailableDay}
                        isAvailable={isAvailableDay}
                      />
                    );
                  }
                }}
              />
            </LocalizationProvider>
          </CalendarContext.Provider>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Legend:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#90caf9' }} />
                <Typography variant="body2" color="text.secondary">Booked</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ef9a9a' }} />
                <Typography variant="body2" color="text.secondary">Unavailable</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#c8e6c9' }} />
                <Typography variant="body2" color="text.secondary">Available</Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
          </Typography>
          
          {selectedDate && (
            <Box sx={{ mb: 2 }}>
              {isDateUnavailable(selectedDate) ? (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography color="error" variant="body2">
                    You are marked as unavailable on this date
                  </Typography>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    color="primary"
                    onClick={() => {
                      setCalendarEvents(calendarEvents.filter(event => 
                        !(event.type === 'unavailable' && isSameDay(event.date, selectedDate))
                      ));
                    }}
                  >
                    Make Available
                  </Button>
                </Box>
              ) : isDateEvent(selectedDate) ? (
                <Typography color="primary" variant="body2">
                  You have events scheduled on this date
                </Typography>
              ) : (
                <Typography color="success.main" variant="body2">
                  You are available on this date
                </Typography>
              )}
            </Box>
          )}
          
          {eventsForSelectedDate.length > 0 ? (
            <List>
              {eventsForSelectedDate.map((event) => (
                <ListItem
                  key={event.id}
                  secondaryAction={
                    event.type === 'event' && (
                      <IconButton edge="end" onClick={(e) => handleMenuOpen(e, event.id)}>
                        <MoreVertIcon />
                      </IconButton>
                    )
                  }
                  sx={{
                    bgcolor: event.type === 'unavailable' ? 'error.light' : 'background.paper',
                    mb: 1,
                    borderRadius: 1,
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: event.type === 'unavailable' ? 'error.main' : 'primary.main' }}>
                      {event.type === 'unavailable' ? <EventBusyIcon /> : <EventIcon />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={event.title}
                    secondary={event.type === 'unavailable' ? 'You are marked as unavailable' : 'Event'}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              No events scheduled for this date.
            </Typography>
          )}
        </Paper>
      </Grid>
    </Grid>
  );

  // Render events tab
  const renderEventsTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Upcoming Events</Typography>
          
          {upcomingEvents.length > 0 ? (
            <Grid container spacing={2}>
              {upcomingEvents.map((event) => (
                <Grid item xs={12} sm={6} md={4} key={event.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>{event.name}</Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {format(parseISO(event.date), 'MMMM d, yyyy')}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Venue:</strong> {event.venue}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Client:</strong> {event.client}
                      </Typography>
                      <Chip 
                        label={event.status} 
                        color={event.status === 'confirmed' ? 'success' : 'warning'} 
                        size="small" 
                        sx={{ mt: 1 }} 
                      />
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small" 
                        startIcon={<VisibilityIcon />}
                        onClick={() => navigate(`/events/${event.id}`)}
                      >
                        View Details
                      </Button>
                      <Button 
                        size="small" 
                        startIcon={<MessageIcon />}
                        onClick={() => handleOpenMessageDialog(event.id, 'u1')} // Assuming client id is u1
                      >
                        Message Client
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body1" color="text.secondary">
              No upcoming events scheduled.
            </Typography>
          )}
        </Paper>
      </Grid>
      
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Event Requests</Typography>
          
          {eventRequests.filter(req => req.status === 'pending').length > 0 ? (
            <List>
              {eventRequests
                .filter(req => req.status === 'pending')
                .map((request) => (
                  <ListItem
                    key={request.id}
                    secondaryAction={
                      <Box>
                        <IconButton 
                          edge="end" 
                          color="success"
                          onClick={() => handleEventRequestResponse(request.id, true)}
                        >
                          <CheckIcon />
                        </IconButton>
                        <IconButton 
                          edge="end" 
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
                        <EventIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={request.eventName}
                      secondary={
                        <>
                          <Typography component="span" variant="body2">
                            {format(parseISO(request.date), 'MMMM d, yyyy')}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2">
                            Client: {request.clientName}
                          </Typography>
                          {request.message && (
                            <>
                              <br />
                              <Typography component="span" variant="body2">
                                "{request.message}"
                              </Typography>
                            </>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                ))}
            </List>
          ) : (
            <Typography variant="body1" color="text.secondary">
              No pending event requests.
            </Typography>
          )}
        </Paper>
      </Grid>
    </Grid>
  );

  // Render messages tab
  const renderMessagesTab = () => (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Messages</Typography>
      
      {messages.length > 0 ? (
        <List>
          {messages.map((message) => (
            <ListItem
              key={message.id}
              alignItems="flex-start"
              sx={{
                bgcolor: message.read ? 'background.paper' : 'action.hover',
                mb: 1,
                borderRadius: 1,
              }}
            >
              <ListItemAvatar>
                <Avatar>{message.senderName.charAt(0)}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography component="span" variant="subtitle1">
                      {message.senderName}
                    </Typography>
                    <Typography component="span" variant="body2" color="text.secondary">
                      {format(parseISO(message.timestamp), 'MMM d, h:mm a')}
                    </Typography>
                  </Box>
                }
                secondary={
                  <>
                    {message.eventName && (
                      <Typography component="span" variant="body2" color="primary">
                        Re: {message.eventName}
                      </Typography>
                    )}
                    <Typography component="p" variant="body1" sx={{ mt: 1 }}>
                      {message.content}
                    </Typography>
                    <Button 
                      size="small" 
                      sx={{ mt: 1 }}
                      onClick={() => {
                        if (message.eventId) {
                          handleOpenMessageDialog(message.eventId, message.senderId);
                          // Mark as read
                          setMessages(prev => 
                            prev.map(m => 
                              m.id === message.id ? { ...m, read: true } : m
                            )
                          );
                        }
                      }}
                    >
                      Reply
                    </Button>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <MessageIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            No messages to display.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Messages from clients about your services will appear here.
          </Typography>
        </Box>
      )}
    </Paper>
  );

  // Render settings tab
  const renderSettingsTab = () => (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Service Settings</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Profile Information</Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Name:</strong> {currentUser?.name || 'Your Name'}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Service Type:</strong> {currentUser?.role ? getServiceTypeDisplayName(currentUser.role as UserRole) : 'Service Provider'}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Email:</strong> {currentUser?.email || 'your.email@example.com'}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Phone:</strong> {currentUser?.phone || 'Not provided'}
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                size="small" 
                startIcon={<EditIcon />}
                onClick={() => navigate('/profile')}
              >
                Edit Profile
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Calendar Settings</Typography>
              <Typography variant="body2" paragraph>
                Connect your external calendar to sync your availability and events.
              </Typography>
              <Button 
                variant="outlined" 
                startIcon={<CalendarIcon />}
                sx={{ mb: 2 }}
              >
                Connect Google Calendar
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<CalendarIcon />}
              >
                Connect iCal
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Service Availability</Typography>
              <Typography variant="body2" paragraph>
                Set your general availability for bookings.
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<EditIcon />}
              >
                Manage Availability
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Paper>
  );

  // Render the appropriate tab content
  const renderTabContent = () => {
    switch (tabValue) {
      case 0:
        return renderCalendarTab();
      case 1:
        return renderEventsTab();
      case 2:
        return renderMessagesTab();
      case 3:
        return renderSettingsTab();
      default:
        return renderCalendarTab();
    }
  };

  return (
    <Layout title={`${currentUser?.role ? getServiceTypeDisplayName(currentUser.role as UserRole) : 'Service Provider'} Dashboard`}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="dashboard tabs"
              variant="fullWidth"
            >
              <Tab 
                icon={<CalendarIcon />} 
                label="Calendar" 
                id="tab-0" 
                aria-controls="tabpanel-0" 
              />
              <Tab 
                icon={<EventIcon />} 
                label="Events" 
                id="tab-1" 
                aria-controls="tabpanel-1" 
                iconPosition="start"
              />
              <Tab 
                icon={
                  <Badge 
                    badgeContent={messages.filter(m => !m.read).length} 
                    color="error"
                  >
                    <MessageIcon />
                  </Badge>
                } 
                label="Messages" 
                id="tab-2" 
                aria-controls="tabpanel-2" 
              />
              <Tab 
                icon={<SettingsIcon />} 
                label="Settings" 
                id="tab-3" 
                aria-controls="tabpanel-3" 
              />
            </Tabs>
          </Box>
          
          <Box sx={{ p: 2 }}>
            {renderTabContent()}
          </Box>
        </Paper>
      </Container>
      
      {/* Event Action Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <VisibilityIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="View Details" />
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: 'info.main' }}>
              <MessageIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Message Client" />
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: 'error.main' }}>
              <CloseIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Cancel Event" />
        </MenuItem>
      </Menu>
      
      {/* Unavailability Dialog */}
      <Dialog open={openUnavailabilityDialog} onClose={() => setOpenUnavailabilityDialog(false)}>
        <DialogTitle>Mark Date as Unavailable</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            Are you sure you want to mark {unavailabilityDate ? format(unavailabilityDate, 'MMMM d, yyyy') : 'this date'} as unavailable?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This will prevent clients from booking you on this date.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUnavailabilityDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmUnavailability} variant="contained" color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Message Dialog */}
      <Dialog open={openMessageDialog} onClose={() => setOpenMessageDialog(false)} fullWidth>
        <DialogTitle>Send Message</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="message"
            label="Message"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMessageDialog(false)}>Cancel</Button>
          <Button onClick={handleSendMessage} variant="contained" color="primary" disabled={!messageText.trim()}>
            Send
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog for Marking Unavailability */}
      <Dialog
        open={confirmUnavailabilityDialog}
        onClose={handleCancelUnavailability}
        aria-labelledby="confirm-unavailability-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="confirm-unavailability-dialog-title" sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EventBusyIcon color="error" />
            <Typography variant="h6">Confirm Unavailability</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ 
            p: 2, 
            mb: 2, 
            bgcolor: 'error.light', 
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'error.main'
          }}>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {isRangeSelection && rangeStart && dateToMarkUnavailable ? (
                `You are about to mark all days from ${format(rangeStart, 'MMMM d, yyyy')} to ${format(dateToMarkUnavailable, 'MMMM d, yyyy')} as unavailable.`
              ) : (
                `You are about to mark ${dateToMarkUnavailable ? format(dateToMarkUnavailable, 'MMMM d, yyyy') : 'this day'} as unavailable.`
              )}
            </Typography>
          </Box>
          
          <Typography variant="body2" paragraph>
            This action will:
          </Typography>
          
          <Box component="ul" sx={{ pl: 2 }}>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body2">
                Prevent clients from booking you on these dates
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body2">
                Display these dates as unavailable on your calendar
              </Typography>
            </Box>
            <Box component="li">
              <Typography variant="body2">
                You can change this later by clicking on the unavailable date
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#ef9a9a' }} />
            <Typography variant="body2" color="text.secondary">
              Unavailable dates will be shown in red on your calendar
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleCancelUnavailability} 
            variant="outlined"
            startIcon={<CloseIcon />}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmUnavailabilityNew} 
            color="error" 
            variant="contained"
            startIcon={<EventBusyIcon />}
          >
            Mark as Unavailable
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default ServiceProviderDashboard; 