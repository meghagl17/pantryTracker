"use client"
 
import Link from 'next/link'


export default function Home() {
    
    return (
        <div>
            <Link href="/pantry"> Pantry</Link>
            <Link href="/shoppingList"> Shopping List</Link>
        </div>
    );
}
