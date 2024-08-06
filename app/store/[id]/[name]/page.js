"use client"
import { auth, db } from '../../../../firebase';
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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Checkbox from '@mui/material/Checkbox';
import { FormControlLabel, IconButton } from '@mui/material'

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

import { collection, addDoc, getDocs, query, updateDoc, getDoc, doc, deleteDoc} from 'firebase/firestore';
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation';  // Use next/navigation for app directory routing

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

    const params = useParams();
    const [param, setParam] = useState({id: '', name: ''});

    const [shoppingList, setShoppingList] = useState([]);
    const [doneList, setDoneList] = useState([]);
    const [itemName, setItemName] = useState('');
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState('');

    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    const [open, setOpen] = React.useState(false);

    const router = useRouter();  // Initialize useRouter from next/navigation

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleReturnToStores = () => {
        router.push('/stores'); 
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
                setParam({id: params.id, name: params.name})
                setLoading(false);
            } else {
                setLoading(true);
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
        const shoppingListCollectionRef = collection(db, 'users', userId, 'stores', param.id, 'shoppingList');
        await addDoc(shoppingListCollectionRef, {
            name: itemName,
            addedAt: new Date(),
        });
        console.log(`Item ${itemName} added to shoppingList`);
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
        setLoading(true);
        if (!user) return;
        const userId = user.uid;
        const shoppingListCollectionRef = collection(db, 'users', userId, 'stores', param.id, 'shoppingList');
        const q = query(shoppingListCollectionRef);
        const querySnapshot = await getDocs(q);

        const items = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));

        setShoppingList(items);
        console.log("shopping List items:", items);
        console.log('id of store from specific store page: ', param.id);

        const doneCollectionRef = collection(db, 'users', userId, 'stores', param.id, 'done');
        const q2 = query(doneCollectionRef);
        const querySnapshot2 = await getDocs(q2);

        const items2 = querySnapshot2.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));

        setDoneList(items2);
        setLoading(false);
        console.log("Done List items:", items2);
    };

    const addToDone = async (itemName, itemId) => {
        if (!user) return; 
        const userId = user.uid;
        const doneCollectionRef = collection(db, 'users', userId,'stores', param.id, 'done');
        await addDoc(doneCollectionRef, {
            name: itemName,
        });

        try {
            const itemDocRef = doc(db, 'users', userId, 'stores', param.id, 'shoppingList', itemId);
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
        const doneCollectionRef = collection(db, 'users', userId, 'stores', param.id, 'done');
        const querySnapshot = await getDocs(doneCollectionRef);
        const deletePromises = querySnapshot.docs.map(docSnapshot => {
            return deleteDoc(doc(db, 'users', userId, 'stores', param.id, 'done', docSnapshot.id));
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
                <Button sx={{ backgroundColor: '#3f4f22', '&:hover': {backgroundColor: '#2e3b1a',}, color:'white'}} onClick={handleAddItem}>
                        Add Item
                </Button>
            </div>
            
            <div style={{alignItems: 'center', gap: '10px', marginBottom: '10px', width: '100%', maxWidth: '600px' }}>{shoppingList.length === 0 && loading === false ? (
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
      🛒 Your Shopping List is currently empty. Start adding items to keep track of items to shop!
    </Typography>
  </Box>
) : null}</div>


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

{!loading && shoppingList.length > 0 ?  <Box 
    sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      gap: 1, // Space between text and icon
      margin: '10px 0', // Add margin for spacing
      backgroundColor: '#e8f5e9', // Background color
      padding: '10px', // Padding around the content
      borderRadius: '8px', // Rounded corners
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' // Subtle shadow
    }}
  >
    <Typography 
      variant="h4"
      sx={{ 
        color: '#3f4f22', // Custom color
        fontWeight: 'bold',
        textAlign: 'center', 
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        fontSize: '2rem' // Increase the font size
      }}
    >
        Buy list
    </Typography>
    <ArrowDownwardIcon 
      sx={{ 
        color: '#3f4f22', // Match the text color
        fontSize: '2rem' // Match the font size
      }} 
    />
  </Box> : (null)}

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

{!loading && doneList.length != 0 ? <Box 
    sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      gap: 1, // Space between text and icon
      margin: '10px 0', // Add margin for spacing
      backgroundColor: '#e8f5e9', // Background color
      padding: '10px', // Padding around the content
      borderRadius: '8px', // Rounded corners
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' // Subtle shadow
    }}
  >
    <Typography 
      variant="h4"
      sx={{ 
        color: '#3f4f22', // Custom color
        fontWeight: 'bold',
        textAlign: 'center', 
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        fontSize: '2rem' // Increase the font size
      }}
    >
      Done List
    </Typography>
    <ArrowDownwardIcon 
      sx={{ 
        color: '#3f4f22', // Match the text color
        fontSize: '2rem' // Match the font size
      }} 
    />
  </Box> : (null)}
                    {doneList.map((item) => (
                        <Card 
                            key={item.id} 
                            sx={{ 
                                width: 300, 
                                margin: 'auto', 
                                marginTop: '10px',
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

            <IconButton 
                onClick={handleReturnToStores} 
                sx={{ backgroundColor: '#3f4f22', '&:hover': {backgroundColor: '#2e3b1a',}, color:'white'}}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    left: '20px',
                    zIndex: 1000, // Ensures the button is above other elements
                }}
            >
                <ArrowBackIcon />
                {/* <ArrowDownwardIcon /> */}
            </IconButton>

            <React.Fragment>
                <Button
                variant="contained"
                onClick={handleClickOpen}
                sx={{ backgroundColor: '#3f4f22', '&:hover': {backgroundColor: '#2e3b1a',}, color:'white'}}
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
                        This action will delete all the items that you have shopped
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <CustomButton onClick={() => handleClose(false)}>NO</CustomButton>
                    <CustomButton onClick={() => handleClose(true)} autoFocus>
                        YES
                    </CustomButton>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        </div>
    );
}
