import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Save as SaveIcon,
  Image as ImageIcon,
  CalendarMonth as CalendarIcon,
  Event as EventIcon,
  EventBusy as EventBusyIcon,
  DateRange as DateRangeIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { 
  DJ, 
  CateringService, 
  Venue, 
  djs, 
  cateringServices, 
  venues 
} from '../data/mockData';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateCalendar, PickersDay, PickersDayProps } from '@mui/x-date-pickers';
import { isSameDay, isWithinInterval, format, addDays, startOfDay } from 'date-fns';

// Add these interfaces after the imports
interface CalendarEvent {
  id: string;
  date: Date;
  title: string;
  type: 'event' | 'unavailable' | 'available';
  recurring?: boolean;
}

// Add this component after the imports and before the ManageServicesPage component
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

const ManageServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, isVendor } = useAuth();
  
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // If not a vendor, redirect to profile
  useEffect(() => {
    if (!isVendor) {
      navigate('/profile');
    }
  }, [isVendor, navigate]);
  
  // Get services based on user role
  const getUserServices = () => {
    if (!currentUser) return [];
    
    // For users with multiple services
    if (currentUser.role === 'multiple' && currentUser.selectedServices) {
      const allServices = [];
      
      // Add services based on selected categories
      if (currentUser.selectedServices.includes('dj')) {
        allServices.push(...djs.filter(dj => dj.ownerId === currentUser.id));
      }
      
      if (currentUser.selectedServices.includes('caterer')) {
        allServices.push(...cateringServices.filter(service => service.ownerId === currentUser.id));
      }
      
      if (currentUser.selectedServices.includes('venue')) {
        allServices.push(...venues.filter(venue => venue.ownerId === currentUser.id));
      }
      
      return allServices;
    }
    
    // For users with a single service type
    switch (currentUser.role) {
      case 'dj':
        return djs.filter(dj => dj.ownerId === currentUser.id);
      case 'caterer':
        return cateringServices.filter(service => service.ownerId === currentUser.id);
      case 'venue':
        return venues.filter(venue => venue.ownerId === currentUser.id);
      default:
        return [];
    }
  };
  
  const [services, setServices] = useState<(DJ | CateringService | Venue)[]>(getUserServices());
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentService, setCurrentService] = useState<DJ | CateringService | Venue | null>(null);
  
  // Form fields for different service types
  const [formData, setFormData] = useState({
    // Common fields
    name: '',
    price: 0,
    description: '',
    image: '',
    
    // DJ specific
    genres: [] as string[],
    experience: 0,
    
    // Venue specific
    type: 'indoor' as 'indoor' | 'outdoor' | 'both',
    size: 'medium' as 'small' | 'medium' | 'large',
    location: '',
    
    // Caterer specific
    cuisineType: [] as string[],
    
    // Travel distance (for DJ and caterer)
    maxTravelDistance: 30
  });
  
  // Add these state variables after the existing state declarations
  const [availabilityDialogOpen, setAvailabilityDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<DJ | CateringService | Venue | null>(null);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isRangeSelection, setIsRangeSelection] = useState(false);
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2025, 2, 1)); // March 2025
  const [confirmUnavailabilityDialog, setConfirmUnavailabilityDialog] = useState(false);
  const [dateToMarkUnavailable, setDateToMarkUnavailable] = useState<Date | null>(null);
  
  // Handle opening the edit dialog
  const handleOpenEditDialog = (service: DJ | CateringService | Venue | null = null) => {
    if (service) {
      // Edit existing service
      setCurrentService(service);
      
      // Set common fields
      setFormData({
        ...formData,
        name: service.name,
        price: service.price,
        image: 'image' in service ? service.image : '',
        description: 'description' in service ? service.description : 'bio' in service ? service.bio : '',
        
        // Set specific fields based on service type
        genres: 'genres' in service ? service.genres : [],
        experience: 'experience' in service ? service.experience : 0,
        type: 'type' in service ? service.type : 'indoor',
        size: 'size' in service ? service.size : 'medium',
        location: 'location' in service ? service.location : '',
        cuisineType: 'cuisineType' in service ? service.cuisineType : [],
        maxTravelDistance: 'maxTravelDistance' in service ? service.maxTravelDistance || 30 : 30
      });
      
      setEditDialogOpen(true);
    }
  };
  
  // Handle closing the edit dialog
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
  };
  
  // Handle form field changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' || name === 'experience' || name === 'maxTravelDistance' 
        ? Number(value) 
        : value
    });
  };
  
  // Handle select field changes
  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle saving the service
  const handleSaveService = () => {
    // In a real app, this would make an API call to save the service
    // For now, we'll just update our local state
    
    if (currentService) {
      // Update existing service
      const updatedServices = services.map(service => 
        service.id === currentService.id ? { ...service, ...updateServiceData() } : service
      );
      setServices(updatedServices);
      setSnackbarMessage('Service updated successfully!');
      
      setSnackbarOpen(true);
      setEditDialogOpen(false);
    }
  };
  
  // Update service data based on user role
  const updateServiceData = () => {
    if (!currentUser || !currentService) return {};
    
    const baseUpdate = {
      name: formData.name,
      price: formData.price
    };
    
    switch (currentUser.role) {
      case 'dj':
        return {
          ...baseUpdate,
          genres: formData.genres,
          experience: formData.experience,
          bio: formData.description,
          image: formData.image,
          maxTravelDistance: formData.maxTravelDistance
        };
        
      case 'caterer':
        return {
          ...baseUpdate,
          cuisineType: formData.cuisineType,
          description: formData.description,
          image: formData.image,
          maxTravelDistance: formData.maxTravelDistance
        };
        
      case 'venue':
        return {
          ...baseUpdate,
          type: formData.type,
          size: formData.size,
          location: formData.location,
          description: formData.description,
          images: [formData.image]
        };
        
      default:
        return baseUpdate;
    }
  };
  
  // Handle deleting a service
  const handleDeleteService = (serviceId: string) => {
    // In a real app, this would make an API call to delete the service
    // For now, we'll just update our local state
    const updatedServices = services.filter(service => service.id !== serviceId);
    setServices(updatedServices);
    setSnackbarMessage('Service deleted successfully!');
    setSnackbarOpen(true);
  };
  
  // Handle managing service availability
  const handleManageAvailability = (serviceId: string) => {
    // Find the service
    const service = services.find(s => {
      if ('id' in s) {
        return s.id === serviceId;
      }
      return false;
    });
    
    if (!service) {
      setSnackbarMessage('Service not found');
      setSnackbarOpen(true);
      return;
    }
    
    // Set the selected service and current dates
    setSelectedService(service);
    
    // Parse availability dates
    const availabilityDates = service.availability.map(dateStr => new Date(dateStr));
    setCalendarEvents(
      availabilityDates.map((date, index) => ({
        id: `avail-${index}`,
        date,
        title: 'Available',
        type: 'available'
      }))
    );
    
    // Open the availability dialog
    setAvailabilityDialogOpen(true);
  };
  
  // Add these helper functions for calendar functionality
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
      // Single date selection
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
  
  // Handle confirmation of unavailability
  const handleConfirmUnavailability = () => {
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
  
  // Render the availability management dialog
  const renderAvailabilityDialog = () => {
    return (
      <Dialog 
        open={availabilityDialogOpen} 
        onClose={() => setAvailabilityDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Manage Availability
          <IconButton
            aria-label="close"
            onClick={() => setAvailabilityDialogOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent dividers>
          {selectedService && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedService.name}
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Calendar Integration
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="calendar-type-label">Calendar Type</InputLabel>
                      <Select
                        labelId="calendar-type-label"
                        value={currentUser?.calendarType || ''}
                        label="Calendar Type"
                        onChange={(e) => {
                          // In a real app, this would update the user's calendar preferences
                          setSnackbarMessage('Calendar preference saved');
                          setSnackbarOpen(true);
                        }}
                      >
                        <MenuItem value="">No Integration</MenuItem>
                        <MenuItem value="google">Google Calendar</MenuItem>
                        <MenuItem value="ical">iCal</MenuItem>
                      </Select>
                    </FormControl>
                    
                    <Button
                      variant="outlined"
                      sx={{ mt: 2 }}
                      startIcon={<EventIcon />}
                      onClick={() => {
                        // In a real app, this would trigger calendar authentication
                        setSnackbarMessage('Calendar integration is not yet implemented');
                        setSnackbarOpen(true);
                      }}
                    >
                      Connect Calendar
                    </Button>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      Connecting your calendar will automatically update your availability
                      based on your existing appointments.
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle1" gutterBottom>
                    Manual Availability
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => {
                        setIsRangeSelection(!isRangeSelection);
                        setRangeStart(null);
                      }}
                    >
                      {isRangeSelection ? 'Single Date Selection' : 'Date Range Selection'}
                    </Button>
                    
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => {
                        if (selectedDate) {
                          setDateToMarkUnavailable(selectedDate);
                          setConfirmUnavailabilityDialog(true);
                        } else {
                          setSnackbarMessage('Please select a date first');
                          setSnackbarOpen(true);
                        }
                      }}
                      disabled={!selectedDate}
                    >
                      Mark as Unavailable
                    </Button>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Click on dates to mark them as available. Click again to remove.
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <DateCalendar
                        value={selectedDate}
                        onChange={(newDate) => {
                          if (!newDate) return;
                          
                          setSelectedDate(newDate);
                          
                          if (isRangeSelection) {
                            if (!rangeStart) {
                              setRangeStart(newDate);
                            } else {
                              // Mark all dates in range as available
                              const start = rangeStart < newDate ? rangeStart : newDate;
                              const end = rangeStart < newDate ? newDate : rangeStart;
                              
                              // Create dates for the range
                              const datesInRange: Date[] = [];
                              let currentDate = start;
                              
                              while (currentDate <= end) {
                                datesInRange.push(new Date(currentDate));
                                currentDate = addDays(currentDate, 1);
                              }
                              
                              // Add to calendar events
                              const newEvents = [
                                ...calendarEvents,
                                ...datesInRange.map((date, index) => ({
                                  id: `range-${index}-${Date.now()}`,
                                  date,
                                  title: 'Available',
                                  type: 'available' as const
                                }))
                              ];
                              
                              setCalendarEvents(newEvents);
                              setRangeStart(null);
                            }
                          } else {
                            // Toggle individual date availability
                            const dateIndex = calendarEvents.findIndex(e => 
                              e.type === 'available' && isSameDay(e.date, newDate)
                            );
                            
                            if (dateIndex === -1) {
                              // Add as available
                              setCalendarEvents([
                                ...calendarEvents,
                                {
                                  id: `avail-${Date.now()}`,
                                  date: newDate,
                                  title: 'Available',
                                  type: 'available'
                                }
                              ]);
                            } else {
                              // Remove availability
                              const newEvents = [...calendarEvents];
                              newEvents.splice(dateIndex, 1);
                              setCalendarEvents(newEvents);
                            }
                          }
                        }}
                        slots={{
                          day: (dayProps) => 
                            <CustomDay 
                              {...dayProps}
                              isAvailable={isDateAvailable(dayProps.day)}
                              isUnavailable={isDateUnavailable(dayProps.day)}
                              isEvent={isDateEvent(dayProps.day)} 
                            />
                        }}
                        views={['day']}
                      />
                      
                      <Box sx={{ mt: 2, width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#c8e6c9', mr: 1 }} />
                            <Typography variant="body2">Available</Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ef9a9a', mr: 1 }} />
                            <Typography variant="body2">Unavailable</Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#90caf9', mr: 1 }} />
                            <Typography variant="body2">Booked</Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setAvailabilityDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={() => {
              // Save availability (in a real app, this would update the database)
              if (selectedService) {
                // Extract available dates from calendar events
                const availableDates = calendarEvents
                  .filter(e => e.type === 'available')
                  .map(e => format(e.date, 'yyyy-MM-dd'));
                
                // Update the service's availability
                const updatedServices = services.map(s => {
                  if (
                    'id' in s && selectedService && 'id' in selectedService && 
                    s.id === selectedService.id
                  ) {
                    return {
                      ...s,
                      availability: availableDates
                    };
                  }
                  return s;
                });
                
                setServices(updatedServices);
                setSnackbarMessage('Availability updated successfully');
                setSnackbarOpen(true);
                setAvailabilityDialogOpen(false);
              }
            }}
          >
            Save Availability
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  // Render service cards
  const renderServiceCards = () => {
    if (services.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" gutterBottom>
            You haven't added any services yet.
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Start by adding your first service to get discovered by event organizers.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/create-service')}
          >
            Create Service
          </Button>
        </Box>
      );
    }
    
    return (
      <Grid container spacing={3}>
        {services.map(service => (
          <Grid item xs={12} sm={6} md={4} key={service.id}>
            <Card elevation={1}>
              <CardMedia
                component="img"
                height="140"
                image={'image' in service ? service.image : 'images' in service ? service.images[0] : ''}
                alt={service.name}
              />
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  {service.name}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    ${service.price}{currentUser?.role === 'caterer' ? '/person' : currentUser?.role === 'dj' ? '/hour' : '/event'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {service.rating} ★ ({service.reviews})
                    </Typography>
                  </Box>
                </Box>
                
                {/* Service-specific details */}
                {'genres' in service && (
                  <Box sx={{ mt: 1, mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Genres:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                      {service.genres.map((genre, index) => (
                        <Chip key={index} label={genre} size="small" />
                      ))}
                    </Box>
                  </Box>
                )}
                
                {'cuisineType' in service && (
                  <Box sx={{ mt: 1, mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Cuisine:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                      {service.cuisineType.map((cuisine, index) => (
                        <Chip key={index} label={cuisine} size="small" />
                      ))}
                    </Box>
                  </Box>
                )}
                
                {'type' in service && (
                  <Box sx={{ mt: 1, mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Type: {service.type.charAt(0).toUpperCase() + service.type.slice(1)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Size: {service.size.charAt(0).toUpperCase() + service.size.slice(1)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Location: {service.location}
                    </Typography>
                  </Box>
                )}
                
                {'maxTravelDistance' in service && service.maxTravelDistance && (
                  <Typography variant="body2" color="text.secondary">
                    Max Travel Distance: {service.maxTravelDistance} km
                  </Typography>
                )}
                
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {'description' in service ? service.description : 'bio' in service ? service.bio : ''}
                </Typography>
              </CardContent>
              
              <Divider />
              
              <CardActions>
                <Button 
                  size="small" 
                  startIcon={<CalendarIcon />}
                  onClick={() => handleManageAvailability(service.id)}
                >
                  Availability
                </Button>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton 
                  size="small" 
                  color="primary"
                  onClick={() => handleOpenEditDialog(service)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton 
                  size="small" 
                  color="error"
                  onClick={() => handleDeleteService(service.id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };
  
  // Render edit dialog based on user role
  const renderEditDialog = () => {
    if (!currentUser) return null;
    
    let dialogTitle = 'Edit Service';
    
    switch (currentUser?.role) {
      case 'dj':
        dialogTitle = 'Edit DJ Service';
        break;
      case 'caterer':
        dialogTitle = 'Edit Catering Service';
        break;
      case 'venue':
        dialogTitle = 'Edit Venue';
        break;
    }
    
    return (
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="md" fullWidth>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            {/* Common fields for all service types */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleFormChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      {currentUser.role === 'caterer' ? '/person' : currentUser.role === 'dj' ? '/hour' : '/event'}
                    </InputAdornment>
                  )
                }}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Image URL"
                name="image"
                value={formData.image}
                onChange={handleFormChange}
                placeholder="https://example.com/image.jpg"
              />
            </Grid>
            
            {/* DJ-specific fields */}
            {currentUser.role === 'dj' && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Experience (years)"
                    name="experience"
                    type="number"
                    value={formData.experience}
                    onChange={handleFormChange}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Max Travel Distance (km)"
                    name="maxTravelDistance"
                    type="number"
                    value={formData.maxTravelDistance}
                    onChange={handleFormChange}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="genres-label">Genres</InputLabel>
                    <Select
                      labelId="genres-label"
                      multiple
                      name="genres"
                      value={formData.genres}
                      onChange={handleSelectChange}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      )}
                    >
                      {['House', 'Electronic', 'Pop', 'Hip Hop', 'R&B', 'Latin', 'Reggaeton', 'Dance', 'Techno', '80s', '90s', 'Rock', 'Top 40'].map((genre) => (
                        <MenuItem key={genre} value={genre}>
                          {genre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}
            
            {/* Caterer-specific fields */}
            {currentUser.role === 'caterer' && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Max Travel Distance (km)"
                    name="maxTravelDistance"
                    type="number"
                    value={formData.maxTravelDistance}
                    onChange={handleFormChange}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="cuisine-label">Cuisine Types</InputLabel>
                    <Select
                      labelId="cuisine-label"
                      multiple
                      name="cuisineType"
                      value={formData.cuisineType}
                      onChange={handleSelectChange}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      )}
                    >
                      {['Italian', 'Mediterranean', 'Japanese', 'Chinese', 'Thai', 'Fusion', 'International', 'American', 'Seafood', 'Cuban', 'Spanish', 'Latin American', 'Southern', 'BBQ', 'Vegan', 'Vegetarian', 'Desserts'].map((cuisine) => (
                        <MenuItem key={cuisine} value={cuisine}>
                          {cuisine}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}
            
            {/* Venue-specific fields */}
            {currentUser.role === 'venue' && (
              <>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="venue-type-label">Venue Type</InputLabel>
                    <Select
                      labelId="venue-type-label"
                      name="type"
                      value={formData.type}
                      onChange={handleSelectChange}
                    >
                      <MenuItem value="indoor">Indoor</MenuItem>
                      <MenuItem value="outdoor">Outdoor</MenuItem>
                      <MenuItem value="both">Both</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="venue-size-label">Venue Size</InputLabel>
                    <Select
                      labelId="venue-size-label"
                      name="size"
                      value={formData.size}
                      onChange={handleSelectChange}
                    >
                      <MenuItem value="small">Small</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="large">Large</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleFormChange}
                    placeholder="e.g., Downtown Tampa"
                  />
                </Grid>
              </>
            )}
            
            {/* Description field for all service types */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={currentUser.role === 'dj' ? 'Bio' : 'Description'}
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            startIcon={<SaveIcon />}
            onClick={handleSaveService}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  if (!currentUser || !isVendor) {
    return null;
  }
  
  return (
    <Layout title="Manage Services" hideSearch>
      <Container maxWidth="md">
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" component="h1">
              Your Services
            </Typography>
            
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => navigate('/create-service')}
            >
              Create Service
            </Button>
          </Box>
          
          <Typography variant="body1" color="text.secondary">
            Manage your service listings and availability.
          </Typography>
        </Box>
        
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">
              Your Services
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => navigate('/create-service')}
            >
              Create Service
            </Button>
          </Box>
          
          {renderServiceCards()}
        </Paper>
        
        {renderEditDialog()}
        {renderAvailabilityDialog()}
        
        {/* Confirmation Dialog for Marking Unavailability */}
        <Dialog
          open={confirmUnavailabilityDialog}
          onClose={handleCancelUnavailability}
          aria-labelledby="confirm-unavailability-dialog-title"
        >
          <DialogTitle id="confirm-unavailability-dialog-title">
            Confirm Unavailability
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              {isRangeSelection && rangeStart && dateToMarkUnavailable ? (
                `Are you sure you want to mark all days from ${format(rangeStart, 'MMMM d, yyyy')} to ${format(dateToMarkUnavailable, 'MMMM d, yyyy')} as unavailable?`
              ) : (
                `Are you sure you want to mark ${dateToMarkUnavailable ? format(dateToMarkUnavailable, 'MMMM d, yyyy') : 'this day'} as unavailable?`
              )}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              This will prevent clients from booking you on these dates.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelUnavailability}>Cancel</Button>
            <Button onClick={handleConfirmUnavailability} color="primary" variant="contained">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
        
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
        />
      </Container>
    </Layout>
  );
};

export default ManageServicesPage; 