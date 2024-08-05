"use client"
import { auth, db } from '../../firebase';
import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Checkbox from '@mui/material/Checkbox';
import { FormControlLabel } from '@mui/material'

import Link from 'next/link';

import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import { styled } from '@mui/system';

const CustomCard = styled(Card)(({ theme }) => ({
    backgroundColor: '#ffffe5',
    minWidth: 275,
    maxWidth: 400,
    '& .MuiCardContent-root': {
        backgroundColor: '#ffffe5'
    }
}));

import { collection, addDoc, getDocs, query, updateDoc, getDoc, doc, deleteDoc} from 'firebase/firestore';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const CustomButton = styled(Button)(({ theme }) => ({
    color: '#3f4f22',
    backgroundColor: 'rgba(126, 158, 69, 0.2)', /* 50% opacity */
    '&:hover': {
        backgroundColor: '#7e9e45',
        color: 'white',
    },
}));

export default function Home() {
    const [storesList, setStoresList] = useState([]);
    const [storeName, setStoreName] = useState('');
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState('');

    // const [open, setOpen] = React.useState(false);

    // const handleClickOpen = () => {
    //     setOpen(true);
    // };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
                setLoading(false);
            } else {
                setLoading(true);
            }
        });
    
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (user) {
            handleGetStores();
        }
    }, [user]);

    const updateInventory = async (storeName) => {
        if (!user) return; 
        const userId = user.uid;
        const storesCollectionRef = collection(db, 'users', userId, 'stores');
        await addDoc(storesCollectionRef, {
            name: storeName,
            addedAt: new Date(),
        });
        console.log(`Item ${storeName} added to pantry`);
    }

    const handleAddItem = async () => {
        if (storeName.trim() !== '') {
            await updateInventory(storeName);
            setStoreName('');
            handleGetStores();
        } else {
            alert('Please provide item name');
            console.error('Please provide item name');
        }
    };

    const handleGetStores = async () => {
        setLoading(true);
        if (!user) return;
        const userId = user.uid;
        const storesCollectionRef = collection(db, 'users', userId, 'stores');
        const q = query(storesCollectionRef);
        const querySnapshot = await getDocs(q);

        const items = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));

        setStoresList(items);
        console.log("Stores List:", items);

        setLoading(false);
    };

    // const addToDone = async (storeName, itemId) => {
    //     if (!user) return; 
    //     const userId = user.uid;
    //     const doneCollectionRef = collection(db, 'users', userId, 'done');
    //     await addDoc(doneCollectionRef, {
    //         name: storeName,
    //     });

    //     try {
    //         const itemDocRef = doc(db, 'users', userId, 'shoppingList', itemId);
    //         await deleteDoc(itemDocRef);
    //         console.log(`Item ${itemId} deleted successfully`);
    //       } catch (error) {
    //         console.error('Error deleting item:', error.message);
    //     }

    //     handleGetItems();
    //     console.log(`Item ${storeName} added to Done`);
    // }

    // const DeleteDoneItems = async () => {
    //     if (!user) return; 
    //     const userId = user.uid;
    //     const doneCollectionRef = collection(db, 'users', userId, 'done');
    //     const querySnapshot = await getDocs(doneCollectionRef);
    //     const deletePromises = querySnapshot.docs.map(docSnapshot => {
    //         return deleteDoc(doc(db, 'users', userId, 'done', docSnapshot.id));
    //     });
    //     await Promise.all(deletePromises);
    //     handleGetItems();
    // }

    // const handleClose = (deleteItems) => {
    //     if(deleteItems){
    //         DeleteDoneItems();
    //     }
    //     setOpen(false);
    // };
    
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', width: '100%', maxWidth: '600px' }}>
                    <>
                    <TextField
                        fullWidth
                        id="item-name"
                        label="Enter item name"
                        variant="outlined"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        placeholder="Enter item name"
                    />
                    <Button sx={{ backgroundColor: '#3f4f22', '&:hover': {backgroundColor: '#2e3b1a',}, color:'white'}} onClick={handleAddItem}>
                        Add Item
                    </Button>
                    </>

            </div>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(1, 1fr)', // Default to 1 column
                    gap: '20px',
                    marginTop: '20px',
                    width: '100%',
                    maxWidth: '1200px',
                    '@media (min-width: 600px)': {
                        gridTemplateColumns: 'repeat(2, 1fr)' // 2 columns on medium screens
                    },
                    '@media (min-width: 890px)': {
                        gridTemplateColumns: 'repeat(3, 1fr)' // 3 columns on larger screens
                    }
                }}
            >
                {loading ? (
                    <Box 
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
                ) : (
                    <>
                        <Link href='/shoppingList' passHref>
                            <CustomCard>
                                <CardContent sx={{ backgroundColor: '#fffff4' }}>
                                    <Typography variant="h5" component="div">
                                        General
                                    </Typography>
                                </CardContent>
                                <Divider />
                                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    {/* Additional content here */}
                                </Box>
                            </CustomCard>
                        </Link>

                        {storesList.map((item) => (
                            <Link key={item.id} href={`/store/${item.id}/${encodeURIComponent(item.name)}`} passHref>
                                <CustomCard>
                                    <CardContent sx={{ backgroundColor: '#fffff4' }}>
                                        <Typography variant="h5" component="div">
                                            {item.name}
                                        </Typography>
                                    </CardContent>
                                    <Divider />
                                    <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        {/* Additional content here */}
                                    </Box>
                                </CustomCard>
                            </Link>
                        ))}
                    </>
                )}
            </Box>
        </div>
    );
}
