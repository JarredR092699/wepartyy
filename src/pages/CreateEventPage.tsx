import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Stepper,
  Step,
  StepLabel,
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
  CardActionArea
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ArrowBack as ArrowBackIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import Layout from '../components/Layout';
import ServiceCard from '../components/ServiceCard';
import { venues, djs, cateringServices } from '../data/mockData';

// Define steps for the event creation process
const steps = ['Select Date', 'Choose Venue', 'Select DJ', 'Add Catering', 'Confirm'];

const CreateEventPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  
  // State for form data
  const [eventData, setEventData] = useState({
    name: '',
    date: null as Date | null,
    isPublic: false,
    venueId: '',
    djId: '',
    cateringId: '',
    attendees: 50,
  });
  
  // Handle next step
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  
  // Handle back step
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  // Handle form input changes
  const handleChange = (field: string, value: any) => {
    setEventData({
      ...eventData,
      [field]: value,
    });
  };
  
  // Handle service selection
  const handleServiceSelect = (type: 'venue' | 'dj' | 'catering', id: string) => {
    const fieldMap = {
      venue: 'venueId',
      dj: 'djId',
      catering: 'cateringId',
    };
    
    handleChange(fieldMap[type], id);
  };
  
  // Handle form submission
  const handleSubmit = () => {
    // In a real app, this would send the data to the backend
    console.log('Event data submitted:', eventData);
    
    // Navigate to the My Events page
    navigate('/my-events');
  };
  
  // Render different step content based on active step
  const getStepContent = (step: number) => {
    switch (step) {
      case 0: // Date selection
        return (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              When is your event?
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Event Date"
                value={eventData.date}
                onChange={(newDate: Date | null) => handleChange('date', newDate)}
                sx={{ width: '100%', mt: 2 }}
              />
            </LocalizationProvider>
            
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
          </Box>
        );
        
      case 1: // Venue selection
        return (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Choose a Venue
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {venues.map((venue) => (
                <Grid item xs={12} sm={6} key={venue.id}>
                  <Card 
                    sx={{ 
                      border: eventData.venueId === venue.id ? 2 : 0,
                      borderColor: 'primary.main',
                    }}
                  >
                    <CardActionArea onClick={() => handleServiceSelect('venue', venue.id)}>
                      <ServiceCard service={venue} type="venue" />
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
        
      case 2: // DJ selection
        return (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Select a DJ
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {djs.map((dj) => (
                <Grid item xs={12} sm={6} key={dj.id}>
                  <Card 
                    sx={{ 
                      border: eventData.djId === dj.id ? 2 : 0,
                      borderColor: 'primary.main',
                    }}
                  >
                    <CardActionArea onClick={() => handleServiceSelect('dj', dj.id)}>
                      <ServiceCard service={dj} type="dj" />
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
        
      case 3: // Catering selection
        return (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Add Catering (Optional)
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {cateringServices.map((catering) => (
                <Grid item xs={12} sm={6} key={catering.id}>
                  <Card 
                    sx={{ 
                      border: eventData.cateringId === catering.id ? 2 : 0,
                      borderColor: 'primary.main',
                    }}
                  >
                    <CardActionArea onClick={() => handleServiceSelect('catering', catering.id)}>
                      <ServiceCard service={catering} type="catering" />
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
        
      case 4: // Confirmation
        const selectedVenue = venues.find(v => v.id === eventData.venueId);
        const selectedDJ = djs.find(d => d.id === eventData.djId);
        const selectedCatering = cateringServices.find(c => c.id === eventData.cateringId);
        
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
                Date: {eventData.date ? eventData.date.toLocaleDateString() : 'Not selected'}
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
              
              <Typography variant="body1" gutterBottom>
                Venue: {selectedVenue ? selectedVenue.name : 'None selected'}
              </Typography>
              
              <Typography variant="body1" gutterBottom>
                DJ: {selectedDJ ? selectedDJ.name : 'None selected'}
              </Typography>
              
              <Typography variant="body1" gutterBottom>
                Catering: {selectedCatering ? selectedCatering.name : 'None selected'}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Estimated Total Cost:
              </Typography>
              
              <Typography variant="body1" fontWeight="bold">
                ${(
                  (selectedVenue ? selectedVenue.price : 0) +
                  (selectedDJ ? selectedDJ.price : 0) +
                  (selectedCatering ? selectedCatering.price * eventData.attendees : 0)
                ).toLocaleString()}
              </Typography>
            </Paper>
          </Box>
        );
        
      default:
        return 'Unknown step';
    }
  };
  
  return (
    <Layout title="Create Event" hideSearch>
      <Container maxWidth="md">
        <Box sx={{ width: '100%', mb: 4 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {getStepContent(activeStep)}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="outlined"
              disabled={activeStep === 0}
              onClick={handleBack}
              startIcon={<ArrowBackIcon />}
            >
              Back
            </Button>
            
            {activeStep === steps.length - 1 ? (
              <Button 
                variant="contained" 
                onClick={handleSubmit}
              >
                Book Now
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<ArrowForwardIcon />}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default CreateEventPage; 