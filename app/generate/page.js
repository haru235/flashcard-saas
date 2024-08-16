"use client"
import React from 'react';
import { db } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { 
    Box, Container, TextField, Typography, Button, Dialog, DialogTitle, 
    DialogContent, DialogContentText, DialogActions, Grid, Card, CardContent, 
    ThemeProvider, createTheme, CssBaseline, CircularProgress
} from "@mui/material";
import { collection, doc, getDoc, writeBatch } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Add as AddIcon, Save as SaveIcon } from '@mui/icons-material';

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

export default function Generate() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [text, setText] = useState('')
    const [flashcards, setFlashcards] = useState([])
    const [setName, setSetName] = useState('')
    const [setDescription, setSetDescription] = useState('')
    const [dialogOpen, setDialogOpen] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const handleOpenDialog = () => setDialogOpen(true)
    const handleCloseDialog = () => setDialogOpen(false)
    const router = useRouter()

    const saveFlashcards = async () => {
        if (!setName.trim()) {
            alert('Please enter a name for your flashcard set.')
            return
        }

        setIsSaving(true)
        try {
            const userDocRef = doc(collection(db, 'users'), user.id)
            const userDocSnap = await getDoc(userDocRef)

            const batch = writeBatch(db)

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data()
                const updatedSets = [...(userData.flashcardSets || []), { name: setName, description: setDescription, size: flashcards.length }]
                batch.update(userDocRef, { flashcardSets: updatedSets })
            } else {
                batch.set(userDocRef, { flashcardSets: [{ name: setName, description: setDescription, size: flashcards.length }] })
            }

            const setDocRef = doc(collection(userDocRef, 'flashcardSets'), setName)
            batch.set(setDocRef, { flashcards })

            await batch.commit()

            alert('Flashcards saved successfully')
            handleCloseDialog()
            setSetName('')
            router.push('/flashcard-sets')
        } catch (error) {
            console.error('Error saving flashcards:', error)
            alert('An error occurred while saving flashcards. Please try again.')
        } finally {
            setIsSaving(false)
        }
    }

    const handleSubmit = async () => {
        if (!text.trim()) {
            alert('Please enter some text to generate flashcards.')
            return
        }

        setIsGenerating(true)
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                body: text,
            })

            if (!response.ok) {
                throw new Error('Failed to generate flashcards')
            }

            const data = await response.json()
            setFlashcards(data.flashcards)
            setSetName(data.name)
            setSetDescription(data.description)
        } catch (error) {
            console.error('Error generating flashcards:', error)
            alert('An error occurred while generating flashcards. Please try again.')
        } finally {
            setIsGenerating(false)
        }
    }

    if (!isLoaded || !isSignedIn) {
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Container maxWidth="md">
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                        <CircularProgress />
                    </Box>
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
                        Generate Flashcards
                    </Typography>
                    <Typography variant="h5" sx={{ mb: 4, color: 'rgba(255, 255, 255, 0.8)' }}>
                        Create custom flashcards from your text
                    </Typography>
                </Box>

                <Box sx={{ mb: 6 }}>
                    <Card raised sx={{ p: 4 }}>
                        <TextField 
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            label="Enter text"
                            fullWidth
                            multiline
                            rows={6}
                            variant="outlined"
                            sx={{ mb: 3 }} 
                        />
                        <Button 
                            variant="contained"
                            color="secondary"
                            onClick={handleSubmit}
                            fullWidth
                            disabled={isGenerating}
                            startIcon={<AddIcon />}
                            size="large"
                            sx={{ py: 1.5 }}
                        >
                            {isGenerating ? 'Generating...' : 'Generate Flashcards'}
                        </Button>
                    </Card>
                </Box>

                {flashcards.length > 0 && (
                    <Box sx={{ mt: 6 }}>
                        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
                            {setName}
                        </Typography>
                        <Typography variant="body" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
                            {setDescription}
                        </Typography>
                        <Grid container spacing={3}>
                            {flashcards.map((flashcard, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Card raised sx={{ height: '100%' }}>
                                        <CardContent>
                                            <Typography variant="h6" color="primary" gutterBottom>Front:</Typography>
                                            <Typography variant="body1" sx={{ mb: 2 }}>{flashcard.front}</Typography>
                                            <Typography variant="h6" color="secondary" gutterBottom>Back:</Typography>
                                            <Typography variant="body1">{flashcard.back}</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                onClick={handleOpenDialog}
                                startIcon={<SaveIcon />}
                                size="large"
                                sx={{ px: 4, py: 1.5 }}
                            >
                                Save Flashcards
                            </Button>
                        </Box>
                    </Box>
                )}

                <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                    <DialogTitle>Save Flashcard Set</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Confirm the name and description for your flashcard set.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Set Name"
                            type="text"
                            fullWidth
                            value={setName}
                            onChange={(e) => setSetName(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="dense"
                            label="Set Description"
                            type="text"
                            fullWidth
                            multiline
                            rows={3}
                            value={setDescription}
                            onChange={(e) => setSetDescription(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
                        <Button 
                            onClick={saveFlashcards} 
                            color="secondary" 
                            variant="contained"
                            disabled={isSaving}
                        >
                            {isSaving ? 'Saving...' : 'Save'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </ThemeProvider>
    );
}