import { push, ref, onValue, get } from "firebase/database";

import { db } from "../firebase";

const fieldsPath = (userId) => `users/${userId}/fields`;

/**
 * Live list of the owner's fields.
 * `sensorReadings` is stripped out of each field because readings are
 * streamed separately by sensorService (keeps the field list light and
 * stops every new reading from re-rendering the whole list).
 */
export const subscribeFields = (userId, onUpdate, onError) => {
  if (!userId) {
    onError?.(new Error("User ID is required"));
    return () => {};
  }

  return onValue(
    ref(db, fieldsPath(userId)),
    (snapshot) => {
      const fields = [];

      snapshot.forEach((child) => {
        const value = child.val();

        if (value && typeof value === "object") {
          // eslint-disable-next-line no-unused-vars
          const { sensorReadings, ...data } = value;
          fields.push({ id: child.key, ...data });
        }
      });

      fields.sort(
        (a, b) =>
          new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
      );

      onUpdate(fields);
    },
    (error) => onError?.(error)
  );
};

/**
 * Register a new field for the owner. Returns the new field id.
 */
export const addField = async (userId, data) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const fieldName = data?.fieldName?.trim();
  const area = Number(data?.area);

  if (!fieldName) {
    throw new Error("Field name is required");
  }

  if (!Number.isFinite(area) || area <= 0) {
    throw new Error("Enter a valid area greater than 0");
  }

  const payload = {
    ownerId: userId,
    fieldName,
    area,
    createdAt: new Date().toISOString(),
  };

  [
    "cropType",
    "soilType",
    "country",
    "state",
    "district",
    "city",
    "address",
    "sensorDeviceId",
  ].forEach((key) => {
    const value = data?.[key]?.toString().trim();
    if (value) payload[key] = value;
  });

  ["latitude", "longitude"].forEach((key) => {
    const raw = data?.[key];
    if (raw !== undefined && raw !== null && `${raw}`.trim() !== "") {
      const number = Number(raw);
      if (!Number.isFinite(number)) {
        throw new Error(`${key} must be a number`);
      }
      payload[key] = number;
    }
  });

  const newRef = await push(ref(db, fieldsPath(userId)), payload);

  return newRef.key;
};

/**
 * Live details of one field (without its sensorReadings).
 */
export const subscribeField = (ownerId, fieldId, onUpdate, onError) => {
  if (!ownerId || !fieldId) {
    onUpdate(null);
    return () => {};
  }

  return onValue(
    ref(db, `${fieldsPath(ownerId)}/${fieldId}`),
    (snapshot) => {
      if (!snapshot.exists()) {
        onUpdate(null);
        return;
      }

      // eslint-disable-next-line no-unused-vars
      const { sensorReadings, ...data } = snapshot.val() || {};
      onUpdate({ id: fieldId, ownerId, ...data });
    },
    (error) => onError?.(error)
  );
};

/**
 * Best-effort owner display name. Adjust the paths to wherever your app
 * stores the user's name.
 */
export const getOwnerName = async (ownerId) => {
  if (!ownerId) return "";

  for (const key of ["name", "displayName", "fullName"]) {
    try {
      const snap = await get(ref(db, `users/${ownerId}/${key}`));
      if (snap.exists() && snap.val()) return String(snap.val());
    } catch (err) {
      return "";
    }
  }

  return "";
};