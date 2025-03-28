import React, { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  InputBase, 
  Paper, 
  BottomNavigation, 
  BottomNavigationAction,
  styled,
  alpha,
  Badge
} from '@mui/material';
import { 
  Home as HomeIcon, 
  Event as EventIcon, 
  Explore as ExploreIcon, 
  Person as PersonIcon,
  Search as SearchIcon,
  CalendarMonth as CalendarIcon,
  Message as MessageIcon,
  Settings as SettingsIcon,
  Celebration as CelebrationIcon,
  Favorite as FavoriteIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 50,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

interface LayoutProps {
  children: ReactNode;
  title?: string;
  hideSearch?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, title = 'WeParty', hideSearch = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, isVendor, isAuthenticated } = useAuth();
  
  // Get unread message count (mock for now)
  const unreadMessageCount = 2;
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            {title}
          </Typography>
          
          {!hideSearch && (
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search DJ, venue, catering..."
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
          )}
        </Toolbar>
      </AppBar>
      
      <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
        {children}
      </Box>
      
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        {isAuthenticated && isVendor ? (
          // Service Provider Navigation
          <BottomNavigation
            showLabels
            value={
              location.pathname === '/' || location.pathname === '/my-events' ? 0 :
              location.pathname === '/manage-services' ? 1 :
              location.pathname === '/messages' ? 2 :
              location.pathname === '/profile' ? 3 : 0
            }
          >
            <BottomNavigationAction 
              label="My Events" 
              icon={<EventIcon />} 
              onClick={() => navigate('/my-events')}
            />
            <BottomNavigationAction 
              label="Services" 
              icon={<EventIcon />} 
              onClick={() => navigate('/manage-services')}
            />
            <BottomNavigationAction 
              label="Messages" 
              icon={
                <Badge badgeContent={unreadMessageCount} color="error">
                  <MessageIcon />
                </Badge>
              } 
              onClick={() => navigate('/messages')}
            />
            <BottomNavigationAction 
              label="Profile" 
              icon={<PersonIcon />} 
              onClick={() => navigate('/profile')}
            />
          </BottomNavigation>
        ) : (
          // Client Navigation
          <BottomNavigation
            showLabels
            value={
              location.pathname === '/' ? 0 :
              location.pathname === '/my-events' ? 1 :
              location.pathname === '/favorites' ? 2 :
              location.pathname === '/messages' ? 3 :
              location.pathname === '/profile' ? 4 : 0
            }
          >
            <BottomNavigationAction 
              label="Home" 
              icon={<HomeIcon />} 
              onClick={() => navigate('/')}
            />
            <BottomNavigationAction 
              label="My Events" 
              icon={<EventIcon />} 
              onClick={() => navigate('/my-events')}
            />
            <BottomNavigationAction 
              label="Favorites" 
              icon={<FavoriteIcon />} 
              onClick={() => navigate('/favorites')}
            />
            <BottomNavigationAction 
              label="Messages" 
              icon={
                <Badge badgeContent={unreadMessageCount} color="error">
                  <MessageIcon />
                </Badge>
              }
              onClick={() => navigate('/messages')}
            />
            <BottomNavigationAction 
              label="Profile" 
              icon={<PersonIcon />} 
              onClick={() => navigate('/profile')}
            />
          </BottomNavigation>
        )}
      </Paper>
      
      {/* Add padding at the bottom to account for the fixed bottom navigation */}
      <Box sx={{ height: 56 }} />
    </Box>
  );
};

export default Layout; 