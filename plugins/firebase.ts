// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCZJcCtYfcMTOeL2TnoVNvJq2MFEMOCoqs",
    authDomain: "n11-web.firebaseapp.com",
    projectId: "n11-web",
    storageBucket: "n11-web.firebasestorage.app",
    messagingSenderId: "736279801392",
    appId: "1:736279801392:web:e8ab808ff001fb464f87f5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app); 
const auth = getAuth(app);


// Nuxt plugin olarak export edin
export default defineNuxtPlugin(() => {
  return {
    provide: {
      firebase: app,
      storage,
      db,
      auth
    }
  };
});