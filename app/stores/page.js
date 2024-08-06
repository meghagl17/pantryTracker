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
import { useRouter } from 'next/navigation';  // Use next/navigation for app directory routing
import DeleteIcon from '@mui/icons-material/Delete';


import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Checkbox from '@mui/material/Checkbox';
import { FormControlLabel, IconButton } from '@mui/material'

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

    const router = useRouter();  // Initialize useRouter from next/navigation

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
        console.log(`Item ${storeName} added to store list`);
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

    const goToStore = async (itemId, itemName) => {
        router.push(`/store/${itemId}/${encodeURIComponent(itemName)}`);
    }

    const goToGeneral = async () => {
        router.push('/shoppingList');
    }

    const handleDeleteStore = async (storeId, storeName) => {
        setStoreToDelete({id: storeId, name: storeName});
        handleOpenDialog();
    }
    
    const [openDialog, setOpenDialog] = useState(false);
    const [storeToDelete, setStoreToDelete] = useState({id: '', name: ''}); // item thats quantity is to be updated

    // open function for dialog
    const handleOpenDialog = (storeId, storeName) => {
        setOpenDialog(true);
    };

    // close function for dialog which will also add to shopping cart and delete from pantry
    const handleCloseDialog = async (deleteItem) => {
        if (!user) return; 
        const userId = user.uid;
        const storeId = storeToDelete.id;
        console.log(storeId);

        if(deleteItem){
            try {
                // Reference to the store's shopping list subcollection
                const shoppingListRef = collection(db, 'users', userId, 'stores', storeId, 'shoppingList');
                
                // Get all items in the shopping list
                const querySnapshot = await getDocs(shoppingListRef);
        
                // Delete each item in the shopping list
                if (!querySnapshot.empty) {
                    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
                    await Promise.all(deletePromises);
                    console.log('All items in the shopping list have been deleted.');
                } else {
                    console.log('No items found in the shopping list or collection does not exist.');
                }
    
                // Reference to the store's shopping list subcollection
                const doneListRef = collection(db, 'users', userId, 'stores', storeId, 'done');
                
                // Get all items in the shopping list
                const doneQuerySnapshot = await getDocs(doneListRef);
        
                if(!doneQuerySnapshot.empty){
                    // Delete each item in the shopping list
                    const deletePromises2 = doneQuerySnapshot.docs.map(doc => deleteDoc(doc.ref));
                    await Promise.all(deletePromises2);
                    console.log('All items in the Done list have been deleted.');
                } else {
                    console.log('No items found in the shopping list or collection does not exist.');
                }

                // Reference to the store document
                const storeDocRef = doc(db, 'users', userId, 'stores', storeId);
        
                // Delete the store document
                await deleteDoc(storeDocRef);
                console.log('Store document deleted successfully.');
        
            } catch (error) {
                console.error('Error deleting store and its items:', error.message);
            }
            // handleGetItems();
            // console.log(`Item ${itemId} added to pantry`);
            handleGetStores();
        }

        setStoreToDelete({id: '', name: ''})
        setOpenDialog(false);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
            
            <React.Fragment>
                <Dialog open={openDialog}>
                    <DialogTitle id="alert-dialog-title">
                        Confirm Deletion
                    </DialogTitle>
                    <DialogContent>
                        Are you sure you want to delete all items from the shopping list in this store? This action cannot be undone.
                    </DialogContent>
                    <DialogActions>
                    <CustomButton onClick={() => handleCloseDialog(false)}>Cancel</CustomButton>
                    <CustomButton onClick={() => handleCloseDialog(true)} autoFocus>
                        Delete
                    </CustomButton>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', width: '100%', maxWidth: '600px' }}>
                    <>
                    <TextField
                        fullWidth
                        id="item-name"
                        label="Enter Store Name"
                        variant="outlined"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        placeholder="Enter Store Name"
                    />
                    <Button sx={{ backgroundColor: '#3f4f22', '&:hover': {backgroundColor: '#2e3b1a',}, color:'white'}} onClick={handleAddItem}>
                        Add Store
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
                        <div>
            <CustomCard
                sx={{
                    marginBottom: '1rem', // Spacing between cards
                    borderRadius: '12px', // Rounded corners
                    boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.2)', // Slightly more pronounced shadow
                    border: '2px solid #3f4f22', // Add a border to emphasize
                }}
            >
                <CardContent
                    sx={{
                        backgroundColor: '#e3f2fd', // Light blue background for emphasis
                        display: 'flex',
                        justifyContent: 'space-between', // Space between name and icon
                        alignItems: 'center', // Center vertically
                        padding: '16px', // Padding around content
                    }}
                >
                    <Typography
                        variant="h5"
                        component="div"
                        sx={{ fontWeight: 'bold' }} // Emphasize the text
                    >
                        General
                    </Typography>
                </CardContent>
                <Divider />
                <Box
                    sx={{
                        p: 2,
                        display: 'flex',
                        justifyContent: 'center', // Center button horizontally
                    }}
                >
                    <CustomButton onClick={() => goToGeneral()}>Add items</CustomButton>
                </Box>
            </CustomCard>
        </div>

        <div>
            {storesList.map((item) => (
                <CustomCard
                    key={item.id}
                    sx={{
                        marginBottom: '1rem', // Optional: Add spacing between cards
                        borderRadius: '8px', // Optional: Add border radius for rounded corners
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Optional: Add shadow for visual separation
                    }}
                >
                    <CardContent
                        sx={{
                            backgroundColor: '#fffff4',
                            display: 'flex',
                            justifyContent: 'space-between', // Space between name and icon
                            alignItems: 'center', // Center vertically
                            padding: '16px', // Ensure proper padding
                        }}
                    >
                        <Typography variant="h5" component="div">
                            {item.name}
                        </Typography>
                        <IconButton
                            sx={{ 
                                marginLeft: 'auto', // Pushes icon to the right
                                color: 'red',
                            }}
                            onClick={() => handleDeleteStore(item.id, item.name)} // Placeholder for delete action
                        >
                            <DeleteIcon />
                        </IconButton>
                    </CardContent>
                    <Divider />
                    <Box
                        sx={{
                            p: 2,
                            display: 'flex',
                            justifyContent: 'center', // Center button horizontally
                        }}
                    >
                        <CustomButton onClick={() => goToStore(item.id, item.name)}>Add items</CustomButton>
                    </Box>
                </CustomCard>
            ))}
        </div>
                    </>
                )}
            </Box>
        </div>
    );
}
