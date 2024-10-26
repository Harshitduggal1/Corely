// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
   authDomain: "corey-17884.firebaseapp.com",
   projectId: "corey-17884",
   storageBucket: "corey-17884.appspot.com",
   messagingSenderId: "420702834091",
   appId: "1:420702834091:web:45979e4258847dd78496ee",
   measurementId: "G-TJ34GF3807"
 };


// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const storage = getStorage(app);
