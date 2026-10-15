import {
  push,
  ref,
  get,
  query,
  limitToLast,
  onValue,
} from "firebase/database";

import { db } from "../firebase";

const readingsPath = (userId, fieldId) =>
  `users/${userId}/fields/${fieldId}/sensorReadings`;

const toReadingList = (snapshot) => {
  if (!snapshot.exists()) {
    return [];
  }

  const readings = [];

  snapshot.forEach((child) => {
    readings.push({
      id: child.key,
      ...child.val(),
    });
  });

  return readings.sort(
    (a, b) =>
      new Date(b.timestamp || b.createdAt || 0) -
      new Date(a.timestamp || a.createdAt || 0)
  );
};

export const saveSensorReading = async (
  userId,
  fieldId,
  sensorData
) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!fieldId) {
    throw new Error("Field ID is required");
  }

  const newReadingRef = await push(
    ref(db, readingsPath(userId, fieldId)),
    {
      ...sensorData,
      timestamp:
        sensorData?.timestamp ||
        new Date().toISOString(),
    }
  );

  return newReadingRef.key;
};

export const getSensorReadings = async (
  userId,
  fieldId
) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!fieldId) {
    throw new Error("Field ID is required");
  }

  const snapshot = await get(
    ref(db, readingsPath(userId, fieldId))
  );

  return toReadingList(snapshot);
};

// Only the most recent readings are streamed to the dashboard.
const RECENT_READINGS_LIMIT = 30;

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

  const recentReadings = query(
    ref(db, readingsPath(userId, fieldId)),
    limitToLast(RECENT_READINGS_LIMIT)
  );

  // onValue returns its own unsubscribe function.
  return onValue(
    recentReadings,
    (snapshot) => onUpdate(toReadingList(snapshot)),
    (error) => onError?.(error)
  );
<<<<<<< HEAD
};
export const subscribeLiveSensors = (onUpdate, onError) =>
  onValue(
    ref(db, "sensors"),
    (snap) => {
      const v = snap.val() || {};
      const env = v.environment || {};
      const irr = v.irrigation || {};
      onUpdate({
        ...env,
        ...irr,
        pump: irr.pumpstatus ?? irr.pumpStatus,
        timestamp: new Date().toISOString(), // marks it as "live"
      });
    },
    (e) => onError?.(e)
  );
=======
};
>>>>>>> a14f7c100e58b059d90a93f072994e087a6aeef6
