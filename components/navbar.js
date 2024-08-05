"use client"

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';  // Use next/navigation for app directory routing
import Image from "next/image";
import logo from '../public/favicon.ico'
import Link from 'next/link'

import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

import HomeIcon from '@mui/icons-material/Home';

export default function ButtonAppBar() {
  const router = useRouter();  // Initialize useRouter from next/navigation

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
            setUser(user);
        } else {
            setUser(null);
        }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null); // Optionally clear the user state after sign-out
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#7e9e45' }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            {/* <MenuIcon /> */}
          </IconButton>
          <div style={{ 
            position: 'relative', 
            width: '70px', // Set the desired width
            height: '70px', // Set the desired height
            overflow: 'hidden', // Hide overflow to crop
          }}>
            <Image
              src={logo}
              alt="Pantrify Logo"
              layout="fill" // Use fill layout to cover the container
              objectFit="cover" // Cover the container while maintaining aspect ratio
              style={{
                position: 'absolute', // Absolute positioning within the container
                top: '50%', // Center vertically
                left: '50%', // Center horizontally
                transform: 'translate(-65%, -30%) scale(2)', // Center and zoom in
              }}
            />
          </div>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontFamily: 'Gistesy, sans-serif', // Apply Gistesy font
              fontStyle: 'italic', // Make the text cursive
            }}
          >
            Pantrify
          </Typography>
          {!user ? (
            <>
              <Link href="/signin">
                <Button 
                  variant="contained" 
                  sx={{ 
                    backgroundColor: '#3f4f22', 
                    '&:hover': { backgroundColor: '#2e3b1a' }, 
                    color: 'white', 
                    marginRight: '7px',
                    fontFamily: 'Gistesy, sans-serif' // Apply Gistesy font
                  }}
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button 
                  variant="contained" 
                  sx={{ 
                    backgroundColor: '#3f4f22', 
                    '&:hover': { backgroundColor: '#2e3b1a' }, 
                    color: 'white',
                    fontFamily: 'Gistesy, sans-serif' // Apply Gistesy font
                  }}
                >
                  Sign Up
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard">
                <HomeIcon 
                  sx={{
                    fontSize: '2rem',
                    color: '#fff',
                    cursor: 'pointer',
                    '&:active': {
                      color: '#ccc',
                    },
                  }} 
                />
              </Link>
              <Button
                color="inherit"
                onClick={handleLogout}
                sx={{
                  marginLeft: '20px',
                  color: '#fff',
                  backgroundColor: '#3f4f22',
                  '&:hover': {
                    backgroundColor: '#2e3b1a',
                  },
                  fontFamily: 'Gistesy, sans-serif' // Apply Gistesy font
                }}
              >
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
