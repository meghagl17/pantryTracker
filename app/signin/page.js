"use client";
import { useState } from 'react';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';  // Use next/navigation for app directory routing

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();  // Initialize useRouter from next/navigation

  const handleSignIn = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in:', userCredential.user);
      router.push('/dashboard');  // Redirect to dashboard after sign-in
    } catch (error) {
      alert('Incorrect password');
      console.error('Error signing in:', error.message);
    }
  };

  const defaultTheme = createTheme();

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: '3f4f22' }}>
            {/* <LockOutlinedIcon /> */}
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSignIn} noValidate sx={{ mt: 1 }}>
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
                '& label': { color: '#3f4f22' }, // Label color
                '& input': { color: '#3f4f22' }, // Input text color
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#3f4f22' }, // Outline color
                  '&:hover fieldset': { borderColor: '#3f4f22' }, // Outline color on hover
                  '&.Mui-focused fieldset': { borderColor: '#3f4f22' } // Outline color when focused
                }
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
                '& label': { color: '#3f4f22' }, // Label color
                '& input': { color: '#3f4f22' }, // Input text color
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#3f4f22' }, // Outline color
                  '&:hover fieldset': { borderColor: '#3f4f22' }, // Outline color on hover
                  '&.Mui-focused fieldset': { borderColor: '#3f4f22' } // Outline color when focused
                }
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: '#3f4f22',
                color: 'white', // or whatever text color you want
                mt: 3,
                mb: 2,
                '&:hover': {
                  backgroundColor: '#3f4f22', // Same as default color
                },
                '&:focus': {
                  backgroundColor: '#3f4f22', // Same as default color
                }
              }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
