import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCqeEOH6DRoLl-zppVRGx3ZPvLP_IfdZtg",
  authDomain: "taskbuddy-8f586.firebaseapp.com",
  projectId: "taskbuddy-8f586",
  storageBucket: "taskbuddy-8f586.firebasestorage.app",
  messagingSenderId: "664466407872",
  appId: "1:664466407872:web:db839cc6d76e32e9b40825",
  measurementId: "G-EWNFQKHS1T"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider(); 