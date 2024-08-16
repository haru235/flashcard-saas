"use client"
import React from 'react';
import { db } from "@/firebase"
import { useUser } from "@clerk/nextjs"
import { 
  Box, Button, Card, CardActionArea, CardContent, Container, Grid, 
  Typography, CircularProgress, ThemeProvider, createTheme, CssBaseline 
} from "@mui/material"
import { collection, doc, getDoc, setDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Add as AddIcon } from '@mui/icons-material';

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
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
          transition: '0.3s',
          '&:hover': { transform: 'scale(1.05)' },
        },
      },
    },
  },
});

export default function FlashcardSets() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcardSets, setFlashcardSets] = useState([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    const handleNewSetClick = (id) => {
        router.push('/generate')
    }

    const handleCardClick = (id) => {
        router.push(`/flashcard-set?id=${id}`)
    }

    useEffect(() => {
        async function getFlashcards() {
            if (!user) return
            setLoading(true)
            try {
                const docRef = doc(collection(db, 'users'), user.id)
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()) {
                    const userData = docSnap.data()
                    const sets = userData.flashcardSets || []
                    setFlashcardSets(sets)
                } else {
                    await setDoc(docRef, { flashcardSets: [] })
                }
            } catch (error) {
                console.error("Error fetching flashcard sets:", error)
                // You might want to show an error message to the user here
            } finally {
                setLoading(false)
            }
        }
        if (isLoaded && isSignedIn) {
            getFlashcards()
        }
    }, [isLoaded, isSignedIn, user])

    if (!isLoaded || !isSignedIn) {
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Container maxWidth="md">
                    <Typography variant="h4" sx={{ mt: 4, textAlign: 'center' }}>
                        Please sign in to view your flashcard sets.
                    </Typography>
                </Container>
            </ThemeProvider>
        )
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="lg">
                <Box sx={{ 
                    textAlign: 'center', 
                    py: 8, 
                    px: 2,
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)',
                    mb: 6
                }}>
                    <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'white' }}>
                        Your Flashcard Sets
                    </Typography>
                    <Typography variant="h5" sx={{ mb: 4, color: 'rgba(255, 255, 255, 0.8)' }}>
                        Manage and study your personalized flashcard collections
                    </Typography>
                    <Button 
                        variant="contained" 
                        color="secondary" 
                        size="large" 
                        startIcon={<AddIcon />}
                        onClick={handleNewSetClick}
                        sx={{ px: 4, py: 1.5 }}
                    >
                        Create New Set
                    </Button>
                </Box>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : flashcardSets.length === 0 ? (
                    <Typography variant="h5" sx={{ textAlign: 'center', mt: 4 }}>
                        You don't have any flashcard sets yet. Create one to get started!
                    </Typography>
                ) : (
                    <Grid container spacing={4}>
                        {flashcardSets.map((set, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card raised>
                                    <CardActionArea onClick={() => handleCardClick(set.name)}>
                                        <CardContent sx={{ minHeight: 150, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                            <Typography variant="h5" component="div" gutterBottom>
                                                {set.name}
                                            </Typography>
                                            <Typography variant="body1" component="div" gutterBottom>
                                                {set.description ? `${set.description}` : `Study ${set.name}`}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {set.size ? `${set.size} cards` : 'No cards yet'}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </ThemeProvider>
    )
}