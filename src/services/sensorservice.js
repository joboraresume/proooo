import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit
} from "firebase/firestore";

import { db } from "../firebase";

export const saveSensorReading = async (userId, sensorData) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const readingsRef = collection(
    db,
    "users",
    userId,
    "sensorReadings"
  );

  const docRef = await addDoc(readingsRef, {
    ...sensorData,
    timestamp: new Date()
  });

  return docRef.id;
};