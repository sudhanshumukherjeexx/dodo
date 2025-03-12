// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBOCbifrfsZmime0_nIMB00lc39dt_KZgU",
  authDomain: "dodo-6896f.firebaseapp.com",
  projectId: "dodo-6896f",
  storageBucket: "dodo-6896f.firebasestorage.app",
  messagingSenderId: "117127975562",
  appId: "1:117127975562:web:e076f7c303c6c48f5a5373",
  measurementId: "G-VGHW9E70M8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app)
const db = getFirestore(app)


// Export the firebase services we'll use
export{auth, db};