"use client"

import Link from 'next/link';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const StyledLink = styled(Link)(({ theme }) => ({
    textDecoration: 'none',
    color: 'inherit',
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

export default function Home() {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            flexDirection: 'column'
        }}>
            <StyledLink href="/pantry">
                <StyledCard>
                    <CenteredContent>
                        <Typography variant="h5">Pantry</Typography>
                        <Typography variant="body2">Keep track of your pantry items</Typography>
                    </CenteredContent>
                </StyledCard>
            </StyledLink>

            <StyledLink href="/shoppingList">
                <StyledCard>
                    <CenteredContent>
                        <Typography variant="h5">Shopping List</Typography>
                        <Typography variant="body2">Keep track of your shopping list</Typography>
                    </CenteredContent>
                </StyledCard>
            </StyledLink>
        </div>
    );
}
