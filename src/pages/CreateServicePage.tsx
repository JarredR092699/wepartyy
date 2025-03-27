import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Alert,
  Stepper,
  Step,
  StepLabel,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import {
  Save as SaveIcon,
  Event as EventIcon
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateCalendar, PickersDay, PickersDayProps } from '@mui/x-date-pickers';
import { format, isSameDay } from 'date-fns';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { UserRole, DJ, Venue, CateringService, Entertainment, Photography, Decoration, AudioVisual, Furniture, BarService, Security } from '../data/mockData';

// Steps for creating a service
const createServiceSteps = ['Select Service Type', 'Basic Information', 'Additional Details', 'Availability'];

// CustomDay component for the availability calendar
const CustomDay = (props: PickersDayProps<Date> & { 
  isSelected?: boolean; 
}) => {
  const { isSelected, ...other } = props;
  
  return (
    <PickersDay
      {...other}
      disableMargin
      sx={{
        backgroundColor: isSelected ? '#c8e6c9' : 'transparent',
        '&:hover': {
          backgroundColor: isSelected ? '#a5d6a7' : undefined,
        },
        borderRadius: '50%',
      }}
    />
  );
};

// Main component
const CreateServicePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, isVendor } = useAuth();
  
  // State for the form
  const [activeStep, setActiveStep] = useState(0);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [selectedServiceType, setSelectedServiceType] = useState<UserRole | ''>('');
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<UserRole[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Basic form data
  const [formData, setFormData] = useState({
    // Common fields
    name: '',
    price: 0,
    description: '',
    priceType: 'flat' as 'hourly' | 'flat' | 'per_person' | 'package' | 'custom' | 'per_item' | 'per_guard',
    maxTravelDistance: 30,
    
    // Primary and combined service types
    primaryService: '' as UserRole | '',
    combinedServices: [] as UserRole[],
    combineDescription: '',
    
    // DJ specific fields
    genres: [] as string[],
    experience: 0,
    
    // Venue specific fields
    venueType: 'indoor' as 'indoor' | 'outdoor' | 'both',
    venueSize: 'medium' as 'small' | 'medium' | 'large',
    venueStyles: [] as string[],
    capacity: 100,
    
    // Caterer specific fields
    cuisineTypes: [] as string[],
    
    // Entertainment specific fields
    entertainmentTypes: [] as string[],
    
    // Photography specific fields
    photographyTypes: [] as string[],
    photographyStyles: [] as string[],
    
    // Decoration specific fields
    decorationTypes: [] as string[],
    decorationStyles: [] as string[],
    
    // Audio Visual specific fields
    equipmentTypes: [] as string[],
    includesTechnician: false,
    
    // Furniture specific fields
    furnitureTypes: [] as string[],
    furnitureStyles: [] as string[],
    includesSetup: false,
    
    // Bar Service specific fields
    barServiceTypes: [] as string[],
    includesBartenders: false,
    
    // Security specific fields
    securityTypes: [] as string[],
    uniformed: false,
  });

  // Redirect if not a vendor
  useEffect(() => {
    if (!isVendor) {
      navigate('/profile');
    }
  }, [isVendor, navigate]);

  // Get available service types for the user
  const getAvailableServiceTypes = (): UserRole[] => {
    if (!currentUser) return [];
    
    if (currentUser.role === 'multiple' && currentUser.selectedServices) {
      return currentUser.selectedServices;
    }
    
    // If single service type
    if (currentUser.role !== 'eventOrganizer' && currentUser.role !== 'publicUser') {
      return [currentUser.role];
    }
    
    return [];
  };

  // Handle stepping through the form
  const handleNext = () => {
    // Validate current step
    if (activeStep === 0) {
      if (!formData.primaryService) {
        setError('Please select a primary service type to continue');
        return;
      }
      
      // Set the selected service type to the primary service for backward compatibility
      setSelectedServiceType(formData.primaryService);
    }
    
    if (activeStep === 1) {
      if (!formData.name.trim()) {
        setError('Please enter a name for your service');
        return;
      }
      
      if (formData.price <= 0) {
        setError('Please enter a valid price');
        return;
      }
    }
    
    setError(null);
    setActiveStep((prevStep) => prevStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  // Handle form input changes
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value) || 0;
    setFormData({
      ...formData,
      [name]: numValue,
    });
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };
  
  const handleMultiSelectChange = (
    event: SelectChangeEvent<string[]>,
    field: string
  ) => {
    setFormData({
      ...formData,
      [field]: event.target.value as string[],
    });
  };
  
  const handleServiceTypeChange = (event: SelectChangeEvent<string>) => {
    setSelectedServiceType(event.target.value as UserRole);
  };
  
  // Handle date selection for availability
  const handleDateClick = (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    const dateIndex = availableDates.findIndex(d => format(d, 'yyyy-MM-dd') === formattedDate);
    
    if (dateIndex === -1) {
      // Date not selected yet, add it
      setAvailableDates([...availableDates, date]);
    } else {
      // Date already selected, remove it
      const newDates = [...availableDates];
      newDates.splice(dateIndex, 1);
      setAvailableDates(newDates);
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.primaryService) {
      setError('Please select a primary service type');
      return;
    }
    
    if (!formData.name.trim()) {
      setError('Please enter a name for your service');
      return;
    }
    
    if (formData.price <= 0) {
      setError('Please enter a valid price');
      return;
    }
    
    if (availableDates.length === 0) {
      setError('Please select at least one available date');
      return;
    }
    
    // If there are combined services, make sure the package description is provided
    if (formData.combinedServices.length > 0 && !formData.combineDescription.trim()) {
      setError('Please provide a description for your combined service package');
      return;
    }
    
    // In a real app, here we would submit the form data to an API
    // For our mock app, we'll create a new service object with combined service information
    const newService = {
      id: `new-service-${Date.now()}`,
      ownerId: currentUser?.id || '',
      name: formData.name,
      price: formData.price,
      description: formData.description,
      image: 'https://picsum.photos/300/200', // Placeholder image
      type: formData.primaryService,
      availability: availableDates.map(date => format(date, 'yyyy-MM-dd')),
      
      // Combined service information
      isCombinedService: formData.combinedServices.length > 0,
      combinedServices: formData.combinedServices,
      combineDescription: formData.combineDescription,
      
      // Add service-specific fields based on the primary service type
      ...(formData.primaryService === 'venue' && {
        venueType: formData.venueType,
        venueSize: formData.venueSize,
        venueStyles: formData.venueStyles,
        capacity: formData.capacity,
        location: currentUser?.location?.address || 'Location not specified',
      }),
      
      ...(formData.primaryService === 'dj' && {
        genres: formData.genres,
        experience: formData.experience,
        maxTravelDistance: formData.maxTravelDistance,
      }),
      
      ...(formData.primaryService === 'caterer' && {
        cuisineType: formData.cuisineTypes,
        maxTravelDistance: formData.maxTravelDistance,
      }),
    };
    
    console.log('Creating new service:', newService);
    
    // Show success message to the user
    alert('Service created successfully with ' + 
      (formData.combinedServices.length > 0 
        ? `${formData.combinedServices.length} combined services` 
        : 'no combined services'));
    
    // Navigate back to the manage services page
    navigate('/manage-services');
  };
  
  // Render service type selection step
  const renderServiceTypeStep = () => {
    const availableTypes = getAvailableServiceTypes();
    
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          What type of service would you like to create?
        </Typography>
        
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="primary-service-type-label">Primary Service Type</InputLabel>
          <Select
            labelId="primary-service-type-label"
            value={formData.primaryService}
            onChange={(e) => {
              const newPrimaryService = e.target.value as UserRole;
              setFormData({
                ...formData,
                primaryService: newPrimaryService,
                // Reset combined services when primary changes to avoid duplicates
                combinedServices: formData.combinedServices.filter(type => type !== newPrimaryService)
              });
            }}
            label="Primary Service Type"
          >
            {availableTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type === 'venue' ? 'Venue' : 
                 type === 'dj' ? 'DJ' : 
                 type === 'caterer' ? 'Catering' : 
                 type === 'entertainment' ? 'Entertainment' : 
                 type === 'photography' ? 'Photography' : 
                 type === 'decoration' ? 'Decoration' : 
                 type === 'audioVisual' ? 'Audio Visual' : 
                 type === 'furniture' ? 'Furniture' : 
                 type === 'barService' ? 'Bar Service' : 
                 type === 'security' ? 'Security' : 
                 type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        {formData.primaryService && (
          <>
            <FormControl fullWidth margin="normal">
              <InputLabel id="combined-services-label">Combined Services (Optional)</InputLabel>
              <Select
                labelId="combined-services-label"
                multiple
                value={formData.combinedServices}
                onChange={(e) => {
                  const newCombinedServices = e.target.value as UserRole[];
                  setFormData({
                    ...formData,
                    combinedServices: newCombinedServices
                  });
                }}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selected as UserRole[]).map((value) => (
                      <Chip 
                        key={value} 
                        label={
                          value === 'venue' ? 'Venue' : 
                          value === 'dj' ? 'DJ' : 
                          value === 'caterer' ? 'Catering' : 
                          value === 'entertainment' ? 'Entertainment' : 
                          value === 'photography' ? 'Photography' : 
                          value === 'decoration' ? 'Decoration' : 
                          value === 'audioVisual' ? 'Audio Visual' : 
                          value === 'furniture' ? 'Furniture' : 
                          value === 'barService' ? 'Bar Service' : 
                          value === 'security' ? 'Security' : 
                          value
                        } 
                      />
                    ))}
                  </Box>
                )}
              >
                {availableTypes
                  .filter(type => type !== formData.primaryService) // Exclude primary service
                  .map((type) => (
                    <MenuItem key={type} value={type}>
                      {type === 'venue' ? 'Venue' : 
                      type === 'dj' ? 'DJ' : 
                      type === 'caterer' ? 'Catering' : 
                      type === 'entertainment' ? 'Entertainment' : 
                      type === 'photography' ? 'Photography' : 
                      type === 'decoration' ? 'Decoration' : 
                      type === 'audioVisual' ? 'Audio Visual' : 
                      type === 'furniture' ? 'Furniture' : 
                      type === 'barService' ? 'Bar Service' : 
                      type === 'security' ? 'Security' : 
                      type}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            
            {formData.combinedServices.length > 0 && (
              <TextField
                fullWidth
                label="Combined Package Description"
                name="combineDescription"
                value={formData.combineDescription}
                onChange={handleTextChange}
                placeholder="Describe how these services are combined together as a package"
                margin="normal"
                multiline
                rows={3}
              />
            )}
          </>
        )}
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {formData.combinedServices.length > 0 
            ? "You're creating a combined service package. Select your primary service type and any additional services you want to include in this package." 
            : "Select the type of service you want to offer. You can also create a combined package by selecting additional services after choosing your primary service."}
        </Typography>
        
        {formData.combinedServices.length > 0 && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Clients who book this service will see that it includes multiple service types, making it easier for them to find comprehensive solutions.
          </Alert>
        )}
      </Box>
    );
  };
  
  // Render basic info step
  const renderBasicInfoStep = () => {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Basic Information
        </Typography>
        
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleTextChange}
          margin="normal"
          required
        />
        
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleTextChange}
          margin="normal"
          multiline
          rows={4}
          required
        />
        
        <FormControl fullWidth margin="normal">
          <InputLabel id="price-type-label">Price Type</InputLabel>
          <Select
            labelId="price-type-label"
            name="priceType"
            value={formData.priceType}
            onChange={(e) => {
              setFormData({
                ...formData,
                priceType: e.target.value as 'hourly' | 'flat' | 'per_person' | 'package' | 'custom' | 'per_item' | 'per_guard'
              });
            }}
            label="Price Type"
          >
            <MenuItem value="hourly">Per Hour</MenuItem>
            <MenuItem value="flat">Flat Rate (Per Event)</MenuItem>
            <MenuItem value="per_person">Per Person</MenuItem>
            <MenuItem value="package">Package</MenuItem>
            {selectedServiceType === 'furniture' && <MenuItem value="per_item">Per Item</MenuItem>}
            {selectedServiceType === 'security' && <MenuItem value="per_guard">Per Guard</MenuItem>}
          </Select>
        </FormControl>
        
        <TextField
          fullWidth
          label={`Price (${formData.priceType === 'hourly' ? 'per Hour' : 
                           formData.priceType === 'flat' ? 'per Event' :
                           formData.priceType === 'per_person' ? 'per Person' :
                           formData.priceType === 'per_item' ? 'per Item' :
                           formData.priceType === 'per_guard' ? 'per Guard' : 'for Package'}) ($)`}
          name="price"
          type="number"
          value={formData.price}
          onChange={handleNumberChange}
          margin="normal"
          required
          InputProps={{
            inputProps: { min: 0 }
          }}
        />
        
        <TextField
          fullWidth
          label="Maximum Travel Distance (km)"
          name="maxTravelDistance"
          type="number"
          value={formData.maxTravelDistance}
          onChange={handleNumberChange}
          margin="normal"
          helperText="How far are you willing to travel for events? Leave at 0 for venue services or if travel distance is not applicable."
          InputProps={{
            inputProps: { min: 0 }
          }}
        />
      </Box>
    );
  };
  
  // Render service-specific details step
  const renderDetailsStep = () => {
    // Show details form for primary service
    const primaryService = formData.primaryService as UserRole;
    
    // If combined services exist, show a summary
    const combinedServicesSummary = formData.combinedServices.length > 0 && (
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Combined Services Package
        </Typography>
        <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
          <Typography variant="body2" paragraph>
            <strong>Primary Service:</strong> {
              primaryService === 'venue' ? 'Venue' : 
              primaryService === 'dj' ? 'DJ' : 
              primaryService === 'caterer' ? 'Catering' : 
              primaryService === 'entertainment' ? 'Entertainment' : 
              primaryService === 'photography' ? 'Photography' : 
              primaryService === 'decoration' ? 'Decoration' : 
              primaryService === 'audioVisual' ? 'Audio Visual' : 
              primaryService === 'furniture' ? 'Furniture' : 
              primaryService === 'barService' ? 'Bar Service' : 
              primaryService === 'security' ? 'Security' : 
              primaryService
            }
          </Typography>
          <Typography variant="body2" paragraph>
            <strong>Additional Services:</strong> {formData.combinedServices.map(service => 
              service === 'venue' ? 'Venue' : 
              service === 'dj' ? 'DJ' : 
              service === 'caterer' ? 'Catering' : 
              service === 'entertainment' ? 'Entertainment' : 
              service === 'photography' ? 'Photography' : 
              service === 'decoration' ? 'Decoration' : 
              service === 'audioVisual' ? 'Audio Visual' : 
              service === 'furniture' ? 'Furniture' : 
              service === 'barService' ? 'Bar Service' : 
              service === 'security' ? 'Security' : 
              service
            ).join(', ')}
          </Typography>
          <Typography variant="body2">
            <strong>Package Description:</strong> {formData.combineDescription}
          </Typography>
        </Paper>
        <Alert severity="info" sx={{ mt: 2 }}>
          You're configuring details for your primary service. The combined package will be displayed to clients with your package description.
        </Alert>
      </Box>
    );
    
    switch (primaryService) {
      case 'dj':
        return (
          <Box>
            {combinedServicesSummary}
            <Typography variant="h6" gutterBottom>
              DJ Service Details
            </Typography>
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="genres-label">Music Genres</InputLabel>
              <Select
                labelId="genres-label"
                multiple
                value={formData.genres}
                onChange={(e) => handleMultiSelectChange(e as SelectChangeEvent<string[]>, 'genres')}
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
            
            <TextField
              fullWidth
              label="Years of Experience"
              name="experience"
              type="number"
              value={formData.experience}
              onChange={handleNumberChange}
              margin="normal"
              InputProps={{
                inputProps: { min: 0 }
              }}
            />
          </Box>
        );
        
      case 'venue':
        return (
          <Box>
            {combinedServicesSummary}
            <Typography variant="h6" gutterBottom>
              Venue Details
            </Typography>
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="venue-type-label">Venue Type</InputLabel>
              <Select
                labelId="venue-type-label"
                name="venueType"
                value={formData.venueType}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    venueType: e.target.value as 'indoor' | 'outdoor' | 'both'
                  });
                }}
                label="Venue Type"
              >
                <MenuItem value="indoor">Indoor</MenuItem>
                <MenuItem value="outdoor">Outdoor</MenuItem>
                <MenuItem value="both">Both Indoor & Outdoor</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="venue-size-label">Venue Size</InputLabel>
              <Select
                labelId="venue-size-label"
                name="venueSize"
                value={formData.venueSize}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    venueSize: e.target.value as 'small' | 'medium' | 'large'
                  });
                }}
                label="Venue Size"
              >
                <MenuItem value="small">Small (up to 50 people)</MenuItem>
                <MenuItem value="medium">Medium (50-150 people)</MenuItem>
                <MenuItem value="large">Large (150+ people)</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Capacity"
              name="capacity"
              type="number"
              value={formData.capacity}
              onChange={handleNumberChange}
              margin="normal"
              required
              InputProps={{
                inputProps: { min: 1 }
              }}
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="venue-styles-label">Venue Style</InputLabel>
              <Select
                labelId="venue-styles-label"
                multiple
                value={formData.venueStyles}
                onChange={(e) => handleMultiSelectChange(e as SelectChangeEvent<string[]>, 'venueStyles')}
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
          </Box>
        );
        
      case 'caterer':
        return (
          <Box>
            {combinedServicesSummary}
            <Typography variant="h6" gutterBottom>
              Catering Service Details
            </Typography>
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="cuisine-types-label">Cuisine Types</InputLabel>
              <Select
                labelId="cuisine-types-label"
                multiple
                value={formData.cuisineTypes}
                onChange={(e) => handleMultiSelectChange(e as SelectChangeEvent<string[]>, 'cuisineTypes')}
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
          </Box>
        );
        
      // Add more cases for other service types as needed
        
      default:
        return (
          <Box>
            {combinedServicesSummary}
            <Typography>
              Please provide any additional details specific to your service.
            </Typography>
            
            <Alert severity="info" sx={{ mt: 2 }}>
              You'll be able to add more detailed information to your service profile after creation.
            </Alert>
          </Box>
        );
    }
  };
  
  // Render availability selection step
  const renderAvailabilityStep = () => {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Set Your Availability
        </Typography>
        
        {formData.combinedServices.length > 0 && (
          <Paper sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
            <Typography variant="subtitle1" gutterBottom>
              Combined Service Package Summary
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
              <Chip 
                label={
                  formData.primaryService === 'venue' ? 'Venue (Primary)' : 
                  formData.primaryService === 'dj' ? 'DJ (Primary)' : 
                  formData.primaryService === 'caterer' ? 'Catering (Primary)' : 
                  formData.primaryService === 'entertainment' ? 'Entertainment (Primary)' : 
                  formData.primaryService === 'photography' ? 'Photography (Primary)' : 
                  formData.primaryService === 'decoration' ? 'Decoration (Primary)' : 
                  formData.primaryService === 'audioVisual' ? 'Audio Visual (Primary)' : 
                  formData.primaryService === 'furniture' ? 'Furniture (Primary)' : 
                  formData.primaryService === 'barService' ? 'Bar Service (Primary)' : 
                  formData.primaryService === 'security' ? 'Security (Primary)' : 
                  `${formData.primaryService} (Primary)`
                }
                color="primary"
              />
              {formData.combinedServices.map(service => (
                <Chip 
                  key={service}
                  label={
                    service === 'venue' ? 'Venue' : 
                    service === 'dj' ? 'DJ' : 
                    service === 'caterer' ? 'Catering' : 
                    service === 'entertainment' ? 'Entertainment' : 
                    service === 'photography' ? 'Photography' : 
                    service === 'decoration' ? 'Decoration' : 
                    service === 'audioVisual' ? 'Audio Visual' : 
                    service === 'furniture' ? 'Furniture' : 
                    service === 'barService' ? 'Bar Service' : 
                    service === 'security' ? 'Security' : 
                    service
                  }
                />
              ))}
            </Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Package Name:</strong> {formData.name}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Price:</strong> ${formData.price} ({
                formData.priceType === 'hourly' ? 'per Hour' : 
                formData.priceType === 'flat' ? 'per Event' :
                formData.priceType === 'per_person' ? 'per Person' :
                formData.priceType === 'per_item' ? 'per Item' :
                formData.priceType === 'per_guard' ? 'per Guard' : 'for Package'}
              )
            </Typography>
            <Typography variant="body2">
              <strong>Package Description:</strong> {formData.combineDescription}
            </Typography>
          </Paper>
        )}
        
        <Typography variant="body2" color="text.secondary" paragraph>
          Select dates when you're available to provide this service. You can update this later.
        </Typography>
        
        <Box sx={{ mt: 2, mb: 4 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            Later, you'll be able to connect your calendar (Google, iCal) to automatically update your availability.
          </Alert>
          
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateCalendar
              value={new Date()}
              onChange={(newDate) => {
                if (newDate) handleDateClick(newDate);
              }}
              slots={{
                day: (dayProps) => (
                  <CustomDay
                    {...dayProps}
                    isSelected={availableDates.some(d => isSameDay(d, dayProps.day))}
                  />
                )
              }}
            />
          </LocalizationProvider>
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1">
            Selected Available Dates:
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 1, 
            mt: 1, 
            maxHeight: '150px', 
            overflowY: 'auto',
            p: 1,
            border: '1px solid #e0e0e0',
            borderRadius: 1
          }}>
            {availableDates.length > 0 ? (
              availableDates.map((date, index) => (
                <Chip 
                  key={index} 
                  label={format(date, 'MMM d, yyyy')} 
                  onDelete={() => handleDateClick(date)}
                  color="primary"
                  size="small"
                />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No dates selected yet. Click on the calendar to add available dates.
              </Typography>
            )}
          </Box>
        </Box>
        
        {formData.combinedServices.length > 0 && (
          <Alert severity="info" sx={{ mt: 2 }}>
            The availability you set will apply to your entire combined service package.
            Make sure all included services are available on the selected dates.
          </Alert>
        )}
      </Box>
    );
  };
  
  // Get content for current step
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return renderServiceTypeStep();
      case 1:
        return renderBasicInfoStep();
      case 2:
        return renderDetailsStep();
      case 3:
        return renderAvailabilityStep();
      default:
        return 'Unknown step';
    }
  };
  
  return (
    <Layout title="Create New Service" hideSearch>
      <Container maxWidth="md">
        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Create a New Service
          </Typography>
          
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
            Provide details about the service you want to offer to potential clients.
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {createServiceSteps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          <Box component="form" onSubmit={handleSubmit}>
            {getStepContent(activeStep)}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                variant="outlined"
                onClick={activeStep === 0 ? () => navigate('/manage-services') : handleBack}
                disabled={activeStep === 0 && !selectedServiceType}
              >
                {activeStep === 0 ? 'Cancel' : 'Back'}
              </Button>
              
              {activeStep === createServiceSteps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                >
                  Create Service
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </Paper>
      </Container>
    </Layout>
  );
};

export default CreateServicePage; 