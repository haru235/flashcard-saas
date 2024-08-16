"use client"
import React from 'react';
import { Container, Box, Typography, AppBar, Toolbar, Button, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import {  SignUp } from '@clerk/nextjs';
import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

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

export default function SignInPage() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth={false} disableGutters>
        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1, fontWeight: 'bold' }}>
              Flashcard SaaS
            </Typography>
            <SignedOut>
              <Button color="inherit" component={Link} href="/sign-in" sx={{ mr: 1 }}>Login</Button>
              <Button color="secondary" variant="outlined" component={Link} href="/sign-up">Sign Up</Button>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Toolbar>
        </AppBar>
        <Box sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "calc(100vh - 64px)", // Subtracting AppBar height
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)',
          padding: 4,
        }}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ color: 'white', fontWeight: 'bold', mb: 4 }}>
            Sign Up
          </Typography>
          <Box sx={{ 
            backgroundColor: 'background.paper', 
            padding: 4, 
            borderRadius: 2,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}>
            <SignUp />
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}