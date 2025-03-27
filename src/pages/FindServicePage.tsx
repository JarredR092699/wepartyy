import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Grid,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Button,
  Paper,
  IconButton,
  Tooltip,
  SelectChangeEvent
} from '@mui/material';
import { 
  Search as SearchIcon, 
  FilterList as FilterIcon,
  MyLocation as MyLocationIcon,
  LocationOn as LocationOnIcon
} from '@mui/icons-material';
import Layout from '../components/Layout';
import ServiceCard from '../components/ServiceCard';
import { venues, djs, cateringServices, calculateDistance } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Type for the user's location
interface UserLocation {
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`service-tabpanel-${index}`}
      aria-labelledby={`service-tab-${index}`}
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

const FindServicePage: React.FC = () => {
  const routeLocation = useLocation();
  const { currentUser } = useAuth();
  
  // Parse URL parameters for initial tab selection
  const getInitialTab = () => {
    // Check for URL query parameters
    const queryParams = new URLSearchParams(routeLocation.search);
    const serviceType = queryParams.get('type');
    
    if (serviceType === 'venue') return 0;
    if (serviceType === 'dj') return 1;
    if (serviceType === 'catering') return 2;
    
    // Check for state data (for backward compatibility)
    if (routeLocation.state && 'initialTab' in routeLocation.state) {
      return (routeLocation.state as { initialTab: number }).initialTab;
    }
    
    return 0; // Default to venues
  };
  
  const [tabValue, setTabValue] = useState(getInitialTab());
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter states
  const [priceRange, setPriceRange] = useState<number[]>([0, 3000]);
  const [venueType, setVenueType] = useState<string[]>([]);
  const [venueSize, setVenueSize] = useState<string[]>([]);
  const [djGenres, setDjGenres] = useState<string[]>([]);
  const [cuisineTypes, setCuisineTypes] = useState<string[]>([]);
  
  // Location and distance filtering
  const [userLocation, setUserLocation] = useState<UserLocation>({
    address: currentUser?.location?.address || 'New York, NY',
    coordinates: currentUser?.location?.coordinates || { lat: 40.7128, lng: -74.0060 }
  });
  const [customLocation, setCustomLocation] = useState('');
  const [distanceRadius, setDistanceRadius] = useState<number>(10); // in km
  
  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setShowFilters(false);
  };
  
  // Toggle filters visibility
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Handle multiple select change
  const handleMultiSelectChange = (
    event: SelectChangeEvent<string[]>,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter(event.target.value as string[]);
  };
  
  // Use current location (mock implementation)
  const useCurrentLocation = () => {
    // In a real app, this would use the browser's geolocation API
    // For now, we'll just set a mock location
    setUserLocation({
      address: 'Current Location',
      coordinates: { lat: 40.7128, lng: -74.0060 }
    });
    setCustomLocation('');
  };
  
  // Set custom location (mock implementation)
  const setCustomLocationHandler = () => {
    if (customLocation) {
      // In a real app, this would use a geocoding API to convert address to coordinates
      // For now, we'll just set mock coordinates
      setUserLocation({
        address: customLocation,
        coordinates: { lat: 40.7500, lng: -73.9800 }
      });
    }
  };
  
  // Calculate distance for each service
  const calculateDistances = (services: any[]) => {
    return services.map(service => {
      if (service.coordinates) {
        const distance = calculateDistance(
          userLocation.coordinates.lat,
          userLocation.coordinates.lng,
          service.coordinates.lat,
          service.coordinates.lng
        );
        return { ...service, distance };
      }
      return service;
    });
  };
  
  // Filter venues based on criteria
  const filteredVenues = calculateDistances(venues)
    .filter(venue => {
      const matchesSearch = venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          venue.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = venue.price >= priceRange[0] && venue.price <= priceRange[1];
      const matchesType = venueType.length === 0 || venueType.includes(venue.type);
      const matchesSize = venueSize.length === 0 || venueSize.includes(venue.size);
      const matchesDistance = venue.distance <= distanceRadius;
      
      return matchesSearch && matchesPrice && matchesType && matchesSize && matchesDistance;
    })
    .sort((a, b) => a.distance - b.distance);
  
  // Filter DJs based on criteria
  const filteredDJs = calculateDistances(djs)
    .filter(dj => {
      const matchesSearch = dj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dj.bio.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = dj.price >= priceRange[0] && dj.price <= priceRange[1];
      const matchesGenres = djGenres.length === 0 || 
                          dj.genres.some((genre: string) => djGenres.includes(genre));
      const matchesDistance = dj.distance <= distanceRadius;
      
      return matchesSearch && matchesPrice && matchesGenres && matchesDistance;
    })
    .sort((a, b) => a.distance - b.distance);
  
  // Filter catering services based on criteria
  const filteredCatering = calculateDistances(cateringServices)
    .filter(catering => {
      const matchesSearch = catering.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          catering.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = catering.price >= priceRange[0] / 100 && catering.price <= priceRange[1] / 100;
      const matchesCuisine = cuisineTypes.length === 0 || 
                          catering.cuisineType.some((cuisine: string) => cuisineTypes.includes(cuisine));
      const matchesDistance = catering.distance <= distanceRadius;
      
      return matchesSearch && matchesPrice && matchesCuisine && matchesDistance;
    })
    .sort((a, b) => a.distance - b.distance);
  
  // Get all unique venue types
  const allVenueTypes = Array.from(new Set(venues.map(venue => venue.type)));
  
  // Get all unique venue sizes
  const allVenueSizes = Array.from(new Set(venues.map(venue => venue.size)));
  
  // Get all unique DJ genres
  const allDjGenres = Array.from(new Set(djs.flatMap(dj => dj.genres)));
  
  // Get all unique cuisine types
  const allCuisineTypes = Array.from(new Set(cateringServices.flatMap(catering => catering.cuisineType)));
  
  // Update page title based on tab
  useEffect(() => {
    const titles = ['Venues', 'DJs', 'Catering Services'];
    document.title = `Find ${titles[tabValue]} | WeParty`;
  }, [tabValue]);

  return (
    <Layout title="Find a Service">
      <Container maxWidth="md">
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="service tabs"
              variant="fullWidth"
            >
              <Tab label="Venues" />
              <Tab label="DJs" />
              <Tab label="Catering" />
            </Tabs>
          </Box>
          
          {/* Search and Filter Controls */}
          <Box sx={{ mt: 3 }}>
            <TextField
              fullWidth
              placeholder={`Search ${tabValue === 0 ? 'venues' : tabValue === 1 ? 'DJs' : 'catering services'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Button 
                      onClick={toggleFilters}
                      startIcon={<FilterIcon />}
                      color={showFilters ? 'primary' : 'inherit'}
                    >
                      Filters
                    </Button>
                  </InputAdornment>
                ),
              }}
              variant="outlined"
            />
            
            {/* Location Filter (Always visible) */}
            <Paper sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                Location
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOnIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1" sx={{ flexGrow: 1 }}>
                  {userLocation.address}
                </Typography>
                <Tooltip title="Use current location">
                  <IconButton onClick={useCurrentLocation} size="small">
                    <MyLocationIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Enter a location"
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                />
                <Button 
                  variant="outlined" 
                  onClick={setCustomLocationHandler}
                  disabled={!customLocation}
                >
                  Set
                </Button>
              </Box>
              
              <Box sx={{ mt: 2 }}>
                <Typography id="distance-slider" gutterBottom>
                  Distance: {distanceRadius} km
                </Typography>
                <Slider
                  value={distanceRadius}
                  onChange={(e, newValue) => setDistanceRadius(newValue as number)}
                  min={1}
                  max={50}
                  step={1}
                  aria-labelledby="distance-slider"
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">1 km</Typography>
                  <Typography variant="body2" color="text.secondary">50 km</Typography>
                </Box>
              </Box>
            </Paper>
            
            {/* Additional Filters Section */}
            {showFilters && (
              <Paper sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
                <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                  Additional Filters
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography id="price-range-slider" gutterBottom>
                    Price Range
                  </Typography>
                  <Slider
                    value={priceRange}
                    onChange={(e, newValue) => setPriceRange(newValue as number[])}
                    valueLabelDisplay="auto"
                    min={0}
                    max={tabValue === 2 ? 300 : 3000}
                    aria-labelledby="price-range-slider"
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      ${priceRange[0]}{tabValue === 2 ? ' per person' : ''}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ${priceRange[1]}{tabValue === 2 ? ' per person' : ''}
                    </Typography>
                  </Box>
                </Box>
                
                {/* Venue-specific filters */}
                {tabValue === 0 && (
                  <>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel id="venue-type-label">Venue Type</InputLabel>
                      <Select
                        labelId="venue-type-label"
                        multiple
                        value={venueType}
                        onChange={(e) => handleMultiSelectChange(e as SelectChangeEvent<string[]>, setVenueType)}
                        renderValue={(selected) => (
                          <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                            {(selected as string[]).map((value) => (
                              <Chip key={value} label={value} size="small" />
                            ))}
                          </Stack>
                        )}
                      >
                        {allVenueTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel id="venue-size-label">Venue Size</InputLabel>
                      <Select
                        labelId="venue-size-label"
                        multiple
                        value={venueSize}
                        onChange={(e) => handleMultiSelectChange(e as SelectChangeEvent<string[]>, setVenueSize)}
                        renderValue={(selected) => (
                          <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                            {(selected as string[]).map((value) => (
                              <Chip key={value} label={value} size="small" />
                            ))}
                          </Stack>
                        )}
                      >
                        {allVenueSizes.map((size) => (
                          <MenuItem key={size} value={size}>
                            {size}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </>
                )}
                
                {/* DJ-specific filters */}
                {tabValue === 1 && (
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="dj-genres-label">Music Genres</InputLabel>
                    <Select
                      labelId="dj-genres-label"
                      multiple
                      value={djGenres}
                      onChange={(e) => handleMultiSelectChange(e as SelectChangeEvent<string[]>, setDjGenres)}
                      renderValue={(selected) => (
                        <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                          {(selected as string[]).map((value) => (
                            <Chip key={value} label={value} size="small" />
                          ))}
                        </Stack>
                      )}
                    >
                      {allDjGenres.map((genre) => (
                        <MenuItem key={genre} value={genre}>
                          {genre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
                
                {/* Catering-specific filters */}
                {tabValue === 2 && (
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="cuisine-types-label">Cuisine Types</InputLabel>
                    <Select
                      labelId="cuisine-types-label"
                      multiple
                      value={cuisineTypes}
                      onChange={(e) => handleMultiSelectChange(e as SelectChangeEvent<string[]>, setCuisineTypes)}
                      renderValue={(selected) => (
                        <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                          {(selected as string[]).map((value) => (
                            <Chip key={value} label={value} size="small" />
                          ))}
                        </Stack>
                      )}
                    >
                      {allCuisineTypes.map((cuisine) => (
                        <MenuItem key={cuisine} value={cuisine}>
                          {cuisine}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </Paper>
            )}
          </Box>
          
          {/* Venues Tab Panel */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={2}>
              {filteredVenues.length > 0 ? (
                filteredVenues.map((venue) => (
                  <Grid item xs={12} sm={6} md={4} key={venue.id}>
                    <ServiceCard 
                      service={venue} 
                      type="venue" 
                      onClick={() => {
                        // In a real app, this would navigate to the venue details page
                        console.log(`Clicked on venue: ${venue.id}`);
                      }}
                    />
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
                    No venues match your search criteria.
                  </Typography>
                </Grid>
              )}
            </Grid>
          </TabPanel>
          
          {/* DJs Tab Panel */}
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={2}>
              {filteredDJs.length > 0 ? (
                filteredDJs.map((dj) => (
                  <Grid item xs={12} sm={6} md={4} key={dj.id}>
                    <ServiceCard 
                      service={dj} 
                      type="dj" 
                      onClick={() => {
                        // In a real app, this would navigate to the DJ details page
                        console.log(`Clicked on DJ: ${dj.id}`);
                      }}
                    />
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
                    No DJs match your search criteria.
                  </Typography>
                </Grid>
              )}
            </Grid>
          </TabPanel>
          
          {/* Catering Tab Panel */}
          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={2}>
              {filteredCatering.length > 0 ? (
                filteredCatering.map((catering) => (
                  <Grid item xs={12} sm={6} md={4} key={catering.id}>
                    <ServiceCard 
                      service={catering} 
                      type="catering" 
                      onClick={() => {
                        // In a real app, this would navigate to the catering details page
                        console.log(`Clicked on catering: ${catering.id}`);
                      }}
                    />
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
                    No catering services match your search criteria.
                  </Typography>
                </Grid>
              )}
            </Grid>
          </TabPanel>
        </Box>
      </Container>
    </Layout>
  );
};

export default FindServicePage; 