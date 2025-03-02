import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseconfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "eshop-e614e.firebaseapp.com",
  projectId: "eshop-e614e",
  storageBucket: "eshop-e614e.appspot.com",
  messagingSenderId: "272954111023",
  appId: "1:272954111023:web:351cec4312189ed68e82da",
  measurementId: "G-4KXN3S2QKC",
};

const app = initializeApp(firebaseconfig);
const auth = getAuth(app);

export { auth };
