import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Tabs
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
  LocationOn as LocationIcon
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

const CreateEventPage: React.FC = () => {
  const navigate = useNavigate();
  // Replace activeStep with activeTab
  const [activeTab, setActiveTab] = useState('dates');
  
  // Add state for snackbar and dialog
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [draftName, setDraftName] = useState('');
  
  // Define service categories
  const serviceCategories = [
    { id: 'venue', label: 'Venue', icon: <LocationIcon />, required: false },
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
    isPublic: false,
    venueId: '',
    djId: '',
    cateringId: '',
    entertainmentId: '',
    photographyId: '',
    decorationId: '',
    audioVisualId: '',
    furnitureId: '',
    barServiceId: '',
    securityId: '',
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
    } else if (!eventData.isMultiDay && eventData.date) {
      // Filter services based on single date
      filterServicesForSingleDate(eventData.date);
    }
  }, [eventData.date, eventData.dateRange.start, eventData.dateRange.end, eventData.isMultiDay, 
      venueFilters, djFilters, cateringFilters]);
  
  // Filter services for a single date
  const filterServicesForSingleDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    
    // Filter venues
    let filteredVenues = venues.filter(venue => 
      venue.availability.includes(dateString)
    );
    
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
    
    // Filter DJs
    let filteredDJs = djs.filter(dj => 
      dj.availability.includes(dateString)
    );
    
    // Apply DJ filters
    if (djFilters.genres.length > 0) {
      filteredDJs = filteredDJs.filter(dj => 
        dj.genres.some(genre => djFilters.genres.includes(genre))
      );
    }
    
    filteredDJs = filteredDJs.filter(dj => dj.price <= djFilters.maxPrice);
    
    // Filter caterers
    let filteredCaterers = cateringServices.filter(caterer => 
      caterer.availability.includes(dateString)
    );
    
    // Apply catering filters
    if (cateringFilters.cuisineTypes.length > 0) {
      filteredCaterers = filteredCaterers.filter(caterer => 
        caterer.cuisineType.some(cuisine => cateringFilters.cuisineTypes.includes(cuisine))
      );
    }
    
    filteredCaterers = filteredCaterers.filter(caterer => caterer.price <= cateringFilters.maxPrice);
    
    // Filter entertainment
    let filteredEntertainment = entertainment.filter(item => 
      item.availability.includes(dateString)
    );
    
    // Apply entertainment filters
    if (entertainmentFilters.types.length > 0) {
      filteredEntertainment = filteredEntertainment.filter(item => 
        item.type.some(type => entertainmentFilters.types.includes(type))
      );
    }
    
    filteredEntertainment = filteredEntertainment.filter(item => item.price <= entertainmentFilters.maxPrice);
    
    // Filter photography
    let filteredPhotography = photography.filter(item => 
      item.availability.includes(dateString)
    );
    
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
    
    // Filter decoration
    let filteredDecoration = decoration.filter(item => 
      item.availability.includes(dateString)
    );
    
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
    
    // Filter audio visual
    let filteredAudioVisual = audioVisual.filter(item => 
      item.availability.includes(dateString)
    );
    
    // Apply audio visual filters
    if (audioVisualFilters.equipmentTypes.length > 0) {
      filteredAudioVisual = filteredAudioVisual.filter(item => 
        item.equipmentTypes.some(type => audioVisualFilters.equipmentTypes.includes(type))
      );
    }
    
    filteredAudioVisual = filteredAudioVisual.filter(item => item.price <= audioVisualFilters.maxPrice);
    
    // Filter furniture
    let filteredFurniture = furniture.filter(item => 
      item.availability.includes(dateString)
    );
    
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
    
    // Filter bar services
    let filteredBarServices = barServices.filter(item => 
      item.availability.includes(dateString)
    );
    
    // Apply bar service filters
    if (barServiceFilters.serviceTypes.length > 0) {
      filteredBarServices = filteredBarServices.filter(item => 
        item.serviceTypes.some(type => barServiceFilters.serviceTypes.includes(type))
      );
    }
    
    filteredBarServices = filteredBarServices.filter(item => item.price <= barServiceFilters.maxPrice);
    
    // Filter security
    let filteredSecurity = security.filter(item => 
      item.availability.includes(dateString)
    );
    
    // Apply security filters
    if (securityFilters.serviceTypes.length > 0) {
      filteredSecurity = filteredSecurity.filter(item => 
        item.serviceTypes.some(type => securityFilters.serviceTypes.includes(type))
      );
    }
    
    filteredSecurity = filteredSecurity.filter(item => item.price <= securityFilters.maxPrice);
    
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
  };
  
  // Filter services for a date range
  const filterServicesForDateRange = (startDate: Date, endDate: Date) => {
    // Generate array of dates in the range
    const dateRange: string[] = [];
    let currentDate = startDate;
    
    while (isBefore(currentDate, endDate) || isEqual(currentDate, endDate)) {
      dateRange.push(format(currentDate, 'yyyy-MM-dd'));
      currentDate = addDays(currentDate, 1);
    }
    
    // Filter venues available for ANY date in the range (not ALL dates)
    let filteredVenues = venues.filter(venue => 
      dateRange.some(date => venue.availability.includes(date))
    );
    
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
    
    // Filter DJs available for ANY date in the range
    let filteredDJs = djs.filter(dj => 
      dateRange.some(date => dj.availability.includes(date))
    );
    
    // Apply DJ filters
    if (djFilters.genres.length > 0) {
      filteredDJs = filteredDJs.filter(dj => 
        dj.genres.some(genre => djFilters.genres.includes(genre))
      );
    }
    
    filteredDJs = filteredDJs.filter(dj => dj.price <= djFilters.maxPrice);
    
    // Filter caterers available for ANY date in the range
    let filteredCaterers = cateringServices.filter(caterer => 
      dateRange.some(date => caterer.availability.includes(date))
    );
    
    // Apply catering filters
    if (cateringFilters.cuisineTypes.length > 0) {
      filteredCaterers = filteredCaterers.filter(caterer => 
        caterer.cuisineType.some(cuisine => cateringFilters.cuisineTypes.includes(cuisine))
      );
    }
    
    filteredCaterers = filteredCaterers.filter(caterer => caterer.price <= cateringFilters.maxPrice);
    
    // Filter entertainment available for ANY date in the range
    let filteredEntertainment = entertainment.filter(item => 
      dateRange.some(date => item.availability.includes(date))
    );
    
    // Apply entertainment filters
    if (entertainmentFilters.types.length > 0) {
      filteredEntertainment = filteredEntertainment.filter(item => 
        item.type.some(type => entertainmentFilters.types.includes(type))
      );
    }
    
    filteredEntertainment = filteredEntertainment.filter(item => item.price <= entertainmentFilters.maxPrice);
    
    // Filter photography available for ANY date in the range
    let filteredPhotography = photography.filter(item => 
      dateRange.some(date => item.availability.includes(date))
    );
    
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
    
    // Filter decoration available for ANY date in the range
    let filteredDecoration = decoration.filter(item => 
      dateRange.some(date => item.availability.includes(date))
    );
    
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
    
    // Filter audio visual available for ANY date in the range
    let filteredAudioVisual = audioVisual.filter(item => 
      dateRange.some(date => item.availability.includes(date))
    );
    
    // Apply audio visual filters
    if (audioVisualFilters.equipmentTypes.length > 0) {
      filteredAudioVisual = filteredAudioVisual.filter(item => 
        item.equipmentTypes.some(type => audioVisualFilters.equipmentTypes.includes(type))
      );
    }
    
    filteredAudioVisual = filteredAudioVisual.filter(item => item.price <= audioVisualFilters.maxPrice);
    
    // Filter furniture available for ANY date in the range
    let filteredFurniture = furniture.filter(item => 
      dateRange.some(date => item.availability.includes(date))
    );
    
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
    
    // Filter bar services available for ANY date in the range
    let filteredBarServices = barServices.filter(item => 
      dateRange.some(date => item.availability.includes(date))
    );
    
    // Apply bar service filters
    if (barServiceFilters.serviceTypes.length > 0) {
      filteredBarServices = filteredBarServices.filter(item => 
        item.serviceTypes.some(type => barServiceFilters.serviceTypes.includes(type))
      );
    }
    
    filteredBarServices = filteredBarServices.filter(item => item.price <= barServiceFilters.maxPrice);
    
    // Filter security available for ANY date in the range
    let filteredSecurity = security.filter(item => 
      dateRange.some(date => item.availability.includes(date))
    );
    
    // Apply security filters
    if (securityFilters.serviceTypes.length > 0) {
      filteredSecurity = filteredSecurity.filter(item => 
        item.serviceTypes.some(type => securityFilters.serviceTypes.includes(type))
      );
    }
    
    filteredSecurity = filteredSecurity.filter(item => item.price <= securityFilters.maxPrice);
    
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
  
  // Handle service selection
  const handleServiceSelect = (type: 'venue' | 'dj' | 'catering' | 'entertainment' | 'photography' | 'decoration' | 'audioVisual' | 'furniture' | 'barService' | 'security', id: string) => {
    const fieldMap = {
      venue: 'venueId',
      dj: 'djId',
      catering: 'cateringId',
      entertainment: 'entertainmentId',
      photography: 'photographyId',
      decoration: 'decorationId',
      audioVisual: 'audioVisualId',
      furniture: 'furnitureId',
      barService: 'barServiceId',
      security: 'securityId',
    };
    
    handleChange(fieldMap[type], id);
    
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
  
  // Navigate to previous month in calendar
  const handlePrevMonth = () => {
    setCalendarDate(prevDate => subMonths(prevDate, 1));
  };
  
  // Navigate to next month in calendar
  const handleNextMonth = () => {
    setCalendarDate(prevDate => addMonths(prevDate, 1));
  };
  
  // Handle form submission
  const handleSubmit = () => {
    // Prepare the event data
    const submissionData = {
      ...eventData,
      // Format dates for submission
      date: eventData.date ? format(eventData.date, 'yyyy-MM-dd') : null,
      dateRange: {
        start: eventData.dateRange.start ? format(eventData.dateRange.start, 'yyyy-MM-dd') : null,
        end: eventData.dateRange.end ? format(eventData.dateRange.end, 'yyyy-MM-dd') : null,
      },
      selectedDates: eventData.selectedDates.map(date => format(date, 'yyyy-MM-dd'))
    };
    
    // In a real app, this would send the data to the backend
    console.log('Event data submitted:', submissionData);
    
    // Navigate to the My Events page
    navigate('/my-events');
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
              <FormControlLabel 
                control={
                  <Checkbox 
                    checked={eventData.isPublic} 
                    onChange={(e) => handleChange('isPublic', e.target.checked)} 
                  />
                } 
                label="Make this event public (visible in featured events)" 
              />
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
                                {eventData[`${category.id}Id` as keyof typeof eventData] ? 
                                  'Selected' : 
                                  'Not selected'}
                              </Typography>
                            </Box>
                            {eventData[`${category.id}Id` as keyof typeof eventData] && 
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
            ) : (
            <Grid container spacing={2} sx={{ mt: 1 }}>
                {availableVenues.map((venue) => (
                <Grid item xs={12} sm={6} key={venue.id}>
                  <Card 
                    sx={{ 
                      border: eventData.venueId === venue.id ? 2 : 0,
                      borderColor: 'primary.main',
                    }}
                  >
                      <CardActionArea onClick={() => {
                        handleServiceSelect('venue', venue.id);
                        setActiveTab('services');
                      }}>
                      <ServiceCard service={venue} type="venue" />
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 3 }}>
              <Button 
                variant="outlined" 
                startIcon={<ArrowBackIcon />} 
                onClick={() => setActiveTab('services')}
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
                {availableDJs.map((dj) => (
                <Grid item xs={12} sm={6} key={dj.id}>
                  <Card 
                    sx={{ 
                      border: eventData.djId === dj.id ? 2 : 0,
                      borderColor: 'primary.main',
                    }}
                  >
                      <CardActionArea onClick={() => {
                        handleServiceSelect('dj', dj.id);
                        setActiveTab('services');
                      }}>
                      <ServiceCard service={dj} type="dj" />
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 3 }}>
              <Button 
                variant="outlined" 
                startIcon={<ArrowBackIcon />} 
                onClick={() => setActiveTab('services')}
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
                      <CardActionArea onClick={() => {
                        handleServiceSelect('catering', catering.id);
                        setActiveTab('services');
                      }}>
                      <ServiceCard service={catering} type="catering" />
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 3 }}>
              <Button 
                variant="outlined" 
                startIcon={<ArrowBackIcon />} 
                onClick={() => setActiveTab('services')}
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
        
        return (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Select {categoryInfo?.label || 'Service'}
            </Typography>
            
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
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 3 }}>
              <Button 
                variant="outlined" 
                startIcon={<ArrowBackIcon />} 
                onClick={() => setActiveTab('services')}
              >
                Back to Services
              </Button>
            </Box>
          </Box>
        );
        
      case 'review':
        // Confirmation content (from original step 4)
        const selectedVenue = venues.find(v => v.id === eventData.venueId);
        const selectedDJ = djs.find(d => d.id === eventData.djId);
        const selectedCatering = cateringServices.find(c => c.id === eventData.cateringId);
        
        // Calculate number of days for multi-day events
        const numberOfDays = eventData.isMultiDay && eventData.dateRange.start && eventData.dateRange.end
          ? Math.round((eventData.dateRange.end.getTime() - eventData.dateRange.start.getTime()) / (1000 * 60 * 60 * 24)) + 1
        : 1;
        
        // Calculate costs
        const venueCost = selectedVenue ? selectedVenue.price * numberOfDays : 0;
        const djCost = selectedDJ ? selectedDJ.price * numberOfDays : 0;
        const cateringCost = selectedCatering ? selectedCatering.price * eventData.attendees * numberOfDays : 0;
        
        // Calculate tax and service fees (example rates)
        const taxRate = 0.08; // 8% tax
        const serviceFee = 0.15; // 15% service fee
        
        const subtotal = venueCost + djCost + cateringCost;
        const taxAmount = subtotal * taxRate;
        const serviceFeeAmount = subtotal * serviceFee;
        const total = subtotal + taxAmount + serviceFeeAmount;
        
        return (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Event Summary
            </Typography>
            
            <Paper sx={{ p: 3, mt: 2 }}>
              <Typography variant="h5" gutterBottom>
                {eventData.name || 'Untitled Event'}
              </Typography>
              
              <Typography variant="body1" gutterBottom>
                {eventData.isMultiDay && eventData.dateRange.start && eventData.dateRange.end ? (
                  <>
                    Date Range: {format(eventData.dateRange.start, 'MMM d, yyyy')} - {format(eventData.dateRange.end, 'MMM d, yyyy')} ({numberOfDays} days)
                  </>
                ) : (
                  <>
                    Date: {eventData.date ? format(eventData.date, 'MMM d, yyyy') : 'Not selected'}
                  </>
                )}
              </Typography>
              
              <Typography variant="body1" gutterBottom>
                Attendees: {eventData.attendees}
              </Typography>
              
              <Typography variant="body1" gutterBottom>
                Public Event: {eventData.isPublic ? 'Yes' : 'No'}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Selected Services:
              </Typography>
              
              {selectedVenue && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="medium">
                    Venue: {selectedVenue.name}
              </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedVenue.type} • {selectedVenue.style.join(', ')}
                  </Typography>
                  <Typography variant="body2">
                    ${selectedVenue.price.toLocaleString()} per day × {numberOfDays} {numberOfDays > 1 ? 'days' : 'day'}
                  </Typography>
                </Box>
              )}
              
              {selectedDJ && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="medium">
                    DJ: {selectedDJ.name}
              </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedDJ.genres.join(', ')}
                  </Typography>
                  <Typography variant="body2">
                    ${selectedDJ.price.toLocaleString()} per day × {numberOfDays} {numberOfDays > 1 ? 'days' : 'day'}
                  </Typography>
                </Box>
              )}
              
              {selectedCatering && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="medium">
                    Catering: {selectedCatering.name}
              </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedCatering.cuisineType.join(', ')}
                  </Typography>
                  <Typography variant="body2">
                    ${selectedCatering.price.toLocaleString()} per person × {eventData.attendees} guests × {numberOfDays} {numberOfDays > 1 ? 'days' : 'day'}
                  </Typography>
                </Box>
              )}
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Price Breakdown:
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Venue Total:</Typography>
                <Typography variant="body1">${venueCost.toLocaleString()}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">DJ Total:</Typography>
                <Typography variant="body1">${djCost.toLocaleString()}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Catering Total:</Typography>
                <Typography variant="body1">${cateringCost.toLocaleString()}</Typography>
              </Box>
              
              <Divider sx={{ my: 1 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Subtotal:</Typography>
                <Typography variant="body1">${subtotal.toLocaleString()}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Tax ({(taxRate * 100).toFixed(0)}%):</Typography>
                <Typography variant="body1">${taxAmount.toLocaleString()}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Service Fee ({(serviceFee * 100).toFixed(0)}%):</Typography>
                <Typography variant="body1">${serviceFeeAmount.toLocaleString()}</Typography>
              </Box>
              
              <Divider sx={{ my: 1 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" fontWeight="bold">${total.toLocaleString()}</Typography>
              </Box>
              
              <Box sx={{ mt: 3, p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
                <Typography variant="body2" color="primary.contrastText">
                  A 25% deposit (${(total * 0.25).toLocaleString()}) will be required to confirm your booking. The remaining balance will be due 14 days before your event.
              </Typography>
              </Box>
            </Paper>
          </Box>
        );
    }
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
          
          {getTabContent(activeTab)}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Box>
            <Button
              variant="outlined"
                disabled={activeTab === 'dates'}
                onClick={() => {
                  if (activeTab === 'services') {
                    setActiveTab('dates');
                  } else if (activeTab === 'review') {
                    setActiveTab('services');
                  }
                }}
              startIcon={<ArrowBackIcon />}
                sx={{ mr: 1 }}
            >
              Back
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
                  !eventData.venueId || 
                  !eventData.djId || 
                  (eventData.isMultiDay ? 
                    !eventData.dateRange.start || !eventData.dateRange.end : 
                    eventData.isMultiSelect ?
                      eventData.selectedDates.length === 0 :
                      !eventData.date
                  )
                }
              >
                Book Now
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={() => {
                  if (activeTab === 'dates') {
                    setActiveTab('services');
                  } else if (activeTab === 'services') {
                    setActiveTab('review');
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
                  (activeTab === 'services' && (!eventData.venueId || !eventData.djId))
                }
              >
                {activeTab === 'services' ? 'Review & Book' : 'Next'}
              </Button>
            )}
          </Box>
        </Box>
        
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