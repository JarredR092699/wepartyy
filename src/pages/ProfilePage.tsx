import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Avatar,
  Paper,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Rating,
  Chip,
  Stack,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Switch,
  FormControlLabel,
  Slider,
  Grid,
  IconButton
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Event as EventIcon,
  Star as StarIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  LocationOn as LocationIcon,
  Add as AddIcon,
  Edit as EditIcon,
  PhotoCamera as PhotoCameraIcon,
  VerifiedUser as VerifiedIcon,
  Favorite as FavoriteIcon
} from '@mui/icons-material';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, logout, updateUserProfile, isVendor } = useAuth();
  
  const [maxTravelDistance, setMaxTravelDistance] = useState<number>(
    currentUser?.maxTravelDistance || 30
  );
  const [travelDistanceDialogOpen, setTravelDistanceDialogOpen] = useState(false);
  
  const [editProfileDialogOpen, setEditProfileDialogOpen] = useState(false);
  const [profileFormData, setProfileFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: currentUser?.location?.address || '',
    avatar: currentUser?.avatar || ''
  });
  const [profileFormErrors, setProfileFormErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  }>({});
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const handleOpenTravelDistanceDialog = () => {
    setTravelDistanceDialogOpen(true);
    setMaxTravelDistance(currentUser?.maxTravelDistance || 30);
  };
  
  const handleCloseTravelDistanceDialog = () => {
    setTravelDistanceDialogOpen(false);
  };
  
  const handleSaveTravelDistance = () => {
    updateUserProfile({
      maxTravelDistance
    });
    
    setTravelDistanceDialogOpen(false);
  };
  
  const handleOpenEditProfileDialog = () => {
    setProfileFormData({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      address: currentUser?.location?.address || '',
      avatar: currentUser?.avatar || ''
    });
    setProfileFormErrors({});
    setEditProfileDialogOpen(true);
  };
  
  const handleCloseEditProfileDialog = () => {
    setEditProfileDialogOpen(false);
  };
  
  const handleProfileFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (profileFormErrors[name as keyof typeof profileFormErrors]) {
      setProfileFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  const validateProfileForm = () => {
    const errors: {
      name?: string;
      email?: string;
      phone?: string;
      address?: string;
    } = {};
    
    if (!profileFormData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!profileFormData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileFormData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (profileFormData.phone && !/^\+?[0-9\s\-()]+$/.test(profileFormData.phone)) {
      errors.phone = 'Phone number is invalid';
    }
    
    setProfileFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSaveProfile = () => {
    if (!validateProfileForm()) {
      return;
    }
    
    const updatedProfile: Partial<typeof currentUser> = {
      name: profileFormData.name,
      email: profileFormData.email,
      phone: profileFormData.phone || undefined,
      avatar: profileFormData.avatar || undefined
    };
    
    if (profileFormData.address) {
      updatedProfile.location = {
        address: profileFormData.address,
        coordinates: currentUser?.location?.coordinates || {
          lat: 27.9506,
          lng: -82.4572
        }
      };
    }
    
    updateUserProfile(updatedProfile);
    setEditProfileDialogOpen(false);
  };
  
  if (!currentUser) {
    return null;
  }
  
  return (
    <Layout title="Profile" hideSearch>
      <Container maxWidth="sm">
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            mb: 3, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            borderRadius: 2,
            bgcolor: 'background.paper'
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={currentUser.avatar}
              alt={currentUser.name}
              sx={{
                width: 100,
                height: 100,
                mb: 2,
                border: 3,
                borderColor: 'primary.main'
              }}
            >
              {currentUser.name.charAt(0)}
            </Avatar>
            <IconButton 
              size="small" 
              sx={{ 
                position: 'absolute', 
                bottom: 10, 
                right: -10, 
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                }
              }}
              onClick={handleOpenEditProfileDialog}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Box>
          
          <Typography variant="h5" component="h1" gutterBottom fontWeight="bold">
            {currentUser.name}
          </Typography>
          
          {currentUser.rating && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Rating value={currentUser.rating} precision={0.5} readOnly size="small" />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({currentUser.reviews || 0} reviews)
              </Typography>
            </Box>
          )}
          
          {currentUser.badges && currentUser.badges.length > 0 && (
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              {currentUser.badges.map((badge, index) => (
                <Chip 
                  key={index} 
                  label={badge} 
                  color={index === 0 ? 'primary' : 'default'} 
                  size="small" 
                  variant={index === 0 ? 'filled' : 'outlined'}
                />
              ))}
            </Stack>
          )}
          
          {isVendor && (
            <Chip 
              label={`${currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}`} 
              color="secondary" 
              sx={{ mb: 2 }}
            />
          )}
          
          {!isVendor && currentUser.eventsCreated !== undefined && (
            <Box sx={{ display: 'flex', gap: 2, width: '100%', justifyContent: 'center' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="primary.main">
                  {currentUser.eventsCreated}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Events Created
                </Typography>
              </Box>
              
              <Divider orientation="vertical" flexItem />
              
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="primary.main">
                  {currentUser.eventsAttended || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Events Attended
                </Typography>
              </Box>
            </Box>
          )}
        </Paper>
        
        <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6">
              Contact Information
            </Typography>
            <IconButton 
              size="small" 
              color="primary"
              onClick={handleOpenEditProfileDialog}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Box>
          
          <List disablePadding>
            <ListItem disableGutters>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <EmailIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={currentUser.email} />
            </ListItem>
            
            {currentUser.phone && (
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <PhoneIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary={currentUser.phone} />
              </ListItem>
            )}
            
            {currentUser.location && (
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <LocationIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary={currentUser.location.address} />
              </ListItem>
            )}
          </List>
        </Paper>
        
        {isVendor && (
          <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Travel Distance
            </Typography>
            
            <Alert severity="info" sx={{ mb: 2 }}>
              Set the maximum distance you're willing to travel from your location to a venue.
            </Alert>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1">
                Maximum travel distance: <strong>{currentUser.maxTravelDistance || 30} km</strong>
              </Typography>
              
              <Button 
                variant="outlined" 
                size="small"
                onClick={handleOpenTravelDistanceDialog}
              >
                Change
              </Button>
            </Box>
          </Paper>
        )}
        
        <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Account Settings
          </Typography>
          
          <List disablePadding>
            <ListItemButton 
              disableGutters 
              onClick={handleOpenEditProfileDialog}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Edit Profile" />
            </ListItemButton>
            
            <ListItemButton 
              disableGutters 
              onClick={() => isVendor ? navigate('/manage-services') : console.log('Manage events clicked')}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <EventIcon />
              </ListItemIcon>
              <ListItemText primary={isVendor ? "Manage Services" : "Manage Events"} />
            </ListItemButton>
            
            {!isVendor && (
              <ListItemButton 
                disableGutters 
                onClick={() => navigate('/favorites')}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <FavoriteIcon />
                </ListItemIcon>
                <ListItemText primary="My Favorites" />
              </ListItemButton>
            )}
            
            {isVendor && (
              <ListItemButton 
                disableGutters 
                onClick={() => navigate('/service-dashboard')}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <EventIcon />
                </ListItemIcon>
                <ListItemText primary="Service Provider Dashboard" />
              </ListItemButton>
            )}
            
            {isVendor && (
              <ListItemButton 
                disableGutters 
                onClick={() => navigate('/vendor-verification')}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <VerifiedIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Vendor Verification" 
                  secondary={
                    currentUser?.verificationStatus === 'verified' 
                      ? 'Verified' 
                      : currentUser?.verificationStatus === 'pending' 
                        ? 'Pending Review' 
                        : 'Not Verified'
                  }
                />
              </ListItemButton>
            )}
            
            {currentUser.reviews && currentUser.reviews > 0 && (
              <ListItemButton 
                disableGutters 
                onClick={() => console.log('View reviews clicked')}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <StarIcon />
                </ListItemIcon>
                <ListItemText primary="View Reviews" />
              </ListItemButton>
            )}
            
            <ListItemButton 
              disableGutters 
              onClick={() => console.log('Settings clicked')}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </List>
        </Paper>
        
        <Button 
          variant="outlined" 
          color="error" 
          fullWidth 
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{ mb: 4 }}
        >
          Logout
        </Button>
        
        <Dialog open={travelDistanceDialogOpen} onClose={handleCloseTravelDistanceDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Set Maximum Travel Distance</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" paragraph>
              Set the maximum distance you're willing to travel from your location to a venue. This helps match you with events that are within your preferred travel range.
            </Typography>
            
            <Box sx={{ px: 2, py: 4 }}>
              <Typography id="travel-distance-slider" gutterBottom>
                Maximum Travel Distance: {maxTravelDistance} km
              </Typography>
              <Slider
                value={maxTravelDistance}
                onChange={(_, newValue) => setMaxTravelDistance(newValue as number)}
                aria-labelledby="travel-distance-slider"
                valueLabelDisplay="auto"
                step={5}
                marks
                min={5}
                max={100}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="caption" color="text.secondary">5 km</Typography>
                <Typography variant="caption" color="text.secondary">100 km</Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseTravelDistanceDialog}>Cancel</Button>
            <Button onClick={handleSaveTravelDistance} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>
        
        <Dialog open={editProfileDialogOpen} onClose={handleCloseEditProfileDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" paragraph sx={{ mt: 1 }}>
              Update your profile information below.
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Box sx={{ position: 'relative' }}>
                  <Avatar
                    src={profileFormData.avatar}
                    alt={profileFormData.name}
                    sx={{
                      width: 80,
                      height: 80,
                      border: 2,
                      borderColor: 'primary.main'
                    }}
                  >
                    {profileFormData.name.charAt(0)}
                  </Avatar>
                  <IconButton 
                    size="small" 
                    sx={{ 
                      position: 'absolute', 
                      bottom: 0, 
                      right: -8, 
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      }
                    }}
                    onClick={() => console.log('Change avatar clicked')}
                  >
                    <PhotoCameraIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={profileFormData.name}
                  onChange={handleProfileFormChange}
                  error={!!profileFormErrors.name}
                  helperText={profileFormErrors.name}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={profileFormData.email}
                  onChange={handleProfileFormChange}
                  error={!!profileFormErrors.email}
                  helperText={profileFormErrors.email}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={profileFormData.phone}
                  onChange={handleProfileFormChange}
                  error={!!profileFormErrors.phone}
                  helperText={profileFormErrors.phone}
                  placeholder="+1 (555) 123-4567"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Location"
                  name="address"
                  value={profileFormData.address}
                  onChange={handleProfileFormChange}
                  error={!!profileFormErrors.address}
                  helperText={profileFormErrors.address}
                  placeholder="City, State"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditProfileDialog}>Cancel</Button>
            <Button onClick={handleSaveProfile} variant="contained">Save Changes</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default ProfilePage; 