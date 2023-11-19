import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: "AIzaSyCTubo9ogvtpBcpCc3_6etoJDBLrrLztEc",
  authDomain: "smartexpense-90e04.firebaseapp.com",
  projectId: "smartexpense-90e04",
  storageBucket: "smartexpense-90e04.appspot.com",
  messagingSenderId: "70093435",
  appId: "1:70093435:web:20978de9328bc117fb30de",
  measurementId: "G-ZEGDJ10RS3"
};


// Initialize Firebase

const app = initializeApp(firebaseConfig);


export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
