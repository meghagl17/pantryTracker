"use client"
import React from 'react';

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
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import { collection, addDoc, getDocs, query, updateDoc, getDoc, doc, deleteDoc } from 'firebase/firestore';

export default function Home() {
    const [pantry, setPantry] = useState([]);
    const [itemName, setItemName] = useState('');
    const [itemQuantity, setItemQuantity] = useState('');
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState('');
    const [itemDelete, setItemDelete] = useState({name: '', id: ''});

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
                setLoading(false);
            } else {
                setLoading(false);
            }
        });
    
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (user) {
            handleGetItems();
        }
    }, [user]);

    const updateInventory = async (itemName, itemQuantity) => {
        if (!user) return; 
        const userId = user.uid;
        const pantryCollectionRef = collection(db, 'users', userId, 'pantry');
        await addDoc(pantryCollectionRef, {
            name: itemName,
            addedAt: new Date(),
            quantity: itemQuantity,
        });
        console.log(`Item ${itemName} added to pantry`);
    }

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

    const removeFromInventory = async (itemId, itemName) => {
        if (!user) return; 
        const userId = user.uid;
        const itemDocRef = doc(db, 'users', userId, 'pantry', itemId);
        const itemDoc = await getDoc(itemDocRef);
        const currentQuantity = itemDoc.data().quantity;
        if(currentQuantity - 1 == 0){
            setItemDelete({name: itemName, id: itemId})
            handleClickOpen();
            // open pop up
            // if user says yes, add it to user shopping cart and delete from pantry
            // if user says no, delete it from shopping cart
        }
        await updateDoc(itemDocRef, {
            quantity: currentQuantity - 1
        });
        handleGetItems();
        console.log(`Item ${itemId} removed from pantry`);
    }

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
        } else {
            alert('Please provide item name and quantity');
            console.error('Please provide item name and quantity');
        }
    };

    const handleGetItems = async () => {
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
        console.log("Pantry items:", items);
    };
    
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = async (itemDelete, addtoShoppingCart) => {
        console.log(itemDelete);
        if (!user) return; 
        const userId = user.uid;
        if(addtoShoppingCart){
            const shoppingCartCollectionRef = collection(db, 'users', userId, 'shoppingList');
            await addDoc(shoppingCartCollectionRef, {
                name: itemDelete.name,
                addedAt: new Date(),
            });
            console.log(`Item ${itemDelete.name} added to pantry`);
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

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
            {/* {itemFinish ? (<div> */}
                <React.Fragment>
                    <Dialog
                        open={open}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                        {"Shopping List Update"}
                        </DialogTitle>
                        <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Since this item is not in your pantry anymore, do you want to add it to your shopping list?
                        </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={() => handleClose(itemDelete, false)}>NO</Button>
                        <Button onClick={() => handleClose(itemDelete, true)} autoFocus>
                            YES
                        </Button>
                        </DialogActions>
                    </Dialog>
                </React.Fragment>
                {/* </div>)  */}
             {/* : (null)} */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', width: '100%', maxWidth: '600px' }}>
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
                <Button variant="contained" onClick={handleAddItem}>
                    Add Item
                </Button>
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
                {pantry.map((item) => (
                    <Card key={item.id} sx={{ minWidth: 275, maxWidth: 400 }}>
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
                            <Typography gutterBottom variant="body2">
                                Update Item
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <RemoveIcon onClick={() => removeFromInventory(item.id, item.name)} style={{ cursor: 'pointer' }} />
                                <AddIcon onClick={() => addToInventory(item.id)} style={{ cursor: 'pointer', marginRight: '8px' }} />
                            </Box>
                        </Box>
                    </Card>
                ))}
            </Box>
        </div>
    );
}
