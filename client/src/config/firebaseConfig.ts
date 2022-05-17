// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDnO_PEmiLMKnQXP6si1hkqk4BHkmsb7dQ",
  authDomain: "talkiee-949f5.firebaseapp.com",
  projectId: "talkiee-949f5",
  storageBucket: "talkiee-949f5.appspot.com",
  messagingSenderId: "217026674701",
  appId: "1:217026674701:web:7510864c9f3910b3229544",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export default app;

export { auth };
