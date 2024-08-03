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

import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';


import { collection, addDoc, getDocs, query, updateDoc, getDoc, doc, deleteDoc} from 'firebase/firestore';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function Home() {
    const [shoppingList, setShoppingList] = useState([]);
    const [doneList, setDoneList] = useState([]);
    const [itemName, setItemName] = useState('');
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState('');

    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

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

    const updateInventory = async (itemName) => {
        if (!user) return; 
        const userId = user.uid;
        const pantryCollectionRef = collection(db, 'users', userId, 'shoppingList');
        await addDoc(pantryCollectionRef, {
            name: itemName,
            addedAt: new Date(),
        });
        console.log(`Item ${itemName} added to pantry`);
    }

    const handleAddItem = async () => {
        if (itemName.trim() !== '') {
            await updateInventory(itemName);
            setItemName('');
            handleGetItems();
        } else {
            alert('Please provide item name');
            console.error('Please provide item name');
        }
    };

    const handleGetItems = async () => {
        if (!user) return;
        const userId = user.uid;
        const shoppingListCollectionRef = collection(db, 'users', userId, 'shoppingList');
        const q = query(shoppingListCollectionRef);
        const querySnapshot = await getDocs(q);

        const items = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));

        setShoppingList(items);
        console.log("shopping List items:", items);

        const doneCollectionRef = collection(db, 'users', userId, 'done');
        const q2 = query(doneCollectionRef);
        const querySnapshot2 = await getDocs(q2);

        const items2 = querySnapshot2.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));

        setDoneList(items2);
        console.log("Done List items:", items2);
    };

    const addToDone = async (itemName, itemId) => {
        if (!user) return; 
        const userId = user.uid;
        const doneCollectionRef = collection(db, 'users', userId, 'done');
        await addDoc(doneCollectionRef, {
            name: itemName,
        });

        try {
            const itemDocRef = doc(db, 'users', userId, 'shoppingList', itemId);
            await deleteDoc(itemDocRef);
            console.log(`Item ${itemId} deleted successfully`);
          } catch (error) {
            console.error('Error deleting item:', error.message);
        }

        handleGetItems();
        console.log(`Item ${itemName} added to Done`);
    }

    const DeleteDoneItems = async () => {
        if (!user) return; 
        const userId = user.uid;
        const doneCollectionRef = collection(db, 'users', userId, 'done');
        const querySnapshot = await getDocs(doneCollectionRef);
        const deletePromises = querySnapshot.docs.map(docSnapshot => {
            return deleteDoc(doc(db, 'users', userId, 'done', docSnapshot.id));
        });
        await Promise.all(deletePromises);
        handleGetItems();
    }

    const handleClose = (deleteItems) => {
        if(deleteItems){
            DeleteDoneItems();
        }
        setOpen(false);
    };
    
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
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
                <Button variant="contained" onClick={handleAddItem}>
                    Add Item
                </Button>
            </div>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                margin: '0 auto',
                padding: '20px',
                boxSizing: 'border-box',
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '20px',
                    width: '100%',
                    maxWidth: '600px', // Set a max width to limit the width of the column
                }}>
                    {shoppingList.map((item) => (
                        <Card key={item.id} sx={{ 
                            width: 300, 
                            margin: 'auto', 
                            marginTop: '20px', 
                            boxShadow: '0px 4px 10px rgba(255, 0, 0, 0.5)' // Red shadow
                            }}>
                            <CardContent>
                            <Box display="flex" alignItems="center">
                                <FormControlLabel
                                control={<Checkbox onChange={() => addToDone(item.name, item.id)} />}
                                labelPlacement="start"
                                sx={{ marginRight: 2 }}
                                />
                                <Typography variant="h6">
                                {item.name}
                                </Typography>
                            </Box>
                            </CardContent>
                        </Card>
                        ))}

                    <div>Done list</div>
                    {doneList.map((item) => (
                        <Card 
                            key={item.id} 
                            sx={{ 
                                width: 300, 
                                margin: 'auto', 
                                marginTop: '20px',
                                boxShadow: '0px 4px 10px rgba(0, 100, 0, 0.5)'
                            }}
                        >
                            <CardContent>
                                <Box display="flex" alignItems="center">
                                    <Typography variant="h6">
                                        {item.name}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
            <React.Fragment>
                <Button
                variant="contained"
                onClick={handleClickOpen}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    zIndex: 1000, // Ensures the button is above other elements
                }}
                >
                Done Shopping?
                </Button>
                <Dialog
                    open={open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle>{"Delete DONE items?"}</DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        !This action will delete all the items that you have shopped!
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={() => handleClose(false)}>NO</Button>
                    <Button onClick={() => handleClose(true)} autoFocus>
                        YES
                    </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        </div>
    );
}
