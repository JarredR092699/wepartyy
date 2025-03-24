import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Box,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Divider,
  Card,
  CardContent,
  Alert,
  Snackbar,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import {
  CreditCard as CreditCardIcon,
  AccountBalance as BankIcon,
  Public as PublicIcon,
  Lock as LockIcon,
  CheckCircleOutline as CheckCircleIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { format, parseISO } from 'date-fns';
import { getUserId, getUserDisplayName } from '../utils/userUtils';

// Styled components
const PaymentMethodCard = styled(Card)<{ selected?: boolean }>(({ theme, selected }) => ({
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  border: selected ? `2px solid ${theme.palette.primary.main}` : '1px solid #e0e0e0',
  transform: selected ? 'translateY(-4px)' : 'none',
  boxShadow: selected ? theme.shadows[4] : theme.shadows[1],
  '&:hover': {
    boxShadow: theme.shadows[3],
    transform: 'translateY(-2px)'
  }
}));

// Privacy settings card
const PrivacyCard = styled(Card)<{ selected?: boolean }>(({ theme, selected }) => ({
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  border: selected ? `2px solid ${theme.palette.primary.main}` : '1px solid #e0e0e0',
  transform: selected ? 'translateY(-4px)' : 'none',
  boxShadow: selected ? theme.shadows[4] : theme.shadows[1],
  '&:hover': {
    boxShadow: theme.shadows[3],
    transform: 'translateY(-2px)'
  },
  height: '100%'
}));

// Define payment steps
const steps = ['Review & Confirm', 'Payment Method', 'Privacy Settings', 'Complete'];

// Payment page component
const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  
  // Get event data from location state
  const {
    eventData,
    venues,
    djs,
    caterings,
    entertainment,
    photography,
    decoration,
    audioVisual,
    furniture,
    barService,
    security,
    providerSpecificDates
  } = location.state as any;
  
  // Calculate total price based on selected services
  const calculateTotal = () => {
    let total = 0;
    
    // Get selected services
    const selectedVenue = venues.find((v: any) => v.id === eventData.venueId);
    const selectedDJ = djs.find((dj: any) => dj.id === eventData.djId);
    const selectedCatering = caterings.find((c: any) => c.id === eventData.cateringId);
    const selectedEntertainment = entertainment?.find((e: any) => e.id === eventData.entertainmentId);
    const selectedPhotography = photography?.find((p: any) => p.id === eventData.photographyId);
    const selectedDecoration = decoration?.find((d: any) => d.id === eventData.decorationId);
    const selectedAudioVisual = audioVisual?.find((a: any) => a.id === eventData.audioVisualId);
    const selectedFurniture = furniture?.find((f: any) => f.id === eventData.furnitureId);
    const selectedBarService = barService?.find((b: any) => b.id === eventData.barServiceId);
    const selectedSecurity = security?.find((s: any) => s.id === eventData.securityId);
    
    // Add prices for selected services
    if (selectedVenue) total += selectedVenue.price;
    if (selectedDJ) total += selectedDJ.price;
    if (selectedCatering) total += selectedCatering.pricePerPerson * eventData.attendees;
    if (selectedEntertainment) total += selectedEntertainment.price;
    if (selectedPhotography) total += selectedPhotography.price;
    if (selectedDecoration) total += selectedDecoration.price;
    if (selectedAudioVisual) total += selectedAudioVisual.price;
    if (selectedFurniture) total += selectedFurniture.price;
    if (selectedBarService) total += selectedBarService.price;
    if (selectedSecurity) total += selectedSecurity.price;
    
    return total;
  };
  
  // State variables
  const [activeStep, setActiveStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [privacyType, setPrivacyType] = useState('private');
  const [processing, setProcessing] = useState(false);
  const [eventLink, setEventLink] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const total = calculateTotal();
  const depositAmount = total * 0.25; // 25% deposit
  
  // Handle next step
  const handleNext = () => {
    if (activeStep === 1 && paymentMethod === 'creditCard') {
      // Validate credit card details
      if (!cardNumber || !cardName || !expiryDate || !cvv) {
        setSnackbarMessage('Please fill in all payment details');
        setSnackbarOpen(true);
        return;
      }
    }
    
    setActiveStep((prevStep) => prevStep + 1);
    
    // If completed, process payment and generate event link
    if (activeStep === 2) {
      processPayment();
    }
  };
  
  // Handle back step
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  // Process payment (mock implementation)
  const processPayment = async () => {
    setProcessing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a unique event ID (in a real app, this would come from the backend)
      const eventId = `EVENT-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      
      // Create event link
      const link = `/event/${eventId}`;
      setEventLink(link);
      
      // Store event data in localStorage (in a real app, this would be saved to a database)
      const allEvents = JSON.parse(localStorage.getItem('all-events') || '[]');
      allEvents.push({
        id: eventId,
        ...eventData,
        createdBy: getUserId(currentUser),
        isPublic: privacyType === 'public',
        totalPrice: total,
        depositPaid: depositAmount,
        participants: [],
        pendingRequests: [],
        createdAt: new Date().toISOString()
      });
      
      localStorage.setItem('all-events', JSON.stringify(allEvents));
      
      // Store in user's events
      const userEvents = JSON.parse(localStorage.getItem(`user-events-${getUserId(currentUser)}`) || '[]');
      userEvents.push(eventId);
      localStorage.setItem(`user-events-${getUserId(currentUser)}`, JSON.stringify(userEvents));
      
      setProcessing(false);
    } catch (error) {
      console.error('Payment processing error:', error);
      setSnackbarMessage('Payment processing failed. Please try again.');
      setSnackbarOpen(true);
      setProcessing(false);
      setActiveStep(1); // Go back to payment step
    }
  };
  
  // Navigate to event details page
  const viewEvent = () => {
    navigate(eventLink);
  };
  
  // Get step content based on active step
  const getStepContent = () => {
    switch (activeStep) {
      case 0: // Review step
        return (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Review Your Event</Typography>
            <Typography variant="body1">
              Please review your event details before proceeding to payment.
            </Typography>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold">Event: {eventData.eventName}</Typography>
              <Typography variant="body2">
                Date: {eventData.isMultiDay 
                  ? `${format(parseISO(eventData.dateRange.start), 'MMMM d, yyyy')} - ${format(parseISO(eventData.dateRange.end), 'MMMM d, yyyy')}`
                  : eventData.date 
                    ? format(parseISO(eventData.date), 'MMMM d, yyyy')
                    : 'Multiple dates selected'
                }
              </Typography>
              <Typography variant="body2">Attendees: {eventData.attendees}</Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle1" fontWeight="bold">Price Summary</Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Total Event Cost: ${total.toLocaleString()}
            </Typography>
            <Typography variant="body1" color="primary" fontWeight="medium">
              Deposit Due Now (25%): ${depositAmount.toLocaleString()}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              The remaining balance of ${(total - depositAmount).toLocaleString()} will be due 14 days before your event.
            </Typography>
          </Paper>
        );
        
      case 1: // Payment method step
        return (
          <>
            <Typography variant="h6" gutterBottom>Select Payment Method</Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <PaymentMethodCard 
                  selected={paymentMethod === 'creditCard'}
                  onClick={() => setPaymentMethod('creditCard')}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CreditCardIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">Credit/Debit Card</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Pay securely with your credit or debit card.
                    </Typography>
                  </CardContent>
                </PaymentMethodCard>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <PaymentMethodCard 
                  selected={paymentMethod === 'bankTransfer'}
                  onClick={() => setPaymentMethod('bankTransfer')}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <BankIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">Bank Transfer</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Pay directly from your bank account.
                    </Typography>
                  </CardContent>
                </PaymentMethodCard>
              </Grid>
            </Grid>
            
            {paymentMethod === 'creditCard' && (
              <Paper sx={{ p: 3 }}>
                <Typography variant="subtitle1" gutterBottom>Card Details</Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Card Number"
                      placeholder="XXXX XXXX XXXX XXXX"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Cardholder Name"
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      required
                    />
                  </Grid>
                  
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Expiry Date"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      required
                    />
                  </Grid>
                  
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="CVV"
                      placeholder="XXX"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      required
                    />
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Your card information is secured with 256-bit encryption.
                  </Typography>
                </Box>
              </Paper>
            )}
            
            {paymentMethod === 'bankTransfer' && (
              <Paper sx={{ p: 3 }}>
                <Typography variant="subtitle1" gutterBottom>Bank Transfer Details</Typography>
                <Typography variant="body2">
                  You'll receive our bank details after confirming this step. Please allow 2-3 business days for the transfer to be processed.
                </Typography>
              </Paper>
            )}
          </>
        );
        
      case 2: // Privacy settings step
        return (
          <>
            <Typography variant="h6" gutterBottom>Privacy Settings</Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Choose whether your event is public or private:
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <PrivacyCard 
                  selected={privacyType === 'public'}
                  onClick={() => setPrivacyType('public')}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PublicIcon color="primary" sx={{ mr: 1, fontSize: 40 }} />
                      <Typography variant="h6">Public Event</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ minHeight: 80 }}>
                      Anyone can see your event details and join without approval. Ideal for open parties, community gatherings, and events where you want to reach a wider audience.
                    </Typography>
                    <Box sx={{ mt: 2, bgcolor: 'primary.light', p: 1.5, borderRadius: 1 }}>
                      <Typography variant="body2" fontWeight="medium">
                        Participants can simply click to join your event.
                      </Typography>
                    </Box>
                  </CardContent>
                </PrivacyCard>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <PrivacyCard 
                  selected={privacyType === 'private'}
                  onClick={() => setPrivacyType('private')}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LockIcon color="primary" sx={{ mr: 1, fontSize: 40 }} />
                      <Typography variant="h6">Private Event</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ minHeight: 80 }}>
                      Your event details are visible only to people with the link, and they must request permission to join. Perfect for exclusive parties, business events, or gatherings with a select guest list.
                    </Typography>
                    <Box sx={{ mt: 2, bgcolor: 'primary.light', p: 1.5, borderRadius: 1 }}>
                      <Typography variant="body2" fontWeight="medium">
                        You'll approve each participant's request to join.
                      </Typography>
                    </Box>
                  </CardContent>
                </PrivacyCard>
              </Grid>
            </Grid>
          </>
        );
        
      case 3: // Completion step
        return (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant="h4" gutterBottom>Payment Successful!</Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Your event has been created and your deposit of ${depositAmount.toLocaleString()} has been processed.
            </Typography>
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>Event Link</Typography>
              <Alert severity="success" sx={{ mb: 2 }}>
                <Typography variant="body1">
                  Share this link with potential participants:
                </Typography>
                <Box sx={{ 
                  bgcolor: '#f5f5f5', 
                  p: 1.5, 
                  borderRadius: 1, 
                  mt: 1,
                  fontFamily: 'monospace',
                  wordBreak: 'break-all'
                }}>
                  {window.location.origin + eventLink}
                </Box>
              </Alert>
              
              <Typography variant="body2" sx={{ mt: 2 }}>
                This event has been added to your "My Events" page where you can manage participants and event details.
              </Typography>
            </Box>
            
            <Box sx={{ mt: 3 }}>
              <Button 
                variant="contained" 
                size="large"
                onClick={viewEvent}
              >
                View Event Page
              </Button>
            </Box>
          </Paper>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <Layout title="Payment & Privacy">
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        
        {getStepContent()}
        
        {activeStep < 3 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              disabled={activeStep === 0 || processing}
              onClick={handleBack}
              variant="outlined"
            >
              Back
            </Button>
            
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={processing}
            >
              {processing ? (
                <>
                  <CircularProgress size={24} sx={{ mr: 1 }} />
                  Processing...
                </>
              ) : activeStep === 2 ? 'Complete Payment' : 'Continue'}
            </Button>
          </Box>
        )}
        
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

export default PaymentPage; 