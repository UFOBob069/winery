import { db } from '../app/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

const winery = {
  id: "1",
  name: "The Austin Winery",
  location: "440 E St Elmo Rd A1, Austin, TX 78745",
  rating: 4.8,
  imageUrl: "https://lh5.googleusercontent.com/p/AF1QipPSWkfQMmi0h7cMh500-k-no",
  description: "unique and unconventional setting, housed in what appears to be a repurposed warehouse or industrial space - almost like a hangar",
  siteUrl: "http://www.theaustinwinery.com/",
  featured: true
};

async function addWinery() {
  try {
    const docRef = await addDoc(collection(db, "wineries"), winery);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

addWinery(); 