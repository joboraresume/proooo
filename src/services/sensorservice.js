import { push, ref, get, onValue, off } from "firebase/database";
import { db } from "../firebase";

const readingsPath = (userId, fieldId) =>
  `users/${userId}/fields/${fieldId}/sensorReadings`;

const toReadingList = (snapshot) => {
  if (!snapshot.exists()) return [];

  const readings = [];
  snapshot.forEach((child) => {
    readings.push({ id: child.key, ...child.val() });
  });

  return readings.sort(
    (a, b) =>
      new Date(b.timestamp || b.createdAt || 0) -
      new Date(a.timestamp || a.createdAt || 0)
  );
};

export const saveSensorReading = async (userId, fieldId, sensorData) => {
  if (!userId) {
    throw new Error("User ID is required");
  }
  if (!fieldId) {
    throw new Error("Field ID is required");
  }

  const newReadingRef = await push(ref(db, readingsPath(userId, fieldId)), {
    ...sensorData,
    timestamp: sensorData?.timestamp || new Date().toISOString(),
  });

  return newReadingRef.key;
};

export const getSensorReadings = async (userId, fieldId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }
  if (!fieldId) {
    throw new Error("Field ID is required");
  }

  const snapshot = await get(ref(db, readingsPath(userId, fieldId)));
  return toReadingList(snapshot);
};

/** Live listener for one field. Returns unsubscribe function. */
export const subscribeSensorReadings = (
  userId,
  fieldId,
  onUpdate,
  onError
) => {
  if (!userId) {
    onError?.(new Error("User ID is required"));
    return () => {};
  }
  if (!fieldId) {
    onError?.(new Error("Field ID is required"));
    return () => {};
  }

  const readingsRef = ref(db, readingsPath(userId, fieldId));

  const handleValue = (snapshot) => {
    onUpdate(toReadingList(snapshot));
  };

  const handleError = (error) => {
    onError?.(error);
  };

  onValue(readingsRef, handleValue, handleError);

  return () => off(readingsRef, "value", handleValue);
};
