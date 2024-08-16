"use client"
import React, { useEffect, useState } from 'react';
import { useUser } from "@clerk/nextjs";
import { db } from "@/firebase";
import { collection, doc, getDoc } from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import { 
    Container, Grid, Card, CardActionArea, CardContent, Box, Typography, 
    CircularProgress, ThemeProvider, createTheme, CssBaseline, Button
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
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

export default function FlashcardSet() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [setName, setSetName] = useState("");

    const searchParams = useSearchParams();
    const setId = searchParams.get('id');
    const router = useRouter();

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    useEffect(() => {
        async function getFlashcards() {
            if (!setId || !user) return;
            setLoading(true);
            try {
                const docRef = doc(collection(doc(collection(db, 'users'), user.id), 'flashcardSets'), setId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setSetName(setId || "Unnamed Set");
                    setFlashcards(data.flashcards || []);
                } else {
                    setError("Flashcard set not found.");
                }
            } catch (err) {
                console.error("Error fetching flashcards:", err);
                setError("Failed to load flashcards. Please try again.");
            } finally {
                setLoading(false);
            }
        }
        if (isLoaded && isSignedIn) {
            getFlashcards();
        }
    }, [setId, user, isLoaded, isSignedIn]);

    if (!isLoaded || !isSignedIn) {
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Container maxWidth="md">
                    <Typography variant="h5" sx={{ mt: 4, textAlign: 'center' }}>
                        Please sign in to view your flashcards.
                    </Typography>
                </Container>
            </ThemeProvider>
        );
    }

    if (loading) {
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Container maxWidth="md">
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                        <CircularProgress />
                    </Box>
                </Container>
            </ThemeProvider>
        );
    }

    if (error) {
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Container maxWidth="md">
                    <Typography color="error" variant="h5" sx={{ mt: 4, textAlign: 'center' }}>{error}</Typography>
                </Container>
            </ThemeProvider>
        );
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
                    mb: 6,
                    position: 'relative'
                }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => router.push('/flashcard-sets')}
                        sx={{ position: 'absolute', top: 16, left: 16, color: 'white' }}
                    >
                        Back to Sets
                    </Button>
                    <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'white' }}>
                        {setName}
                    </Typography>
                    <Typography variant="h5" sx={{ mb: 4, color: 'rgba(255, 255, 255, 0.8)' }}>
                        Review your flashcards
                    </Typography>
                </Box>

                {flashcards.length === 0 ? (
                    <Typography variant="h5" textAlign="center">This flashcard set is empty.</Typography>
                ) : (
                    <Grid container spacing={4} sx={{ mt: 2, justifyContent: 'center' }}>
                        {flashcards.map((flashcard, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card
                                    raised
                                    sx={{
                                        height: 250,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        perspective: '1000px'
                                    }}
                                >
                                    <CardActionArea
                                        onClick={() => handleCardClick(index)}
                                        sx={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <CardContent sx={{ width: '100%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: 8,
                                                    left: 8,
                                                    backgroundColor: flipped[index] ? 'secondary.main' : 'primary.main',
                                                    color: 'white',
                                                    padding: '4px 12px',
                                                    borderRadius: '16px',
                                                    fontSize: '0.875rem',
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                {flipped[index] ? 'Answer' : 'Question'}
                                            </Box>
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    width: '100%',
                                                    height: '100%',
                                                    transition: 'transform 0.6s',
                                                    transformStyle: 'preserve-3d',
                                                    transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        width: '100%',
                                                        height: '100%',
                                                        backfaceVisibility: 'hidden',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        padding: 3,
                                                    }}
                                                >
                                                    <Typography variant="h6" align="center">
                                                        {flashcard.front}
                                                    </Typography>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        width: '100%',
                                                        height: '100%',
                                                        backfaceVisibility: 'hidden',
                                                        transform: 'rotateY(180deg)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        padding: 3,
                                                    }}
                                                >
                                                    <Typography variant="h6" align="center">
                                                        {flashcard.back}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </ThemeProvider>
    );
}