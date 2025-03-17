import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Grid,
  Alert,
  AlertTitle,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material';
import {
  VerifiedUser as VerifiedIcon,
  Upload as UploadIcon,
  Description as DocumentIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Business as BusinessIcon,
  Badge as BadgeIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';

const VendorVerificationPage: React.FC = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<{
    businessLicense: File | null;
    identityProof: File | null;
    insuranceCertificate: File | null;
    otherDocuments: File[];
  }>({
    businessLicense: null,
    identityProof: null,
    insuranceCertificate: null,
    otherDocuments: []
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Check if user is a vendor (dj, venue, or caterer)
  const isVendor = currentUser && ['dj', 'venue', 'caterer'].includes(currentUser.role);
  
  // Get verification status
  const verificationStatus = currentUser?.verificationStatus || 'unverified';
  
  const steps = ['Upload Documents', 'Review Information', 'Submit Application'];
  
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, fileType: string) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      
      if (fileType === 'otherDocuments') {
        setUploadedFiles(prev => ({
          ...prev,
          otherDocuments: [...prev.otherDocuments, file]
        }));
      } else {
        setUploadedFiles(prev => ({
          ...prev,
          [fileType]: file
        }));
      }
    }
  };
  
  const handleRemoveFile = (fileType: string, index?: number) => {
    if (fileType === 'otherDocuments' && typeof index === 'number') {
      setUploadedFiles(prev => ({
        ...prev,
        otherDocuments: prev.otherDocuments.filter((_, i) => i !== index)
      }));
    } else {
      setUploadedFiles(prev => ({
        ...prev,
        [fileType]: null
      }));
    }
  };
  
  const handleSubmit = () => {
    setSubmitting(true);
    setError('');
    
    // In a real app, this would upload the files to a server
    // and update the user's verification status
    
    setTimeout(() => {
      // Mock successful submission
      updateUserProfile({
        verificationStatus: 'pending',
        verificationDate: new Date().toISOString(),
        verificationDocuments: {
          businessLicense: uploadedFiles.businessLicense ? 'uploaded' : undefined,
          identityProof: uploadedFiles.identityProof ? 'uploaded' : undefined,
          insuranceCertificate: uploadedFiles.insuranceCertificate ? 'uploaded' : undefined,
          otherDocuments: uploadedFiles.otherDocuments.length > 0 ? ['uploaded'] : undefined
        }
      });
      
      setSuccess('Your verification application has been submitted successfully. We will review your documents and update your status within 2-3 business days.');
      setSubmitting(false);
    }, 1500);
  };
  
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Upload Required Documents
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Please upload the following documents to verify your business. All documents must be in PDF, JPG, or PNG format.
            </Typography>
            
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    <BusinessIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Business License
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    A valid business license or registration certificate.
                  </Typography>
                  
                  {uploadedFiles.businessLicense ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <DocumentIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body2" sx={{ flexGrow: 1 }}>
                        {uploadedFiles.businessLicense.name}
                      </Typography>
                      <Button 
                        size="small" 
                        color="error" 
                        onClick={() => handleRemoveFile('businessLicense')}
                      >
                        Remove
                      </Button>
                    </Box>
                  ) : (
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<UploadIcon />}
                      fullWidth
                    >
                      Upload Business License
                      <input
                        type="file"
                        hidden
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(e, 'businessLicense')}
                      />
                    </Button>
                  )}
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    <BadgeIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Identity Proof
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    A government-issued ID (passport, driver's license, etc.).
                  </Typography>
                  
                  {uploadedFiles.identityProof ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <DocumentIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body2" sx={{ flexGrow: 1 }}>
                        {uploadedFiles.identityProof.name}
                      </Typography>
                      <Button 
                        size="small" 
                        color="error" 
                        onClick={() => handleRemoveFile('identityProof')}
                      >
                        Remove
                      </Button>
                    </Box>
                  ) : (
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<UploadIcon />}
                      fullWidth
                    >
                      Upload Identity Proof
                      <input
                        type="file"
                        hidden
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(e, 'identityProof')}
                      />
                    </Button>
                  )}
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    <SecurityIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Insurance Certificate
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Proof of liability insurance (recommended but optional).
                  </Typography>
                  
                  {uploadedFiles.insuranceCertificate ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <DocumentIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body2" sx={{ flexGrow: 1 }}>
                        {uploadedFiles.insuranceCertificate.name}
                      </Typography>
                      <Button 
                        size="small" 
                        color="error" 
                        onClick={() => handleRemoveFile('insuranceCertificate')}
                      >
                        Remove
                      </Button>
                    </Box>
                  ) : (
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<UploadIcon />}
                      fullWidth
                    >
                      Upload Insurance Certificate
                      <input
                        type="file"
                        hidden
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(e, 'insuranceCertificate')}
                      />
                    </Button>
                  )}
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Additional Documents (Optional)
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Any other documents that may help verify your business (certifications, awards, etc.).
                  </Typography>
                  
                  {uploadedFiles.otherDocuments.map((file, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <DocumentIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body2" sx={{ flexGrow: 1 }}>
                        {file.name}
                      </Typography>
                      <Button 
                        size="small" 
                        color="error" 
                        onClick={() => handleRemoveFile('otherDocuments', index)}
                      >
                        Remove
                      </Button>
                    </Box>
                  ))}
                  
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<UploadIcon />}
                    fullWidth
                    sx={{ mt: uploadedFiles.otherDocuments.length > 0 ? 2 : 0 }}
                  >
                    Upload Additional Document
                    <input
                      type="file"
                      hidden
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload(e, 'otherDocuments')}
                    />
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Your Information
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Please review the information below before submitting your verification application.
            </Typography>
            
            <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Business Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Business Name
                  </Typography>
                  <Typography variant="body1">
                    {currentUser?.name}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Business Type
                  </Typography>
                  <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                    {currentUser?.role}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">
                    {currentUser?.email}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Phone
                  </Typography>
                  <Typography variant="body1">
                    {currentUser?.phone || 'Not provided'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Address
                  </Typography>
                  <Typography variant="body1">
                    {currentUser?.location?.address || 'Not provided'}
                  </Typography>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                Uploaded Documents
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    {uploadedFiles.businessLicense ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <CancelIcon color="error" />
                    )}
                  </ListItemIcon>
                  <ListItemText 
                    primary="Business License" 
                    secondary={uploadedFiles.businessLicense ? uploadedFiles.businessLicense.name : 'Not uploaded'} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    {uploadedFiles.identityProof ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <CancelIcon color="error" />
                    )}
                  </ListItemIcon>
                  <ListItemText 
                    primary="Identity Proof" 
                    secondary={uploadedFiles.identityProof ? uploadedFiles.identityProof.name : 'Not uploaded'} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    {uploadedFiles.insuranceCertificate ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <CancelIcon color="warning" />
                    )}
                  </ListItemIcon>
                  <ListItemText 
                    primary="Insurance Certificate (Optional)" 
                    secondary={uploadedFiles.insuranceCertificate ? uploadedFiles.insuranceCertificate.name : 'Not uploaded'} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    {uploadedFiles.otherDocuments.length > 0 ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <CancelIcon color="warning" />
                    )}
                  </ListItemIcon>
                  <ListItemText 
                    primary="Additional Documents (Optional)" 
                    secondary={uploadedFiles.otherDocuments.length > 0 
                      ? `${uploadedFiles.otherDocuments.length} document(s) uploaded` 
                      : 'No additional documents uploaded'} 
                  />
                </ListItem>
              </List>
            </Paper>
            
            {(!uploadedFiles.businessLicense || !uploadedFiles.identityProof) && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                <AlertTitle>Missing Required Documents</AlertTitle>
                Please upload all required documents before proceeding.
              </Alert>
            )}
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Submit Verification Application
            </Typography>
            <Typography variant="body2" paragraph>
              By submitting this application, you confirm that all the information provided is accurate and the documents are authentic.
            </Typography>
            
            <Alert severity="info" sx={{ mb: 3 }}>
              <AlertTitle>Verification Process</AlertTitle>
              <Typography variant="body2">
                Our team will review your application within 2-3 business days. Once verified, your profile will display a verification badge, increasing trust with potential clients.
              </Typography>
            </Alert>
            
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {success}
              </Alert>
            )}
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };
  
  const renderVerificationStatus = () => {
    switch (verificationStatus) {
      case 'verified':
        return (
          <Alert severity="success" icon={<VerifiedIcon />} sx={{ mb: 3 }}>
            <AlertTitle>Verified Vendor</AlertTitle>
            Your business has been verified. A verification badge is now displayed on your profile.
          </Alert>
        );
      case 'pending':
        return (
          <Alert severity="info" icon={<PendingIcon />} sx={{ mb: 3 }}>
            <AlertTitle>Verification In Progress</AlertTitle>
            Your verification application is currently being reviewed. This process typically takes 2-3 business days.
          </Alert>
        );
      case 'rejected':
        return (
          <Alert severity="error" sx={{ mb: 3 }}>
            <AlertTitle>Verification Rejected</AlertTitle>
            Your verification application was not approved. Please check your email for details on why it was rejected and how to reapply.
          </Alert>
        );
      default:
        return (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <AlertTitle>Not Verified</AlertTitle>
            Your business is not verified. Complete the verification process to build trust with potential clients.
          </Alert>
        );
    }
  };
  
  // If user is not a vendor, show a message
  if (!isVendor) {
    return (
      <Layout>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Typography variant="h4" gutterBottom>
            Vendor Verification
          </Typography>
          <Alert severity="info">
            <AlertTitle>Not Available</AlertTitle>
            Vendor verification is only available for venue owners, DJs, and caterers.
          </Alert>
        </Container>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <VerifiedIcon color="primary" sx={{ fontSize: 32, mr: 2 }} />
          <Typography variant="h4">
            Vendor Verification
          </Typography>
        </Box>
        
        {renderVerificationStatus()}
        
        {verificationStatus === 'unverified' || verificationStatus === 'rejected' ? (
          <>
            <Paper sx={{ p: 3, mb: 4 }}>
              <Box sx={{ mb: 3 }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>
              
              {getStepContent(activeStep)}
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mr: 1 }}>
                    Back
                  </Button>
                )}
                
                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={
                      submitting || 
                      !uploadedFiles.businessLicense || 
                      !uploadedFiles.identityProof ||
                      !!success
                    }
                  >
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    disabled={
                      (activeStep === 0 && (!uploadedFiles.businessLicense || !uploadedFiles.identityProof)) ||
                      (activeStep === 1 && (!uploadedFiles.businessLicense || !uploadedFiles.identityProof))
                    }
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Paper>
            
            <Typography variant="h6" gutterBottom>
              Benefits of Verification
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Increased Trust
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Verified vendors appear more trustworthy to potential clients, leading to more bookings.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Better Visibility
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Verified vendors appear higher in search results and are highlighted with a verification badge.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Access to Premium Features
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Verified vendors get access to premium features and promotional opportunities.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        ) : verificationStatus === 'pending' ? (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Verification in Progress
            </Typography>
            <Typography variant="body2" paragraph>
              Your verification application is currently being reviewed. This process typically takes 2-3 business days.
            </Typography>
            <Typography variant="body2" paragraph>
              You will receive an email notification once your application has been reviewed.
            </Typography>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Submitted Documents:
              </Typography>
              <List>
                {currentUser?.verificationDocuments?.businessLicense && (
                  <ListItem>
                    <ListItemIcon>
                      <DocumentIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Business License" />
                  </ListItem>
                )}
                
                {currentUser?.verificationDocuments?.identityProof && (
                  <ListItem>
                    <ListItemIcon>
                      <DocumentIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Identity Proof" />
                  </ListItem>
                )}
                
                {currentUser?.verificationDocuments?.insuranceCertificate && (
                  <ListItem>
                    <ListItemIcon>
                      <DocumentIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Insurance Certificate" />
                  </ListItem>
                )}
                
                {currentUser?.verificationDocuments?.otherDocuments && currentUser.verificationDocuments.otherDocuments.length > 0 && (
                  <ListItem>
                    <ListItemIcon>
                      <DocumentIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Additional Documents" 
                      secondary={`${currentUser.verificationDocuments.otherDocuments.length} document(s)`} 
                    />
                  </ListItem>
                )}
              </List>
            </Box>
          </Paper>
        ) : (
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <VerifiedIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
              <Typography variant="h5">
                Verified Vendor
              </Typography>
            </Box>
            
            <Typography variant="body1" paragraph>
              Congratulations! Your business has been verified. A verification badge is now displayed on your profile, helping you build trust with potential clients.
            </Typography>
            
            <Typography variant="subtitle1" gutterBottom>
              Verification Details:
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Verification Date
                </Typography>
                <Typography variant="body1">
                  {currentUser?.verificationDate 
                    ? new Date(currentUser.verificationDate).toLocaleDateString() 
                    : 'Not available'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Chip 
                  icon={<VerifiedIcon />} 
                  label="Verified" 
                  color="primary" 
                  variant="outlined" 
                />
              </Grid>
            </Grid>
            
            <Typography variant="h6" gutterBottom>
              Benefits You Now Enjoy:
            </Typography>
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Verification Badge" 
                  secondary="Your profile now displays a verification badge, increasing trust with potential clients." 
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Improved Search Ranking" 
                  secondary="Your services now appear higher in search results." 
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Access to Premium Features" 
                  secondary="You now have access to premium features and promotional opportunities." 
                />
              </ListItem>
            </List>
          </Paper>
        )}
      </Container>
    </Layout>
  );
};

export default VendorVerificationPage; 