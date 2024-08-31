"use client"

import Image from "next/image";
import { useState, useEffect } from "react";
import pantrifyImage from '../public/pantrifyImage.png';
import { Button, Typography, Box } from '@mui/material';
import Link from 'next/link'

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to update state based on screen width
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1000);
    };

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Initial check
    handleResize();

    // Cleanup event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Define styles for the container
  const containerStyles = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row', // Stack vertically on mobile
    alignItems: isMobile ? 'center' : 'flex-start', // Center horizontally on mobile
    justifyContent: 'center', // Center content
    backgroundColor: 'white',
    width: isMobile ? '80%' : '60%', // Adjust width for mobile
    margin: '0 auto',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    marginTop: isMobile ? '50px' : null,
    top: isMobile ? '0' : '50%', // Center vertically for non-mobile
    transform: isMobile ? 'none' : 'translateY(-50%)', // Center vertically for non-mobile
    textAlign: isMobile ? 'center' : 'left', // Center text on mobile
  };

  // Define styles for the text and button section
  const textSectionStyles = {
    flex: 1,
    paddingRight: isMobile ? '0' : '20px', // Remove padding on mobile
    marginBottom: isMobile ? '20px' : '0', // Add margin on mobile
  };

  // Define styles for the image section
  const imageStyles = {
    width: isMobile ? '80%' : '300px', // Adjust width for mobile
    height: 'auto', // Maintain aspect ratio
    margin: isMobile ? '0 auto' : '0', // Center horizontally for mobile
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <div style={containerStyles}>
        <div style={textSectionStyles}>
          {isMobile ? <Image
            src={pantrifyImage}
            alt="Pantrify Logo"
            style={imageStyles}
            layout="fixed"
          /> : (null)}
          <Typography variant="h3" sx={{ color: '#3f4f22', fontWeight: 'bold', marginBottom: '20px' }}>
            Welcome to Pantrify
          </Typography>
          <Typography variant="body1" sx={{ color: '#333', marginBottom: '20px' }}>
            Manage your pantry effortlessly and shop with ease. Track your items and never run out of your essentials again!
          </Typography>
          <Box sx={{ display: 'flex', gap: '10px', flexDirection: isMobile ? 'column' : 'row' }}>
            <Link href="/signin"><Button variant="contained" sx={{ backgroundColor: '#3f4f22', '&:hover': { backgroundColor: '#2e3b1a' }, color: 'white' }}>
              Sign In
            </Button></Link>
            <Link href="/signup"><Button variant="outlined" sx={{ borderColor: '#3f4f22', color: '#3f4f22', '&:hover': { borderColor: '#2e3b1a', color: '#2e3b1a' } }}>
              Sign Up
            </Button></Link>
            <Link href="/googleSignIn"><Button variant="outlined" sx={{ borderColor: '#3f4f22', color: '#3f4f22', '&:hover': { borderColor: '#2e3b1a', color: '#2e3b1a' } }}>
              Google
            </Button></Link>
          </Box>
        </div>
        {!isMobile ? <Image
          src={pantrifyImage}
          alt="Pantrify Logo"
          style={imageStyles}
          layout="fixed"
        /> : (null)}
      </div>
    </div>
  );
}
