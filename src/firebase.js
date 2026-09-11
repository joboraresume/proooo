import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBwoAGoENMggSOLLeXsnrph27KYeI39KGc",
  authDomain: "agriculture-af8cf.firebaseapp.com",
  databaseURL: "https://agriculture-af8cf-default-rtdb.firebaseio.com",
  projectId: "agriculture-af8cf",
  storageBucket: "agriculture-af8cf.firebasestorage.app",
  messagingSenderId: "32368038494",
  appId: "1:32368038494:web:55cfc29c1ce70a1f1b9acf",
  measurementId: "G-YMDR5J0L35",
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);

export default app;
