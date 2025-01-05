// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
const firebaseConfig = {
  apiKey: "AIzaSyCpR_7SXe1Ko4wfB7WY5ACUEWzse4IW8c0",
  authDomain: "task-management-app-9f5c7.firebaseapp.com",
  projectId: "task-management-app-9f5c7",
  storageBucket: "task-management-app-9f5c7.firebasestorage.app",
  messagingSenderId: "99892807522",
  appId: "1:99892807522:web:db379da9b2b1758574ce3b",
  measurementId: "G-84LW6P9HGE",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };
