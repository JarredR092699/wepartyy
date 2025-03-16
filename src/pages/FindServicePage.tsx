import React, { useState } from 'react';
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
  Button
} from '@mui/material';
import { Search as SearchIcon, FilterList as FilterIcon } from '@mui/icons-material';
import Layout from '../components/Layout';
import ServiceCard from '../components/ServiceCard';
import { venues, djs, cateringServices } from '../data/mockData';

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
  const [tabValue, setTabValue] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter states
  const [priceRange, setPriceRange] = useState<number[]>([0, 3000]);
  const [venueType, setVenueType] = useState<string[]>([]);
  const [venueSize, setVenueSize] = useState<string[]>([]);
  const [djGenres, setDjGenres] = useState<string[]>([]);
  const [cuisineTypes, setCuisineTypes] = useState<string[]>([]);
  
  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setShowFilters(false);
  };
  
  // Toggle filters visibility
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Filter venues based on criteria
  const filteredVenues = venues.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         venue.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = venue.price >= priceRange[0] && venue.price <= priceRange[1];
    const matchesType = venueType.length === 0 || venueType.includes(venue.type);
    const matchesSize = venueSize.length === 0 || venueSize.includes(venue.size);
    
    return matchesSearch && matchesPrice && matchesType && matchesSize;
  });
  
  // Filter DJs based on criteria
  const filteredDJs = djs.filter(dj => {
    const matchesSearch = dj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dj.bio.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = dj.price >= priceRange[0] && dj.price <= priceRange[1];
    const matchesGenres = djGenres.length === 0 || 
                         dj.genres.some(genre => djGenres.includes(genre));
    
    return matchesSearch && matchesPrice && matchesGenres;
  });
  
  // Filter catering services based on criteria
  const filteredCatering = cateringServices.filter(catering => {
    const matchesSearch = catering.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         catering.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = catering.price >= priceRange[0] / 100 && catering.price <= priceRange[1] / 100;
    const matchesCuisine = cuisineTypes.length === 0 || 
                          catering.cuisineType.some(cuisine => cuisineTypes.includes(cuisine));
    
    return matchesSearch && matchesPrice && matchesCuisine;
  });
  
  // Get all unique venue types
  const allVenueTypes = Array.from(new Set(venues.map(venue => venue.type)));
  
  // Get all unique venue sizes
  const allVenueSizes = Array.from(new Set(venues.map(venue => venue.size)));
  
  // Get all unique DJ genres
  const allDjGenres = Array.from(new Set(djs.flatMap(dj => dj.genres)));
  
  // Get all unique cuisine types
  const allCuisineTypes = Array.from(new Set(cateringServices.flatMap(catering => catering.cuisineType)));
  
  // Handle multiple select change
  const handleMultiSelectChange = (
    event: React.ChangeEvent<{ value: unknown }>,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter(event.target.value as string[]);
  };
  
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
            
            {/* Filters Section */}
            {showFilters && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Filters
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
                        onChange={(e) => handleMultiSelectChange(e as any, setVenueType)}
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
                        onChange={(e) => handleMultiSelectChange(e as any, setVenueSize)}
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
                      onChange={(e) => handleMultiSelectChange(e as any, setDjGenres)}
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
                      onChange={(e) => handleMultiSelectChange(e as any, setCuisineTypes)}
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
              </Box>
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