'use client';

import Link from 'next/link';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import ProtectedRoute from '../ProtectedRoute.js';

const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: '#3f4f22',
  display: 'block',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  cursor: 'pointer',
  height: '200px',
  width: '90%', // 90% width for responsiveness
  maxWidth: '400px',
  justifyContent: 'center',
  margin: '20px auto',
  textAlign: 'center',
  transition: 'transform 0.3s',
  display: 'flex',
  alignItems: 'center',
  '&:hover': {
    transform: 'scale(1.05)',
  },
  backgroundColor: '#3f4f22',
  [theme.breakpoints.down('sm')]: {
    height: '150px', // Smaller height for smaller screens
  },
}));

const CenteredContent = styled(CardContent)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}));

const ButtonContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row', // Default layout (horizontal)
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#ffffd9',
  padding: '20px',
  borderRadius: '8px',
  margin: '15px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column', // Stacked layout on mobile
    alignItems: 'stretch', // Stretch the items to fit full width
  },
}));

export default function Home() {
  return (
    <ProtectedRoute>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          flexDirection: 'row',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <ButtonContainer>
            <StyledLink href="/pantry">
              <StyledCard>
                <CenteredContent>
                  <Typography variant="h5" sx={{ color: '#ffffd9' }}>
                    Pantry
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#ffffd9' }}>
                    Keep track of your pantry items
                  </Typography>
                </CenteredContent>
              </StyledCard>
            </StyledLink>
          </ButtonContainer>

          <ButtonContainer>
            <StyledLink href="/stores">
              <StyledCard>
                <CenteredContent>
                  <Typography variant="h5" sx={{ color: '#ffffd9' }}>
                    Shopping Lists
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#ffffd9' }}>
                    Keep track of your shopping list
                  </Typography>
                </CenteredContent>
              </StyledCard>
            </StyledLink>
          </ButtonContainer>
        </div>
      </div>
    </ProtectedRoute>
  );
}
