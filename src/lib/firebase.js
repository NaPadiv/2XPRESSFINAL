import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA_dTVJCRnzuiPMjN5DPJ_yUfxAhRwv5Y8",
  authDomain: "final2xpress.firebaseapp.com",
  projectId: "final2xpress",
  storageBucket: "final2xpress.appspot.com",
  messagingSenderId: "481042749805",
  appId: "1:481042749805:web:921eca689bd6f4e3f76264",
  measurementId: "G-VDVFWTSEJR"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()

