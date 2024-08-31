"use client";

import { useState } from 'react';
import { auth } from '../../firebase';
import { useRouter } from 'next/navigation'; // Use next/navigation for app directory routing
import { createUserWithEmailAndPassword } from 'firebase/auth';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignUp = async (e) => { // Added e parameter
    e.preventDefault(); // Prevent default form submission
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User signed up:', userCredential.user);
      router.push('/dashboard');  // Redirect to dashboard after sign-in
    } catch (error) {
      alert('This email already has an account, please signIn');
      console.error('Error signing up:', error.message);
    }
  };

  const handleGoogle = async (e) => {
    const provider = await new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            console.log(result);
            router.push('/dashboard');
        }).catch((error) => {
            console.log(error);
        });
  }

  const defaultTheme = createTheme();

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: '12px',
            border: '2px solid #3f4f22',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#f9f9f9',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: '#3f4f22' }}>
            {/* Icon can be added here */}
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ color: '#3f4f22', marginBottom: 2 }}>
            Sign Up for Pantrify
          </Typography>
          
          {/* Google Button */}
          <Button
            onClick={handleGoogle}
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: '#ffffff',
              color: '#3f4f22',
              fontWeight: 'bold',
              textTransform: 'none',
              mb: 2,
              '&:hover': {
                backgroundColor: '#357ae8',
              },
            }}
          >
            <img
              src="/Google.png"
              style={{ width: 20, marginRight: 10 }}
            />
            Sign Up with Google
          </Button>
          
          <Typography component="p" sx={{ color: '#666' }}>OR</Typography>
  
          <Box component="form" onSubmit={handleSignUp} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              sx={{
                '& label': { color: '#3f4f22' },
                '& input': { color: '#3f4f22' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#3f4f22' },
                  '&:hover fieldset': { borderColor: '#3f4f22' },
                  '&.Mui-focused fieldset': { borderColor: '#3f4f22' },
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              sx={{
                '& label': { color: '#3f4f22' },
                '& input': { color: '#3f4f22' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#3f4f22' },
                  '&:hover fieldset': { borderColor: '#3f4f22' },
                  '&.Mui-focused fieldset': { borderColor: '#3f4f22' },
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: '#3f4f22',
                color: 'white',
                mt: 3,
                mb: 2,
                '&:hover': {
                  backgroundColor: '#2c3b19',
                },
                '&:focus': {
                  backgroundColor: '#2c3b19',
                },
              }}
            >
              Sign Up
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
