// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Configuración de tu proyecto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBqri7gnu0QsWeid_LdnJz2Y4AQLHt4JQg",
  authDomain: "ro-app-e1ee9.firebaseapp.com",
  projectId: "ro-app-e1ee9",
  storageBucket: "ro-app-e1ee9.firebasestorage.app",
  messagingSenderId: "292988232214",
  appId: "1:292988232214:web:39bf02fd3a4ff016afcb37"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios para usar en la app
export const db = getFirestore(app); // Firestore
export const auth = getAuth(app);    // Auth
export default app;
