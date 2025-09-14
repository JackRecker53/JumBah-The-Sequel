import { createTheme } from '@mui/material/styles';

const sabahTheme = createTheme({
  palette: {
    primary: {
      main: '#1e3a8a', // Deep blue from Sabah flag
      light: '#60a5fa', // Light blue
      dark: '#1e40af',
    },
    secondary: {
      main: '#ef4444', // Red from Sabah flag
      light: '#f87171',
      dark: '#dc2626',
    },
    background: {
      default: '#f0f9ff', // Light blue background
      paper: '#ffffff',
    },
    success: {
      main: '#059669', // Forest green for nature
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      color: '#1e3a8a',
    },
    h2: {
      fontWeight: 600,
      color: '#1e40af',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(30, 58, 138, 0.1)',
          border: '1px solid rgba(96, 165, 250, 0.2)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

export default sabahTheme;