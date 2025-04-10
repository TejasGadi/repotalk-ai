// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCrlX9vVIj2xVW3-yqQhOwVTl9K-nUyt9Q",
  authDomain: "repotalk-ai.firebaseapp.com",
  projectId: "repotalk-ai",
  storageBucket: "repotalk-ai.firebasestorage.app",
  messagingSenderId: "363047568179",
  appId: "1:363047568179:web:214aa0191b8721677ab446",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app)