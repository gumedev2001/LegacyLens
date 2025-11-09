import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // <- AGREGAR ESTE IMPORT
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwUHEFEu9xen4-j-vo7jRbKjNx4vPd1yE",
  authDomain: "agnilegacylens-a4e8c.firebaseapp.com",
  projectId: "agnilegacylens-a4e8c",
  storageBucket: "agnilegacylens-a4e8c.firebasestorage.app", // <- Esto ya está bien
  messagingSenderId: "724255733833",
  appId: "1:724255733833:web:b916ce5923d94c5e7ea798",
  measurementId: "G-9FP0CKGGL3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth and Firestore (funcionan en servidor y cliente)
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Firebase Storage <- AGREGAR ESTA LÍNEA
export const storage = getStorage(app);

// Analytics solo en el cliente (evita error SSR)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;