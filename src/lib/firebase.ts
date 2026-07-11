import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDlREiC3KL56PsQCv5lNgiGCXnm3gCLmbY",
  authDomain: "yachty-arbor-cv8b6.firebaseapp.com",
  projectId: "yachty-arbor-cv8b6",
  storageBucket: "yachty-arbor-cv8b6.firebasestorage.app",
  messagingSenderId: "374079132433",
  appId: "1:374079132433:web:22d65d174d3933d73cf2b0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with the specific custom database ID provided in config
export const db = getFirestore(app, "ai-studio-richapandeyportf-b8ab621d-3115-42e5-9538-2f9ee97d430f");
