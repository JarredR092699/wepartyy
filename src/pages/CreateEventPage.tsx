import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  Card,
  CardContent,
  CardActionArea,
  ToggleButton,
  ToggleButtonGroup,
  Alert,
  Chip,
  Slider,
  Snackbar,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tab,
  Tabs,
  FormHelperText,
  Avatar
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { 
  ArrowBack as ArrowBackIcon, 
  ArrowForward as ArrowForwardIcon, 
  Event as EventIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ExpandMore as ExpandMoreIcon,
  Check as CheckIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  MusicNote as MusicIcon,
  Restaurant as RestaurantIcon,
  Theaters as EntertainmentIcon,
  PhotoCamera as PhotographyIcon,
  Brush as DecorationIcon,
  Speaker as AudioVisualIcon,
  Chair as FurnitureIcon,
  LocalBar as BarServiceIcon,
  Security as SecurityIcon,
  LocationOn as LocationIcon,
  Delete as DeleteIcon,
  Headphones as HeadphonesIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { format, addDays, isAfter, isBefore, isEqual, parseISO, isSameDay, addMonths, subMonths, startOfMonth, getMonth, getYear } from 'date-fns';
import Layout from '../components/Layout';
import ServiceCard from '../components/ServiceCard';
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
  security,
  filterDJsByTravelDistance, 
  filterCaterersByTravelDistance 
} from '../data/mockData';
import ProviderDateSelector from '../components/ProviderDateSelector';

// Define steps for the event creation process
const tabs = [
  { id: 'dates', label: 'Dates', icon: <EventIcon /> },
  { id: 'services', label: 'Select Services', icon: <LocationIcon /> },
  { id: 'review', label: 'Review & Book', icon: <CheckIcon /> }
];

// Define recommended combinations type
interface RecommendedCombination {
  id: string;
  name: string;
  description: string;
  venueId: string;
  djId: string;
  cateringId: string;
  tags: string[];
}

// Define recommended combinations
const recommendedCombinations: RecommendedCombination[] = [
  {
    id: 'elegant-wedding',
    name: 'Elegant Wedding Package',
    description: 'Perfect for upscale weddings with a sophisticated atmosphere',
    venueId: 'venue1', // Skyline Terrace
    djId: 'dj2', // DJ Harmony
    cateringId: 'catering1', // Gourmet Delights
    tags: ['wedding', 'elegant', 'upscale']
  },
  {
    id: 'corporate-event',
    name: 'Corporate Event Package',
    description: 'Ideal for professional business events and conferences',
    venueId: 'venue3', // Grand Ballroom
    djId: 'dj4', // DJ Pulse
    cateringId: 'catering3', // Fusion Flavors
    tags: ['corporate', 'business', 'professional']
  },
  {
    id: 'birthday-bash',
    name: 'Birthday Celebration Package',
    description: 'Fun and festive setup for birthday parties of all ages',
    venueId: 'venue2', // Beach Club
    djId: 'dj1', // DJ Beats
    cateringId: 'catering2', // Taste of Italy
    tags: ['birthday', 'celebration', 'party']
  },
  {
    id: 'casual-gathering',
    name: 'Casual Gathering Package',
    description: 'Relaxed atmosphere for friendly get-togethers and reunions',
    venueId: 'venue4', // Garden Pavilion
    djId: 'dj3', // DJ Groove
    cateringId: 'catering4', // Street Food Sensations
    tags: ['casual', 'relaxed', 'friends']
  }
];

// Define a service type for consistent use throughout the app
type ServiceType = 'venue' | 'dj' | 'catering' | 'entertainment' | 'photography' | 
  'decoration' | 'audioVisual' | 'furniture' | 'barService' | 'security';

// Define a proper ServiceProvider interface for type consistency
interface ServiceProvider {
  id: string;
  name: string;
  availability: string[];
  description?: string;
  price?: number;
  rating?: number;
  capacity?: number;
  travelDistance?: number;
  [key: string]: any; // For any additional properties
}

// Custom venue interface for user-created venues
interface CustomVenue {
  name: string;
  location: string;
  description: string;
  capacity: number;
  images: string[]; // URLs of uploaded images
}

// Custom DJ interface for user-provided DJs
interface CustomDJ {
  name: string;
  genres: string[];
  experience: number;
  description: string;
  contactInfo: string;
  image: string; // URL of uploaded image
}

// Custom catering interface for user-provided catering services
interface CustomCatering {
  name: string;
  cuisineTypes: string[];
  specialDiets: string[];
  pricePerPerson: number;
  description: string;
  contactInfo: string;
  image: string; // URL of uploaded image
}

// Custom entertainment interface for user-provided entertainment
interface CustomEntertainment {
  name: string;
  description: string;
  image: string; // URL of uploaded image
}

// Custom photography interface for user-provided photography
interface CustomPhotography {
  name: string;
  description: string;
  image: string; // URL of uploaded image
}

// Custom decoration interface for user-provided decoration
interface CustomDecoration {
  name: string;
  description: string;
  image: string; // URL of uploaded image
}

// Custom audio/visual interface for user-provided audio/visual services
interface CustomAudioVisual {
  name: string;
  description: string;
  image: string; // URL of uploaded image
}

// Custom furniture interface for user-provided furniture
interface CustomFurniture {
  name: string;
  description: string;
  image: string; // URL of uploaded image
}

// Custom bar service interface for user-provided bar service
interface CustomBarService {
  name: string;
  description: string;
  image: string; // URL of uploaded image
}

// Custom security interface for user-provided security
interface CustomSecurity {
  name: string;
  description: string;
  image: string; // URL of uploaded image
}

// Define a mapping of service types to their field names for consistent reuse
const serviceTypeToFieldMap: Record<ServiceType, string> = {
  'venue': 'venueId',
  'dj': 'djId',
  'catering': 'cateringId',
  'entertainment': 'entertainmentId',
  'photography': 'photographyId',
  'decoration': 'decorationId',
  'audioVisual': 'audioVisualId',
  'furniture': 'furnitureId',
  'barService': 'barServiceId',
  'security': 'securityId',
};

const CreateEventPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Replace activeStep with activeTab
  const [activeTab, setActiveTab] = useState('dates');
  
  // Add state for snackbar and dialog
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [draftName, setDraftName] = useState('');
  
  // Handle confirmedService from navigation state if it exists
  useEffect(() => {
    if (location.state) {
      const { message, confirmedService } = location.state as any;
      
      // Show message if provided
      if (message) {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
      }
      
      // Process confirmed service if provided
      if (confirmedService) {
        // Get the field name from the service type mapping
        const fieldName = serviceTypeToFieldMap[confirmedService.type as ServiceType];
        
        if (fieldName) {
          // Update the eventData with the selected service
          setEventData(prevData => {
            const updatedData = {
              ...prevData,
              [fieldName]: confirmedService.id,
            };
            
            // If there's a date, handle it
            if (confirmedService.date) {
              const selectedDate = new Date(confirmedService.date);
              
              // If we're in single date mode
              if (!prevData.isMultiDay && !prevData.isMultiSelect) {
                updatedData.date = selectedDate;
              } 
              // If we're in multi-select mode
              else if (prevData.isMultiSelect) {
                updatedData.selectedDates = [...prevData.selectedDates, selectedDate];
              }
              // If we're in date range mode, set as start date if not set
              else if (prevData.isMultiDay && !prevData.dateRange.start) {
                updatedData.dateRange = {
                  ...prevData.dateRange,
                  start: selectedDate,
                };
              }
            }
            
            return updatedData;
          });
          
          // Store provider specific date selection if there's a date
          if (confirmedService.date) {
            const selectedDate = new Date(confirmedService.date);
            setProviderSpecificDates(prevDates => ({
              ...prevDates,
              [confirmedService.id]: {
                type: confirmedService.type as ServiceType,
                date: selectedDate,
              }
            }));
          }
          
          // Set the active tab to services instead of dates
          setActiveTab('services');
        }
      }
    }
  }, [location.state]);
  
  // Define service categories
  const serviceCategories = [
    { id: 'venue', label: 'Venue', icon: <LocationIcon />, required: true },
    { id: 'dj', label: 'DJ', icon: <MusicIcon />, required: false },
    { id: 'catering', label: 'Catering', icon: <RestaurantIcon />, required: false },
    { id: 'entertainment', label: 'Entertainment', icon: <EntertainmentIcon />, required: false },
    { id: 'photography', label: 'Photography', icon: <PhotographyIcon />, required: false },
    { id: 'decoration', label: 'Decoration', icon: <DecorationIcon />, required: false },
    { id: 'audioVisual', label: 'Audio & Visual', icon: <AudioVisualIcon />, required: false },
    { id: 'furniture', label: 'Furniture', icon: <FurnitureIcon />, required: false },
    { id: 'barService', label: 'Bar Service', icon: <BarServiceIcon />, required: false },
    { id: 'security', label: 'Security', icon: <SecurityIcon />, required: false }
  ];
  
  // State for tracking which service categories to include
  const [includedCategories, setIncludedCategories] = useState<string[]>(
    serviceCategories.filter(cat => cat.required).map(cat => cat.id)
  );
  
  // State for form data
  const [eventData, setEventData] = useState({
    name: '',
    date: null as Date | null,
    dateRange: {
      start: null as Date | null,
      end: null as Date | null
    },
    selectedDates: [] as Date[],
    isMultiDay: false,
    isMultiSelect: false,
    venueId: '',
    useCustomVenue: false,
    customVenue: {
      name: '',
      location: '',
      description: '',
      capacity: 50,
      images: [] as string[]
    },
    djId: '',
    useCustomDJ: false,
    customDJ: {
      name: '',
      genres: [] as string[],
      experience: 0,
      description: '',
      contactInfo: '',
      image: ''
    },
    cateringId: '',
    useCustomCatering: false,
    customCatering: {
      name: '',
      cuisineTypes: [] as string[],
      specialDiets: [] as string[],
      pricePerPerson: 25,
      description: '',
      contactInfo: '',
      image: ''
    },
    entertainmentId: '',
    useCustomEntertainment: false,
    customEntertainment: {
      name: '',
      description: '',
      image: ''
    },
    photographyId: '',
    useCustomPhotography: false,
    customPhotography: {
      name: '',
      description: '',
      image: ''
    },
    decorationId: '',
    useCustomDecoration: false,
    customDecoration: {
      name: '',
      description: '',
      image: ''
    },
    audioVisualId: '',
    useCustomAudioVisual: false,
    customAudioVisual: {
      name: '',
      description: '',
      image: ''
    },
    furnitureId: '',
    useCustomFurniture: false,
    customFurniture: {
      name: '',
      description: '',
      image: ''
    },
    barServiceId: '',
    useCustomBarService: false,
    customBarService: {
      name: '',
      description: '',
      image: ''
    },
    securityId: '',
    useCustomSecurity: false,
    customSecurity: {
      name: '',
      description: '',
      image: ''
    },
    attendees: 50,
  });
  
  // State for available services based on date selection
  const [availableVenues, setAvailableVenues] = useState(venues);
  const [availableDJs, setAvailableDJs] = useState(djs);
  const [availableCaterers, setAvailableCaterers] = useState(cateringServices);
  const [availableEntertainment, setAvailableEntertainment] = useState(entertainment);
  const [availablePhotography, setAvailablePhotography] = useState(photography);
  const [availableDecoration, setAvailableDecoration] = useState(decoration);
  const [availableAudioVisual, setAvailableAudioVisual] = useState(audioVisual);
  const [availableFurniture, setAvailableFurniture] = useState(furniture);
  const [availableBarServices, setAvailableBarServices] = useState(barServices);
  const [availableSecurity, setAvailableSecurity] = useState(security);
  
  // Add new state for filter-first approach
  const [venueFilters, setVenueFilters] = useState({
    types: [] as string[],
    maxPrice: 3000,
    styles: [] as string[]
  });

  const [djFilters, setDjFilters] = useState({
    genres: [] as string[],
    maxPrice: 1000
  });

  const [cateringFilters, setCateringFilters] = useState({
    cuisineTypes: [] as string[],
    maxPrice: 100
  });
  
  // Add filters for new service categories
  const [entertainmentFilters, setEntertainmentFilters] = useState({
    types: [] as string[],
    maxPrice: 1000
  });
  
  const [photographyFilters, setPhotographyFilters] = useState({
    types: [] as string[],
    styles: [] as string[],
    maxPrice: 1000
  });
  
  const [decorationFilters, setDecorationFilters] = useState({
    types: [] as string[],
    styles: [] as string[],
    maxPrice: 1000
  });
  
  const [audioVisualFilters, setAudioVisualFilters] = useState({
    equipmentTypes: [] as string[],
    maxPrice: 1000
  });
  
  const [furnitureFilters, setFurnitureFilters] = useState({
    itemTypes: [] as string[],
    styles: [] as string[],
    maxPrice: 1000
  });
  
  const [barServiceFilters, setBarServiceFilters] = useState({
    serviceTypes: [] as string[],
    maxPrice: 1000
  });
  
  const [securityFilters, setSecurityFilters] = useState({
    serviceTypes: [] as string[],
    maxPrice: 1000
  });
  
  // Add state for available dates
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  
  // Add state for showing recommendations
  const [showRecommendations, setShowRecommendations] = useState(false);
  
  // Add state for calendar navigation
  const [calendarDate, setCalendarDate] = useState(new Date());
  
  // New state variables for the enhanced date selection flow
  const [isSelectingProviderDates, setIsSelectingProviderDates] = useState(false);
  const [currentSelectingProvider, setCurrentSelectingProvider] = useState<ServiceProvider | null>(null);
  const [currentSelectingProviderType, setCurrentSelectingProviderType] = useState<ServiceType | null>(null);
  const [providerSpecificDates, setProviderSpecificDates] = useState<{
    [providerId: string]: {
      type: ServiceType;
      date?: Date | null;
      dates?: Date[];
    }
  }>({});
  const [tempSelectedDate, setTempSelectedDate] = useState<Date | null>(null);
  const [tempSelectedDates, setTempSelectedDates] = useState<Date[]>([]);
  const [availableDatesForDisplay, setAvailableDatesForDisplay] = useState<Date[]>([]);
  
  // State for managing provider date selection
  // const [providerSelectorMultiSelect, setProviderSelectorMultiSelect] = useState(false);
  
  // Load saved draft if available
  useEffect(() => {
    const savedDraft = localStorage.getItem('eventDraft');
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        
        // Convert string dates back to Date objects
        if (parsedDraft.date) {
          parsedDraft.date = new Date(parsedDraft.date);
        }
        
        if (parsedDraft.dateRange.start) {
          parsedDraft.dateRange.start = new Date(parsedDraft.dateRange.start);
        }
        
        if (parsedDraft.dateRange.end) {
          parsedDraft.dateRange.end = new Date(parsedDraft.dateRange.end);
        }
        
        setEventData(parsedDraft);
        setSnackbarMessage('Draft loaded successfully');
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, []);
  
  // Update mock data to use current dates
  useEffect(() => {
    // Function to update dates in mock data to be from current day onwards
    const updateMockDataDates = () => {
      const today = new Date();
      
      // Helper function to create a date string in the format 'YYYY-MM-DD'
      const createDateString = (date: Date) => {
        return format(date, 'yyyy-MM-dd');
      };
      
      // Generate random dates from today onwards for each service
      const generateRandomDates = (count: number) => {
        const dates: string[] = [];
        for (let i = 0; i < count; i++) {
          // Random day between 0 and 180 days from today
          const randomDaysToAdd = Math.floor(Math.random() * 180);
          const randomDate = new Date(today);
          randomDate.setDate(today.getDate() + randomDaysToAdd);
          
          dates.push(createDateString(randomDate));
        }
        return dates;
      };
      
      // Update venues availability
      venues.forEach(venue => {
        venue.availability = generateRandomDates(30);
      });
      
      // Update DJs availability
      djs.forEach(dj => {
        dj.availability = generateRandomDates(30);
      });
      
      // Update catering services availability
      cateringServices.forEach(caterer => {
        caterer.availability = generateRandomDates(30);
      });
      
      // Refresh available services
      checkDateAvailability();
    };
    
    updateMockDataDates();
  }, []);
  
  // Update available services when date selection changes
  useEffect(() => {
    if (eventData.isMultiDay && eventData.dateRange.start && eventData.dateRange.end) {
      // Filter services based on date range
      filterServicesForDateRange(eventData.dateRange.start, eventData.dateRange.end);
    } else if (eventData.isMultiSelect && eventData.selectedDates.length > 0) {
      // Filter services based on multiple selected dates
      filterServicesForSelectedDates(eventData.selectedDates);
    } else if (!eventData.isMultiDay && !eventData.isMultiSelect && eventData.date) {
      // Filter services based on single date
      filterServicesForSingleDate(eventData.date);
    }
  }, [
    eventData.date, 
    eventData.dateRange.start, 
    eventData.dateRange.end, 
    eventData.isMultiDay,
    eventData.isMultiSelect,
    eventData.selectedDates,
    venueFilters, 
    djFilters, 
    cateringFilters
  ]);
  
  // Filter services based on the selected date
  const filterServicesForSingleDate = (date: Date) => {
    if (!date) return;
    
    const dateString = format(date, 'yyyy-MM-dd');
    
    // Filter venues based on the selected date
    const filteredVenues = venues.filter(venue => {
      // Check if this venue is available on the selected date
      return venue.availability.includes(dateString);
    });
    
    // Only update if there's a change to avoid unnecessary re-renders
    if (JSON.stringify(filteredVenues) !== JSON.stringify(availableVenues)) {
      setAvailableVenues(filteredVenues);
    }
    
    // Similarly filter other service types
    // Filter DJs
    const filteredDJs = djs.filter(dj => dj.availability.includes(dateString));
    setAvailableDJs(filteredDJs);
    
    // Filter caterers
    const filteredCaterers = cateringServices.filter(caterer => caterer.availability.includes(dateString));
    setAvailableCaterers(filteredCaterers);
    
    // Filter entertainment
    const filteredEntertainment = entertainment.filter(item => item.availability.includes(dateString));
    setAvailableEntertainment(filteredEntertainment);
    
    // Filter photography
    const filteredPhotography = photography.filter(item => item.availability.includes(dateString));
    setAvailablePhotography(filteredPhotography);
    
    // Filter decoration
    const filteredDecoration = decoration.filter(item => item.availability.includes(dateString));
    setAvailableDecoration(filteredDecoration);
    
    // Filter audioVisual
    const filteredAudioVisual = audioVisual.filter(item => item.availability.includes(dateString));
    setAvailableAudioVisual(filteredAudioVisual);
    
    // Filter furniture
    const filteredFurniture = furniture.filter(item => item.availability.includes(dateString));
    setAvailableFurniture(filteredFurniture);
    
    // Filter barServices
    const filteredBarServices = barServices.filter(item => item.availability.includes(dateString));
    setAvailableBarServices(filteredBarServices);
    
    // Filter security
    const filteredSecurity = security.filter(item => item.availability.includes(dateString));
    setAvailableSecurity(filteredSecurity);
  };
  
  // Filter services based on selected date range
  const filterServicesForDateRange = (startDate: Date, endDate: Date) => {
    if (!startDate || !endDate) return;
    
    // Convert all dates in the range to strings in the format 'yyyy-MM-dd'
    const dateStrings = getDatesInRange(startDate, endDate);
    
    // Filter venues that have at least one available date in the selected range
    const filteredVenues = venues.filter(venue => {
      // Check if this venue has at least one available date in the range
      const hasAvailableDate = venue.availability.some(date => dateStrings.includes(date));
      return hasAvailableDate;
    });
    
    // Filter DJs
    const filteredDJs = djs.filter(dj => 
      dj.availability.some(date => dateStrings.includes(date))
    );
    
    // Filter caterers
    const filteredCaterers = cateringServices.filter(caterer => 
      caterer.availability.some(date => dateStrings.includes(date))
    );
    
    // Filter entertainment
    const filteredEntertainment = entertainment.filter(item => 
      item.availability.some(date => dateStrings.includes(date))
    );
    
    // Filter photography
    const filteredPhotography = photography.filter(item => 
      item.availability.some(date => dateStrings.includes(date))
    );
    
    // Filter decoration
    const filteredDecoration = decoration.filter(item => 
      item.availability.some(date => dateStrings.includes(date))
    );
    
    // Filter audioVisual
    const filteredAudioVisual = audioVisual.filter(item => 
      item.availability.some(date => dateStrings.includes(date))
    );
    
    // Filter furniture
    const filteredFurniture = furniture.filter(item => 
      item.availability.some(date => dateStrings.includes(date))
    );
    
    // Filter barServices
    const filteredBarServices = barServices.filter(item => 
      item.availability.some(date => dateStrings.includes(date))
    );
    
    // Filter security
    const filteredSecurity = security.filter(item => 
      item.availability.some(date => dateStrings.includes(date))
    );
    
    // Update available services
    setAvailableVenues(filteredVenues);
    setAvailableDJs(filteredDJs);
    setAvailableCaterers(filteredCaterers);
    setAvailableEntertainment(filteredEntertainment);
    setAvailablePhotography(filteredPhotography);
    setAvailableDecoration(filteredDecoration);
    setAvailableAudioVisual(filteredAudioVisual);
    setAvailableFurniture(filteredFurniture);
    setAvailableBarServices(filteredBarServices);
    setAvailableSecurity(filteredSecurity);

    // Clear any selected services that are no longer available
    const updatedEventData = { ...eventData };
    let hasChanges = false;

    // Check if selected venue is still available
    if (eventData.venueId && !filteredVenues.some(venue => venue.id === eventData.venueId)) {
      updatedEventData.venueId = '';
      hasChanges = true;
    }

    // Check if selected DJ is still available
    if (eventData.djId && !filteredDJs.some(dj => dj.id === eventData.djId)) {
      updatedEventData.djId = '';
      hasChanges = true;
    }

    // Check if selected catering is still available
    if (eventData.cateringId && !filteredCaterers.some(caterer => caterer.id === eventData.cateringId)) {
      updatedEventData.cateringId = '';
      hasChanges = true;
    }

    // Check other services
    if (eventData.entertainmentId && !filteredEntertainment.some(item => item.id === eventData.entertainmentId)) {
      updatedEventData.entertainmentId = '';
      hasChanges = true;
    }

    if (eventData.photographyId && !filteredPhotography.some(item => item.id === eventData.photographyId)) {
      updatedEventData.photographyId = '';
      hasChanges = true;
    }

    if (eventData.decorationId && !filteredDecoration.some(item => item.id === eventData.decorationId)) {
      updatedEventData.decorationId = '';
      hasChanges = true;
    }

    if (eventData.audioVisualId && !filteredAudioVisual.some(item => item.id === eventData.audioVisualId)) {
      updatedEventData.audioVisualId = '';
      hasChanges = true;
    }

    if (eventData.furnitureId && !filteredFurniture.some(item => item.id === eventData.furnitureId)) {
      updatedEventData.furnitureId = '';
      hasChanges = true;
    }

    if (eventData.barServiceId && !filteredBarServices.some(item => item.id === eventData.barServiceId)) {
      updatedEventData.barServiceId = '';
      hasChanges = true;
    }

    if (eventData.securityId && !filteredSecurity.some(item => item.id === eventData.securityId)) {
      updatedEventData.securityId = '';
      hasChanges = true;
    }

    // Update event data if changes were made
    if (hasChanges) {
      setEventData(updatedEventData);
      
      // Also clear any provider-specific dates for services that are no longer available
      const updatedProviderSpecificDates = { ...providerSpecificDates };
      let providerDatesChanged = false;

      Object.keys(providerSpecificDates).forEach(providerId => {
        const provider = updatedProviderSpecificDates[providerId];
        
        // Check if this provider is still available based on its type
        let isAvailable = false;
        switch (provider.type) {
          case 'venue':
            isAvailable = filteredVenues.some(v => v.id === providerId);
            break;
          case 'dj':
            isAvailable = filteredDJs.some(d => d.id === providerId);
            break;
          case 'catering':
            isAvailable = filteredCaterers.some(c => c.id === providerId);
            break;
          case 'entertainment':
            isAvailable = filteredEntertainment.some(e => e.id === providerId);
            break;
          case 'photography':
            isAvailable = filteredPhotography.some(p => p.id === providerId);
            break;
          case 'decoration':
            isAvailable = filteredDecoration.some(d => d.id === providerId);
            break;
          case 'audioVisual':
            isAvailable = filteredAudioVisual.some(a => a.id === providerId);
            break;
          case 'furniture':
            isAvailable = filteredFurniture.some(f => f.id === providerId);
            break;
          case 'barService':
            isAvailable = filteredBarServices.some(b => b.id === providerId);
            break;
          case 'security':
            isAvailable = filteredSecurity.some(s => s.id === providerId);
            break;
        }

        // Remove provider-specific dates if the provider is no longer available
        if (!isAvailable) {
          delete updatedProviderSpecificDates[providerId];
          providerDatesChanged = true;
        }
      });

      // Update provider-specific dates if needed
      if (providerDatesChanged) {
        setProviderSpecificDates(updatedProviderSpecificDates);
      }
    }
  };
  
  // Filter services based on multiple selected dates
  const filterServicesForSelectedDates = (selectedDates: Date[]) => {
    if (!selectedDates.length) return;
    
    // Convert all selected dates to string format 'yyyy-MM-dd'
    const dateStrings = selectedDates.map(date => format(date, 'yyyy-MM-dd'));
    
    // Filter venues that have at least one available date among the selected dates
    const filteredVenues = venues.filter(venue => {
      // Check if this venue has at least one available date in the selected dates
      const hasAvailableDate = venue.availability.some(date => dateStrings.includes(date));
      return hasAvailableDate;
    });
    
    // Filter DJs
    const filteredDJs = djs.filter(dj => 
      dj.availability.some(date => dateStrings.includes(date))
    );
    
    // Filter caterers
    const filteredCaterers = cateringServices.filter(caterer => 
      caterer.availability.some(date => dateStrings.includes(date))
    );
    
    // Filter entertainment
    const filteredEntertainment = entertainment.filter(item => 
      item.availability.some(date => dateStrings.includes(date))
    );
    
    // Filter photography
    const filteredPhotography = photography.filter(item => 
      item.availability.some(date => dateStrings.includes(date))
    );
    
    // Filter decoration
    const filteredDecoration = decoration.filter(item => 
      item.availability.some(date => dateStrings.includes(date))
    );
    
    // Filter audioVisual
    const filteredAudioVisual = audioVisual.filter(item => 
      item.availability.some(date => dateStrings.includes(date))
    );
    
    // Filter furniture
    const filteredFurniture = furniture.filter(item => 
      item.availability.some(date => dateStrings.includes(date))
    );
    
    // Filter barServices
    const filteredBarServices = barServices.filter(item => 
      item.availability.some(date => dateStrings.includes(date))
    );
    
    // Filter security
    const filteredSecurity = security.filter(item => 
      item.availability.some(date => dateStrings.includes(date))
    );
    
    // Update available services
    setAvailableVenues(filteredVenues);
    setAvailableDJs(filteredDJs);
    setAvailableCaterers(filteredCaterers);
    setAvailableEntertainment(filteredEntertainment);
    setAvailablePhotography(filteredPhotography);
    setAvailableDecoration(filteredDecoration);
    setAvailableAudioVisual(filteredAudioVisual);
    setAvailableFurniture(filteredFurniture);
    setAvailableBarServices(filteredBarServices);
    setAvailableSecurity(filteredSecurity);

    // Clear any selected services that are no longer available
    const updatedEventData = { ...eventData };
    let hasChanges = false;

    // Check if selected venue is still available
    if (eventData.venueId && !filteredVenues.some(venue => venue.id === eventData.venueId)) {
      updatedEventData.venueId = '';
      hasChanges = true;
    }

    // Check if selected DJ is still available
    if (eventData.djId && !filteredDJs.some(dj => dj.id === eventData.djId)) {
      updatedEventData.djId = '';
      hasChanges = true;
    }

    // Check if selected catering is still available
    if (eventData.cateringId && !filteredCaterers.some(caterer => caterer.id === eventData.cateringId)) {
      updatedEventData.cateringId = '';
      hasChanges = true;
    }

    // Check other services
    if (eventData.entertainmentId && !filteredEntertainment.some(item => item.id === eventData.entertainmentId)) {
      updatedEventData.entertainmentId = '';
      hasChanges = true;
    }

    if (eventData.photographyId && !filteredPhotography.some(item => item.id === eventData.photographyId)) {
      updatedEventData.photographyId = '';
      hasChanges = true;
    }

    if (eventData.decorationId && !filteredDecoration.some(item => item.id === eventData.decorationId)) {
      updatedEventData.decorationId = '';
      hasChanges = true;
    }

    if (eventData.audioVisualId && !filteredAudioVisual.some(item => item.id === eventData.audioVisualId)) {
      updatedEventData.audioVisualId = '';
      hasChanges = true;
    }

    if (eventData.furnitureId && !filteredFurniture.some(item => item.id === eventData.furnitureId)) {
      updatedEventData.furnitureId = '';
      hasChanges = true;
    }

    if (eventData.barServiceId && !filteredBarServices.some(item => item.id === eventData.barServiceId)) {
      updatedEventData.barServiceId = '';
      hasChanges = true;
    }

    if (eventData.securityId && !filteredSecurity.some(item => item.id === eventData.securityId)) {
      updatedEventData.securityId = '';
      hasChanges = true;
    }

    // Update event data if changes were made
    if (hasChanges) {
      setEventData(updatedEventData);
      
      // Also clear any provider-specific dates for services that are no longer available
      const updatedProviderSpecificDates = { ...providerSpecificDates };
      let providerDatesChanged = false;

      Object.keys(providerSpecificDates).forEach(providerId => {
        const provider = updatedProviderSpecificDates[providerId];
        
        // Check if this provider is still available based on its type
        let isAvailable = false;
        switch (provider.type) {
          case 'venue':
            isAvailable = filteredVenues.some(v => v.id === providerId);
            break;
          case 'dj':
            isAvailable = filteredDJs.some(d => d.id === providerId);
            break;
          case 'catering':
            isAvailable = filteredCaterers.some(c => c.id === providerId);
            break;
          case 'entertainment':
            isAvailable = filteredEntertainment.some(e => e.id === providerId);
            break;
          case 'photography':
            isAvailable = filteredPhotography.some(p => p.id === providerId);
            break;
          case 'decoration':
            isAvailable = filteredDecoration.some(d => d.id === providerId);
            break;
          case 'audioVisual':
            isAvailable = filteredAudioVisual.some(a => a.id === providerId);
            break;
          case 'furniture':
            isAvailable = filteredFurniture.some(f => f.id === providerId);
            break;
          case 'barService':
            isAvailable = filteredBarServices.some(b => b.id === providerId);
            break;
          case 'security':
            isAvailable = filteredSecurity.some(s => s.id === providerId);
            break;
        }

        // Remove provider-specific dates if the provider is no longer available
        if (!isAvailable) {
          delete updatedProviderSpecificDates[providerId];
          providerDatesChanged = true;
        }
      });

      // Update provider-specific dates if needed
      if (providerDatesChanged) {
        setProviderSpecificDates(updatedProviderSpecificDates);
      }
    }
  };
  
  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };
  
  // Handle form input changes
  const handleChange = (field: string, value: any) => {
    setEventData({
      ...eventData,
      [field]: value,
    });
  };
  
  // Handle date type toggle
  const handleDateTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newDateType: boolean,
  ) => {
    if (newDateType !== null) {
      setEventData({
        ...eventData,
        isMultiDay: newDateType,
      });
    }
  };
  
  // Handle date selection in multi-select mode
  const handleDateSelection = (date: Date) => {
    if (eventData.isMultiSelect) {
      // In multi-select mode, toggle individual dates
      const dateString = format(date, 'yyyy-MM-dd');
      const dateExists = eventData.selectedDates.some(d => format(d, 'yyyy-MM-dd') === dateString);
      
      if (dateExists) {
        // Remove date if already selected
        setEventData({
          ...eventData,
          selectedDates: eventData.selectedDates.filter(d => format(d, 'yyyy-MM-dd') !== dateString)
        });
      } else {
        // Add date if not already selected
        setEventData({
          ...eventData,
          selectedDates: [...eventData.selectedDates, date]
        });
      }
    } else if (eventData.isMultiDay) {
      // In range mode, handle range selection
      if (!eventData.dateRange.start || (eventData.dateRange.start && eventData.dateRange.end)) {
        // Start a new range
        setEventData({
          ...eventData,
          dateRange: { 
            start: date, 
            end: null 
          }
        });
      } else {
        // Complete the range
        const start = eventData.dateRange.start;
        if (date < start!) {
          // If clicked date is before start, swap them
          setEventData({
            ...eventData,
            dateRange: { 
              start: date, 
              end: start 
            }
          });
        } else {
          setEventData({
            ...eventData,
            dateRange: { 
              start: start, 
              end: date 
            }
          });
        }
      }
    } else {
      // Single date selection
      setEventData({
        ...eventData,
        date: date
      });
    }
  };
  
  // Handle selection mode toggle
  const handleSelectionModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newSelectionMode: string,
  ) => {
    if (newSelectionMode === null) return;
    
    const isMultiDay = newSelectionMode === 'range';
    const isMultiSelect = newSelectionMode === 'multiple';
    
    setEventData({
      ...eventData,
      isMultiDay,
      isMultiSelect,
      // Reset date selections when changing modes
      date: null,
      dateRange: { start: null, end: null },
      selectedDates: []
    });
  };
  
  // Modified service selection handler
  const handleServiceSelect = (type: ServiceType, id: string) => {
    // Check if we're in date range or multi-select mode
    if (
      // Date range mode with valid range
      (eventData.isMultiDay && eventData.dateRange.start && eventData.dateRange.end) || 
      // OR multi-select mode with selected dates
      (eventData.isMultiSelect && eventData.selectedDates.length > 0)
    ) {
      
      // Find the provider object
      let provider: ServiceProvider | undefined;
      switch (type) {
        case 'venue':
          provider = availableVenues.find(v => v.id === id);
          break;
        case 'dj':
          provider = availableDJs.find(d => d.id === id);
          break;
        case 'catering':
          provider = availableCaterers.find(c => c.id === id);
          break;
        case 'entertainment':
          provider = availableEntertainment.find(e => e.id === id);
          break;
        case 'photography':
          provider = availablePhotography.find(p => p.id === id);
          break;
        case 'decoration':
          provider = availableDecoration.find(d => d.id === id);
          break;
        case 'audioVisual':
          provider = availableAudioVisual.find(a => a.id === id);
          break;
        case 'furniture':
          provider = availableFurniture.find(f => f.id === id);
          break;
        case 'barService':
          provider = availableBarServices.find(b => b.id === id);
          break;
        case 'security':
          provider = availableSecurity.find(s => s.id === id);
          break;
      }
      
      if (!provider) {
        console.error(`Provider not found: ${type} with ID ${id}`);
        return;
      }
      
      // Get available dates within the selected range - this is a safeguard
      // even though we already filter the list of services based on availability
      let availableDatesInRange: string[] = [];
      
      if (eventData.isMultiSelect && eventData.selectedDates.length > 0) {
        // For multi-select mode, check against selectedDates
        availableDatesInRange = eventData.selectedDates
          .map(date => format(date, 'yyyy-MM-dd'))
          .filter(dateStr => provider!.availability.includes(dateStr));
      } else if (eventData.isMultiDay && eventData.dateRange.start && eventData.dateRange.end) {
        // For date range mode, check against the date range
        availableDatesInRange = getDatesInRange(
          eventData.dateRange.start, 
          eventData.dateRange.end
        ).filter(dateStr => provider!.availability.includes(dateStr));
      }
      
      if (availableDatesInRange.length === 0) {
        // If no dates are available, show a helpful message and don't proceed with date selection
        setSnackbarMessage(`${provider.name} has no available dates within your selected ${eventData.isMultiDay ? 'date range' : 'dates'}. Please choose another ${type}.`);
        setSnackbarOpen(true);
        return;
      }
      
      // If there are available dates, proceed with the date selection
      setCurrentSelectingProvider(provider);
      setCurrentSelectingProviderType(type);
      setIsSelectingProviderDates(true);
      
      // Convert available dates to Date objects for the date selector
      const availableDatesAsDateObjects = availableDatesInRange.map(dateStr => new Date(dateStr));
      
      // Log the available dates for debugging
      console.log(`Available dates for ${type} ${provider.name}:`, availableDatesInRange);
      
      // Pass these dates to the date selector component
      setAvailableDatesForDisplay(availableDatesAsDateObjects);
      
      // Initialize or retrieve existing selected dates for this provider
      const existingData = providerSpecificDates[id];
      if (existingData) {
        if (eventData.isMultiSelect) {
          setTempSelectedDates(existingData.dates || []);
        } else {
          setTempSelectedDate(existingData.date || null);
        }
      } else {
        // Use the first available date as default if in single date mode and no existing selection
        if (!eventData.isMultiSelect && availableDatesInRange.length > 0) {
          const firstAvailableDate = new Date(availableDatesInRange[0]);
          setTempSelectedDate(firstAvailableDate);
          setTempSelectedDates([firstAvailableDate]);
        } else {
          setTempSelectedDate(null);
          setTempSelectedDates([]);
        }
      }
    } else {
      // If not in multi-date mode, just set the provider directly
      handleChange(serviceTypeToFieldMap[type], id);
      
      // If a venue is selected, filter DJs and caterers based on travel distance
      if (type === 'venue') {
        // First filter by date availability
        let filteredDJs = availableDJs;
        let filteredCaterers = availableCaterers;
        
        // Then filter by travel distance
        const djsWithinTravelDistance = filterDJsByTravelDistance(id);
        const caterersWithinTravelDistance = filterCaterersByTravelDistance(id);
        
        // Apply both filters
        filteredDJs = filteredDJs.filter(dj => 
          djsWithinTravelDistance.some(travelDj => travelDj.id === dj.id)
        );
        
        filteredCaterers = filteredCaterers.filter(caterer => 
          caterersWithinTravelDistance.some(travelCaterer => travelCaterer.id === caterer.id)
        );
        
        setAvailableDJs(filteredDJs);
        setAvailableCaterers(filteredCaterers);
      }
    }
  };
  
  // Helper function to get all dates in range as strings in 'yyyy-MM-dd' format
  const getDatesInRange = (startDate: Date | null, endDate: Date | null): string[] => {
    if (!startDate || !endDate) return [];
    
    const dateStrings: string[] = [];
    let currentDate = new Date(startDate);
    const endDateCopy = new Date(endDate);
    
    while (currentDate <= endDateCopy) {
      dateStrings.push(format(currentDate, 'yyyy-MM-dd'));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dateStrings;
  };
  
  // Helper function to get the field name for provider type
  const getFieldForType = (type: string): string => {
    const fieldMap: Record<string, string> = {
      'venue': 'venueId',
      'dj': 'djId',
      'catering': 'cateringId',
      'entertainment': 'entertainmentId',
      'photography': 'photographyId',
      'decoration': 'decorationId',
      'audioVisual': 'audioVisualId',
      'furniture': 'furnitureId',
      'barService': 'barServiceId',
      'security': 'securityId',
    };
    
    return fieldMap[type] || '';
  };
  
  // Helper function to check if provider has any available dates in the selected range
  const checkProviderAvailability = (provider: ServiceProvider | undefined, startDate: Date | null, endDate: Date | null): boolean => {
    if (!startDate || !endDate || !provider || !provider.availability) return false;
    
    // Get all dates in the range
    const dateStrings = getDatesInRange(startDate, endDate);
    
    // Check if provider has at least one available date in the range
    return provider.availability.some((date: string) => dateStrings.includes(date));
  };
  
  // Handler for selecting a date for a specific provider - simple implementation
  const handleProviderDateSelect = (date: Date) => {
    // Get the date string for comparison
    const dateString = format(date, 'yyyy-MM-dd');
    
    if (eventData.isMultiSelect) {
      // For multiple date selection
      const dateExists = tempSelectedDates.some(d => format(d, 'yyyy-MM-dd') === dateString);
      
      if (dateExists) {
        // Remove the date if it's already selected
        const updatedDates = tempSelectedDates.filter(d => format(d, 'yyyy-MM-dd') !== dateString);
        setTempSelectedDates(updatedDates);
        
        // If this was the only date or we removed the current tempSelectedDate,
        // set the single selection to the first remaining date or null
        if (updatedDates.length === 0) {
          setTempSelectedDate(null);
        } else if (tempSelectedDate && format(tempSelectedDate, 'yyyy-MM-dd') === dateString) {
          setTempSelectedDate(updatedDates[0]);
        }
      } else {
        // Add the date if it's not already selected
        const updatedDates = [...tempSelectedDates, date];
        setTempSelectedDates(updatedDates);
        
        // Also update single selection for consistency
        setTempSelectedDate(date);
      }
    } else {
      // Single date selection - just replace both states
      setTempSelectedDate(date);
      setTempSelectedDates([date]);
    }
  };
  
  // Handler for confirming provider-specific date selection
  const handleConfirmProviderDateSelection = () => {
    if (!currentSelectingProvider || !currentSelectingProviderType) return;
    
    // Save the selected dates for this provider
    setProviderSpecificDates({
      ...providerSpecificDates,
      [currentSelectingProvider.id]: {
        type: currentSelectingProviderType,
        date: tempSelectedDate,
        dates: tempSelectedDates
      }
    });
    
    // Set the provider ID in the eventData
    handleChange(serviceTypeToFieldMap[currentSelectingProviderType], currentSelectingProvider.id);
    
    // If a venue is selected, filter DJs and caterers based on travel distance and selected dates
    if (currentSelectingProviderType === 'venue') {
      // First filter by date availability
      let filteredDJs = availableDJs;
      let filteredCaterers = availableCaterers;
      
      // Then filter by travel distance
      const djsWithinTravelDistance = filterDJsByTravelDistance(currentSelectingProvider.id);
      const caterersWithinTravelDistance = filterCaterersByTravelDistance(currentSelectingProvider.id);
      
      // Apply both filters
      filteredDJs = filteredDJs.filter(dj => 
        djsWithinTravelDistance.some(travelDj => travelDj.id === dj.id)
      );
      
      filteredCaterers = filteredCaterers.filter(caterer => 
        caterersWithinTravelDistance.some(travelCaterer => travelCaterer.id === caterer.id)
      );
      
      setAvailableDJs(filteredDJs);
      setAvailableCaterers(filteredCaterers);
      
      // Apply the new cascading filter to prioritize providers available on selected dates
      if (eventData.dateRange.start && eventData.dateRange.end) {
        filterForPriorSelections(eventData.dateRange.start, eventData.dateRange.end);
      }
    }
    
    // Reset the provider date selection state
    setIsSelectingProviderDates(false);
    setCurrentSelectingProvider(null);
    setCurrentSelectingProviderType(null);
    setTempSelectedDate(null);
    setTempSelectedDates([]);
    
    // Return to the services tab
    setActiveTab('services');
  };
  
  // Handler for canceling provider-specific date selection
  const handleCancelProviderDateSelection = () => {
    setIsSelectingProviderDates(false);
    setCurrentSelectingProvider(null);
    setCurrentSelectingProviderType(null);
    setTempSelectedDate(null);
    setTempSelectedDates([]);
  };
  
  // Navigate to previous month in calendar
  const handlePrevMonth = () => {
    setCalendarDate(prevDate => subMonths(prevDate, 1));
  };
  
  // Navigate to next month in calendar
  const handleNextMonth = () => {
    setCalendarDate(prevDate => addMonths(prevDate, 1));
  };
  
  // handleSubmit function to validate and submit form
  const handleSubmit = () => {
    // Check if all required services are selected
    if (!hasRequiredServices()) {
      setSnackbarMessage('Please select a venue before proceeding.');
      setSnackbarOpen(true);
      return;
    }
    
    // Check if dates are selected
    if (
      (!eventData.date && !eventData.isMultiDay && !eventData.isMultiSelect) ||
      (eventData.isMultiDay && (!eventData.dateRange.start || !eventData.dateRange.end)) ||
      (eventData.isMultiSelect && eventData.selectedDates.length === 0)
    ) {
      setSnackbarMessage('Please select at least one date for your event.');
      setSnackbarOpen(true);
      return;
    }
    
    // Create a copy of the event data with formatted dates for the payment page
    const formattedEventData = {
      ...eventData,
      // Format date if it exists
      date: eventData.date ? format(eventData.date, 'yyyy-MM-dd\'T\'HH:mm:ss') : null,
      // Format dateRange if it exists
      dateRange: {
        start: eventData.dateRange.start ? format(eventData.dateRange.start, 'yyyy-MM-dd\'T\'HH:mm:ss') : null,
        end: eventData.dateRange.end ? format(eventData.dateRange.end, 'yyyy-MM-dd\'T\'HH:mm:ss') : null,
      },
      // Format selectedDates if they exist
      selectedDates: eventData.selectedDates.map(date => format(date, 'yyyy-MM-dd\'T\'HH:mm:ss')),
      // Add event name for display in payment page
      eventName: eventData.name,
    };
    
    // Navigate to the payment page with formatted event data
    navigate('/payment', { 
      state: { 
        eventData: formattedEventData,
        venues: availableVenues,
        djs: availableDJs,
        caterings: availableCaterers,
        entertainment: availableEntertainment,
        photography: availablePhotography,
        decoration: availableDecoration,
        audioVisual: availableAudioVisual,
        furniture: availableFurniture,
        barService: availableBarServices,
        security: availableSecurity,
        providerSpecificDates
      } 
    });
  };
  
  // Apply filters to available services
  const applyFilters = () => {
    // This function is now only used for the initial loading and when filters change
    // without a date selection
    if (!eventData.date && (!eventData.dateRange.start || !eventData.dateRange.end)) {
      let filteredVenues = availableVenues;
      let filteredDJs = availableDJs;
      let filteredCaterers = availableCaterers;
      
      // Apply venue filters
      if (venueFilters.types.length > 0) {
        filteredVenues = filteredVenues.filter(venue => 
          venueFilters.types.includes(venue.type)
        );
      }
      
      if (venueFilters.styles.length > 0) {
        filteredVenues = filteredVenues.filter(venue => 
          venue.style.some(style => venueFilters.styles.includes(style))
        );
      }
      
      filteredVenues = filteredVenues.filter(venue => venue.price <= venueFilters.maxPrice);
      
      // Apply DJ filters
      if (djFilters.genres.length > 0) {
        filteredDJs = filteredDJs.filter(dj => 
          dj.genres.some(genre => djFilters.genres.includes(genre))
        );
      }
      
      filteredDJs = filteredDJs.filter(dj => dj.price <= djFilters.maxPrice);
      
      // Apply catering filters
      if (cateringFilters.cuisineTypes.length > 0) {
        filteredCaterers = filteredCaterers.filter(caterer => 
          caterer.cuisineType.some(cuisine => cateringFilters.cuisineTypes.includes(cuisine))
        );
      }
      
      filteredCaterers = filteredCaterers.filter(caterer => caterer.price <= cateringFilters.maxPrice);
      
      // Update available services with filtered results
      setAvailableVenues(filteredVenues);
      setAvailableDJs(filteredDJs);
      setAvailableCaterers(filteredCaterers);
    }
  };

  // Handle filter changes
  const handleVenueFilterChange = (filter: string, value: any) => {
    setVenueFilters({
      ...venueFilters,
      [filter]: value
    });
  };

  const handleDjFilterChange = (filter: string, value: any) => {
    setDjFilters({
      ...djFilters,
      [filter]: value
    });
  };

  const handleCateringFilterChange = (filter: string, value: any) => {
    setCateringFilters({
      ...cateringFilters,
      [filter]: value
    });
  };
  
  // Add reset filter functions
  const resetVenueFilters = () => {
    setVenueFilters({
      types: [],
      maxPrice: 3000,
      styles: []
    });
  };
  
  const resetDjFilters = () => {
    setDjFilters({
      genres: [],
      maxPrice: 1000
    });
  };
  
  const resetCateringFilters = () => {
    setCateringFilters({
      cuisineTypes: [],
      maxPrice: 100
    });
  };
  
  // Add reset functions for new service categories
  const resetEntertainmentFilters = () => {
    setEntertainmentFilters({
      types: [],
      maxPrice: 1000
    });
  };
  
  const resetPhotographyFilters = () => {
    setPhotographyFilters({
      types: [],
      styles: [],
      maxPrice: 1000
    });
  };
  
  const resetDecorationFilters = () => {
    setDecorationFilters({
      types: [],
      styles: [],
      maxPrice: 1000
    });
  };
  
  const resetAudioVisualFilters = () => {
    setAudioVisualFilters({
      equipmentTypes: [],
      maxPrice: 1000
    });
  };
  
  const resetFurnitureFilters = () => {
    setFurnitureFilters({
      itemTypes: [],
      styles: [],
      maxPrice: 1000
    });
  };
  
  const resetBarServiceFilters = () => {
    setBarServiceFilters({
      serviceTypes: [],
      maxPrice: 1000
    });
  };
  
  const resetSecurityFilters = () => {
    setSecurityFilters({
      serviceTypes: [],
      maxPrice: 1000
    });
  };
  
  const resetAllFilters = () => {
    resetVenueFilters();
    resetDjFilters();
    resetCateringFilters();
    resetEntertainmentFilters();
    resetPhotographyFilters();
    resetDecorationFilters();
    resetAudioVisualFilters();
    resetFurnitureFilters();
    resetBarServiceFilters();
    resetSecurityFilters();
  };
  
  // Function to check if a date has matching options
  const checkDateAvailability = () => {
    // Get all unique dates from venues, DJs, and caterers
    const allDates = new Set<string>();
    
    // Apply filters to get filtered services
    let filteredVenues = venues;
    let filteredDJs = djs;
    let filteredCaterers = cateringServices;
    let filteredEntertainment = entertainment;
    let filteredPhotography = photography;
    let filteredDecoration = decoration;
    let filteredAudioVisual = audioVisual;
    let filteredFurniture = furniture;
    let filteredBarServices = barServices;
    let filteredSecurity = security;
    
    // Apply venue filters
    if (venueFilters.types.length > 0) {
      filteredVenues = filteredVenues.filter(venue => 
        venueFilters.types.includes(venue.type)
      );
    }
    
    if (venueFilters.styles.length > 0) {
      filteredVenues = filteredVenues.filter(venue => 
        venue.style.some(style => venueFilters.styles.includes(style))
      );
    }
    
    filteredVenues = filteredVenues.filter(venue => venue.price <= venueFilters.maxPrice);
    
    // Apply DJ filters
    if (djFilters.genres.length > 0) {
      filteredDJs = filteredDJs.filter(dj => 
        dj.genres.some(genre => djFilters.genres.includes(genre))
      );
    }
    
    filteredDJs = filteredDJs.filter(dj => dj.price <= djFilters.maxPrice);
    
    // Apply catering filters
    if (cateringFilters.cuisineTypes.length > 0) {
      filteredCaterers = filteredCaterers.filter(caterer => 
        caterer.cuisineType.some(cuisine => cateringFilters.cuisineTypes.includes(cuisine))
      );
    }
    
    filteredCaterers = filteredCaterers.filter(caterer => caterer.price <= cateringFilters.maxPrice);
    
    // Apply entertainment filters
    if (entertainmentFilters.types.length > 0) {
      filteredEntertainment = filteredEntertainment.filter(item => 
        item.type.some(type => entertainmentFilters.types.includes(type))
      );
    }
    
    filteredEntertainment = filteredEntertainment.filter(item => item.price <= entertainmentFilters.maxPrice);
    
    // Apply photography filters
    if (photographyFilters.types.length > 0) {
      filteredPhotography = filteredPhotography.filter(item => 
        item.type.some(type => photographyFilters.types.includes(type))
      );
    }
    
    if (photographyFilters.styles.length > 0) {
      filteredPhotography = filteredPhotography.filter(item => 
        item.style.some(style => photographyFilters.styles.includes(style))
      );
    }
    
    filteredPhotography = filteredPhotography.filter(item => item.price <= photographyFilters.maxPrice);
    
    // Apply decoration filters
    if (decorationFilters.types.length > 0) {
      filteredDecoration = filteredDecoration.filter(item => 
        item.type.some(type => decorationFilters.types.includes(type))
      );
    }
    
    if (decorationFilters.styles.length > 0) {
      filteredDecoration = filteredDecoration.filter(item => 
        item.style.some(style => decorationFilters.styles.includes(style))
      );
    }
    
    filteredDecoration = filteredDecoration.filter(item => item.price <= decorationFilters.maxPrice);
    
    // Apply audio visual filters
    if (audioVisualFilters.equipmentTypes.length > 0) {
      filteredAudioVisual = filteredAudioVisual.filter(item => 
        item.equipmentTypes.some(type => audioVisualFilters.equipmentTypes.includes(type))
      );
    }
    
    filteredAudioVisual = filteredAudioVisual.filter(item => item.price <= audioVisualFilters.maxPrice);
    
    // Apply furniture filters
    if (furnitureFilters.itemTypes.length > 0) {
      filteredFurniture = filteredFurniture.filter(item => 
        item.itemTypes.some(type => furnitureFilters.itemTypes.includes(type))
      );
    }
    
    if (furnitureFilters.styles.length > 0) {
      filteredFurniture = filteredFurniture.filter(item => 
        item.style.some(style => furnitureFilters.styles.includes(style))
      );
    }
    
    filteredFurniture = filteredFurniture.filter(item => item.price <= furnitureFilters.maxPrice);
    
    // Apply bar service filters
    if (barServiceFilters.serviceTypes.length > 0) {
      filteredBarServices = filteredBarServices.filter(item => 
        item.serviceTypes.some(type => barServiceFilters.serviceTypes.includes(type))
      );
    }
    
    filteredBarServices = filteredBarServices.filter(item => item.price <= barServiceFilters.maxPrice);
    
    // Apply security filters
    if (securityFilters.serviceTypes.length > 0) {
      filteredSecurity = filteredSecurity.filter(item => 
        item.serviceTypes.some(type => securityFilters.serviceTypes.includes(type))
      );
    }
    
    filteredSecurity = filteredSecurity.filter(item => item.price <= securityFilters.maxPrice);
    
    // Get all dates where at least one venue, one DJ, and one caterer are available
    const venueDates = new Set<string>();
    const djDates = new Set<string>();
    const catererDates = new Set<string>();
    const entertainmentDates = new Set<string>();
    const photographyDates = new Set<string>();
    const decorationDates = new Set<string>();
    const audioVisualDates = new Set<string>();
    const furnitureDates = new Set<string>();
    const barServiceDates = new Set<string>();
    const securityDates = new Set<string>();
    
    filteredVenues.forEach(venue => {
      venue.availability.forEach(date => venueDates.add(date));
    });
    
    filteredDJs.forEach(dj => {
      dj.availability.forEach(date => djDates.add(date));
    });
    
    filteredCaterers.forEach(caterer => {
      caterer.availability.forEach(date => catererDates.add(date));
    });
    
    filteredEntertainment.forEach(item => {
      item.availability.forEach(date => entertainmentDates.add(date));
    });
    
    filteredPhotography.forEach(item => {
      item.availability.forEach(date => photographyDates.add(date));
    });
    
    filteredDecoration.forEach(item => {
      item.availability.forEach(date => decorationDates.add(date));
    });
    
    filteredAudioVisual.forEach(item => {
      item.availability.forEach(date => audioVisualDates.add(date));
    });
    
    filteredFurniture.forEach(item => {
      item.availability.forEach(date => furnitureDates.add(date));
    });
    
    filteredBarServices.forEach(item => {
      item.availability.forEach(date => barServiceDates.add(date));
    });
    
    filteredSecurity.forEach(item => {
      item.availability.forEach(date => securityDates.add(date));
    });
    
    // Find dates that have at least one venue, one DJ, and one caterer available
    // For optional categories, only check if they're included in the event
    venueDates.forEach(date => {
      if (djDates.has(date) && 
          (!includedCategories.includes('catering') || catererDates.has(date)) &&
          (!includedCategories.includes('entertainment') || entertainmentDates.has(date)) &&
          (!includedCategories.includes('photography') || photographyDates.has(date)) &&
          (!includedCategories.includes('decoration') || decorationDates.has(date)) &&
          (!includedCategories.includes('audioVisual') || audioVisualDates.has(date)) &&
          (!includedCategories.includes('furniture') || furnitureDates.has(date)) &&
          (!includedCategories.includes('barService') || barServiceDates.has(date)) &&
          (!includedCategories.includes('security') || securityDates.has(date))) {
        allDates.add(date);
      }
    });
    
    // Convert string dates to Date objects with proper error handling
    const availableDateObjects = Array.from(allDates).map(dateStr => {
      try {
        const parsedDate = new Date(dateStr);
        // Check if the date is valid
        if (isNaN(parsedDate.getTime())) {
          console.warn(`Invalid date string: ${dateStr}`);
          return null;
        }
        return parsedDate;
      } catch (error) {
        console.error(`Error parsing date: ${dateStr}`, error);
        return null;
      }
    }).filter((date): date is Date => date !== null); // Filter out null values and type assertion
    
    setAvailableDates(availableDateObjects);
  };
  
  // Call checkDateAvailability when filters change
  useEffect(() => {
    checkDateAvailability();
    applyFilters(); // Automatically apply filters when they change
  }, [venueFilters, djFilters, cateringFilters]);
  
  // Handle saving draft
  const handleSaveDraft = () => {
    setSaveDialogOpen(true);
  };
  
  const confirmSaveDraft = () => {
    try {
      localStorage.setItem('eventDraft', JSON.stringify(eventData));
      localStorage.setItem('eventDraftName', draftName || 'Untitled Event');
      setSnackbarMessage('Draft saved successfully');
      setSnackbarOpen(true);
      setSaveDialogOpen(false);
    } catch (error) {
      console.error('Error saving draft:', error);
      setSnackbarMessage('Error saving draft');
      setSnackbarOpen(true);
    }
  };
  
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  
  // Filter recommendations based on current filters
  const filteredRecommendations = useMemo(() => {
    return recommendedCombinations.filter(combo => {
      const venue = venues.find(v => v.id === combo.venueId);
      const dj = djs.find(d => d.id === combo.djId);
      const catering = cateringServices.find(c => c.id === combo.cateringId);
      
      // Check if all services exist
      if (!venue || !dj || !catering) return false;
      
      // Check venue filters
      if (venueFilters.types.length > 0 && !venueFilters.types.includes(venue.type)) return false;
      if (venueFilters.styles.length > 0 && !venue.style.some(style => venueFilters.styles.includes(style))) return false;
      if (venue.price > venueFilters.maxPrice) return false;
      
      // Check DJ filters
      if (djFilters.genres.length > 0 && !dj.genres.some(genre => djFilters.genres.includes(genre))) return false;
      if (dj.price > djFilters.maxPrice) return false;
      
      // Check catering filters
      if (cateringFilters.cuisineTypes.length > 0 && !catering.cuisineType.some(cuisine => cateringFilters.cuisineTypes.includes(cuisine))) return false;
      if (catering.price > cateringFilters.maxPrice) return false;
      
      return true;
    });
  }, [venueFilters, djFilters, cateringFilters]);
  
  // Apply a recommended combination
  const applyRecommendation = (combo: RecommendedCombination) => {
    setEventData({
      ...eventData,
      venueId: combo.venueId,
      djId: combo.djId,
      cateringId: combo.cateringId
    });
    
    setSnackbarMessage(`Applied "${combo.name}" package`);
    setSnackbarOpen(true);
    setShowRecommendations(false);
  };
  
  // Replace getStepContent with getTabContent
  const getTabContent = (tabId: string) => {
    switch (tabId) {
      case 'dates':
        // This is the content from the original step 0
        return (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Plan Your Event
            </Typography>
            
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                Event Details
              </Typography>
            
            <TextField
              fullWidth
              label="Event Name"
              value={eventData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              margin="normal"
            />
            
            <TextField
              fullWidth
              label="Expected Attendees"
              type="number"
              value={eventData.attendees}
              onChange={(e) => handleChange('attendees', parseInt(e.target.value))}
              margin="normal"
            />
            
            <FormGroup sx={{ mt: 2 }}>
              {/* Removed the isPublic checkbox as there's no public/private distinction anymore */}
            </FormGroup>
            </Paper>
            
            {/* Recommended Packages Section */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="medium">
                  Recommended Packages
                </Typography>
                <Button 
                  size="small" 
                  onClick={() => setShowRecommendations(!showRecommendations)}
                >
                  {showRecommendations ? 'Hide Packages' : 'Show Packages'}
                </Button>
          </Box>
              
              {showRecommendations && (
                <Box sx={{ mt: 2 }}>
                  {filteredRecommendations.length > 0 ? (
                    <Grid container spacing={2}>
                      {filteredRecommendations.map((combo) => {
                        const venue = venues.find(v => v.id === combo.venueId);
                        const dj = djs.find(d => d.id === combo.djId);
                        const catering = cateringServices.find(c => c.id === combo.cateringId);
                        
                        if (!venue || !dj || !catering) return null;
                        
                        const packagePrice = venue.price + dj.price + (catering.price * eventData.attendees);
                        
                        return (
                          <Grid item xs={12} sm={6} key={combo.id}>
                            <Card>
                              <CardContent>
                                <Typography variant="h6" gutterBottom>
                                  {combo.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                  {combo.description}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                  <strong>Venue:</strong> {venue.name}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                  <strong>DJ:</strong> {dj.name}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                  <strong>Catering:</strong> {catering.name}
                                </Typography>
                                <Typography variant="body1" fontWeight="bold" sx={{ mt: 1 }}>
                                  Package Price: ${packagePrice.toLocaleString()}
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                                  {combo.tags.map((tag) => (
                                    <Chip key={tag} label={tag} size="small" />
                                  ))}
                                </Box>
                              </CardContent>
                              <CardActionArea onClick={() => applyRecommendation(combo)}>
                                <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white', textAlign: 'center' }}>
                                  Apply Package
                                </Box>
                              </CardActionArea>
                            </Card>
                          </Grid>
                        );
                      })}
                    </Grid>
                  ) : (
                    <Alert severity="info">
                      No recommended packages match your current filters. Try adjusting your preferences or create a custom combination.
                    </Alert>
                  )}
                </Box>
              )}
            </Paper>
            
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                Date Selection
              </Typography>
              
              <ToggleButtonGroup
                value={eventData.isMultiSelect ? 'multiple' : (eventData.isMultiDay ? 'range' : 'single')}
                exclusive
                onChange={handleSelectionModeChange}
                aria-label="date selection mode"
                fullWidth
                sx={{ mb: 3 }}
              >
                <ToggleButton value="single" aria-label="single day">
                  Single Day
                </ToggleButton>
                <ToggleButton value="range" aria-label="date range">
                  Date Range
                </ToggleButton>
                <ToggleButton value="multiple" aria-label="multiple days">
                  Multiple Days
                </ToggleButton>
              </ToggleButtonGroup>
              
              {/* Date selection summary */}
              {eventData.isMultiSelect && eventData.selectedDates.length > 0 && (
                <Box sx={{ mt: 2, mb: 2, display: 'flex', alignItems: 'center' }}>
                  <EventIcon color="primary" sx={{ mr: 1 }} />
                  <Typography>
                    Selected {eventData.selectedDates.length} date{eventData.selectedDates.length > 1 ? 's' : ''}:
                    {' '}
                    {eventData.selectedDates
                      .sort((a, b) => a.getTime() - b.getTime())
                      .map(date => format(date, 'MMM d, yyyy'))
                      .join(', ')}
                  </Typography>
                </Box>
              )}
              
              {eventData.isMultiDay && eventData.dateRange.start && eventData.dateRange.end && (
                <Box sx={{ mt: 2, mb: 2, display: 'flex', alignItems: 'center' }}>
                  <EventIcon color="primary" sx={{ mr: 1 }} />
                  <Typography>
                    {format(eventData.dateRange.start, 'MMM d, yyyy')} - {format(eventData.dateRange.end, 'MMM d, yyyy')}
                    {' '}
                    ({Math.round((eventData.dateRange.end.getTime() - eventData.dateRange.start.getTime()) / (1000 * 60 * 60 * 24)) + 1} days)
                  </Typography>
                </Box>
              )}
              
              {!eventData.isMultiDay && !eventData.isMultiSelect && eventData.date && (
                <Box sx={{ mt: 2, mb: 2, display: 'flex', alignItems: 'center' }}>
                  <EventIcon color="primary" sx={{ mr: 1 }} />
                  <Typography>
                    {format(eventData.date, 'MMM d, yyyy')}
                  </Typography>
                </Box>
              )}
              
              <Box sx={{ mt: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2">
                    Calendar
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={handlePrevMonth} size="small">
                      <ChevronLeftIcon />
                    </IconButton>
                    <Typography sx={{ mx: 1 }}>
                      {format(calendarDate, 'MMMM yyyy')}
                    </Typography>
                    <IconButton onClick={handleNextMonth} size="small">
                      <ChevronRightIcon />
                    </IconButton>
                  </Box>
                </Box>
                
                <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <Box key={day} sx={{ textAlign: 'center', fontWeight: 'bold', p: 1 }}>
                        {day}
                      </Box>
                    ))}
                    
                    {(() => {
                      // Generate calendar for selected month
                      const currentMonth = getMonth(calendarDate);
                      const currentYear = getYear(calendarDate);
                      
                      // First day of the month
                      const firstDay = startOfMonth(calendarDate);
                      const startingDayOfWeek = firstDay.getDay();
                      
                      // Last day of the month
                      const lastDay = new Date(currentYear, currentMonth + 1, 0);
                      const daysInMonth = lastDay.getDate();
                      
                      // Generate calendar cells
                      const calendarCells = [];
                      
                      // Add empty cells for days before the first of the month
                      for (let i = 0; i < startingDayOfWeek; i++) {
                        calendarCells.push(
                          <Box key={`empty-${i}`} sx={{ p: 1, textAlign: 'center', color: 'text.disabled' }}></Box>
                        );
                      }
                      
                      // Add cells for each day of the month
                      for (let day = 1; day <= daysInMonth; day++) {
                        const date = new Date(currentYear, currentMonth, day);
                        const dateString = format(date, 'yyyy-MM-dd');
                        
                        // Check if this date is available
                        const isAvailable = availableDates.some(availableDate => 
                          format(availableDate, 'yyyy-MM-dd') === dateString
                        );
                        
                        // Check if this is today
                        const today = new Date();
                        const isToday = day === today.getDate() && 
                                        currentMonth === today.getMonth() && 
                                        currentYear === today.getFullYear();
                        
                        // Check if this date is in the past
                        const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
                        
                        // Check if this date is selected
                        const isSelected = eventData.isMultiSelect 
                          ? eventData.selectedDates.some(d => format(d, 'yyyy-MM-dd') === dateString)
                          : eventData.isMultiDay 
                            ? (eventData.dateRange.start && eventData.dateRange.end && 
                               date >= eventData.dateRange.start && date <= eventData.dateRange.end)
                            : (eventData.date && format(eventData.date, 'yyyy-MM-dd') === dateString);
                        
                        calendarCells.push(
                          <Box 
                            key={day} 
                            sx={{ 
                              p: 1, 
                              textAlign: 'center', 
                              borderRadius: 1,
                              border: isToday ? '2px solid' : '1px solid',
                              borderColor: isToday ? 'primary.main' : 'divider',
                              bgcolor: isSelected 
                                ? 'primary.main' 
                                : isAvailable 
                                  ? 'success.light' 
                                  : 'background.paper',
                              color: isSelected 
                                ? 'primary.contrastText' 
                                : isAvailable 
                                  ? 'success.contrastText' 
                                  : isPast
                                    ? 'text.disabled'
                                    : 'text.primary',
                              cursor: isPast ? 'not-allowed' : 'pointer',
                              opacity: isPast ? 0.5 : 1,
                              '&:hover': {
                                bgcolor: isPast 
                                  ? undefined 
                                  : isSelected 
                                    ? 'primary.dark' 
                                    : 'action.hover'
                              }
                            }}
                            onClick={() => {
                              if (!isPast) {
                                handleDateSelection(date);
                              }
                            }}
                          >
                            {day}
                          </Box>
                        );
                      }
                      
                      return calendarCells;
                    })()}
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: 16, height: 16, bgcolor: 'success.light', mr: 1, borderRadius: 1 }}></Box>
                      <Typography variant="body2">Available</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: 16, height: 16, bgcolor: 'primary.main', mr: 1, borderRadius: 1 }}></Box>
                      <Typography variant="body2">Selected</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: 16, height: 16, bgcolor: 'background.paper', border: '2px solid', borderColor: 'primary.main', mr: 1, borderRadius: 1 }}></Box>
                      <Typography variant="body2">Today</Typography>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            </Paper>
            
            {/* Filter sections removed from Dates & Filters tab */}
            
          </Box>
        );
        
      case 'services':
        // This will be a new flexible service selection UI
        return (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Select Services for Your Event
            </Typography>
            
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="medium">
                  Available Services
                </Typography>
                <Button 
                  size="small" 
                  onClick={resetAllFilters}
                  startIcon={<ArrowBackIcon />}
                >
                  Reset All Filters
                </Button>
              </Box>
              
              <Grid container spacing={2}>
                {serviceCategories.map(category => (
                  <Grid item xs={12} sm={6} md={4} key={category.id}>
                    <Card>
                      <CardActionArea onClick={() => setActiveTab(category.id)}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {category.icon}
                            <Box sx={{ ml: 2 }}>
                              <Typography variant="h6">{category.label}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {category.id === 'venue' && eventData.useCustomVenue ? 
                                  `Custom: ${eventData.customVenue.name}` : 
                                  category.id === 'dj' && eventData.useCustomDJ ?
                                  `Custom: ${eventData.customDJ.name}` :
                                  category.id === 'catering' && eventData.useCustomCatering ?
                                  `Custom: ${eventData.customCatering.name}` :
                                  category.id === 'entertainment' && eventData.useCustomEntertainment ?
                                  `Custom: ${eventData.customEntertainment.name}` :
                                  category.id === 'photography' && eventData.useCustomPhotography ?
                                  `Custom: ${eventData.customPhotography.name}` :
                                  category.id === 'decoration' && eventData.useCustomDecoration ?
                                  `Custom: ${eventData.customDecoration.name}` :
                                  category.id === 'audioVisual' && eventData.useCustomAudioVisual ?
                                  `Custom: ${eventData.customAudioVisual.name}` :
                                  category.id === 'furniture' && eventData.useCustomFurniture ?
                                  `Custom: ${eventData.customFurniture.name}` :
                                  category.id === 'barService' && eventData.useCustomBarService ?
                                  `Custom: ${eventData.customBarService.name}` :
                                  category.id === 'security' && eventData.useCustomSecurity ?
                                  `Custom: ${eventData.customSecurity.name}` :
                                  eventData[`${category.id}Id` as keyof typeof eventData] ? 
                                  'Selected' : 
                                  'Not selected'}
                              </Typography>
                            </Box>
                            {(eventData[`${category.id}Id` as keyof typeof eventData] || 
                              (category.id === 'venue' && eventData.useCustomVenue) ||
                              (category.id === 'dj' && eventData.useCustomDJ) ||
                              (category.id === 'catering' && eventData.useCustomCatering) ||
                              (category.id === 'entertainment' && eventData.useCustomEntertainment) ||
                              (category.id === 'photography' && eventData.useCustomPhotography) ||
                              (category.id === 'decoration' && eventData.useCustomDecoration) ||
                              (category.id === 'audioVisual' && eventData.useCustomAudioVisual) ||
                              (category.id === 'furniture' && eventData.useCustomFurniture) ||
                              (category.id === 'barService' && eventData.useCustomBarService) ||
                              (category.id === 'security' && eventData.useCustomSecurity)) && 
                              <CheckIcon color="success" sx={{ ml: 'auto' }} />}
                          </Box>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Box>
        );
        
      case 'venue':
        // Venue selection content with filters
        return (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Choose a Venue
            </Typography>
            
            {/* Toggle between existing venues and custom venue */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                Venue Options
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <ToggleButtonGroup
                  value={eventData.useCustomVenue ? 'custom' : 'existing'}
                  exclusive
                  onChange={(e, newValue) => {
                    if (newValue) {
                      // Clear any existing venue selection when switching modes
                      setEventData({
                        ...eventData,
                        useCustomVenue: newValue === 'custom',
                        venueId: newValue === 'custom' ? '' : eventData.venueId,
                      });
                    }
                  }}
                  aria-label="venue selection mode"
                  fullWidth
                >
                  <ToggleButton value="existing" aria-label="select existing venue">
                    Choose from Listed Venues
                  </ToggleButton>
                  <ToggleButton value="custom" aria-label="add custom venue">
                    Add Your Own Venue
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Paper>
            
            {/* Show venue filters and listings when "Choose from Listed Venues" is selected */}
            {!eventData.useCustomVenue && (
              <>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="medium">
                  Venue Filters
                </Typography>
                <Button 
                  size="small" 
                  onClick={resetVenueFilters}
                  startIcon={<ArrowBackIcon />}
                >
                  Reset Filters
                </Button>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="venue-types-label">Venue Type</InputLabel>
                    <Select
                      labelId="venue-types-label"
                      multiple
                      value={venueFilters.types}
                      onChange={(e) => handleVenueFilterChange('types', e.target.value)}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {(selected as string[]).map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      )}
                    >
                      <MenuItem value="indoor">Indoor</MenuItem>
                      <MenuItem value="outdoor">Outdoor</MenuItem>
                      <MenuItem value="both">Both Indoor & Outdoor</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="venue-styles-label">Venue Style</InputLabel>
                    <Select
                      labelId="venue-styles-label"
                      multiple
                      value={venueFilters.styles}
                      onChange={(e) => handleVenueFilterChange('styles', e.target.value)}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {(selected as string[]).map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      )}
                    >
                      {['rooftop', 'modern', 'elegant', 'classic', 'beach', 'villa', 'relaxed', 'rustic', 'industrial', 'garden'].map((style) => (
                        <MenuItem key={style} value={style}>
                          {style}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ mt: 2 }}>
                    <Typography id="venue-price-slider" gutterBottom>
                      Maximum Venue Price: ${venueFilters.maxPrice}
                    </Typography>
                    <Slider
                      value={venueFilters.maxPrice}
                      onChange={(e, newValue) => handleVenueFilterChange('maxPrice', newValue)}
                      min={500}
                      max={5000}
                      step={100}
                      aria-labelledby="venue-price-slider"
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Button 
                    variant="contained" 
                    fullWidth
                    onClick={() => {
                      if (eventData.date) {
                        filterServicesForSingleDate(eventData.date);
                      } else if (eventData.dateRange.start && eventData.dateRange.end) {
                        filterServicesForDateRange(eventData.dateRange.start, eventData.dateRange.end);
                      } else {
                        applyFilters();
                      }
                    }}
                  >
                    Apply Filters
                  </Button>
                </Grid>
              </Grid>
            </Paper>
            
            {availableVenues.length === 0 ? (
              <Alert severity="info" sx={{ mt: 2 }}>
                No venues are available for your selected {eventData.isMultiDay ? 'date range' : 'date'} and filters. 
                Please try different filters or a different {eventData.isMultiDay ? 'range' : 'date'}.
              </Alert>
            ) :
            <Grid container spacing={2} sx={{ mt: 1 }}>
                {availableVenues.map((venue) => {
                  // Check if venue has any available dates in the selected range or dates
                  let hasAvailableDates = true;
                  if (eventData.isMultiDay && eventData.dateRange.start && eventData.dateRange.end) {
                    // For date range, check if any date in the range is available
                    const dateStrings = getDatesInRange(eventData.dateRange.start, eventData.dateRange.end);
                    hasAvailableDates = dateStrings.some(dateStr => venue.availability.includes(dateStr));
                  } else if (eventData.isMultiSelect && eventData.selectedDates.length > 0) {
                    // For multi-select, check if any selected date is available
                    hasAvailableDates = eventData.selectedDates.some(date => 
                      venue.availability.includes(format(date, 'yyyy-MM-dd'))
                    );
                  }
                  
                  // Skip rendering venues with no available dates
                  if (!hasAvailableDates) {
                    return null;
                  }
                  
                  return (
                <Grid item xs={12} sm={6} key={venue.id}>
                  <Card 
                    sx={{ 
                      border: eventData.venueId === venue.id ? 2 : 0,
                      borderColor: 'primary.main',
                    }}
                  >
                        <CardActionArea onClick={() => handleServiceSelect('venue', venue.id)}>
                      <ServiceCard service={venue} type="venue" />
                          {/* Add badges for selected dates if applicable */}
                          {providerSpecificDates[venue.id] && (
                            <Box sx={{ p: 1, bgcolor: 'primary.light', color: 'white' }}>
                              <Typography variant="body2">
                                {eventData.isMultiSelect 
                                  ? `Selected ${providerSpecificDates[venue.id].dates?.length || 0} date(s)` 
                                  : `Selected: ${providerSpecificDates[venue.id].date 
                                      ? format(providerSpecificDates[venue.id].date as Date, 'MMM d, yyyy') 
                                      : 'None'}`
                                }
                              </Typography>
                            </Box>
                          )}
                    </CardActionArea>
                  </Card>
                </Grid>
                  );
                }).filter(Boolean)}
            </Grid>
            }
              </>
            )}
            
            {/* Show custom venue form when "Add Your Own Venue" is selected */}
            {eventData.useCustomVenue && (
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                  Enter Your Venue Details
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      label="Venue Name"
                      value={eventData.customVenue.name}
                      onChange={(e) => setEventData({
                        ...eventData,
                        customVenue: {
                          ...eventData.customVenue,
                          name: e.target.value
                        }
                      })}
                      margin="normal"
                      error={!eventData.customVenue.name.trim()}
                      helperText={!eventData.customVenue.name.trim() ? "Venue name is required" : ""}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      label="Location"
                      value={eventData.customVenue.location}
                      onChange={(e) => setEventData({
                        ...eventData,
                        customVenue: {
                          ...eventData.customVenue,
                          location: e.target.value
                        }
                      })}
                      margin="normal"
                      placeholder="Full address of the venue"
                      error={!eventData.customVenue.location.trim()}
                      helperText={!eventData.customVenue.location.trim() ? "Location is required" : ""}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      required
                      label="Capacity"
                      type="number"
                      value={eventData.customVenue.capacity}
                      InputProps={{
                        inputProps: { min: 1 }
                      }}
                      onChange={(e) => setEventData({
                        ...eventData,
                        customVenue: {
                          ...eventData.customVenue,
                          capacity: parseInt(e.target.value) || 0
                        }
                      })}
                      margin="normal"
                      error={eventData.customVenue.capacity <= 0}
                      helperText={eventData.customVenue.capacity <= 0 ? "Capacity must be greater than 0" : ""}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Description"
                      value={eventData.customVenue.description}
                      onChange={(e) => setEventData({
                        ...eventData,
                        customVenue: {
                          ...eventData.customVenue,
                          description: e.target.value
                        }
                      })}
                      margin="normal"
                      placeholder="Describe your venue, including features, amenities, and any special considerations"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      Venue Images
                    </Typography>
                    <Box 
                      sx={{ 
                        border: '2px dashed', 
                        borderColor: 'divider', 
                        p: 3, 
                        borderRadius: 1,
                        textAlign: 'center',
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'action.hover'
                        }
                      }}
                      onClick={() => {
                        // In a real app, this would open a file dialog
                        // For this demo, we'll just add a placeholder image
                        setEventData({
                          ...eventData,
                          customVenue: {
                            ...eventData.customVenue,
                            images: [...eventData.customVenue.images, 'https://via.placeholder.com/300x200?text=Venue+Image']
                          }
                        });
                      }}
                    >
                      <Typography variant="body1" gutterBottom>
                        Upload Images
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Click to add images of your venue (max 5 images)
                      </Typography>
                    </Box>
                  </Grid>
                  
                  {eventData.customVenue.images.length > 0 && (
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                        {eventData.customVenue.images.map((image, index) => (
                          <Box 
                            key={index}
                            sx={{ 
                              position: 'relative',
                              width: 100,
                              height: 100,
                              borderRadius: 1,
                              overflow: 'hidden'
                            }}
                          >
                            <img 
                              src={image} 
                              alt={`Venue image ${index + 1}`} 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <IconButton
                              size="small"
                              sx={{ 
                                position: 'absolute', 
                                top: 0, 
                                right: 0, 
                                bgcolor: 'rgba(0,0,0,0.5)',
                                color: 'white',
                                '&:hover': {
                                  bgcolor: 'rgba(0,0,0,0.7)'
                                }
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                const newImages = [...eventData.customVenue.images];
                                newImages.splice(index, 1);
                                setEventData({
                                  ...eventData,
                                  customVenue: {
                                    ...eventData.customVenue,
                                    images: newImages
                                  }
                                });
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        ))}
                      </Box>
            </Grid>
                  )}
                  
                  {/* Add confirmation buttons */}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setEventData({
                            ...eventData,
                            useCustomVenue: false
                          });
                        }}
                      >
                        Cancel
                      </Button>
                      
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={!eventData.customVenue.name.trim() || !eventData.customVenue.location.trim() || eventData.customVenue.capacity <= 0}
                        onClick={() => {
                          // Show confirmation message
                          setSnackbarMessage('Custom venue has been confirmed!');
                          setSnackbarOpen(true);
                          
                          // Navigate back to services tab
                          setActiveTab('services');
                        }}
                      >
                        Confirm Venue
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 3 }}>
              <Button 
                variant="outlined" 
                startIcon={<ArrowBackIcon />} 
                onClick={() => setActiveTab('services')}
                sx={{ mr: 1 }}
              >
                Back to Services
              </Button>
            </Box>
          </Box>
        );
        
      case 'dj':
        // DJ selection content with filters
        return (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Select a DJ
            </Typography>
            
            {/* Toggle between existing DJs and custom DJ */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                DJ Options
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <ToggleButtonGroup
                  value={eventData.useCustomDJ ? 'custom' : 'existing'}
                  exclusive
                  onChange={(e, newValue) => {
                    if (newValue) {
                      // Clear any existing DJ selection when switching modes
                      setEventData({
                        ...eventData,
                        useCustomDJ: newValue === 'custom',
                        djId: newValue === 'custom' ? '' : eventData.djId,
                      });
                    }
                  }}
                  aria-label="dj selection mode"
                  fullWidth
                >
                  <ToggleButton value="existing" aria-label="select existing dj">
                    Choose from Listed DJs
                  </ToggleButton>
                  <ToggleButton value="custom" aria-label="add custom dj">
                    Add Your Own DJ
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Paper>
            
            {/* Show DJ filters and listings when "Choose from Listed DJs" is selected */}
            {!eventData.useCustomDJ && (
              <>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="medium">
                  DJ Filters
                </Typography>
                <Button 
                  size="small" 
                  onClick={resetDjFilters}
                  startIcon={<ArrowBackIcon />}
                >
                  Reset Filters
                </Button>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="dj-genres-label">Music Genres</InputLabel>
                    <Select
                      labelId="dj-genres-label"
                      multiple
                      value={djFilters.genres}
                      onChange={(e) => handleDjFilterChange('genres', e.target.value)}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {(selected as string[]).map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      )}
                    >
                      {['House', 'Electronic', 'Pop', 'Hip Hop', 'R&B', 'Top 40', 'Latin', 'Reggaeton', 'Dance', 'Rock', 'Techno', 'Country'].map((genre) => (
                        <MenuItem key={genre} value={genre}>
                          {genre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ mt: 2 }}>
                    <Typography id="dj-price-slider" gutterBottom>
                      Maximum DJ Price: ${djFilters.maxPrice}
                    </Typography>
                    <Slider
                      value={djFilters.maxPrice}
                      onChange={(e, newValue) => handleDjFilterChange('maxPrice', newValue)}
                      min={300}
                      max={2000}
                      step={100}
                      aria-labelledby="dj-price-slider"
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Button 
                    variant="contained" 
                    fullWidth
                    onClick={() => {
                      if (eventData.date) {
                        filterServicesForSingleDate(eventData.date);
                      } else if (eventData.dateRange.start && eventData.dateRange.end) {
                        filterServicesForDateRange(eventData.dateRange.start, eventData.dateRange.end);
                      } else {
                        applyFilters();
                      }
                    }}
                  >
                    Apply Filters
                  </Button>
                </Grid>
              </Grid>
            </Paper>
            
            {availableDJs.length === 0 ? (
              <Alert severity="info" sx={{ mt: 2 }}>
                No DJs are available for your selected {eventData.isMultiDay ? 'date range' : 'date'} and filters. 
                Please try different filters or a different {eventData.isMultiDay ? 'range' : 'date'}.
              </Alert>
            ) : (
            <Grid container spacing={2} sx={{ mt: 1 }}>
                {availableDJs.map((dj) => {
                  // Check if DJ has any available dates in the selected range or dates
                  let hasAvailableDates = true;
                  if (eventData.isMultiDay && eventData.dateRange.start && eventData.dateRange.end) {
                    // For date range, check if any date in the range is available
                    const dateStrings = getDatesInRange(eventData.dateRange.start, eventData.dateRange.end);
                    hasAvailableDates = dateStrings.some(dateStr => dj.availability.includes(dateStr));
                  } else if (eventData.isMultiSelect && eventData.selectedDates.length > 0) {
                    // For multi-select, check if any selected date is available
                    hasAvailableDates = eventData.selectedDates.some(date => 
                      dj.availability.includes(format(date, 'yyyy-MM-dd'))
                    );
                  }
                  
                  // Skip rendering DJs with no available dates
                  if (!hasAvailableDates) {
                    return null;
                  }
                  
                  return (
                <Grid item xs={12} sm={6} key={dj.id}>
                  <Card 
                    sx={{ 
                      border: eventData.djId === dj.id ? 2 : 0,
                      borderColor: 'primary.main',
                    }}
                  >
                        <CardActionArea onClick={() => handleServiceSelect('dj', dj.id)}>
                      <ServiceCard service={dj} type="dj" />
                          {/* Add badges for selected dates if applicable */}
                          {providerSpecificDates[dj.id] && (
                            <Box sx={{ p: 1, bgcolor: 'primary.light', color: 'white' }}>
                              <Typography variant="body2">
                                {eventData.isMultiSelect 
                                  ? `Selected ${providerSpecificDates[dj.id].dates?.length || 0} date(s)` 
                                  : `Selected: ${providerSpecificDates[dj.id].date 
                                      ? format(providerSpecificDates[dj.id].date as Date, 'MMM d, yyyy') 
                                      : 'None'}`
                                }
                              </Typography>
                            </Box>
                          )}
                    </CardActionArea>
                  </Card>
                </Grid>
                  );
                }).filter(Boolean)}
            </Grid>
            )}
              </>
            )}
            
            {/* Show custom DJ form when "Add Your Own DJ" is selected */}
            {eventData.useCustomDJ && (
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                  Enter Your DJ Details
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      label="DJ Name/Stage Name"
                      value={eventData.customDJ.name}
                      onChange={(e) => setEventData({
                        ...eventData,
                        customDJ: {
                          ...eventData.customDJ,
                          name: e.target.value
                        }
                      })}
                      margin="normal"
                      error={!eventData.customDJ.name.trim()}
                      helperText={!eventData.customDJ.name.trim() ? "DJ name is required" : ""}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControl fullWidth margin="normal" required>
                      <InputLabel id="custom-dj-genres-label">Music Genres</InputLabel>
                      <Select
                        labelId="custom-dj-genres-label"
                        multiple
                        value={eventData.customDJ.genres}
                        onChange={(e) => setEventData({
                          ...eventData,
                          customDJ: {
                            ...eventData.customDJ,
                            genres: e.target.value as string[]
                          }
                        })}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {(selected as string[]).map((value) => (
                              <Chip key={value} label={value} />
                            ))}
                          </Box>
                        )}
                        error={eventData.customDJ.genres.length === 0}
                      >
                        {['House', 'Electronic', 'Pop', 'Hip Hop', 'R&B', 'Top 40', 'Latin', 'Reggaeton', 'Dance', 'Rock', 'Techno', 'Country'].map((genre) => (
                          <MenuItem key={genre} value={genre}>
                            {genre}
                          </MenuItem>
                        ))}
                      </Select>
                      {eventData.customDJ.genres.length === 0 && (
                        <FormHelperText error>Please select at least one genre</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Years of Experience"
                      type="number"
                      value={eventData.customDJ.experience}
                      InputProps={{
                        inputProps: { min: 0 }
                      }}
                      onChange={(e) => setEventData({
                        ...eventData,
                        customDJ: {
                          ...eventData.customDJ,
                          experience: parseInt(e.target.value) || 0
                        }
                      })}
                      margin="normal"
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Contact Information"
                      value={eventData.customDJ.contactInfo}
                      onChange={(e) => setEventData({
                        ...eventData,
                        customDJ: {
                          ...eventData.customDJ,
                          contactInfo: e.target.value
                        }
                      })}
                      margin="normal"
                      placeholder="Email or phone number"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Description"
                      value={eventData.customDJ.description}
                      onChange={(e) => setEventData({
                        ...eventData,
                        customDJ: {
                          ...eventData.customDJ,
                          description: e.target.value
                        }
                      })}
                      margin="normal"
                      placeholder="Describe the DJ's style, equipment needs, and any special requirements"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      DJ Image
                    </Typography>
                    <Box 
                      sx={{ 
                        border: '2px dashed', 
                        borderColor: 'divider', 
                        p: 3, 
                        borderRadius: 1,
                        textAlign: 'center',
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'action.hover'
                        }
                      }}
                      onClick={() => {
                        // In a real app, this would open a file dialog
                        // For this demo, we'll just add a placeholder image
                        setEventData({
                          ...eventData,
                          customDJ: {
                            ...eventData.customDJ,
                            image: 'https://via.placeholder.com/300x300?text=DJ+Image'
                          }
                        });
                      }}
                    >
                      <Typography variant="body1" gutterBottom>
                        Upload Image
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Click to add an image of the DJ
                      </Typography>
                    </Box>
                  </Grid>
                  
                  {eventData.customDJ.image && (
                    <Grid item xs={12}>
                      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                        <Box 
                          sx={{ 
                            position: 'relative',
                            width: 150,
                            height: 150,
                            borderRadius: 2,
                            overflow: 'hidden'
                          }}
                        >
                          <img 
                            src={eventData.customDJ.image} 
                            alt="DJ" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <IconButton
                            size="small"
                            sx={{ 
                              position: 'absolute', 
                              top: 0, 
                              right: 0, 
                              bgcolor: 'rgba(0,0,0,0.5)',
                              color: 'white',
                              '&:hover': {
                                bgcolor: 'rgba(0,0,0,0.7)'
                              }
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setEventData({
                                ...eventData,
                                customDJ: {
                                  ...eventData.customDJ,
                                  image: ''
                                }
                              });
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
            </Grid>
                  )}
                  
                  {/* Add confirmation buttons */}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setEventData({
                            ...eventData,
                            useCustomDJ: false
                          });
                        }}
                      >
                        Cancel
                      </Button>
                      
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={!eventData.customDJ.name.trim() || eventData.customDJ.genres.length === 0}
                        onClick={() => {
                          // Show confirmation message
                          setSnackbarMessage('Custom DJ has been added to your event!');
                          setSnackbarOpen(true);
                          
                          // Navigate back to services tab
                          setActiveTab('services');
                        }}
                      >
                        Add DJ to Event
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 3 }}>
              <Button 
                variant="outlined" 
                startIcon={<ArrowBackIcon />} 
                onClick={() => setActiveTab('services')}
                sx={{ mr: 1 }}
              >
                Back to Services
              </Button>
            </Box>
          </Box>
        );
        
      case 'catering':
        // Catering selection content with filters
        return (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Add Catering
            </Typography>
            
            {/* Toggle between existing caterers and custom catering */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                Catering Options
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <ToggleButtonGroup
                  value={eventData.useCustomCatering ? 'custom' : 'existing'}
                  exclusive
                  onChange={(e, newValue) => {
                    if (newValue) {
                      // Clear any existing catering selection when switching modes
                      setEventData({
                        ...eventData,
                        useCustomCatering: newValue === 'custom',
                        cateringId: newValue === 'custom' ? '' : eventData.cateringId,
                      });
                    }
                  }}
                  aria-label="catering selection mode"
                  fullWidth
                >
                  <ToggleButton value="existing" aria-label="select existing catering">
                    Choose from Listed Caterers
                  </ToggleButton>
                  <ToggleButton value="custom" aria-label="add custom catering">
                    Add Your Own Catering
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Paper>
            
            {/* Show catering filters and listings when "Choose from Listed Caterers" is selected */}
            {!eventData.useCustomCatering && (
              <>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="medium">
                  Catering Filters
                </Typography>
                <Button 
                  size="small" 
                  onClick={resetCateringFilters}
                  startIcon={<ArrowBackIcon />}
                >
                  Reset Filters
                </Button>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="cuisine-types-label">Cuisine Types</InputLabel>
                    <Select
                      labelId="cuisine-types-label"
                      multiple
                      value={cateringFilters.cuisineTypes}
                      onChange={(e) => handleCateringFilterChange('cuisineTypes', e.target.value)}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {(selected as string[]).map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      )}
                    >
                      {['International', 'Fusion', 'Gourmet', 'Italian', 'Mediterranean', 'Japanese', 'Chinese', 'Thai', 'Mexican', 'American', 'French', 'Indian', 'Vegan', 'Vegetarian', 'Gluten-Free'].map((cuisine) => (
                        <MenuItem key={cuisine} value={cuisine}>
                          {cuisine}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ mt: 2 }}>
                    <Typography id="catering-price-slider" gutterBottom>
                      Maximum Price per Person: ${cateringFilters.maxPrice}
                    </Typography>
                    <Slider
                      value={cateringFilters.maxPrice}
                      onChange={(e, newValue) => handleCateringFilterChange('maxPrice', newValue)}
                      min={20}
                      max={200}
                      step={5}
                      aria-labelledby="catering-price-slider"
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Button 
                    variant="contained" 
                    fullWidth
                    onClick={() => {
                      if (eventData.date) {
                        filterServicesForSingleDate(eventData.date);
                      } else if (eventData.dateRange.start && eventData.dateRange.end) {
                        filterServicesForDateRange(eventData.dateRange.start, eventData.dateRange.end);
                      } else {
                        applyFilters();
                      }
                    }}
                  >
                    Apply Filters
                  </Button>
                </Grid>
              </Grid>
            </Paper>
            
            {availableCaterers.length === 0 ? (
              <Alert severity="info" sx={{ mt: 2 }}>
                No catering services are available for your selected {eventData.isMultiDay ? 'date range' : 'date'} and filters. 
                Please try different filters or a different {eventData.isMultiDay ? 'range' : 'date'}.
              </Alert>
            ) : (
            <Grid container spacing={2} sx={{ mt: 1 }}>
                {availableCaterers.map((catering) => (
                <Grid item xs={12} sm={6} key={catering.id}>
                  <Card 
                    sx={{ 
                      border: eventData.cateringId === catering.id ? 2 : 0,
                      borderColor: 'primary.main',
                    }}
                  >
                          <CardActionArea onClick={() => handleServiceSelect('catering', catering.id)}>
                      <ServiceCard service={catering} type="catering" />
                            {/* Add badges for selected dates if applicable */}
                            {providerSpecificDates[catering.id] && (
                              <Box sx={{ p: 1, bgcolor: 'primary.light', color: 'white' }}>
                                <Typography variant="body2">
                                  {eventData.isMultiSelect 
                                    ? `Selected ${providerSpecificDates[catering.id].dates?.length || 0} date(s)` 
                                    : `Selected: ${providerSpecificDates[catering.id].date 
                                        ? format(providerSpecificDates[catering.id].date as Date, 'MMM d, yyyy') 
                                        : 'None'}`
                                  }
                                </Typography>
                              </Box>
                            )}
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
                )}
              </>
            )}
            
            {/* Show custom catering form when "Add Your Own Catering" is selected */}
            {eventData.useCustomCatering && (
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                  Enter Your Catering Details
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      label="Catering Provider Name"
                      value={eventData.customCatering.name}
                      onChange={(e) => setEventData({
                        ...eventData,
                        customCatering: {
                          ...eventData.customCatering,
                          name: e.target.value
                        }
                      })}
                      margin="normal"
                      error={!eventData.customCatering.name.trim()}
                      helperText={!eventData.customCatering.name.trim() ? "Provider name is required" : ""}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControl fullWidth margin="normal" required>
                      <InputLabel id="custom-cuisine-types-label">Cuisine Types</InputLabel>
                      <Select
                        labelId="custom-cuisine-types-label"
                        multiple
                        value={eventData.customCatering.cuisineTypes}
                        onChange={(e) => setEventData({
                          ...eventData,
                          customCatering: {
                            ...eventData.customCatering,
                            cuisineTypes: e.target.value as string[]
                          }
                        })}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {(selected as string[]).map((value) => (
                              <Chip key={value} label={value} />
                            ))}
                          </Box>
                        )}
                        error={eventData.customCatering.cuisineTypes.length === 0}
                      >
                        {['International', 'Fusion', 'Gourmet', 'Italian', 'Mediterranean', 'Japanese', 'Chinese', 'Thai', 'Mexican', 'American', 'French', 'Indian', 'Vegan', 'Vegetarian', 'Gluten-Free'].map((cuisine) => (
                          <MenuItem key={cuisine} value={cuisine}>
                            {cuisine}
                          </MenuItem>
                        ))}
                      </Select>
                      {eventData.customCatering.cuisineTypes.length === 0 && (
                        <FormHelperText error>Please select at least one cuisine type</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="custom-special-diets-label">Special Diets Accommodated</InputLabel>
                      <Select
                        labelId="custom-special-diets-label"
                        multiple
                        value={eventData.customCatering.specialDiets}
                        onChange={(e) => setEventData({
                          ...eventData,
                          customCatering: {
                            ...eventData.customCatering,
                            specialDiets: e.target.value as string[]
                          }
                        })}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {(selected as string[]).map((value) => (
                              <Chip key={value} label={value} />
                            ))}
                          </Box>
                        )}
                      >
                        {['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Kosher', 'Halal', 'Low-Carb', 'Keto', 'Paleo'].map((diet) => (
                          <MenuItem key={diet} value={diet}>
                            {diet}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      required
                      label="Price Per Person ($)"
                      type="number"
                      value={eventData.customCatering.pricePerPerson}
                      InputProps={{
                        inputProps: { min: 0 }
                      }}
                      onChange={(e) => setEventData({
                        ...eventData,
                        customCatering: {
                          ...eventData.customCatering,
                          pricePerPerson: parseInt(e.target.value) || 0
                        }
                      })}
                      margin="normal"
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Contact Information"
                      value={eventData.customCatering.contactInfo}
                      onChange={(e) => setEventData({
                        ...eventData,
                        customCatering: {
                          ...eventData.customCatering,
                          contactInfo: e.target.value
                        }
                      })}
                      margin="normal"
                      placeholder="Email or phone number"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Description"
                      value={eventData.customCatering.description}
                      onChange={(e) => setEventData({
                        ...eventData,
                        customCatering: {
                          ...eventData.customCatering,
                          description: e.target.value
                        }
                      })}
                      margin="normal"
                      placeholder="Describe the menu, service style, and any special offerings"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      Catering Image
                    </Typography>
                    <Box 
                      sx={{ 
                        border: '2px dashed', 
                        borderColor: 'divider', 
                        p: 3, 
                        borderRadius: 1,
                        textAlign: 'center',
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'action.hover'
                        }
                      }}
                      onClick={() => {
                        // In a real app, this would open a file dialog
                        // For this demo, we'll just add a placeholder image
                        setEventData({
                          ...eventData,
                          customCatering: {
                            ...eventData.customCatering,
                            image: 'https://via.placeholder.com/300x300?text=Catering+Image'
                          }
                        });
                      }}
                    >
                      <Typography variant="body1" gutterBottom>
                        Upload Image
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Click to add an image of the food or catering service
                      </Typography>
                    </Box>
                  </Grid>
                  
                  {eventData.customCatering.image && (
                    <Grid item xs={12}>
                      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                        <Box 
                          sx={{ 
                            position: 'relative',
                            width: 150,
                            height: 150,
                            borderRadius: 2,
                            overflow: 'hidden'
                          }}
                        >
                          <img 
                            src={eventData.customCatering.image} 
                            alt="Catering" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <IconButton
                            size="small"
                            sx={{ 
                              position: 'absolute', 
                              top: 0, 
                              right: 0, 
                              bgcolor: 'rgba(0,0,0,0.5)',
                              color: 'white',
                              '&:hover': {
                                bgcolor: 'rgba(0,0,0,0.7)'
                              }
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setEventData({
                                ...eventData,
                                customCatering: {
                                  ...eventData.customCatering,
                                  image: ''
                                }
                              });
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </Grid>
                  )}
                  
                  {/* Add confirmation buttons */}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setEventData({
                            ...eventData,
                            useCustomCatering: false
                          });
                        }}
                      >
                        Cancel
                      </Button>
                      
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={!eventData.customCatering.name.trim() || eventData.customCatering.cuisineTypes.length === 0}
                        onClick={() => {
                          // Show confirmation message
                          setSnackbarMessage('Custom catering has been added to your event!');
                          setSnackbarOpen(true);
                          
                          // Navigate back to services tab
                          setActiveTab('services');
                        }}
                      >
                        Add Catering to Event
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 3 }}>
              <Button 
                variant="outlined" 
                startIcon={<ArrowBackIcon />} 
                onClick={() => setActiveTab('services')}
                sx={{ mr: 1 }}
              >
                Back to Services
              </Button>
            </Box>
          </Box>
        );
        
      case 'entertainment':
      case 'photography':
      case 'decoration':
      case 'audioVisual':
      case 'furniture':
      case 'barService':
      case 'security':
        // Generic service selection for other categories
        const categoryInfo = serviceCategories.find(cat => cat.id === tabId);
        
        // Define the service list with proper typing
        type ServiceListType = {
          entertainment: typeof availableEntertainment;
          photography: typeof availablePhotography;
          decoration: typeof availableDecoration;
          audioVisual: typeof availableAudioVisual;
          furniture: typeof availableFurniture;
          barService: typeof availableBarServices;
          security: typeof availableSecurity;
        };
        
        const serviceList: ServiceListType = {
          'entertainment': availableEntertainment,
          'photography': availablePhotography,
          'decoration': availableDecoration,
          'audioVisual': availableAudioVisual,
          'furniture': availableFurniture,
          'barService': availableBarServices,
          'security': availableSecurity
        };
        
        const currentServiceList = serviceList[tabId as keyof ServiceListType] || [];
        
        // Helper function to get the correct custom field name
        const getCustomFieldName = (tabType: string): string => {
          switch(tabType) {
            case 'entertainment': return 'useCustomEntertainment';
            case 'photography': return 'useCustomPhotography';
            case 'decoration': return 'useCustomDecoration';
            case 'audioVisual': return 'useCustomAudioVisual';
            case 'furniture': return 'useCustomFurniture';
            case 'barService': return 'useCustomBarService';
            case 'security': return 'useCustomSecurity';
            default: return '';
          }
        };
        
        // Helper function to get the custom object for a given service
        const getCustomServiceObject = (tabType: string): any => {
          switch(tabType) {
            case 'entertainment': return eventData.customEntertainment;
            case 'photography': return eventData.customPhotography;
            case 'decoration': return eventData.customDecoration;
            case 'audioVisual': return eventData.customAudioVisual;
            case 'furniture': return eventData.customFurniture;
            case 'barService': return eventData.customBarService;
            case 'security': return eventData.customSecurity;
            default: return null;
          }
        };
        
        // Check if custom option is enabled for this service
        const customFieldName = getCustomFieldName(tabId);
        const isCustomService = customFieldName ? (eventData as any)[customFieldName] : false;
        const customService = getCustomServiceObject(tabId);
        
        return (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Select {categoryInfo?.label || 'Service'}
            </Typography>
            
            {/* Toggle between existing service and custom service */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                {categoryInfo?.label || 'Service'} Options
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <ToggleButtonGroup
                  value={isCustomService ? 'custom' : 'existing'}
                  exclusive
                  onChange={(e, newValue) => {
                    if (newValue) {
                      // Create a state update object
                      const stateUpdate = {
                        ...eventData
                      } as any;
                      
                      // Set the custom flag
                      stateUpdate[customFieldName] = newValue === 'custom';
                      
                      // Clear the service ID if we're switching to custom
                      if (newValue === 'custom') {
                        stateUpdate[`${tabId}Id`] = '';
                      }
                      
                      // Update the state
                      setEventData(stateUpdate);
                    }
                  }}
                  aria-label={`${tabId} selection mode`}
                  fullWidth
                >
                  <ToggleButton value="existing" aria-label={`select existing ${tabId}`}>
                    Choose from Listed {categoryInfo?.label || 'Service'}
                  </ToggleButton>
                  <ToggleButton value="custom" aria-label={`add custom ${tabId}`}>
                    Add Your Own {categoryInfo?.label || 'Service'}
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Paper>
            
            {/* Show existing services when "Choose from Listed Services" is selected */}
            {!isCustomService && (
              <>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="medium">
                  {categoryInfo?.label || 'Service'} Filters
                </Typography>
                <Button 
                  size="small" 
                  onClick={() => {
                    // Reset filters based on category
                    switch(tabId) {
                      case 'entertainment':
                        resetEntertainmentFilters();
                        break;
                      case 'photography':
                        resetPhotographyFilters();
                        break;
                      case 'decoration':
                        resetDecorationFilters();
                        break;
                      case 'audioVisual':
                        resetAudioVisualFilters();
                        break;
                      case 'furniture':
                        resetFurnitureFilters();
                        break;
                      case 'barService':
                        resetBarServiceFilters();
                        break;
                      case 'security':
                        resetSecurityFilters();
                        break;
                    }
                  }}
                  startIcon={<ArrowBackIcon />}
                >
                  Reset Filters
                </Button>
              </Box>
              
              {/* Basic price filter for all categories */}
              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography gutterBottom>
                  Maximum Price: $
                  {tabId === 'entertainment' ? entertainmentFilters.maxPrice :
                   tabId === 'photography' ? photographyFilters.maxPrice :
                   tabId === 'decoration' ? decorationFilters.maxPrice :
                   tabId === 'audioVisual' ? audioVisualFilters.maxPrice :
                   tabId === 'furniture' ? furnitureFilters.maxPrice :
                   tabId === 'barService' ? barServiceFilters.maxPrice :
                   tabId === 'security' ? securityFilters.maxPrice : 1000}
                </Typography>
                <Slider
                  value={
                    tabId === 'entertainment' ? entertainmentFilters.maxPrice :
                    tabId === 'photography' ? photographyFilters.maxPrice :
                    tabId === 'decoration' ? decorationFilters.maxPrice :
                    tabId === 'audioVisual' ? audioVisualFilters.maxPrice :
                    tabId === 'furniture' ? furnitureFilters.maxPrice :
                    tabId === 'barService' ? barServiceFilters.maxPrice :
                    tabId === 'security' ? securityFilters.maxPrice : 1000
                  }
                  onChange={(e, newValue) => {
                    // Update price filter based on category
                    switch(tabId) {
                      case 'entertainment':
                        setEntertainmentFilters({
                          ...entertainmentFilters,
                          maxPrice: newValue as number
                        });
                        break;
                      case 'photography':
                        setPhotographyFilters({
                          ...photographyFilters,
                          maxPrice: newValue as number
                        });
                        break;
                      case 'decoration':
                        setDecorationFilters({
                          ...decorationFilters,
                          maxPrice: newValue as number
                        });
                        break;
                      case 'audioVisual':
                        setAudioVisualFilters({
                          ...audioVisualFilters,
                          maxPrice: newValue as number
                        });
                        break;
                      case 'furniture':
                        setFurnitureFilters({
                          ...furnitureFilters,
                          maxPrice: newValue as number
                        });
                        break;
                      case 'barService':
                        setBarServiceFilters({
                          ...barServiceFilters,
                          maxPrice: newValue as number
                        });
                        break;
                      case 'security':
                        setSecurityFilters({
                          ...securityFilters,
                          maxPrice: newValue as number
                        });
                        break;
                    }
                  }}
                  min={200}
                  max={3000}
                  step={100}
                />
              </Box>
              
              <Button 
                variant="contained" 
                fullWidth
                onClick={() => {
                  if (eventData.date) {
                    filterServicesForSingleDate(eventData.date);
                  } else if (eventData.dateRange.start && eventData.dateRange.end) {
                    filterServicesForDateRange(eventData.dateRange.start, eventData.dateRange.end);
                  } else {
                    applyFilters();
                  }
                }}
              >
                Apply Filters
              </Button>
            </Paper>
            
            {currentServiceList.length === 0 ? (
              <Alert severity="info" sx={{ mt: 2 }}>
                No {categoryInfo?.label || 'services'} are available for your selected {eventData.isMultiDay ? 'date range' : 'date'} and filters. 
                Please try different filters or a different {eventData.isMultiDay ? 'range' : 'date'}.
              </Alert>
            ) : (
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {currentServiceList.map((service: any) => (
                  <Grid item xs={12} sm={6} key={service.id}>
                    <Card 
                      sx={{ 
                        border: eventData[`${tabId}Id` as keyof typeof eventData] === service.id ? 2 : 0,
                        borderColor: 'primary.main',
                      }}
                    >
                      <CardActionArea onClick={() => {
                        handleServiceSelect(tabId as any, service.id);
                        setActiveTab('services');
                      }}>
                        <ServiceCard service={service} type={tabId as any} />
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
                )}
              </>
            )}
            
            {/* Show custom service form when "Add Your Own Service" is selected */}
            {isCustomService && (
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                  Enter Your {categoryInfo?.label || 'Service'} Details
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      label={`${categoryInfo?.label || 'Service'} Name`}
                      value={customService.name}
                      onChange={(e) => {
                        // Create a state update object
                        const stateUpdate = {
                          ...eventData
                        } as any;
                        
                        // Update the name field
                        stateUpdate[`custom${tabId.charAt(0).toUpperCase() + tabId.slice(1)}`] = {
                          ...customService,
                          name: e.target.value
                        };
                        
                        // Update the state
                        setEventData(stateUpdate);
                      }}
                      margin="normal"
                      error={!customService.name.trim()}
                      helperText={!customService.name.trim() ? "Name is required" : ""}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      multiline
                      rows={4}
                      label="Description"
                      value={customService.description}
                      onChange={(e) => {
                        // Create a state update object
                        const stateUpdate = {
                          ...eventData
                        } as any;
                        
                        // Update the description field
                        stateUpdate[`custom${tabId.charAt(0).toUpperCase() + tabId.slice(1)}`] = {
                          ...customService,
                          description: e.target.value
                        };
                        
                        // Update the state
                        setEventData(stateUpdate);
                      }}
                      margin="normal"
                      error={!customService.description.trim()}
                      helperText={!customService.description.trim() ? "Description is required" : ""}
                      placeholder={`Describe the ${categoryInfo?.label || 'service'}`}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      {categoryInfo?.label || 'Service'} Image
                    </Typography>
                    <Box 
                      sx={{ 
                        border: '2px dashed', 
                        borderColor: 'divider', 
                        p: 3, 
                        borderRadius: 1,
                        textAlign: 'center',
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'action.hover'
                        }
                      }}
                      onClick={() => {
                        // Create a state update object
                        const stateUpdate = {
                          ...eventData
                        } as any;
                        
                        // Update the image field
                        stateUpdate[`custom${tabId.charAt(0).toUpperCase() + tabId.slice(1)}`] = {
                          ...customService,
                          image: `https://via.placeholder.com/300x300?text=${categoryInfo?.label || 'Service'}+Image`
                        };
                        
                        // Update the state
                        setEventData(stateUpdate);
                      }}
                    >
                      <Typography variant="body1" gutterBottom>
                        Upload Image
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Click to add an image
                      </Typography>
                    </Box>
                  </Grid>
                  
                  {customService.image && (
                    <Grid item xs={12}>
                      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                        <Box 
                          sx={{ 
                            position: 'relative',
                            width: 150,
                            height: 150,
                            borderRadius: 2,
                            overflow: 'hidden'
                          }}
                        >
                          <img 
                            src={customService.image} 
                            alt={`${categoryInfo?.label || 'Service'}`} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <IconButton
                            size="small"
                            sx={{ 
                              position: 'absolute', 
                              top: 0, 
                              right: 0, 
                              bgcolor: 'rgba(0,0,0,0.5)',
                              color: 'white',
                              '&:hover': {
                                bgcolor: 'rgba(0,0,0,0.7)'
                              }
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              
                              // Create a state update object
                              const stateUpdate = {
                                ...eventData
                              } as any;
                              
                              // Update the image field
                              stateUpdate[`custom${tabId.charAt(0).toUpperCase() + tabId.slice(1)}`] = {
                                ...customService,
                                image: ''
                              };
                              
                              // Update the state
                              setEventData(stateUpdate);
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </Grid>
                  )}
                  
                  {/* Add confirmation buttons */}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          // Create a state update object to disable custom mode
                          const stateUpdate = {
                            ...eventData
                          } as any;
                          
                          // Disable custom mode
                          stateUpdate[customFieldName] = false;
                          
                          // Update the state
                          setEventData(stateUpdate);
                        }}
                      >
                        Cancel
                      </Button>
                      
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={!customService.name.trim() || !customService.description.trim()}
                        onClick={() => {
                          // Show confirmation message
                          setSnackbarMessage(`Custom ${categoryInfo?.label || 'service'} has been confirmed!`);
                          setSnackbarOpen(true);
                          
                          // Navigate back to services tab
                          setActiveTab('services');
                        }}
                      >
                        Confirm {categoryInfo?.label || 'Service'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 3 }}>
              <Button 
                variant="outlined" 
                startIcon={<ArrowBackIcon />} 
                onClick={() => setActiveTab('services')}
                sx={{ mr: 1 }}
              >
                Back to Services
              </Button>
            </Box>
          </Box>
        );
        
      case 'review':
        // Calculate total price
        const selectedVenue = eventData.useCustomVenue ? null : availableVenues.find(v => v.id === eventData.venueId);
        const selectedDJ = availableDJs.find(d => d.id === eventData.djId);
        const selectedCatering = availableCaterers.find(c => c.id === eventData.cateringId);
        const selectedEntertainment = availableEntertainment.find(e => e.id === eventData.entertainmentId);
        const selectedPhotography = availablePhotography.find(p => p.id === eventData.photographyId);
        const selectedDecoration = availableDecoration.find(d => d.id === eventData.decorationId);
        const selectedAudioVisual = availableAudioVisual.find(a => a.id === eventData.audioVisualId);
        const selectedFurniture = availableFurniture.find(f => f.id === eventData.furnitureId);
        const selectedBarService = availableBarServices.find(b => b.id === eventData.barServiceId);
        const selectedSecurity = availableSecurity.find(s => s.id === eventData.securityId);
        
        // Calculate the base price
        let venuePrice = selectedVenue ? selectedVenue.price || 0 : 0;
        const djPrice = selectedDJ ? selectedDJ.price || 0 : 0;
        const cateringPrice = selectedCatering ? (selectedCatering.price || 0) * eventData.attendees : 0;
        const entertainmentPrice = selectedEntertainment ? selectedEntertainment.price || 0 : 0;
        const photographyPrice = selectedPhotography ? selectedPhotography.price || 0 : 0;
        const decorationPrice = selectedDecoration ? selectedDecoration.price || 0 : 0;
        const audioVisualPrice = selectedAudioVisual ? selectedAudioVisual.price || 0 : 0;
        const furniturePrice = selectedFurniture ? selectedFurniture.price || 0 : 0;
        const barServicePrice = selectedBarService ? selectedBarService.price || 0 : 0;
        const securityPrice = selectedSecurity ? selectedSecurity.price || 0 : 0;
        
        // Calculate total
        const total = venuePrice + djPrice + cateringPrice + entertainmentPrice + photographyPrice + 
                      decorationPrice + audioVisualPrice + furniturePrice + barServicePrice + securityPrice;
        
        // Generate the review content
        return (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Review Your Event
            </Typography>
            
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                Event Details
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Event Name
                  </Typography>
              <Typography variant="body1" gutterBottom>
                    {eventData.name || 'Not specified'}
              </Typography>
                </Grid>
              
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Expected Attendees
                  </Typography>
              <Typography variant="body1" gutterBottom>
                    {eventData.attendees} guests
              </Typography>
                </Grid>
              
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Event Type
                  </Typography>
              <Typography variant="body1" gutterBottom>
                    Standard Event
              </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Date(s)
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {eventData.isMultiSelect ? (
                      <>Selected {eventData.selectedDates.length} date(s): {eventData.selectedDates.map(d => format(d, 'MMM d, yyyy')).join(', ')}</>
                    ) : eventData.isMultiDay ? (
                      <>{format(eventData.dateRange.start!, 'MMM d, yyyy')} - {format(eventData.dateRange.end!, 'MMM d, yyyy')}</>
                    ) : (
                      <>{format(eventData.date!, 'MMM d, yyyy')}</>
                    )}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
            
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                Service Details
              </Typography>
              
              <Grid container spacing={3}>
                {/* Venue section */}
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Venue
              </Typography>
                  {eventData.useCustomVenue ? (
                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="body1" fontWeight="medium">
                        {eventData.customVenue.name || 'Custom Venue'}
                  </Typography>
                      <Typography variant="body2" gutterBottom>
                        Location: {eventData.customVenue.location || 'Not specified'}
                  </Typography>
                      <Typography variant="body2" gutterBottom>
                        Capacity: {eventData.customVenue.capacity || 'Not specified'} guests
                      </Typography>
                      {eventData.customVenue.description && (
                        <Typography variant="body2" gutterBottom>
                          Description: {eventData.customVenue.description}
                        </Typography>
                      )}
                      {eventData.customVenue.images.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                          {eventData.customVenue.images.map((image, i) => (
                            <Box
                              key={i}
                              component="img"
                              src={image}
                              alt={`Venue image ${i+1}`}
                              sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 1 }}
                            />
                          ))}
                </Box>
              )}
                      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        <Typography variant="body1" color="primary.main">
                          Custom Venue (No charge)
              </Typography>
                      </Box>
                    </Box>
                  ) : selectedVenue ? (
                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedVenue.name}
                  </Typography>
                      <Typography variant="body2" gutterBottom>
                        {selectedVenue.description}
                      </Typography>
                      {providerSpecificDates[selectedVenue.id] && (
                        <Typography variant="body2" color="primary.main" gutterBottom>
                          {eventData.isMultiSelect 
                            ? `Booked for ${providerSpecificDates[selectedVenue.id].dates?.length || 0} date(s)` 
                            : `Booked for: ${providerSpecificDates[selectedVenue.id].date 
                                ? format(providerSpecificDates[selectedVenue.id].date as Date, 'MMM d, yyyy') 
                                : 'No specific date'}`
                          }
                        </Typography>
                      )}
                      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        <Typography variant="body1" color="primary.main">
                          ${selectedVenue.price?.toLocaleString()}
                  </Typography>
                </Box>
                    </Box>
                  ) : (
                    <Typography variant="body1" color="text.secondary">
                      No venue selected
                    </Typography>
                  )}
                </Grid>
                
                {/* DJ section */}
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    DJ
              </Typography>
                  {eventData.useCustomDJ ? (
                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="body1" fontWeight="medium">
                        {eventData.customDJ.name || 'Custom DJ'}
                  </Typography>
                      <Typography variant="body2" gutterBottom>
                        Genres: {eventData.customDJ.genres.join(', ') || 'Not specified'}
                  </Typography>
                      {eventData.customDJ.experience > 0 && (
                        <Typography variant="body2" gutterBottom>
                          Experience: {eventData.customDJ.experience} years
                        </Typography>
                      )}
                      {eventData.customDJ.description && (
                        <Typography variant="body2" gutterBottom>
                          Description: {eventData.customDJ.description}
                        </Typography>
                      )}
                      {eventData.customDJ.contactInfo && (
                        <Typography variant="body2" gutterBottom>
                          Contact: {eventData.customDJ.contactInfo}
                        </Typography>
                      )}
                      {eventData.customDJ.image && (
                        <Box sx={{ display: 'flex', mt: 1 }}>
                          <Box
                            component="img"
                            src={eventData.customDJ.image}
                            alt="DJ image"
                            sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 1 }}
                          />
                </Box>
              )}
                      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        <Typography variant="body1" color="primary.main">
                          Custom DJ (No charge)
                        </Typography>
                      </Box>
                    </Box>
                  ) : selectedDJ ? (
                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedDJ.name}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {selectedDJ.genres ? selectedDJ.genres.join(', ') : ''}
                      </Typography>
                      {providerSpecificDates[selectedDJ.id] && (
                        <Typography variant="body2" color="primary.main" gutterBottom>
                          {eventData.isMultiSelect 
                            ? `Booked for ${providerSpecificDates[selectedDJ.id].dates?.length || 0} date(s)` 
                            : `Booked for: ${providerSpecificDates[selectedDJ.id].date 
                                ? format(providerSpecificDates[selectedDJ.id].date as Date, 'MMM d, yyyy') 
                                : 'No specific date'}`
                          }
                        </Typography>
                      )}
                      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        <Typography variant="body1" color="primary.main">
                          ${selectedDJ.price?.toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Typography variant="body1" color="text.secondary">
                      No DJ selected (optional)
                    </Typography>
                  )}
                </Grid>
                
                {/* Catering section */}
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Catering
              </Typography>
                  {eventData.useCustomCatering ? (
                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="body1" fontWeight="medium">
                        {eventData.customCatering.name || 'Custom Catering'}
                  </Typography>
                      <Typography variant="body2" gutterBottom>
                        Cuisine: {eventData.customCatering.cuisineTypes.join(', ') || 'Not specified'}
                  </Typography>
                      {eventData.customCatering.specialDiets.length > 0 && (
                        <Typography variant="body2" gutterBottom>
                          Special Diets: {eventData.customCatering.specialDiets.join(', ')}
                        </Typography>
                      )}
                      {eventData.customCatering.description && (
                        <Typography variant="body2" gutterBottom>
                          Description: {eventData.customCatering.description}
                        </Typography>
                      )}
                      {eventData.customCatering.contactInfo && (
                        <Typography variant="body2" gutterBottom>
                          Contact: {eventData.customCatering.contactInfo}
                        </Typography>
                      )}
                      {eventData.customCatering.image && (
                        <Box sx={{ display: 'flex', mt: 1 }}>
                          <Box
                            component="img"
                            src={eventData.customCatering.image}
                            alt="Catering image"
                            sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 1 }}
                          />
                </Box>
              )}
                      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        <Typography variant="body1" color="primary.main">
                          ${eventData.customCatering.pricePerPerson} per person × {eventData.attendees} guests = ${(eventData.customCatering.pricePerPerson * eventData.attendees).toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  ) : selectedCatering ? (
                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedCatering.name}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {selectedCatering.cuisineType ? selectedCatering.cuisineType.join(', ') : ''}
                      </Typography>
                      {providerSpecificDates[selectedCatering.id] && (
                        <Typography variant="body2" color="primary.main" gutterBottom>
                          {eventData.isMultiSelect 
                            ? `Booked for ${providerSpecificDates[selectedCatering.id].dates?.length || 0} date(s)` 
                            : `Booked for: ${providerSpecificDates[selectedCatering.id].date 
                                ? format(providerSpecificDates[selectedCatering.id].date as Date, 'MMM d, yyyy') 
                                : 'No specific date'}`
                          }
                        </Typography>
                      )}
                      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        <Typography variant="body1" color="primary.main">
                          ${selectedCatering.price?.toLocaleString()} per person × {eventData.attendees} guests = ${(selectedCatering.price! * eventData.attendees).toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Typography variant="body1" color="text.secondary">
                      No catering selected (optional)
                    </Typography>
                  )}
                </Grid>
                
                {/* Entertainment section */}
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Entertainment
                  </Typography>
                  {eventData.useCustomEntertainment ? (
                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="body1" fontWeight="medium">
                        {eventData.customEntertainment.name || 'Custom Entertainment'}
                      </Typography>
                      {eventData.customEntertainment.description && (
                        <Typography variant="body2" gutterBottom>
                          Description: {eventData.customEntertainment.description}
                        </Typography>
                      )}
                      {eventData.customEntertainment.image && (
                        <Box sx={{ display: 'flex', mt: 1 }}>
                          <Box
                            component="img"
                            src={eventData.customEntertainment.image}
                            alt="Entertainment image"
                            sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 1 }}
                          />
                        </Box>
                      )}
                      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        <Typography variant="body1" color="primary.main">
                          Custom Entertainment (No charge)
                        </Typography>
                      </Box>
                    </Box>
                  ) : selectedEntertainment ? (
                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedEntertainment.name}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {selectedEntertainment.description}
                      </Typography>
                      {providerSpecificDates[selectedEntertainment.id] && (
                        <Typography variant="body2" color="primary.main" gutterBottom>
                          {eventData.isMultiSelect 
                            ? `Booked for ${providerSpecificDates[selectedEntertainment.id].dates?.length || 0} date(s)` 
                            : `Booked for: ${providerSpecificDates[selectedEntertainment.id].date 
                                ? format(providerSpecificDates[selectedEntertainment.id].date as Date, 'MMM d, yyyy') 
                                : 'No specific date'}`
                          }
                        </Typography>
                      )}
                      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        <Typography variant="body1" color="primary.main">
                          ${selectedEntertainment.price?.toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Typography variant="body1" color="text.secondary">
                      No entertainment selected (optional)
                    </Typography>
                  )}
                </Grid>

                {/* Photography section */}
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Photography
              </Typography>
                  {eventData.useCustomPhotography ? (
                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="body1" fontWeight="medium">
                        {eventData.customPhotography.name || 'Custom Photography'}
                      </Typography>
                      {eventData.customPhotography.description && (
                        <Typography variant="body2" gutterBottom>
                          Description: {eventData.customPhotography.description}
                        </Typography>
                      )}
                      {eventData.customPhotography.image && (
                        <Box sx={{ display: 'flex', mt: 1 }}>
                          <Box
                            component="img"
                            src={eventData.customPhotography.image}
                            alt="Photography image"
                            sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 1 }}
                          />
                        </Box>
                      )}
                      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        <Typography variant="body1" color="primary.main">
                          Custom Photography (No charge)
                        </Typography>
                      </Box>
                    </Box>
                  ) : selectedPhotography ? (
                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedPhotography.name}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {selectedPhotography.description}
                      </Typography>
                      {providerSpecificDates[selectedPhotography.id] && (
                        <Typography variant="body2" color="primary.main" gutterBottom>
                          {eventData.isMultiSelect 
                            ? `Booked for ${providerSpecificDates[selectedPhotography.id].dates?.length || 0} date(s)` 
                            : `Booked for: ${providerSpecificDates[selectedPhotography.id].date 
                                ? format(providerSpecificDates[selectedPhotography.id].date as Date, 'MMM d, yyyy') 
                                : 'No specific date'}`
                          }
                        </Typography>
                      )}
                      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        <Typography variant="body1" color="primary.main">
                          ${selectedPhotography.price?.toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Typography variant="body1" color="text.secondary">
                      No photography selected (optional)
                    </Typography>
                  )}
                </Grid>

                {/* Decoration section */}
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Decoration
                  </Typography>
                  {eventData.useCustomDecoration ? (
                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="body1" fontWeight="medium">
                        {eventData.customDecoration.name || 'Custom Decoration'}
                      </Typography>
                      {eventData.customDecoration.description && (
                        <Typography variant="body2" gutterBottom>
                          Description: {eventData.customDecoration.description}
                        </Typography>
                      )}
                      {eventData.customDecoration.image && (
                        <Box sx={{ display: 'flex', mt: 1 }}>
                          <Box
                            component="img"
                            src={eventData.customDecoration.image}
                            alt="Decoration image"
                            sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 1 }}
                          />
              </Box>
                      )}
                      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        <Typography variant="body1" color="primary.main">
                          Custom Decoration (No charge)
                        </Typography>
                      </Box>
                    </Box>
                  ) : selectedDecoration ? (
                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedDecoration.name}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {selectedDecoration.description}
                      </Typography>
                      {providerSpecificDates[selectedDecoration.id] && (
                        <Typography variant="body2" color="primary.main" gutterBottom>
                          {eventData.isMultiSelect 
                            ? `Booked for ${providerSpecificDates[selectedDecoration.id].dates?.length || 0} date(s)` 
                            : `Booked for: ${providerSpecificDates[selectedDecoration.id].date 
                                ? format(providerSpecificDates[selectedDecoration.id].date as Date, 'MMM d, yyyy') 
                                : 'No specific date'}`
                          }
                        </Typography>
                      )}
                      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        <Typography variant="body1" color="primary.main">
                          ${selectedDecoration.price?.toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Typography variant="body1" color="text.secondary">
                      No decoration selected (optional)
                    </Typography>
                  )}
                </Grid>

                {/* Audio/Visual section */}
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Audio/Visual
                  </Typography>
                  {eventData.useCustomAudioVisual ? (
                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="body1" fontWeight="medium">
                        {eventData.customAudioVisual.name || 'Custom Audio/Visual'}
                      </Typography>
                      {eventData.customAudioVisual.description && (
                        <Typography variant="body2" gutterBottom>
                          Description: {eventData.customAudioVisual.description}
                        </Typography>
                      )}
                      {eventData.customAudioVisual.image && (
                        <Box sx={{ display: 'flex', mt: 1 }}>
                          <Box
                            component="img"
                            src={eventData.customAudioVisual.image}
                            alt="Audio/Visual image"
                            sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 1 }}
                          />
              </Box>
                      )}
                      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        <Typography variant="body1" color="primary.main">
                          Custom Audio/Visual (No charge)
                        </Typography>
                      </Box>
                    </Box>
                  ) : selectedAudioVisual ? (
                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedAudioVisual.name}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {selectedAudioVisual.description}
                      </Typography>
                      {providerSpecificDates[selectedAudioVisual.id] && (
                        <Typography variant="body2" color="primary.main" gutterBottom>
                          {eventData.isMultiSelect 
                            ? `Booked for ${providerSpecificDates[selectedAudioVisual.id].dates?.length || 0} date(s)` 
                            : `Booked for: ${providerSpecificDates[selectedAudioVisual.id].date 
                                ? format(providerSpecificDates[selectedAudioVisual.id].date as Date, 'MMM d, yyyy') 
                                : 'No specific date'}`
                          }
                        </Typography>
                      )}
                      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        <Typography variant="body1" color="primary.main">
                          ${selectedAudioVisual.price?.toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Typography variant="body1" color="text.secondary">
                      No audio/visual selected (optional)
                    </Typography>
                  )}
                </Grid>

                {/* Furniture section */}
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Furniture
                  </Typography>
                  {eventData.useCustomFurniture ? (
                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="body1" fontWeight="medium">
                        {eventData.customFurniture.name || 'Custom Furniture'}
                      </Typography>
                      {eventData.customFurniture.description && (
                        <Typography variant="body2" gutterBottom>
                          Description: {eventData.customFurniture.description}
                        </Typography>
                      )}
                      {eventData.customFurniture.image && (
                        <Box sx={{ display: 'flex', mt: 1 }}>
                          <Box
                            component="img"
                            src={eventData.customFurniture.image}
                            alt="Furniture image"
                            sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 1 }}
                          />
              </Box>
                      )}
                      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        <Typography variant="body1" color="primary.main">
                          Custom Furniture (No charge)
                        </Typography>
                      </Box>
                    </Box>
                  ) : selectedFurniture ? (
                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedFurniture.name}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {selectedFurniture.description}
                      </Typography>
                      {providerSpecificDates[selectedFurniture.id] && (
                        <Typography variant="body2" color="primary.main" gutterBottom>
                          {eventData.isMultiSelect 
                            ? `Booked for ${providerSpecificDates[selectedFurniture.id].dates?.length || 0} date(s)` 
                            : `Booked for: ${providerSpecificDates[selectedFurniture.id].date 
                                ? format(providerSpecificDates[selectedFurniture.id].date as Date, 'MMM d, yyyy') 
                                : 'No specific date'}`
                          }
                        </Typography>
                      )}
                      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        <Typography variant="body1" color="primary.main">
                          ${selectedFurniture.price?.toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Typography variant="body1" color="text.secondary">
                      No furniture selected (optional)
                    </Typography>
                  )}
                </Grid>

                {/* Bar Service section */}
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Bar Service
                  </Typography>
                  {eventData.useCustomBarService ? (
                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="body1" fontWeight="medium">
                        {eventData.customBarService.name || 'Custom Bar Service'}
                      </Typography>
                      {eventData.customBarService.description && (
                        <Typography variant="body2" gutterBottom>
                          Description: {eventData.customBarService.description}
                        </Typography>
                      )}
                      {eventData.customBarService.image && (
                        <Box sx={{ display: 'flex', mt: 1 }}>
                          <Box
                            component="img"
                            src={eventData.customBarService.image}
                            alt="Bar Service image"
                            sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 1 }}
                          />
              </Box>
                      )}
                      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        <Typography variant="body1" color="primary.main">
                          Custom Bar Service (No charge)
                        </Typography>
                      </Box>
                    </Box>
                  ) : selectedBarService ? (
                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedBarService.name}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {selectedBarService.description}
                      </Typography>
                      {providerSpecificDates[selectedBarService.id] && (
                        <Typography variant="body2" color="primary.main" gutterBottom>
                          {eventData.isMultiSelect 
                            ? `Booked for ${providerSpecificDates[selectedBarService.id].dates?.length || 0} date(s)` 
                            : `Booked for: ${providerSpecificDates[selectedBarService.id].date 
                                ? format(providerSpecificDates[selectedBarService.id].date as Date, 'MMM d, yyyy') 
                                : 'No specific date'}`
                          }
                        </Typography>
                      )}
                      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        <Typography variant="body1" color="primary.main">
                          ${selectedBarService.price?.toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Typography variant="body1" color="text.secondary">
                      No bar service selected (optional)
                    </Typography>
                  )}
                </Grid>

                {/* Security section */}
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Security
                  </Typography>
                  {eventData.useCustomSecurity ? (
                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="body1" fontWeight="medium">
                        {eventData.customSecurity.name || 'Custom Security'}
                      </Typography>
                      {eventData.customSecurity.description && (
                        <Typography variant="body2" gutterBottom>
                          Description: {eventData.customSecurity.description}
                        </Typography>
                      )}
                      {eventData.customSecurity.image && (
                        <Box sx={{ display: 'flex', mt: 1 }}>
                          <Box
                            component="img"
                            src={eventData.customSecurity.image}
                            alt="Security image"
                            sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 1 }}
                          />
              </Box>
                      )}
                      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        <Typography variant="body1" color="primary.main">
                          Custom Security (No charge)
                        </Typography>
                      </Box>
                    </Box>
                  ) : selectedSecurity ? (
                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedSecurity.name}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {selectedSecurity.description}
                      </Typography>
                      {providerSpecificDates[selectedSecurity.id] && (
                        <Typography variant="body2" color="primary.main" gutterBottom>
                          {eventData.isMultiSelect 
                            ? `Booked for ${providerSpecificDates[selectedSecurity.id].dates?.length || 0} date(s)` 
                            : `Booked for: ${providerSpecificDates[selectedSecurity.id].date 
                                ? format(providerSpecificDates[selectedSecurity.id].date as Date, 'MMM d, yyyy') 
                                : 'No specific date'}`
                          }
                        </Typography>
                      )}
                      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        <Typography variant="body1" color="primary.main">
                          ${selectedSecurity.price?.toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Typography variant="body1" color="text.secondary">
                      No security selected (optional)
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Paper>
          </Box>
        );
    }
  };
  
  // Add this function after the filterServicesForDateRange function to support the cascading filter
  const filterForPriorSelections = (startDate: Date, endDate: Date) => {
    // Get all dates that have already been selected for any provider
    const allSelectedDates: string[] = [];
    Object.values(providerSpecificDates).forEach(providerData => {
      if (providerData.date) {
        allSelectedDates.push(format(providerData.date as Date, 'yyyy-MM-dd'));
      }
      if (providerData.dates && providerData.dates.length > 0) {
        providerData.dates.forEach(date => {
          allSelectedDates.push(format(date, 'yyyy-MM-dd'));
        });
      }
    });

    // For venues, prioritize those available on already selected dates
    if (allSelectedDates.length > 0) {
      // Filter venues that are available on at least one of the already selected dates
      let priorityVenues = availableVenues.filter(venue => 
        allSelectedDates.some(dateStr => venue.availability.includes(dateStr))
      );
      
      // If we found venues that match the priority dates, use those
      if (priorityVenues.length > 0) {
        setAvailableVenues(priorityVenues);
      }
      
      // Do the same for DJs
      let priorityDJs = availableDJs.filter(dj => 
        allSelectedDates.some(dateStr => dj.availability.includes(dateStr))
      );
      
      if (priorityDJs.length > 0) {
        setAvailableDJs(priorityDJs);
      }
      
      // And for caterers
      let priorityCaterers = availableCaterers.filter(caterer => 
        allSelectedDates.some(dateStr => caterer.availability.includes(dateStr))
      );
      
      if (priorityCaterers.length > 0) {
        setAvailableCaterers(priorityCaterers);
      }
      
      // Continue with other service types...
      // Entertainment
      let priorityEntertainment = availableEntertainment.filter(item => 
        allSelectedDates.some(dateStr => item.availability.includes(dateStr))
      );
      
      if (priorityEntertainment.length > 0) {
        setAvailableEntertainment(priorityEntertainment);
      }
      
      // Photography
      let priorityPhotography = availablePhotography.filter(item => 
        allSelectedDates.some(dateStr => item.availability.includes(dateStr))
      );
      
      if (priorityPhotography.length > 0) {
        setAvailablePhotography(priorityPhotography);
      }
      
      // And so on for other services...
    }
  };
  
  // Get all dates that are already selected by other providers
  const getAlreadySelectedProviderDates = (): string[] => {
    const allDates: string[] = [];
    Object.entries(providerSpecificDates).forEach(([providerId, data]) => {
      // Skip the current provider if we're editing an existing selection
      if (currentSelectingProvider && providerId === currentSelectingProvider.id) {
        return;
      }
      
      // Add all selected dates
      if (data.date) {
        allDates.push(format(data.date as Date, 'yyyy-MM-dd'));
      }
      if (data.dates && data.dates.length > 0) {
        data.dates.forEach(date => {
          allDates.push(format(date, 'yyyy-MM-dd'));
        });
      }
    });
    return allDates;
  };
  
  // Get dates that are selected for other providers as Date objects
  const getSelectedDatesForOtherServices = (): Date[] => {
    const dates: Date[] = [];
    Object.entries(providerSpecificDates).forEach(([providerId, data]) => {
      // Skip the current provider if we're editing an existing selection
      if (currentSelectingProvider && providerId === currentSelectingProvider.id) {
        return;
      }
      
      // Add all selected dates as Date objects
      if (data.date) {
        dates.push(new Date(data.date as Date));
      }
      if (data.dates && data.dates.length > 0) {
        data.dates.forEach(date => {
          dates.push(new Date(date));
        });
      }
    });
    console.log('Selected dates for other services:', dates.map(d => format(d, 'yyyy-MM-dd')));
    return dates;
  };
  
  // Get unavailable dates based on other provider selections
  const getUnavailableDates = (provider: ServiceProvider | undefined): string[] => {
    if (!provider || !provider.availability) return [];
    
    const allSelectedDates = getAlreadySelectedProviderDates();
    
    // Return dates that are not in the provider's availability
    if (allSelectedDates.length > 0) {
      // For each selected date, check if this provider is available
      return allSelectedDates.filter(dateStr => !provider.availability.includes(dateStr));
    }
    
    return [];
  };
  
  // Handler for provider selection mode change
  const handleProviderSelectionModeChange = (isMultiSelectMode: boolean) => {
    // Update the global selection mode
    setEventData({
      ...eventData,
      isMultiSelect: isMultiSelectMode
    });
    
    // Keep track of current selected dates
    if (!isMultiSelectMode && tempSelectedDates.length > 0) {
      // If switching to single mode and we have multiple dates, just keep the first one
      setTempSelectedDate(tempSelectedDates[0]);
      setTempSelectedDates([tempSelectedDates[0]]);
    } else if (isMultiSelectMode && tempSelectedDate) {
      // If switching to multi mode and we have a single date, convert it to an array
      if (tempSelectedDates.length === 0) {
        setTempSelectedDates([tempSelectedDate]);
      }
    }
  };

  // The tab content for selecting provider-specific dates
  const getProviderDateSelectorTab = () => {
    if (!currentSelectingProvider || !currentSelectingProviderType) return null;
    
    // Determine the proper date range to pass based on selection mode
    let dateRangeToPass = eventData.dateRange;
    
    // If we're in multi-select mode with no date range, pass null as date range
    if (eventData.isMultiSelect && (!eventData.dateRange.start || !eventData.dateRange.end) && eventData.selectedDates.length > 0) {
      dateRangeToPass = { start: null, end: null };
    }
    
    // Ensure we have proper available dates
    if (availableDatesForDisplay.length === 0 && currentSelectingProvider.availability.length > 0) {
      console.log("Warning: No available dates provided to date selector but provider has availability");
      
      // As a fallback, generate available dates from the provider's availability
      let fallbackDates: Date[] = [];
      
      if (eventData.isMultiDay && eventData.dateRange.start && eventData.dateRange.end) {
        // For date range
        fallbackDates = currentSelectingProvider.availability
          .filter(dateStr => {
            const date = new Date(dateStr);
            return (date >= eventData.dateRange.start! && date <= eventData.dateRange.end!);
          })
          .map(dateStr => new Date(dateStr));
      } else if (eventData.isMultiSelect && eventData.selectedDates.length > 0) {
        // For multi-select dates
        fallbackDates = currentSelectingProvider.availability
          .filter(dateStr => 
            eventData.selectedDates.some(selectedDate => 
              format(selectedDate, 'yyyy-MM-dd') === dateStr
            )
          )
          .map(dateStr => new Date(dateStr));
      }
      
      // Update the availableDatesForDisplay state
      if (fallbackDates.length > 0) {
        setAvailableDatesForDisplay(fallbackDates);
      }
    }
    
    return (
      <ProviderDateSelector 
        provider={currentSelectingProvider}
        providerType={currentSelectingProviderType}
        dateRange={dateRangeToPass}
        selectedDate={tempSelectedDate}
        selectedDates={eventData.isMultiSelect ? [...eventData.selectedDates, ...tempSelectedDates] : tempSelectedDates}
        onDateSelect={handleProviderDateSelect}
        onConfirm={handleConfirmProviderDateSelection}
        onCancel={handleCancelProviderDateSelection}
        isMultiSelect={eventData.isMultiSelect}
        onSelectionModeChange={handleProviderSelectionModeChange}
        unavailableDates={getUnavailableDates(currentSelectingProvider)}
        alreadySelectedProviderDates={getAlreadySelectedProviderDates()}
        availableDatesForDisplay={availableDatesForDisplay}
        selectedDatesForOtherServices={getSelectedDatesForOtherServices()}
      />
    );
  };
  
  // Check if the required services are selected
  const hasRequiredServices = useCallback(() => {
    // Venue is required - either a venue ID OR a custom venue with required fields
    const hasVenue = eventData.venueId || (
      eventData.useCustomVenue && 
      eventData.customVenue.name.trim() !== '' && 
      eventData.customVenue.location.trim() !== '' &&
      eventData.customVenue.capacity > 0
    );
    
    // Only venue is required now, other services are optional
    return hasVenue;
  }, [eventData.venueId, eventData.useCustomVenue, eventData.customVenue]);
  
  // Generic custom service form for remaining services (entertainment, photography, decoration, etc.)
  const getCustomServiceForm = (tabId: string) => {
    // Get category information
    const categoryInfo = serviceCategories.find(cat => cat.id === tabId);
    
    // Get the custom field name for this service (e.g., useCustomEntertainment)
    const customFieldName = `useCustom${tabId.charAt(0).toUpperCase() + tabId.slice(1)}` as keyof typeof eventData;
    
    // Get the custom service object from eventData (e.g., customEntertainment)
    const customServiceField = `custom${tabId.charAt(0).toUpperCase() + tabId.slice(1)}` as keyof typeof eventData;
    const customService = eventData[customServiceField] as any;
    
    return (
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Add Your Own {categoryInfo?.label || 'Service'}
        </Typography>
        
        <Grid container spacing={2}>
          {/* Service Name */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={`${categoryInfo?.label || 'Service'} Name`}
              value={customService.name}
              onChange={(e) => {
                // Create a state update object
                const stateUpdate = {
                  ...eventData
                } as any;
                
                // Update the name field
                stateUpdate[customServiceField] = {
                  ...customService,
                  name: e.target.value
                };
                
                // Update the state
                setEventData(stateUpdate);
              }}
              required
              error={!customService.name.trim()}
              helperText={!customService.name.trim() ? "Name is required" : ""}
            />
          </Grid>
          
          {/* Description */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={customService.description}
              onChange={(e) => {
                // Create a state update object
                const stateUpdate = {
                  ...eventData
                } as any;
                
                // Update the description field
                stateUpdate[customServiceField] = {
                  ...customService,
                  description: e.target.value
                };
                
                // Update the state
                setEventData(stateUpdate);
              }}
              required
              error={!customService.description.trim()}
              helperText={!customService.description.trim() ? "Description is required" : ""}
              placeholder={`Describe the ${categoryInfo?.label || 'service'}`}
            />
          </Grid>
          
          {/* Image Upload */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {categoryInfo?.label || 'Service'} Image
            </Typography>
            <Box 
              sx={{ 
                border: '2px dashed', 
                borderColor: 'divider', 
                p: 3, 
                borderRadius: 1,
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'action.hover'
                }
              }}
              onClick={() => {
                // Create a state update object
                const stateUpdate = {
                  ...eventData
                } as any;
                
                // Update the image field
                stateUpdate[customServiceField] = {
                  ...customService,
                  image: `https://via.placeholder.com/300x300?text=${categoryInfo?.label || 'Service'}+Image`
                };
                
                // Update the state
                setEventData(stateUpdate);
              }}
            >
              <Typography variant="body1" gutterBottom>
                Upload Image
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click to add an image
              </Typography>
              </Box>
          </Grid>
          
          {/* Display image if one is selected */}
          {customService.image && (
            <Grid item xs={12}>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Box 
                  sx={{ 
                    position: 'relative',
                    width: 150,
                    height: 150,
                    borderRadius: 2,
                    overflow: 'hidden'
                  }}
                >
                  <img 
                    src={customService.image} 
                    alt={`${categoryInfo?.label || 'Service'}`} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <IconButton
                    size="small"
                    sx={{ 
                      position: 'absolute', 
                      top: 0, 
                      right: 0, 
                      bgcolor: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'rgba(0,0,0,0.7)'
                      }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      
                      // Create a state update object
                      const stateUpdate = {
                        ...eventData
                      } as any;
                      
                      // Update the image field
                      stateUpdate[customServiceField] = {
                        ...customService,
                        image: ''
                      };
                      
                      // Update the state
                      setEventData(stateUpdate);
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
              </Box>
              </Box>
            </Grid>
          )}
          
          {/* Confirmation Buttons */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                variant="outlined"
                onClick={() => {
                  // Create a state update object to disable custom mode
                  const stateUpdate = {
                    ...eventData
                  } as any;
                  
                  // Disable custom mode
                  stateUpdate[customFieldName] = false;
                  
                  // Update the state
                  setEventData(stateUpdate);
                }}
              >
                Cancel
              </Button>
              
              <Button
                variant="contained"
                color="primary"
                disabled={!customService.name.trim() || !customService.description.trim()}
                onClick={() => {
                  // Show confirmation message
                  setSnackbarMessage(`Custom ${categoryInfo?.label || 'service'} has been confirmed!`);
                  setSnackbarOpen(true);
                  
                  // Navigate back to services tab
                  setActiveTab('services');
                }}
              >
                Confirm {categoryInfo?.label || 'Service'}
              </Button>
              </Box>
          </Grid>
        </Grid>
            </Paper>
        );
  };
  
  return (
    <Layout title="Create Event" hideSearch>
      <Container maxWidth="md">
        <Box sx={{ width: '100%', mb: 4 }}>
          {/* Replace Stepper with Tabs */}
          <Paper sx={{ mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
              aria-label="event creation tabs"
            >
              {tabs.map((tab) => (
                <Tab 
                  key={tab.id}
                  value={tab.id}
                  label={tab.label}
                  icon={tab.icon}
                  iconPosition="start"
                />
              ))}
            </Tabs>
          </Paper>
          
          {/* Always show the main content */}
          {getTabContent(activeTab)}
          
          {/* Only show main navigation buttons when NOT in provider selection mode */}
          {!isSelectingProviderDates && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              {/* 
                Navigation buttons for event creation process:
                - Back button: navigates to previous step or back to services from service-specific tabs
                - Next button: navigates to next step or back to services from service-specific tabs
                - Button labels change based on current tab to clearly indicate destination
              */}
              <Box>
                <Button
                  variant="outlined"
                  disabled={activeTab === 'dates'}
                  onClick={() => {
                    if (activeTab === 'services') {
                      setActiveTab('dates');
                    } else if (activeTab === 'review') {
                      setActiveTab('services');
                    } else if (
                      activeTab === 'dj' || 
                      activeTab === 'catering' ||
                      activeTab === 'entertainment' ||
                      activeTab === 'photography' ||
                      activeTab === 'decoration' ||
                      activeTab === 'audioVisual' ||
                      activeTab === 'furniture' ||
                      activeTab === 'barService' ||
                      activeTab === 'security' ||
                      activeTab === 'venue'
                    ) {
                      setActiveTab('services');
                    }
                  }}
                  startIcon={<ArrowBackIcon />}
                  sx={{ mr: 1 }}
                >
                  {activeTab === 'review' ? 'Back to Services' : 
                   (activeTab === 'services' ? 'Back to Dates' : 'Back to Services')}
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={handleSaveDraft}
                  startIcon={<SaveIcon />}
                >
                  Save Draft
                </Button>
              </Box>
              
              {activeTab === 'review' ? (
                <Button 
                  variant="contained" 
                  onClick={handleSubmit}
                  disabled={
                    (!eventData.venueId && !eventData.useCustomVenue) || 
                    (eventData.isMultiDay ? 
                      !eventData.dateRange.start || !eventData.dateRange.end : 
                      eventData.isMultiSelect ?
                        eventData.selectedDates.length === 0 :
                        !eventData.date
                    )
                  }
                >
                  Create Event
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => {
                    if (activeTab === 'dates') {
                      setActiveTab('services');
                    } else if (activeTab === 'services') {
                      setActiveTab('review');
                    } else if (
                      activeTab === 'dj' || 
                      activeTab === 'catering' ||
                      activeTab === 'entertainment' ||
                      activeTab === 'photography' ||
                      activeTab === 'decoration' ||
                      activeTab === 'audioVisual' ||
                      activeTab === 'furniture' ||
                      activeTab === 'barService' ||
                      activeTab === 'security' ||
                      activeTab === 'venue'
                    ) {
                      // For service-specific tabs, always navigate back to services
                      setActiveTab('services');
                    }
                  }}
                  endIcon={<ArrowForwardIcon />}
                  disabled={
                    (activeTab === 'dates' && (
                      !eventData.name || 
                      (eventData.isMultiDay ? 
                        !eventData.dateRange.start || !eventData.dateRange.end : 
                        eventData.isMultiSelect ?
                          eventData.selectedDates.length === 0 :
                          !eventData.date
                      )
                    )) ||
                    (activeTab === 'services' && (!eventData.venueId && !eventData.useCustomVenue))
                  }
                >
                  {activeTab === 'dates' ? 'Next to Services' : 
                   activeTab === 'services' ? 'Review Event' : 
                   (activeTab === 'venue' || 
                    activeTab === 'dj' || 
                    activeTab === 'catering' || 
                    activeTab === 'entertainment' || 
                    activeTab === 'photography' || 
                    activeTab === 'decoration' || 
                    activeTab === 'audioVisual' || 
                    activeTab === 'furniture' || 
                    activeTab === 'barService' || 
                    activeTab === 'security') ? 'Back to Services' : 'Next'}
                </Button>
              )}
            </Box>
          )}
        </Box>
        
        {/* Provider Date Selection Modal Overlay */}
        {isSelectingProviderDates && currentSelectingProvider && (
          <Box 
            sx={{ 
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              padding: 2,
              overflowY: 'auto'
            }}
          >
            <Box 
              sx={{ 
                maxWidth: 'md', 
                width: '100%', 
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1
              }}
            >
              <Box sx={{ flexGrow: 1 }}>
                {getProviderDateSelectorTab()}
              </Box>
            </Box>
          </Box>
        )}
        
        {/* Save Draft Dialog */}
        <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
          <DialogTitle>Save Event Draft</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Give your draft a name so you can easily find it later.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Draft Name"
              fullWidth
              variant="outlined"
              value={draftName || eventData.name || 'Untitled Event'}
              onChange={(e) => setDraftName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmSaveDraft} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>
        
        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
          action={
            <IconButton
              size="small"
              color="inherit"
              onClick={handleSnackbarClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      </Container>
    </Layout>
  );
};

export default CreateEventPage; 