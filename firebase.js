// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore"
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCyHQXbcNgDTe2W8Q7UO5xvaCAymNYAhx4",
  authDomain: "flashcardsaas-45196.firebaseapp.com",
  projectId: "flashcardsaas-45196",
  storageBucket: "flashcardsaas-45196.appspot.com",
  messagingSenderId: "917612823796",
  appId: "1:917612823796:web:d7d7f702efa3f7bb308aa1",
  measurementId: "G-61RCHJK5SM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export {db}