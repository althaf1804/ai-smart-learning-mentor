// src/theme.js
import { createTheme } from '@mui/material/styles';

// Central gradient tokens — reused across Login, Sidebar, Navbar, cards, etc.
// so the whole app shares one consistent "deep blue → purple" identity.
export const gradients = {
  primary: 'linear-gradient(135deg, #1E1B6E 0%, #4C2FD9 45%, #9333EA 100%)',
  primarySoft: 'linear-gradient(135deg, rgba(76,47,217,0.12) 0%, rgba(147,51,234,0.12) 100%)',
  accent: 'linear-gradient(135deg, #4C2FD9 0%, #C026D3 100%)',
  page: 'radial-gradient(circle at 0% 0%, rgba(76,47,217,0.06) 0%, rgba(0,0,0,0) 45%), radial-gradient(circle at 100% 100%, rgba(192,38,211,0.06) 0%, rgba(0,0,0,0) 45%)',
  text: 'linear-gradient(135deg, #4C2FD9 0%, #C026D3 100%)',
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4C2FD9',
      light: '#7B5CF0',
      dark: '#2E1B99',
      contrastText: '#fff',
    },
    secondary: {
      main: '#C026D3',
      light: '#E066EA',
      dark: '#8B1AA0',
      contrastText: '#fff',
    },
    success: {
      main: '#22C55E',
    },
    warning: {
      main: '#F59E0B',
    },
    error: {
      main: '#EF4444',
    },
    background: {
      default: '#F7F6FC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#181828',
      secondary: '#6B6B85',
    },
  },
  typography: {
    fontFamily: '"Inter", "Poppins", "Roboto", sans-serif',
    h1: { fontFamily: '"Poppins", sans-serif', fontWeight: 700 },
    h2: { fontFamily: '"Poppins", sans-serif', fontWeight: 700 },
    h3: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
    h4: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
    h5: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 20px rgba(46, 27, 153, 0.08)',
          border: '1px solid rgba(76, 47, 217, 0.07)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          paddingTop: 8,
          paddingBottom: 8,
        },
        containedPrimary: {
          backgroundImage: gradients.primary,
          boxShadow: '0 4px 14px rgba(76, 47, 217, 0.35)',
          '&:hover': {
            backgroundImage: gradients.primary,
            filter: 'brightness(1.08)',
            boxShadow: '0 6px 18px rgba(76, 47, 217, 0.45)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;
