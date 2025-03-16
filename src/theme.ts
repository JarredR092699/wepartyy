import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#5E60CE', // Vibrant purple - modern and trendy
      light: '#7B78E5',
      dark: '#4C4BA6',
    },
    secondary: {
      main: '#FF5C8D', // Bright pink - energetic and fun
      light: '#FF7EA6',
      dark: '#E54F7B',
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '0.875rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12, // Rounded corners are trendy
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 50, // Pill-shaped buttons
          padding: '10px 20px',
          boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)',
        },
        contained: {
          '&:hover': {
            boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
          borderRadius: 16,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

export default theme; 