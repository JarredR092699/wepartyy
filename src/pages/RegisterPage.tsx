import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Stepper,
  Step,
  StepLabel,
  SelectChangeEvent,
  Chip,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { PersonAdd as PersonAddIcon } from '@mui/icons-material';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../data/mockData';

// Define steps for vendor registration
const vendorSteps = ['Account Details', 'Vendor Information', 'Location'];

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'eventOrganizer' as UserRole,
    name: '',
    phone: '',
    // Vendor specific fields
    description: '',
    // DJ specific fields
    genres: [] as string[],
    experience: 0,
    // Venue specific fields
    venueType: 'indoor' as 'indoor' | 'outdoor' | 'both',
    venueSize: 'medium' as 'small' | 'medium' | 'large',
    venueStyles: [] as string[],
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
    // Multiple services
    serviceCategories: [] as UserRole[],
    // Common vendor fields
    price: 0,
    priceType: 'flat' as 'hourly' | 'flat' | 'per_person' | 'per_hour' | 'package' | 'custom' | 'per_item' | 'per_guard',
    // Location
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleSelectChange = (e: SelectChangeEvent<UserRole>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name as string]: value,
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
  
  const handleNext = () => {
    // Validate current step
    if (activeStep === 0) {
      if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all required fields');
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }
    
    setError(null);
    setActiveStep((prevStep) => prevStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      // Create location object for vendors
      const location = formData.role !== 'eventOrganizer' && formData.role !== 'publicUser' ? {
        address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
        coordinates: {
          // Mock coordinates - in a real app, you would use a geocoding API
          lat: 40.7128,
          lng: -74.0060
        }
      } : undefined;
      
      const { success, message } = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        name: formData.name || formData.username,
        phone: formData.phone,
        location,
        calendarConnected: false
      });
      
      if (success) {
        navigate('/profile');
      } else {
        setError(message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Render different step content based on active step
  const getStepContent = (step: number) => {
    switch (step) {
      case 0: // Account Details
        return (
          <Box>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleTextChange}
              margin="normal"
              required
              autoFocus
            />
            
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleTextChange}
              margin="normal"
              required
            />
            
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleTextChange}
              margin="normal"
              required
            />
            
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleTextChange}
              margin="normal"
              required
            />
            
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="role-label">Account Type</InputLabel>
              <Select
                labelId="role-label"
                name="role"
                value={formData.role}
                onChange={handleSelectChange}
                label="Account Type"
              >
                <MenuItem value="eventOrganizer">Event Organizer</MenuItem>
                <MenuItem value="publicUser">Public User</MenuItem>
                <MenuItem value="venue">Venue Provider</MenuItem>
                <MenuItem value="dj">DJ</MenuItem>
                <MenuItem value="caterer">Caterer</MenuItem>
                <MenuItem value="entertainment">Entertainment Provider</MenuItem>
                <MenuItem value="photography">Photography Provider</MenuItem>
                <MenuItem value="decoration">Decoration Provider</MenuItem>
                <MenuItem value="audioVisual">Audio Visual Provider</MenuItem>
                <MenuItem value="furniture">Furniture Provider</MenuItem>
                <MenuItem value="barService">Bar Service Provider</MenuItem>
                <MenuItem value="security">Security Provider</MenuItem>
                <MenuItem value="multiple">Multiple Service Provider</MenuItem>
              </Select>
            </FormControl>
          </Box>
        );
        
      case 1: // Vendor Information
        return (
          <Box>
            <TextField
              fullWidth
              label="Full Name / Business Name"
              name="name"
              value={formData.name}
              onChange={handleTextChange}
              margin="normal"
              required
            />
            
            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleTextChange}
              margin="normal"
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
              placeholder="Tell us about your services..."
            />

            {/* DJ-specific fields */}
            {formData.role === 'dj' && (
              <>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="genres-label">Music Genres</InputLabel>
                  <Select
                    labelId="genres-label"
                    multiple
                    name="genres"
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
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setFormData({
                      ...formData,
                      experience: value
                    });
                  }}
                  margin="normal"
                />

                <TextField
                  fullWidth
                  label="Price per Event ($)"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setFormData({
                      ...formData,
                      price: value
                    });
                  }}
                  margin="normal"
                  required
                />

                <TextField
                  fullWidth
                  label="Sample Playlist URL (SoundCloud, Spotify, etc.)"
                  name="playlistUrl"
                  onChange={handleTextChange}
                  margin="normal"
                  placeholder="https://soundcloud.com/yourusername/sets/yourplaylist"
                />
              </>
            )}

            {/* Venue-specific fields */}
            {formData.role === 'venue' && (
              <>
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

                <FormControl fullWidth margin="normal">
                  <InputLabel id="venue-styles-label">Venue Style</InputLabel>
                  <Select
                    labelId="venue-styles-label"
                    multiple
                    name="venueStyles"
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

                <TextField
                  fullWidth
                  label="Price per Event ($)"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setFormData({
                      ...formData,
                      price: value
                    });
                  }}
                  margin="normal"
                  required
                />
              </>
            )}

            {/* Caterer-specific fields */}
            {formData.role === 'caterer' && (
              <>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="cuisine-types-label">Cuisine Types</InputLabel>
                  <Select
                    labelId="cuisine-types-label"
                    multiple
                    name="cuisineTypes"
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

                <TextField
                  fullWidth
                  label="Price per Person ($)"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setFormData({
                      ...formData,
                      price: value
                    });
                  }}
                  margin="normal"
                  required
                />
              </>
            )}

            {/* Entertainment-specific fields */}
            {formData.role === 'entertainment' && (
              <>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="entertainment-types-label">Entertainment Types</InputLabel>
                  <Select
                    labelId="entertainment-types-label"
                    multiple
                    name="entertainmentTypes"
                    value={formData.entertainmentTypes}
                    onChange={(e) => handleMultiSelectChange(e as SelectChangeEvent<string[]>, 'entertainmentTypes')}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {['Band', 'Solo Musician', 'DJ', 'Dancer', 'Comedian', 'Magician', 'Speaker', 'MC', 'Circus', 'Interactive'].map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

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
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label={`Price ${formData.priceType === 'hourly' ? 'per Hour' : 'per Event'} ($)`}
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setFormData({
                      ...formData,
                      price: value
                    });
                  }}
                  margin="normal"
                  required
                />
              </>
            )}

            {/* Photography-specific fields */}
            {formData.role === 'photography' && (
              <>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="photography-types-label">Photography Types</InputLabel>
                  <Select
                    labelId="photography-types-label"
                    multiple
                    name="photographyTypes"
                    value={formData.photographyTypes}
                    onChange={(e) => handleMultiSelectChange(e as SelectChangeEvent<string[]>, 'photographyTypes')}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {['Photographer', 'Videographer', 'Drone', 'Photo Booth', 'Portrait', 'Event Coverage'].map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel id="photography-styles-label">Photography Styles</InputLabel>
                  <Select
                    labelId="photography-styles-label"
                    multiple
                    name="photographyStyles"
                    value={formData.photographyStyles}
                    onChange={(e) => handleMultiSelectChange(e as SelectChangeEvent<string[]>, 'photographyStyles')}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {['Traditional', 'Photojournalistic', 'Artistic', 'Candid', 'Formal', 'Documentary'].map((style) => (
                      <MenuItem key={style} value={style}>
                        {style}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

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
                    <MenuItem value="package">Package</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label={`${formData.priceType === 'hourly' ? 'Price per Hour' : 'Package Price'} ($)`}
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setFormData({
                      ...formData,
                      price: value
                    });
                  }}
                  margin="normal"
                  required
                />
              </>
            )}

            {/* Decoration-specific fields */}
            {formData.role === 'decoration' && (
              <>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="decoration-types-label">Decoration Types</InputLabel>
                  <Select
                    labelId="decoration-types-label"
                    multiple
                    name="decorationTypes"
                    value={formData.decorationTypes}
                    onChange={(e) => handleMultiSelectChange(e as SelectChangeEvent<string[]>, 'decorationTypes')}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {['Floral', 'Lighting', 'Stage', 'Themed', 'Balloon', 'Table Settings', 'Backdrops', 'Props'].map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel id="decoration-styles-label">Decoration Styles</InputLabel>
                  <Select
                    labelId="decoration-styles-label"
                    multiple
                    name="decorationStyles"
                    value={formData.decorationStyles}
                    onChange={(e) => handleMultiSelectChange(e as SelectChangeEvent<string[]>, 'decorationStyles')}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {['Modern', 'Rustic', 'Elegant', 'Bohemian', 'Minimalist', 'Vintage', 'Tropical', 'Industrial'].map((style) => (
                      <MenuItem key={style} value={style}>
                        {style}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

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
                    <MenuItem value="package">Package</MenuItem>
                    <MenuItem value="custom">Custom Quote</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Base Price ($)"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setFormData({
                      ...formData,
                      price: value
                    });
                  }}
                  margin="normal"
                  required
                />
              </>
            )}

            {/* Audio Visual-specific fields */}
            {formData.role === 'audioVisual' && (
              <>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="equipment-types-label">Equipment Types</InputLabel>
                  <Select
                    labelId="equipment-types-label"
                    multiple
                    name="equipmentTypes"
                    value={formData.equipmentTypes}
                    onChange={(e) => handleMultiSelectChange(e as SelectChangeEvent<string[]>, 'equipmentTypes')}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {['Sound System', 'Lighting', 'Projector', 'Microphones', 'Screens', 'Staging', 'Live Streaming', 'Recording'].map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

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
                    <MenuItem value="package">Package</MenuItem>
                    <MenuItem value="itemized">Itemized</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Base Price ($)"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setFormData({
                      ...formData,
                      price: value
                    });
                  }}
                  margin="normal"
                  required
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.includesTechnician}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          includesTechnician: e.target.checked
                        });
                      }}
                      name="includesTechnician"
                    />
                  }
                  label="Includes Technician"
                />
              </>
            )}

            {/* Furniture-specific fields */}
            {formData.role === 'furniture' && (
              <>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="furniture-types-label">Furniture Types</InputLabel>
                  <Select
                    labelId="furniture-types-label"
                    multiple
                    name="furnitureTypes"
                    value={formData.furnitureTypes}
                    onChange={(e) => handleMultiSelectChange(e as SelectChangeEvent<string[]>, 'furnitureTypes')}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {['Tables', 'Chairs', 'Lounge', 'Tents', 'Linens', 'Bars', 'Stages', 'Dance Floors'].map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel id="furniture-styles-label">Furniture Styles</InputLabel>
                  <Select
                    labelId="furniture-styles-label"
                    multiple
                    name="furnitureStyles"
                    value={formData.furnitureStyles}
                    onChange={(e) => handleMultiSelectChange(e as SelectChangeEvent<string[]>, 'furnitureStyles')}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {['Modern', 'Rustic', 'Elegant', 'Industrial', 'Vintage', 'Contemporary', 'Classic', 'Bohemian'].map((style) => (
                      <MenuItem key={style} value={style}>
                        {style}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

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
                    <MenuItem value="per_item">Per Item</MenuItem>
                    <MenuItem value="package">Package</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label={`${formData.priceType === 'per_item' ? 'Average Price per Item' : 'Package Price'} ($)`}
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setFormData({
                      ...formData,
                      price: value
                    });
                  }}
                  margin="normal"
                  required
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.includesSetup}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          includesSetup: e.target.checked
                        });
                      }}
                      name="includesSetup"
                    />
                  }
                  label="Includes Setup/Teardown"
                />
              </>
            )}

            {/* Bar Service-specific fields */}
            {formData.role === 'barService' && (
              <>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="bar-service-types-label">Service Types</InputLabel>
                  <Select
                    labelId="bar-service-types-label"
                    multiple
                    name="barServiceTypes"
                    value={formData.barServiceTypes}
                    onChange={(e) => handleMultiSelectChange(e as SelectChangeEvent<string[]>, 'barServiceTypes')}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {['Full Bar', 'Beer and Wine', 'Specialty Cocktails', 'Mobile Bar', 'Craft Beer', 'Wine Tasting', 'Mixology'].map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

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
                    <MenuItem value="per_person">Per Person</MenuItem>
                    <MenuItem value="per_hour">Per Hour</MenuItem>
                    <MenuItem value="package">Package</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label={`${formData.priceType === 'per_person' ? 'Price per Person' : formData.priceType === 'per_hour' ? 'Price per Hour' : 'Package Price'} ($)`}
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setFormData({
                      ...formData,
                      price: value
                    });
                  }}
                  margin="normal"
                  required
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.includesBartenders}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          includesBartenders: e.target.checked
                        });
                      }}
                      name="includesBartenders"
                    />
                  }
                  label="Includes Bartenders"
                />
              </>
            )}

            {/* Security-specific fields */}
            {formData.role === 'security' && (
              <>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="security-types-label">Service Types</InputLabel>
                  <Select
                    labelId="security-types-label"
                    multiple
                    name="securityTypes"
                    value={formData.securityTypes}
                    onChange={(e) => handleMultiSelectChange(e as SelectChangeEvent<string[]>, 'securityTypes')}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {['Event Security', 'Crowd Control', 'VIP Protection', 'Access Control', 'Bag Checks', 'Parking Security'].map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

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
                    <MenuItem value="per_guard">Per Guard</MenuItem>
                    <MenuItem value="per_hour">Per Hour</MenuItem>
                    <MenuItem value="package">Package</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label={`${formData.priceType === 'per_guard' ? 'Price per Guard' : formData.priceType === 'per_hour' ? 'Price per Hour' : 'Package Price'} ($)`}
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setFormData({
                      ...formData,
                      price: value
                    });
                  }}
                  margin="normal"
                  required
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.uniformed}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          uniformed: e.target.checked
                        });
                      }}
                      name="uniformed"
                    />
                  }
                  label="Uniformed Staff"
                />
              </>
            )}

            {/* Multiple Service Provider fields */}
            {formData.role === 'multiple' && (
              <>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="service-categories-label">Service Categories</InputLabel>
                  <Select
                    labelId="service-categories-label"
                    multiple
                    name="serviceCategories"
                    value={formData.serviceCategories}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        serviceCategories: e.target.value as UserRole[]
                      });
                    }}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as UserRole[]).map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    <MenuItem value="venue">Venue</MenuItem>
                    <MenuItem value="dj">DJ</MenuItem>
                    <MenuItem value="caterer">Caterer</MenuItem>
                    <MenuItem value="entertainment">Entertainment</MenuItem>
                    <MenuItem value="photography">Photography</MenuItem>
                    <MenuItem value="decoration">Decoration</MenuItem>
                    <MenuItem value="audioVisual">Audio Visual</MenuItem>
                    <MenuItem value="furniture">Furniture</MenuItem>
                    <MenuItem value="barService">Bar Service</MenuItem>
                    <MenuItem value="security">Security</MenuItem>
                  </Select>
                </FormControl>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                  As a multiple service provider, you'll be able to set up detailed information for each service category in your profile after registration.
                </Typography>
              </>
            )}
          </Box>
        );
        
      case 2: // Location
        return (
          <Box>
            <TextField
              fullWidth
              label="Street Address"
              name="address"
              value={formData.address}
              onChange={handleTextChange}
              margin="normal"
              required
            />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleTextChange}
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleTextChange}
                  margin="normal"
                  required
                />
              </Grid>
            </Grid>
            
            <TextField
              fullWidth
              label="ZIP Code"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleTextChange}
              margin="normal"
              required
            />
          </Box>
        );
        
      default:
        return 'Unknown step';
    }
  };
  
  // Determine if we should show the stepper (only for vendors)
  const isVendor = formData.role !== 'eventOrganizer' && formData.role !== 'publicUser';
  const showStepper = isVendor && activeStep > 0;
  
  return (
    <Layout title="Register" hideSearch>
      <Container maxWidth="sm">
        <Paper elevation={0} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Create an Account
          </Typography>
          
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
            {isVendor ? 'Join as a vendor and offer your services' : 'Sign up to create and manage events'}
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {showStepper && (
            <Stepper activeStep={activeStep - 1} alternativeLabel sx={{ mb: 4 }}>
              {vendorSteps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          )}
          
          <Box component="form" onSubmit={handleSubmit}>
            {getStepContent(activeStep)}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              {activeStep > 0 ? (
                <Button
                  variant="outlined"
                  onClick={handleBack}
                >
                  Back
                </Button>
              ) : (
                <div></div> // Empty div for spacing
              )}
              
              {activeStep === 0 && (formData.role === 'eventOrganizer' || formData.role === 'publicUser') ? (
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PersonAddIcon />}
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              ) : activeStep === (isVendor ? 2 : 0) ? (
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PersonAddIcon />}
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
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
          
          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body1" gutterBottom>
              Already have an account?
            </Typography>
            
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              size="large"
              sx={{ mt: 1 }}
            >
              Sign In
            </Button>
          </Box>
        </Paper>
      </Container>
    </Layout>
  );
};

export default RegisterPage; 