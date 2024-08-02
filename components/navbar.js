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

// import MenuIcon from '@mui/icons-material/Menu';
// import { useRouter } from 'next/navigation';  // Use next/navigation for app directory routing
import Link from 'next/link'

import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';


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
      <AppBar position="static">
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
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Your Pantry Tracker
          </Typography>
          {/* <Button color="inherit">Login</Button> */}
          {!user ? <><Link
            href="/signin"
            style={{
                display: 'inline-block',
                padding: '12px 24px',
                fontSize: '18px',
                fontWeight: '600',
                color: '#fff',
                backgroundColor: '#007bff',
                borderRadius: '8px',
                textDecoration: 'none',
                textAlign: 'center',
                transition: 'background-color 0.3s',
            }}>
            Login
          </Link>
          <Link
            href="/signup"
            style={{
                display: 'inline-block',
                padding: '12px 24px',
                marginLeft: '5px', 
                fontSize: '18px',
                fontWeight: '600',
                color: '#fff',
                backgroundColor: '#007bff',
                borderRadius: '8px',
                textDecoration: 'none',
                textAlign: 'center',
                transition: 'background-color 0.3s',
            }}>
            SignUp
          </Link></> : 
              <Button
                color="inherit"
                onClick={handleLogout}
                sx={{
                  marginLeft: '20px',
                  color: '#fff',
                  backgroundColor: '#696969',
                  '&:hover': {
                    backgroundColor: '#707070',
                  },
                }}
              >
                Logout
              </Button>}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
