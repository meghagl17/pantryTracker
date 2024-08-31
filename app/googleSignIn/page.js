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

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";


export default function SignIn() {

  const router = useRouter();  // Initialize useRouter from next/navigation


  const handleGoogle = async (e) => {
    const provider = await new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            console.log(result);
            router.push('/dashboard');
        }).catch((error) => {
            console.log(error);
        });
    // router.push('/dashboard');
  }
  

  return (
    <>
        <button onClick={handleGoogle}> Google Sign in</button>
    </>
  );
}
