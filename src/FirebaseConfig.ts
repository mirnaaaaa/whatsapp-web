import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyAjzniB--n-a4Uo99cDVF7kWrgmMWTdvh0",
  authDomain: "chatting-4ad84.firebaseapp.com",
  projectId: "chatting-4ad84",
  storageBucket: "chatting-4ad84.appspot.com",
  messagingSenderId: "572266162291",
  appId: "1:572266162291:web:c8654f74860e5a00d42206",
  measurementId: "G-X16HTV9C75"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app)

