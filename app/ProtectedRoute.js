// components/ProtectedRoute.js
'use client';

import { useEffect } from 'react';
import { useAuth } from '../app/context/AuthContext.js';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin'); // Redirect to login if not authenticated
    }
  }, [user, loading]);

  if (loading) {
    return <Box 
    sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
    }}
>
    <CircularProgress size={60} sx={{ color: 'white' }} />
</Box>
  }

  return children;
};

export default ProtectedRoute;
