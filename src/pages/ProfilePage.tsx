import React from 'react';
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
  Stack
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Event as EventIcon,
  Star as StarIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';
import Layout from '../components/Layout';

const ProfilePage: React.FC = () => {
  // Mock user data - in a real app, this would come from authentication
  const user = {
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 123-4567',
    avatar: '/avatars/alex.jpg',
    eventsCreated: 12,
    eventsAttended: 28,
    rating: 4.8,
    reviews: 15,
    badges: ['Top Organizer', 'Party Pro', 'Verified User']
  };
  
  return (
    <Layout title="Profile" hideSearch>
      <Container maxWidth="sm">
        {/* Profile Header */}
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
          <Avatar
            src={user.avatar}
            alt={user.name}
            sx={{
              width: 100,
              height: 100,
              mb: 2,
              border: 3,
              borderColor: 'primary.main'
            }}
          >
            {user.name.charAt(0)}
          </Avatar>
          
          <Typography variant="h5" component="h1" gutterBottom fontWeight="bold">
            {user.name}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating value={user.rating} precision={0.5} readOnly size="small" />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({user.reviews} reviews)
            </Typography>
          </Box>
          
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            {user.badges.map((badge, index) => (
              <Chip 
                key={index} 
                label={badge} 
                color={index === 0 ? 'primary' : 'default'} 
                size="small" 
                variant={index === 0 ? 'filled' : 'outlined'}
              />
            ))}
          </Stack>
          
          <Box sx={{ display: 'flex', gap: 2, width: '100%', justifyContent: 'center' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="primary.main">
                {user.eventsCreated}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Events Created
              </Typography>
            </Box>
            
            <Divider orientation="vertical" flexItem />
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="primary.main">
                {user.eventsAttended}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Events Attended
              </Typography>
            </Box>
          </Box>
        </Paper>
        
        {/* Contact Information */}
        <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Contact Information
          </Typography>
          
          <List disablePadding>
            <ListItem disableGutters>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <EmailIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={user.email} />
            </ListItem>
            
            <ListItem disableGutters>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <PhoneIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={user.phone} />
            </ListItem>
          </List>
        </Paper>
        
        {/* Account Settings */}
        <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Account Settings
          </Typography>
          
          <List disablePadding>
            <ListItemButton 
              disableGutters 
              onClick={() => console.log('Edit profile clicked')}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Edit Profile" />
            </ListItemButton>
            
            <ListItemButton 
              disableGutters 
              onClick={() => console.log('Manage events clicked')}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <EventIcon />
              </ListItemIcon>
              <ListItemText primary="Manage Events" />
            </ListItemButton>
            
            <ListItemButton 
              disableGutters 
              onClick={() => console.log('View reviews clicked')}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <StarIcon />
              </ListItemIcon>
              <ListItemText primary="View Reviews" />
            </ListItemButton>
            
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
        
        {/* Logout Button */}
        <Button 
          variant="outlined" 
          color="error" 
          fullWidth 
          startIcon={<LogoutIcon />}
          onClick={() => console.log('Logout clicked')}
          sx={{ mb: 4 }}
        >
          Logout
        </Button>
      </Container>
    </Layout>
  );
};

export default ProfilePage; 