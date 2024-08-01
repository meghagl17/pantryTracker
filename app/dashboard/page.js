// import Image from "next/image";
// import styles from "./page.module.css";
"use client"
import { auth, db } from '../../firebase';
import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material'
import { doc, setDoc, collection, addDoc, getDoc } from 'firebase/firestore';


export default function Home() {
    const [pantry, setPantry] = useState([]);
    const [itemName, setItemName] = useState('');
    const [itemQuantity, setItemQuantity] = useState('');
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState('');
    // const user = auth.currentUser;
    // const userId = user.uid;

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          if (user) {
            setUser(user);
            setLoading(false);
          } else {
            setLoading(false);
            // Handle the case where there is no user (e.g., redirect to login)
          }
        });
    
        // Cleanup subscription on unmount
        return () => unsubscribe();
      }, []);

      useEffect(() => {
        if (user) {
          handleGetItem();
        }
      }, [user]);
    

    const updateInventory = async (itemName, itemQuantity) => {
        if (!user) return; 
        const userId = user.uid;
        const pantryCollectionRef = collection(db, 'users', userId, 'pantry');
        await addDoc(pantryCollectionRef, {
            name: itemName,
            addedAt: new Date(),  // Optional: Add a timestamp or any other data
            quantity: itemQuantity,
        });
        console.log(`Item ${itemName} added to pantry`);
    }

    const handleAddItem = async () => {
        if (itemName.trim() !== '') {
          await updateInventory(itemName, itemQuantity);
          setItemName('');  // Clear the input field
          setItemQuantity('');
        } else {
          console.error('Item name is required');
        }
      };

    const handleGetItem = async () => {
        if (!user) return; 
        const userId = user.uid;
        const docRef = doc(db, 'users', userId, 'pantry');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
        } else {
        // docSnap.data() will be undefined in this case
            console.log("No such document!");
        }
    }
    
    // if(userName){
    //     setUser(userName);
    //     console.log(userName)
    // }
    return (
        <div>
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="Enter item name"
          />
          <input
            type="text"
            value={itemQuantity}
            onChange={(e) => setItemQuantity(e.target.value)}
            placeholder="Enter item wuantity"
          />
          <button onClick={handleAddItem}>Add Item</button>
        </div>
      );
}
