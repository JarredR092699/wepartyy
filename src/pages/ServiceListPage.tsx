import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  InputAdornment,
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
  Divider,
  Tooltip,
  SelectChangeEvent,
  Pagination
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
  AccessTime as TimeIcon,
  AttachMoney as MoneyIcon,
  MusicNote as MusicIcon,
  Restaurant as RestaurantIcon,
  PhotoCamera as PhotoCameraIcon,
  Brush as BrushIcon,
  Speaker as SpeakerIcon,
  Chair as ChairIcon,
  LocalBar as LocalBarIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
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
  calculateDistance
} from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

// Define service types & mapping
type ServiceType = 'venue' | 'dj' | 'catering' | 'entertainment' | 'photography' | 
  'decoration' | 'audioVisual' | 'furniture' | 'barService' | 'security';

interface UserLocation {
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

const serviceTypeMap: Record<ServiceType, {
  title: string;
  data: any[];
  icon: React.ReactNode;
  filterOptions: Record<string, string[]>;
}> = {
  venue: {
    title: 'Venues',
    data: venues,
    icon: <LocationIcon color="primary" />,
    filterOptions: {
      type: Array.from(new Set(venues.map(venue => venue.type))),
      size: Array.from(new Set(venues.map(venue => venue.size)))
    }
  },
  dj: {
    title: 'DJs',
    data: djs,
    icon: <MusicIcon color="primary" />,
    filterOptions: {
      genres: Array.from(new Set(djs.flatMap(dj => dj.genres)))
    }
  },
  catering: {
    title: 'Catering Services',
    data: cateringServices,
    icon: <RestaurantIcon color="primary" />,
    filterOptions: {
      cuisineType: Array.from(new Set(cateringServices.flatMap(catering => catering.cuisineType)))
    }
  },
  entertainment: {
    title: 'Entertainment',
    data: entertainment,
    icon: <StarIcon color="primary" />,
    filterOptions: {
      type: Array.from(new Set(entertainment.flatMap(item => item.type)))
    }
  },
  photography: {
    title: 'Photography',
    data: photography,
    icon: <PhotoCameraIcon color="primary" />,
    filterOptions: {
      type: Array.from(new Set(photography.flatMap(item => item.type))),
      style: Array.from(new Set(photography.flatMap(item => item.style)))
    }
  },
  decoration: {
    title: 'Decoration',
    data: decoration,
    icon: <BrushIcon color="primary" />,
    filterOptions: {
      type: Array.from(new Set(decoration.flatMap(item => item.type))),
      style: Array.from(new Set(decoration.flatMap(item => item.style)))
    }
  },
  audioVisual: {
    title: 'Audio/Visual',
    data: audioVisual,
    icon: <SpeakerIcon color="primary" />,
    filterOptions: {
      equipmentTypes: Array.from(new Set(audioVisual.flatMap(item => item.equipmentTypes)))
    }
  },
  furniture: {
    title: 'Furniture',
    data: furniture,
    icon: <ChairIcon color="primary" />,
    filterOptions: {
      itemTypes: Array.from(new Set(furniture.flatMap(item => item.itemTypes)))
    }
  },
  barService: {
    title: 'Bar Services',
    data: barServices,
    icon: <LocalBarIcon color="primary" />,
    filterOptions: {
      serviceTypes: Array.from(new Set(barServices.flatMap(item => item.serviceTypes)))
    }
  },
  security: {
    title: 'Security',
    data: security,
    icon: <SecurityIcon color="primary" />,
    filterOptions: {
      serviceTypes: Array.from(new Set(security.flatMap(item => item.serviceTypes)))
    }
  }
};

// Items per page
const ITEMS_PER_PAGE = 9;

const ServiceListPage: React.FC = () => {
  const { serviceType } = useParams<{ serviceType: ServiceType }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // Debug current service type
  useEffect(() => {
    console.log("Current service type:", serviceType);
    if (serviceType && serviceTypeMap[serviceType as ServiceType]) {
      console.log("Service data length:", serviceTypeMap[serviceType as ServiceType].data.length);
    }
  }, [serviceType]);
  
  // If service type is invalid, redirect to home
  useEffect(() => {
    if (!serviceType || !serviceTypeMap[serviceType as ServiceType]) {
      navigate('/');
    }
  }, [serviceType, navigate]);
  
  // Set specific service type from URL params
  const currentService = serviceType ? serviceTypeMap[serviceType as ServiceType] : null;
  
  // Set initial price range based on service type
  const getInitialPriceRange = () => {
    if (serviceType === 'catering') {
      return [0, 300];
    } else {
      return [0, 3000];
    }
  };
  
  // State for search & filtering
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [priceRange, setPriceRange] = useState<number[]>(getInitialPriceRange());
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [sort, setSort] = useState<string>('rating');
  const [filterValues, setFilterValues] = useState<Record<string, string[]>>({});
  
  // Pagination
  const [page, setPage] = useState(1);
  
  // Location filtering
  const [userLocation, setUserLocation] = useState<UserLocation>({
    address: currentUser?.location?.address || 'New York, NY',
    coordinates: currentUser?.location?.coordinates || { lat: 40.7128, lng: -74.0060 }
  });
  const [distanceRadius, setDistanceRadius] = useState<number>(50); // in km
  
  // Reset filters when service type changes
  useEffect(() => {
    setPriceRange(getInitialPriceRange());
    setRatingFilter(0);
    setFilterValues({});
    setSearchQuery('');
    setPage(1);
  }, [serviceType]);
  
  // Toggle filters visibility
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Handle filter change
  const handleFilterChange = (
    filterName: string,
    values: string[]
  ) => {
    setFilterValues(prev => ({
      ...prev,
      [filterName]: values
    }));
  };
  
  // Calculate distances from user location
  const calculateServiceDistances = (services: any[]) => {
    try {
      if (!services || services.length === 0) {
        console.error("No services provided to calculate distances");
        return [];
      }
      
      console.log("Calculating distances for", services.length, "services");
      
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
        return { ...service, distance: 999 }; // Default value for services without coordinates
      });
    } catch (error) {
      console.error('Error calculating distances:', error);
      // Return services with default distance if error occurs
      return services.map(service => ({ ...service, distance: 999 }));
    }
  };
  
  // Filter services based on all criteria
  const getFilteredServices = () => {
    if (!currentService) {
      console.error("No current service found");
      return [];
    }

    // Debug log the initial state
    console.log(`Getting filtered services for ${serviceType}...`);
    console.log('Current service data:', currentService.data);
    
    try {
      // Use the original data directly to prevent filtering issues
      // Start with a direct clone of the original data
      let filtered = [...currentService.data];
      
      if (filtered.length === 0) {
        console.error("No services found in the original data array");
        return [];
      }
      
      console.log('Initial services count:', filtered.length);
      
      // Only apply minimal filtering to start with - just add distances
      try {
        filtered = calculateServiceDistances(filtered);
      } catch (error) {
        console.error("Error calculating distances:", error);
      }
      
      // Apply search query filter (if provided)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(service => 
          service.name.toLowerCase().includes(query) || 
          (service.description && service.description.toLowerCase().includes(query))
        );
        console.log('After search filter:', filtered.length);
      }
      
      // Apply a more tolerant price filter
      if (priceRange[0] > 0 || priceRange[1] < (serviceType === 'catering' ? 300 : 3000)) {
        filtered = filtered.filter(service => {
          // Skip items with no price
          if (typeof service.price !== 'number') {
            return true;
          }
          
          // Handle price per person for catering services differently
          if (serviceType === 'catering') {
            return service.price >= priceRange[0] / 100 && service.price <= priceRange[1] / 100;
          }
          return service.price >= priceRange[0] && service.price <= priceRange[1];
        });
        console.log('After price filter:', filtered.length);
      }
      
      // Apply a more tolerant rating filter
      if (ratingFilter > 0) {
        filtered = filtered.filter(service => {
          // Skip items with no rating
          if (typeof service.rating !== 'number') {
            return true;
          }
          return service.rating >= ratingFilter;
        });
        console.log('After rating filter:', filtered.length);
      }
      
      // Only apply distance filter if user specifically changed it
      if (distanceRadius < 50) {
        filtered = filtered.filter(service => {
          // Skip items with no distance
          if (typeof service.distance !== 'number') {
            return true;
          }
          return service.distance <= distanceRadius;
        });
        console.log('After distance filter:', filtered.length);
      }
      
      // Apply service-specific filters (only if values are explicitly selected)
      if (serviceType && Object.keys(filterValues).length > 0) {
        Object.entries(filterValues).forEach(([filterKey, selectedValues]) => {
          if (selectedValues.length > 0) {
            console.log(`Applying filter for ${filterKey}:`, selectedValues);
            
            // Skip filter if no services left
            if (filtered.length === 0) {
              console.warn(`No services left to apply ${filterKey} filter`);
              return;
            }
            
            // Skip filter if property doesn't exist in first service
            const firstService = filtered[0];
            if (!(filterKey in firstService)) {
              console.warn(`Filter key ${filterKey} not found in services`);
              return;
            }
            
            // Handle arrays and single values with safety
            if (Array.isArray(firstService[filterKey])) {
              filtered = filtered.filter(service => {
                // Skip if the property is missing or not an array
                if (!service[filterKey] || !Array.isArray(service[filterKey])) {
                  return true;
                }
                return service[filterKey].some((value: string) => selectedValues.includes(value));
              });
            } else {
              filtered = filtered.filter(service => selectedValues.includes(service[filterKey]));
            }
            console.log(`After ${filterKey} filter:`, filtered.length);
          }
        });
      }
      
      // Apply sorting - ensure we have valid data first
      if (filtered.length > 0) {
        console.log('Sorting by:', sort);
        try {
          switch (sort) {
            case 'price-low':
              filtered.sort((a, b) => {
                if (typeof a.price !== 'number' || typeof b.price !== 'number') return 0;
                return a.price - b.price;
              });
              break;
            case 'price-high':
              filtered.sort((a, b) => {
                if (typeof a.price !== 'number' || typeof b.price !== 'number') return 0;
                return b.price - a.price;
              });
              break;
            case 'rating':
              filtered.sort((a, b) => {
                if (typeof a.rating !== 'number' || typeof b.rating !== 'number') return 0;
                return b.rating - a.rating;
              });
              break;
            case 'distance':
              filtered.sort((a, b) => {
                if (typeof a.distance !== 'number' || typeof b.distance !== 'number') return 0;
                return a.distance - b.distance;
              });
              break;
            default:
              filtered.sort((a, b) => {
                if (typeof a.rating !== 'number' || typeof b.rating !== 'number') return 0;
                return b.rating - a.rating;
              });
          }
        } catch (error) {
          console.error('Error sorting services:', error);
        }
      }
      
      console.log('Final filtered services:', filtered.length);
      return filtered;
    } catch (error) {
      console.error('Error filtering services:', error);
      return currentService.data; // Return original data if filtering fails
    }
  };
  
  const filteredServices = getFilteredServices();
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);
  
  // Get current page of services
  const getCurrentPageServices = () => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return filteredServices.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };
  
  // Handle page change
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Results count message
  const getResultsMessage = () => {
    const count = filteredServices.length;
    if (count === 0) {
      return "No results found";
    } else if (count === 1) {
      return "1 result found";
    } else {
      return `${count} results found`;
    }
  };
  
  // If no service type is found
  if (!currentService) {
    return <div>Loading...</div>;
  }
  
  return (
    <Layout title={currentService.title}>
      <Container maxWidth="lg">
        {/* Header with back button */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, mt: 2 }}>
          <IconButton 
            onClick={() => navigate(-1)}
            sx={{ mr: 1 }}
            aria-label="go back"
          >
            <ArrowBackIcon />
          </IconButton>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {currentService.icon}
            <Typography variant="h5" component="h1" sx={{ ml: 1, fontWeight: 'bold' }}>
              {currentService.title}
            </Typography>
          </Box>
        </Box>
        
        {/* Search and Filter Controls */}
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder={`Search ${currentService.title.toLowerCase()}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id="sort-label">Sort By</InputLabel>
                <Select
                  labelId="sort-label"
                  value={sort}
                  label="Sort By"
                  onChange={(e) => setSort(e.target.value)}
                >
                  <MenuItem value="rating">Top Rated</MenuItem>
                  <MenuItem value="price-low">Price: Low to High</MenuItem>
                  <MenuItem value="price-high">Price: High to Low</MenuItem>
                  <MenuItem value="distance">Nearest First</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          <Button
            onClick={toggleFilters}
            startIcon={<FilterIcon />}
            sx={{ mt: 2 }}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </Box>
        
        {/* Filters Panel */}
        {showFilters && (
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Filters
            </Typography>
            
            <Grid container spacing={3}>
              {/* Price Range */}
              <Grid item xs={12} md={6}>
                <Typography id="price-range-slider" gutterBottom>
                  Price Range {serviceType === 'catering' ? '(per person)' : ''}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <MoneyIcon color="action" sx={{ mr: 1 }} />
                  <Slider
                    value={priceRange}
                    onChange={(e, newValue) => setPriceRange(newValue as number[])}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => 
                      serviceType === 'catering' 
                        ? `$${(value / 100).toFixed(2)}` 
                        : `$${value}`
                    }
                    min={0}
                    max={serviceType === 'catering' ? 300 : 3000}
                    step={serviceType === 'catering' ? 5 : 50}
                    aria-labelledby="price-range-slider"
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    {serviceType === 'catering' 
                      ? `$${(priceRange[0] / 100).toFixed(2)}` 
                      : `$${priceRange[0]}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {serviceType === 'catering' 
                      ? `$${(priceRange[1] / 100).toFixed(2)}` 
                      : `$${priceRange[1]}`}
                  </Typography>
                </Box>
              </Grid>
              
              {/* Rating Filter */}
              <Grid item xs={12} md={6}>
                <Typography id="rating-slider" gutterBottom>
                  Minimum Rating
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <StarIcon color="action" sx={{ mr: 1 }} />
                  <Slider
                    value={ratingFilter}
                    onChange={(e, newValue) => setRatingFilter(newValue as number)}
                    valueLabelDisplay="auto"
                    min={0}
                    max={5}
                    step={0.5}
                    aria-labelledby="rating-slider"
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Any
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    5 Stars
                  </Typography>
                </Box>
              </Grid>
              
              {/* Distance Filter */}
              <Grid item xs={12} md={6}>
                <Typography id="distance-slider" gutterBottom>
                  Maximum Distance
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationIcon color="action" sx={{ mr: 1 }} />
                  <Slider
                    value={distanceRadius}
                    onChange={(e, newValue) => setDistanceRadius(newValue as number)}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value} km`}
                    min={1}
                    max={100}
                    step={1}
                    aria-labelledby="distance-slider"
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    1 km
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    100 km
                  </Typography>
                </Box>
              </Grid>
              
              {/* Service Specific Filters */}
              {currentService.filterOptions && Object.entries(currentService.filterOptions).map(([filterName, options]) => (
                <Grid item xs={12} md={6} key={filterName}>
                  <FormControl fullWidth>
                    <InputLabel id={`${filterName}-label`}>
                      {filterName.charAt(0).toUpperCase() + filterName.slice(1)}
                    </InputLabel>
                    <Select
                      labelId={`${filterName}-label`}
                      multiple
                      value={filterValues[filterName] || []}
                      onChange={(e: SelectChangeEvent<string[]>) => 
                        handleFilterChange(filterName, e.target.value as string[])
                      }
                      renderValue={(selected) => (
                        <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                          {(selected as string[]).map((value) => (
                            <Chip key={value} label={value} size="small" />
                          ))}
                        </Stack>
                      )}
                    >
                      {options.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              ))}
            </Grid>
            
            {/* Filter actions */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button 
                onClick={() => {
                  setFilterValues({});
                  setPriceRange(getInitialPriceRange());
                  setRatingFilter(0);
                  setDistanceRadius(50);
                }}
                sx={{ mr: 1 }}
              >
                Reset Filters
              </Button>
              <Button 
                variant="contained" 
                onClick={toggleFilters}
              >
                Apply Filters
              </Button>
            </Box>
          </Paper>
        )}
        
        {/* Results count */}
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {getResultsMessage()}
          </Typography>
          
          {totalPages > 1 && (
            <Typography variant="body2" color="text.secondary">
              Page {page} of {totalPages}
            </Typography>
          )}
        </Box>
        
        {/* Services Grid */}
        <Grid container spacing={3}>
          {getCurrentPageServices().map((service) => (
            <Grid item xs={12} sm={6} md={4} key={service.id}>
              <ServiceCard 
                service={service} 
                type={serviceType as ServiceType} 
                onClick={() => navigate(`/service/${serviceType}/${service.id}`)}
              />
            </Grid>
          ))}
          
          {filteredServices.length === 0 && (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No matching {currentService.title.toLowerCase()} found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try adjusting your filters or search terms
                </Typography>
                <Button 
                  variant="outlined" 
                  sx={{ mt: 2 }}
                  onClick={() => {
                    setSearchQuery('');
                    setFilterValues({});
                    setPriceRange(getInitialPriceRange());
                    setRatingFilter(0);
                    setDistanceRadius(50);
                  }}
                >
                  Reset All Filters
                </Button>
              </Paper>
            </Grid>
          )}
        </Grid>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={handlePageChange} 
              color="primary" 
              size="large"
              showFirstButton 
              showLastButton
            />
          </Box>
        )}
      </Container>
    </Layout>
  );
};

export default ServiceListPage; 