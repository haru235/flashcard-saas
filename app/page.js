"use client"
import React from 'react';
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { AppBar, Box, Button, Container, Grid, Toolbar, Typography, Paper, ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import getStripe from "./utils/get-stripe";
import Head from "next/head";
import { School, SmartToy, Devices } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#BB86FC',
    },
    secondary: {
      main: '#03DAC6',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 28,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
        },
      },
    },
  },
});

export default function Home() {
  const handleSubmit = async (type) => {
    if (type == 'free') {
      handleGetStarted()
      return
    }
    try {
      const checkoutSession = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'type': type,
        },
      })
      const checkoutSessionJson = await checkoutSession.json()

      const stripe = await getStripe()
      const { error } = await stripe.redirectToCheckout({
        sessionId: checkoutSessionJson.id,
      });

      if (error) {
        console.warn('Error redirecting to checkout:', error.message);
      }
    } catch (error) {
      console.error('Error handling checkout session:', error);
    }
  }

  const { isSignedIn } = useUser();
  const router = useRouter();

  const handleGetStarted = () => {
    if (isSignedIn) {
      router.push('/flashcard-sets');
    } else {
      router.push('/sign-in');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth={false} disableGutters>
        <Head>
          <title>Flashcard SaaS</title>
          <meta name="description" content="Create flashcards from your text." />
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet" />
        </Head>
        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1, fontWeight: 'bold' }}>
              Flashcard SaaS
            </Typography>
            <SignedOut>
              <Button color="inherit" href="/sign-in" sx={{ mr: 1 }}>Login</Button>
              <Button color="secondary" variant="outlined" href="/sign-up">Sign Up</Button>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Toolbar>
        </AppBar>

        <Box sx={{
          textAlign: 'center',
          py: 12,
          px: 2,
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)',
        }}>
          <Typography variant="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'white' }}>
            Welcome to Flashcard SaaS
          </Typography>
          <Typography variant="h4" gutterBottom sx={{ mb: 4, color: 'rgba(255, 255, 255, 0.8)' }}>
            The easiest way to create flashcards from your text.
          </Typography>
          <Button variant="contained" color="secondary" size="large" sx={{ mr: 2, px: 4, py: 1.5 }} onClick={handleGetStarted}>
            Get Started
          </Button>
          <Button variant="outlined" color="inherit" size="large" sx={{ px: 4, py: 1.5 }}>
            Learn More
          </Button>
        </Box>

        <Container>
          <Box sx={{ my: 12, textAlign: 'center' }}>
            <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 6 }}>Features</Typography>
            <Grid container spacing={6}>
              <Grid item xs={12} md={4}>
                <Paper elevation={3} sx={{ p: 4, height: '100%', transition: '0.3s', '&:hover': { transform: 'translateY(-10px)' } }}>
                  <School fontSize="large" color="primary" sx={{ mb: 2, fontSize: 60 }} />
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>Easy Text Input</Typography>
                  <Typography>Simply input your text and let our software do the rest. Creating flashcards has never been easier.</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper elevation={3} sx={{ p: 4, height: '100%', transition: '0.3s', '&:hover': { transform: 'translateY(-10px)' } }}>
                  <SmartToy fontSize="large" color="primary" sx={{ mb: 2, fontSize: 60 }} />
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>Smart Flashcards</Typography>
                  <Typography>Our AI intelligently breaks down your text into concise flashcards, perfect for studying.</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper elevation={3} sx={{ p: 4, height: '100%', transition: '0.3s', '&:hover': { transform: 'translateY(-10px)' } }}>
                  <Devices fontSize="large" color="primary" sx={{ mb: 2, fontSize: 60 }} />
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>Accessible Anywhere</Typography>
                  <Typography>Access your flashcards from any device, at any time. Study on the go with ease.</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ my: 12, textAlign: 'center' }}>
            <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 6 }}>Pricing</Typography>
            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={12} md={4}>
                <Paper elevation={3} sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', transition: '0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
                  <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>Free</Typography>
                  <Typography variant="h3" gutterBottom color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>$0 / month</Typography>
                  <Typography sx={{ flexGrow: 1, mb: 3 }}>
                    • Create up to 50 flashcards<br />
                    • Basic study tools<br />
                    • Ad-supported
                  </Typography>
                  <Button variant="outlined" color="primary" onClick={() => handleSubmit('free')} size="large" sx={{ borderRadius: 28, py: 1.5 }}>Get Started</Button>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper elevation={3} sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', transition: '0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
                  <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>Basic</Typography>
                  <Typography variant="h3" gutterBottom color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>$5 / month</Typography>
                  <Typography sx={{ flexGrow: 1, mb: 3 }}>
                    • Unlimited flashcards<br />
                    • Advanced study tools<br />
                    • Ad-free experience
                  </Typography>
                  <Button variant="outlined" color="primary" onClick={() => handleSubmit('basic')} size="large" sx={{ borderRadius: 28, py: 1.5 }}>Choose Basic</Button>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper elevation={3} sx={{
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: 'primary.dark',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: '0.3s',
                  '&:hover': { transform: 'scale(1.05)' }
                }}>
                  <Box sx={{
                    position: 'absolute',
                    top: 20,
                    right: -35,
                    transform: 'rotate(45deg)',
                    backgroundColor: 'secondary.main',
                    color: 'background.paper',
                    padding: '5px 40px',
                  }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>BEST VALUE</Typography>
                  </Box>
                  <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>Pro</Typography>
                  <Typography variant="h3" gutterBottom color="secondary" sx={{ fontWeight: 'bold', mb: 2 }}>$10 / month</Typography>
                  <Typography sx={{ flexGrow: 1, mb: 3 }}>
                    • Unlimited flashcards<br />
                    • AI-powered study recommendations<br />
                    • Priority support<br />
                    • Early access to new features
                  </Typography>
                  <Button variant="contained" color="secondary" onClick={() => handleSubmit('pro')} size="large" sx={{ borderRadius: 28, py: 1.5 }}>Choose Pro</Button>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Container>
    </ThemeProvider>
  );
}