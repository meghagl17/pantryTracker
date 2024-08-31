"use client"
import React from 'react';

import { auth, db } from '../../firebase';
import { collection, addDoc, getDocs, query, updateDoc, getDoc, doc, deleteDoc } from 'firebase/firestore';

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
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import CircularProgress from '@mui/material/CircularProgress';

import { styled } from '@mui/system';
import ProtectedRoute from '../ProtectedRoute.js';

const CustomCard = styled(Card)(({ theme }) => ({
    backgroundColor: '#ffffe5',
    minWidth: 275,
    maxWidth: 400,
    '& .MuiCardContent-root': {
        backgroundColor: '#ffffe5'
    }
}));

const CustomButton = styled(Button)(({ theme }) => ({
    color: '#3f4f22',
    backgroundColor: 'rgba(126, 158, 69, 0.2)', /* 50% opacity */
    '&:hover': {
        backgroundColor: '#7e9e45',
        color: 'white',
    },
}));

export default function Home() {
    const [pantry, setPantry] = useState([]);     // all the items in the pantry
    const [itemName, setItemName] = useState('');     // new item to add
    const [itemQuantity, setItemQuantity] = useState('');    // new item quantity
    const [loading, setLoading] = useState(true);     // loading state
    const [user, setUser] = useState('');       // current user
    const [itemDelete, setItemDelete] = useState({name: '', id: ''});    // item thats quantity is now 0
    const [itemToUpdate, setItemToUpdate] = useState({id: '', name: ''}); // item thats quantity is to be updated
    const [updateQuantity, setUpdatedQuantity] = useState(''); // quantity of the updated item

    const [searchQuery, setSearchQuery] = useState(''); // stores what the user searched for
    const [filteredPantry, setFilteredPantry] = useState([]);  // stores the filtered list

    const [clickedRequest, setClikedRequest] = useState({addItem: false, searchItem: true, getRecipe: false});

    // Initially get the user
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
            }
        });
    
        return () => unsubscribe();
    }, []);

    // initiallt get the items once the user is loaded
    useEffect(() => {
        if (user) {
            handleGetItems();
        }
    }, [user]);

    useEffect(() => {
        filterPantryItems();
    }, [searchQuery, pantry]);

    const filterPantryItems = () => {
        setClikedRequest({addItem: false, searchItem: true, getRecipe: false});
        const filtered = pantry.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredPantry(filtered);
    };

    // const handleSearchChange = (event) => {
    //     setSearchQuery(event.target.value);
    // };

    // Get all the items in the pantry for the user
    const handleGetItems = async () => {
        setLoading(true);
        if (!user) return;
        const userId = user.uid;
        const pantryCollectionRef = collection(db, 'users', userId, 'pantry');
        const q = query(pantryCollectionRef);
        const querySnapshot = await getDocs(q);

        const items = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));

        setPantry(items);
        setLoading(false);
        console.log("Pantry items:", items);
    };

    // Adding a new item to the inventory
    const handleAddItem = async () => {
        if (itemName.trim() !== '' && itemQuantity.trim() !== '') {
            const quantity = parseFloat(itemQuantity);
            if (isNaN(quantity)) {
                alert('Quantity must be a valid number');
                return;
            }
            await updateInventory(itemName, quantity);
            setItemName('');
            setItemQuantity('');
            handleGetItems();
            setClikedRequest({addItem: false, searchItem: false, getRecipe: false});
        } else {
            alert('Please provide item name and quantity');
            console.error('Please provide item name and quantity');
        }
    };

    // Helper funtion to update the inventory with a new item
    const updateInventory = async (itemName, itemQuantity) => {
        if (!user) return; 
        const userId = user.uid;
        const pantryCollectionRef = collection(db, 'users', userId, 'pantry');
        await addDoc(pantryCollectionRef, {
            name: itemName,
            addedAt: new Date(),
            quantity: itemQuantity,
        });
    }

    // Add +1 to an item
    const addToInventory = async (itemId) => {
        if (!user) return; 
        const userId = user.uid;
        const itemDocRef = doc(db, 'users', userId, 'pantry', itemId);
        const itemDoc = await getDoc(itemDocRef);
        const currentQuantity = itemDoc.data().quantity;
        await updateDoc(itemDocRef, {
            quantity: currentQuantity + 1
        });
        handleGetItems();
        console.log(`Item ${itemId} added to pantry`);
    }

    // Subtract -1 to an item
    const removeFromInventory = async (itemId, itemName) => {
        if (!user) return; 
        const userId = user.uid;
        const itemDocRef = doc(db, 'users', userId, 'pantry', itemId);
        const itemDoc = await getDoc(itemDocRef);
        const currentQuantity = itemDoc.data().quantity;
        if(currentQuantity - 1 == 0){
            setItemDelete({name: itemName, id: itemId})
            handleClickOpen();
        }
        await updateDoc(itemDocRef, {
            quantity: currentQuantity - 1
        });
        handleGetItems();
        console.log(`Item ${itemId} removed from pantry`);
    }

    // dialog for when the user wants to update the quantity of an item
    // state for dialog
    const [openForUpdate, setOpenForUpdate] = useState(false);

    // open function for dialog
    const handleClickOpenForUpdate = (itemId, itemName) => {
        setItemToUpdate({id: itemId, name: itemName});
        setOpenForUpdate(true);
    };

    // close function for dialog which will also add to shopping cart and delete from pantry
    const handleCloseForUpdate = async (updateItem) => {
        if (!user) return; 
        const userId = user.uid;

        if (updateQuantity.trim() !== '') {
            const quantity = parseFloat(updateQuantity);
            if (isNaN(quantity)) {
                alert('Quantity must be a valid number');
                return;
            }

            if(updateItem){
                if(quantity == 0){
                    setItemDelete({name: itemToUpdate.name, id: itemToUpdate.id});
                    setUpdatedQuantity('');
                    setItemToUpdate({id: '', name: ''})
                    setOpenForUpdate(false);
                    handleClickOpen();
                }

                const itemDocRef = doc(db, 'users', userId, 'pantry', itemToUpdate.id);
                const itemDoc = await getDoc(itemDocRef);
                // const currentQuantity = itemDoc.data().quantity;
                await updateDoc(itemDocRef, {
                    quantity: quantity
                });
                // handleGetItems();
                // console.log(`Item ${itemId} added to pantry`);
                handleGetItems();
            }

            setUpdatedQuantity('');
            setItemToUpdate({id: '', name: ''})
        }
        setOpenForUpdate(false);
    };
    
    // dialog for when the user clicks "-" and the item quantity becomes 0
    // state for dialog
    const [open, setOpen] = useState(false);

    // open function for dialog
    const handleClickOpen = () => {
        setOpen(true);
    };

    // close function for dialog which will also add to shopping cart and delete from pantry
    const handleClose = async (itemDelete, addtoShoppingCart) => {
        console.log(itemDelete);
        if (!user) return; 
        const userId = user.uid;
        if(addtoShoppingCart){
            // const shoppingCartCollectionRef = collection(db, 'users', userId, 'shoppingList');
            // await addDoc(shoppingCartCollectionRef, {
            //     name: itemDelete.name,
            //     addedAt: new Date(),
            // });
            // console.log(`Item ${itemDelete.name} added to pantry`);
            const generalListCollectionRef = collection(db, 'users', userId, 'generalList');
            const docRef = await addDoc(generalListCollectionRef, {
                name: itemDelete.name,
                addedAt: new Date(),
            });
            console.log('Store created successfully');
        }
        //delete item
        try {
            const itemDocRef = doc(db, 'users', userId, 'pantry', itemDelete.id);
            await deleteDoc(itemDocRef);
            console.log(`Item ${itemDelete.id} deleted successfully`);
          } catch (error) {
            console.error('Error deleting item:', error.message);
        }
        handleGetItems();
        setOpen(false);
    };

    const handleAddItemClicked = async () => {
        setClikedRequest({addItem: true, searchItem: false, getRecipe: false});
    }

    const handleSearchItemClicked = async () => {
        setClikedRequest({addItem: false, searchItem: true, getRecipe: false});
    }

    return (
        <ProtectedRoute>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
            <React.Fragment>
                <Dialog open={open}>
                    <DialogTitle id="alert-dialog-title">
                    {"Shopping List Update"}
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Since this item is not in your pantry anymore, do you want to add it to your shopping list? It will be added to the GENERAL shopping list.
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <CustomButton onClick={() => handleClose(itemDelete, false)}>NO</CustomButton>
                    <CustomButton onClick={() => handleClose(itemDelete, true)} autoFocus>
                        YES
                    </CustomButton>
                    </DialogActions>
                </Dialog>
            </React.Fragment>

            <React.Fragment>
                <Dialog open={openForUpdate}>
                    <DialogTitle id="alert-dialog-title">
                        Update {itemToUpdate.name} Quantity
                    </DialogTitle>
                    <DialogContent>
                    <TextField
                        style={{ width: '150px' }}
                        id="item-quantity"
                        label="Quantity"
                        variant="outlined"
                        value={updateQuantity}
                        onChange={(e) => setUpdatedQuantity(e.target.value)}
                        placeholder="Quantity"
                    />
                    </DialogContent>
                    <DialogActions>
                    <CustomButton onClick={() => handleCloseForUpdate(false)}>Cancel</CustomButton>
                    <CustomButton onClick={() => handleCloseForUpdate(true)} autoFocus>
                        Update
                    </CustomButton>
                    </DialogActions>
                </Dialog>
            </React.Fragment>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', width: '100%', maxWidth: '600px' }}>
                
                {clickedRequest.searchItem ? (
                    <>
                    <TextField
                        fullWidth
                        label="Search your pantry"
                        variant="outlined"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search items..."
                        // style={{ marginBottom: '20px' }}
                    />

                    <div>OR</div>
                    {/* <Button variant="contained" onClick={filterPantryItems}>
                        Search Item
                    </Button> */}
                    </>
                ) : (
                    <Button sx={{ backgroundColor: '#3f4f22', '&:hover': {backgroundColor: '#2e3b1a',}, color:'white'}} onClick={handleSearchItemClicked}>
                        Search Item
                    </Button>
                )}
                
                {clickedRequest.addItem ? (
                    <>
                    <div>OR</div>
                    <TextField
                        fullWidth
                        id="item-name"
                        label="Enter item name"
                        variant="outlined"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        placeholder="Enter item name"
                    />
                    <TextField
                        style={{ width: '150px' }}
                        id="item-quantity"
                        label="Quantity"
                        variant="outlined"
                        value={itemQuantity}
                        onChange={(e) => setItemQuantity(e.target.value)}
                        placeholder="Quantity"
                    />
                    <Button sx={{ backgroundColor: '#3f4f22', '&:hover': {backgroundColor: '#2e3b1a',}, color:'white'}} onClick={handleAddItem}>
                        Add Item
                    </Button>
                    </>
                ) : (
                    <Button sx={{ backgroundColor: '#3f4f22', '&:hover': {backgroundColor: '#2e3b1a',}, color:'white'}} 
                        onClick={handleAddItemClicked}>
                        Add Item
                    </Button>
                )}

            </div>

            <div style={{alignItems: 'center', gap: '10px', marginBottom: '20px', width: '100%', maxWidth: '600px' }}>
                {pantry.length === 0 && loading === false ? (
                    <Box 
                        sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        width: '100%', // Full width of the container
                        backgroundColor: '#f5f5f5', 
                        textAlign: 'center'
                        }}
                    >
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                color: '#7e9e45', 
                                fontWeight: 'bold', 
                                padding: '20px', 
                                backgroundColor: '#ffffff', 
                                borderRadius: '10px', 
                                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                                maxWidth: '600px', // Limit the width to avoid overly wide content
                                width: '100%', // Ensure it uses full width up to the maxWidth
                                margin: '0 auto' // Center horizontally
                            }}
                        >
                            🛒 Your pantry is currently empty. Start adding items to keep track of your stock!
                        </Typography>
                    </Box>
                ) : null}
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
                        gridTemplateColumns: 'repeat(2, 1fr)' // 3 columns on larger screens
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
                ) : (null)}

                {filteredPantry.length === 0 ?
                    (pantry.map((item) => (
                        <CustomCard key={item.id}>
                            <CardContent sx={{ backgroundColor: '#fffff4'}}>
                                <Typography variant="h5" component="div">
                                    {item.name}
                                </Typography>
                                <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
                                    {item.quantity}
                                </Typography>
                            </CardContent>
                            <Divider />
                            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <CustomButton onClick={() => handleClickOpenForUpdate(item.id, item.name)}>
                                Update Item
                            </CustomButton>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <RemoveIcon onClick={() => removeFromInventory(item.id, item.name)} style={{ cursor: 'pointer' }} />
                                    <AddIcon onClick={() => addToInventory(item.id)} style={{ cursor: 'pointer', marginRight: '8px' }} />
                                </Box>
                            </Box>
                        </CustomCard>
                    ))) : 
                    (filteredPantry.map((item) => (
                        <CustomCard key={item.id}>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {item.name}
                                </Typography>
                                <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
                                    {item.quantity}
                                </Typography>
                            </CardContent>
                            <Divider />
                            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <CustomButton onClick={() => handleClickOpenForUpdate(item.id, item.name)}>
                                    Update Item
                                </CustomButton>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <RemoveIcon onClick={() => removeFromInventory(item.id, item.name)} style={{ cursor: 'pointer' }} />
                                    <AddIcon onClick={() => addToInventory(item.id)} style={{ cursor: 'pointer', marginRight: '8px' }} />
                                </Box>
                            </Box>
                        </CustomCard>
                    )))}
            </Box>
        </div>
        </ProtectedRoute>
    );
}
