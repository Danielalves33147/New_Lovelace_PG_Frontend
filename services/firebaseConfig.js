import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Módulo de autenticação
import { getFirestore } from "firebase/firestore"; // Módulo Firestore (banco de dados)


const firebaseConfig = {
  apiKey: "AIzaSyACrxQl_L8Oa-RMf6ix4kWpp53RHQCPcSI",
  authDomain: "lovebancolace.firebaseapp.com",
  projectId: "lovebancolace",
  storageBucket: "lovebancolace.appspot.com",
  messagingSenderId: "394716666524",
  appId: "1:394716666524:web:3bef1255c9563b7bdeab59",
  measurementId: "G-W0TPLD3YFS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

