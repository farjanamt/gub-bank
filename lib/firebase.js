import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔥 Firebase config (console theke copy kora)
const firebaseConfig = {
  apiKey: "AIzaSyBFlJcHpaUGlvkbE7T_8S5XuVsK7C5GXww",
  authDomain: "gub-bank-d3bd8.firebaseapp.com",
  projectId: "gub-bank-d3bd8",
  storageBucket: "gub-bank-d3bd8.firebasestorage.app",
  messagingSenderId: "789628867929",
  appId: "1:789628867929:web:06954f50f2279b0e996848",
};

// Initialize
const app = initializeApp(firebaseConfig);

// 🔥 EXPORTS (VERY IMPORTANT)
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app); // 🔥 EI LINE TA MUST
