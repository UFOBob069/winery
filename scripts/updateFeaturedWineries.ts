import { db } from '../app/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

async function setWineryAsFeatured(wineryId: string) {
  try {
    const wineryRef = doc(db, 'wineries', wineryId);
    await updateDoc(wineryRef, {
      featured: true
    });
    console.log(`Winery ${wineryId} set as featured`);
  } catch (e) {
    console.error("Error updating winery:", e);
  }
}

// Example usage:
setWineryAsFeatured('your-winery-id'); 