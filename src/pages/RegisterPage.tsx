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
  Checkbox,
  Card,
  CardContent,
  CardActionArea
} from '@mui/material';
import { 
  PersonAdd as PersonAddIcon,
  Store as StoreIcon,
  Person as PersonIcon,
  MusicNote as MusicIcon,
  Restaurant as RestaurantIcon,
  Museum as VenueIcon,
  PhotoCamera as CameraIcon,
  Brush as DecorationIcon,
  Mic as AudioIcon,
  Weekend as FurnitureIcon,
  LocalBar as BarIcon,
  Security as SecurityIcon,
  Theaters as EntertainmentIcon
} from '@mui/icons-material';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../data/mockData';

// Define steps for registration
const registrationSteps = ['Account Type', 'Account Details', 'Service Selection', 'Basic Information'];

// Service types with their icons and names
const serviceTypes = [
  { id: 'venue', name: 'Venue', icon: <VenueIcon /> },
  { id: 'dj', name: 'DJ', icon: <MusicIcon /> },
  { id: 'caterer', name: 'Catering', icon: <RestaurantIcon /> },
  { id: 'entertainment', name: 'Entertainment', icon: <EntertainmentIcon /> },
  { id: 'photography', name: 'Photography', icon: <CameraIcon /> },
  { id: 'decoration', name: 'Decoration', icon: <DecorationIcon /> },
  { id: 'audioVisual', name: 'Audio Visual', icon: <AudioIcon /> },
  { id: 'furniture', name: 'Furniture', icon: <FurnitureIcon /> },
  { id: 'barService', name: 'Bar Service', icon: <BarIcon /> },
  { id: 'security', name: 'Security', icon: <SecurityIcon /> },
];

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
    description: '',
    
    // For service providers
    isServiceProvider: false,
    selectedServices: [] as UserRole[],
    
    // Location (common for all service providers)
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
  
  const handleUserTypeSelect = (isServiceProvider: boolean) => {
    setFormData({
      ...formData,
      isServiceProvider,
      role: isServiceProvider ? 'multiple' : 'eventOrganizer',
      selectedServices: [],
    });
    setActiveStep(1);
  };
  
  const handleServiceToggle = (serviceType: UserRole) => {
    const currentSelectedServices = [...formData.selectedServices];
    const serviceIndex = currentSelectedServices.indexOf(serviceType);
    
    if (serviceIndex === -1) {
      // Service not selected, add it
      currentSelectedServices.push(serviceType);
    } else {
      // Service already selected, remove it
      currentSelectedServices.splice(serviceIndex, 1);
    }
    
    setFormData({
      ...formData,
      selectedServices: currentSelectedServices,
      // If only one service is selected, set the role to that service
      // Otherwise, use 'multiple'
      role: currentSelectedServices.length === 1 ? currentSelectedServices[0] : 'multiple'
    });
  };
  
  const handleNext = () => {
    // Validate current step
    if (activeStep === 1) {
      if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all required fields');
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    } else if (activeStep === 2 && formData.isServiceProvider) {
      if (formData.selectedServices.length === 0) {
        setError('Please select at least one service type');
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
      // Create location object for service providers
      const location = formData.isServiceProvider ? {
        address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
        coordinates: {
          // Mock coordinates - in a real app, you would use a geocoding API
          lat: 40.7128,
          lng: -74.0060
        }
      } : undefined;
      
      // For service providers with multiple services, use the 'multiple' role
      // For service providers with a single service, use that service's role
      const role = formData.isServiceProvider 
        ? formData.selectedServices.length === 1 
          ? formData.selectedServices[0] 
          : 'multiple'
        : 'eventOrganizer';
      
      const { success, message } = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: role,
        name: formData.name || formData.username,
        phone: formData.phone,
        location,
        calendarConnected: false,
        // Store additional data for service providers
        selectedServices: formData.isServiceProvider ? formData.selectedServices : undefined,
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
  
  // Render account type selection (Step 0)
  const renderAccountTypeStep = () => {
    return (
      <Box>
        <Typography variant="h6" gutterBottom align="center">
          What type of account would you like to create?
        </Typography>
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 4 }}>
          <Card 
            sx={{ 
              width: 200, 
              textAlign: 'center',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: 6
              } 
            }}
          >
            <CardActionArea onClick={() => handleUserTypeSelect(true)} sx={{ py: 2 }}>
              <StoreIcon sx={{ fontSize: 80, color: 'primary.main' }} />
              <CardContent>
                <Typography variant="h6" component="div">
                  Service Provider
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Offer services for events
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          
          <Card 
            sx={{ 
              width: 200, 
              textAlign: 'center', 
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: 6
              }
            }}
          >
            <CardActionArea onClick={() => handleUserTypeSelect(false)} sx={{ py: 2 }}>
              <PersonIcon sx={{ fontSize: 80, color: 'primary.main' }} />
              <CardContent>
                <Typography variant="h6" component="div">
                  Client / Event Planner
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Create and manage events
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Box>
      </Box>
    );
  };
  
  // Render account details step (Step 1)
  const renderAccountDetailsStep = () => {
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
      </Box>
    );
  };
  
  // Render service selection step (Step 2) - only for service providers
  const renderServiceSelectionStep = () => {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Select Services You Offer
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Choose one or more services that you provide. You can add more details for each service later.
        </Typography>
        
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {serviceTypes.map((service) => (
            <Grid item xs={6} sm={4} key={service.id}>
              <Card 
                sx={{ 
                  border: formData.selectedServices.includes(service.id as UserRole) 
                    ? '2px solid' 
                    : '1px solid',
                  borderColor: formData.selectedServices.includes(service.id as UserRole) 
                    ? 'primary.main' 
                    : 'divider',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: 4
                  }
                }}
              >
                <CardActionArea 
                  onClick={() => handleServiceToggle(service.id as UserRole)}
                  sx={{ 
                    p: 2, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    backgroundColor: formData.selectedServices.includes(service.id as UserRole) 
                      ? 'rgba(25, 118, 210, 0.08)' 
                      : 'transparent'
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: formData.selectedServices.includes(service.id as UserRole) 
                      ? 'primary.main' 
                      : 'text.secondary',
                    mb: 1
                  }}>
                    {service.icon}
                  </Box>
                  <Typography variant="subtitle1" align="center">
                    {service.name}
                  </Typography>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };
  
  // Render basic information step (Step 3)
  const renderBasicInfoStep = () => {
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
          placeholder={formData.isServiceProvider 
            ? "Tell us about your services..." 
            : "Tell us about yourself..."}
        />
        
        {formData.isServiceProvider && (
          <>
            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
              Location Information
            </Typography>
            
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
            
            <Alert severity="info" sx={{ mt: 2 }}>
              After registration, you'll be able to create detailed service listings and set your availability.
            </Alert>
          </>
        )}
      </Box>
    );
  };
  
  // Get step content based on active step
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return renderAccountTypeStep();
      case 1:
        return renderAccountDetailsStep();
      case 2:
        return formData.isServiceProvider 
          ? renderServiceSelectionStep() 
          : renderBasicInfoStep();
      case 3:
        return renderBasicInfoStep();
      default:
        return 'Unknown step';
    }
  };
  
  return (
    <Layout title="Register" hideSearch>
      <Container maxWidth="sm">
        <Paper elevation={0} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Create an Account
          </Typography>
          
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
            {formData.isServiceProvider 
              ? 'Join as a service provider and offer your services' 
              : 'Sign up to create and manage events'}
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {activeStep > 0 && (
            <Stepper 
              activeStep={activeStep - 1} 
              alternativeLabel 
              sx={{ mb: 4 }}
            >
              {formData.isServiceProvider 
                ? registrationSteps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))
                : registrationSteps
                    .filter(step => step !== 'Service Selection')
                    .map((label) => (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))
              }
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
              
              {(activeStep === 3 || (activeStep === 2 && !formData.isServiceProvider)) ? (
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