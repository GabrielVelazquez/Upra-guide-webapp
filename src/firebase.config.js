// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
//import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// npm install react-router-dom@latest
// npm install firebase

// Your web app's Firebase configuration
const firebaseConfig = {

  apiKey: "AIzaSyATTqoOtcexArt9vLiCcQtFDmLQAlUNFm8",
  authDomain: "upra-guide.firebaseapp.com",
  projectId: "upra-guide",
  storageBucket: "upra-guide.appspot.com",
  messagingSenderId: "331170659707",
  appId: "1:331170659707:web:b717a0c6b4c158624e11de"

  /* //Este es el segundo proyecto de firestore por si se pasa del limite diario
  apiKey: "AIzaSyBLUhIIQuQG3dk1c8tVHjln6Uc1rRJ4zPI",
  authDomain: "upra-guide-8cb02.firebaseapp.com",
  projectId: "upra-guide-8cb02",
  storageBucket: "upra-guide-8cb02.appspot.com",
  messagingSenderId: "235639814274",
  appId: "1:235639814274:web:b87e5acc6ef68d645c1c9b"
  */
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
//const analytics = getAnalytics(app);

export { auth, firestore, storage };