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
  alpha
} from '@mui/material';
import { 
  Home as HomeIcon, 
  Event as EventIcon, 
  Explore as ExploreIcon, 
  Person as PersonIcon,
  Search as SearchIcon
} from '@mui/icons-material';

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
        <BottomNavigation
          showLabels
          value={
            location.pathname === '/' ? 0 :
            location.pathname === '/my-events' ? 1 :
            location.pathname === '/explore' ? 2 :
            location.pathname === '/profile' ? 3 : 0
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
            label="Explore" 
            icon={<ExploreIcon />} 
            onClick={() => navigate('/explore')}
          />
          <BottomNavigationAction 
            label="Profile" 
            icon={<PersonIcon />} 
            onClick={() => navigate('/profile')}
          />
        </BottomNavigation>
      </Paper>
      
      {/* Add padding at the bottom to account for the fixed bottom navigation */}
      <Box sx={{ height: 56 }} />
    </Box>
  );
};

export default Layout; 