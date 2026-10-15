import {
  ref,
  onValue,
  off,
  push,
  set,
  get,
  query,
  orderByChild,
  equalTo,
  update,
} from "firebase/database";

import { db } from "../firebase";

const WORKERS_PATH = "workers";
const WORKER_REQUESTS_PATH = "workerRequests";

export const subscribeWorkers = (
  onUpdate,
  onError
) => {
  const workersRef = ref(
    db,
    WORKERS_PATH
  );

  const handleValue = (snapshot) => {
    if (!snapshot.exists()) {
      onUpdate([]);
      return;
    }

    const workers = [];

    snapshot.forEach((child) => {
      workers.push({
        id: child.key,
        ...child.val(),
      });
    });

    onUpdate(workers);
  };

  const handleError = (error) => {
    onError?.(error);
  };

  onValue(
    workersRef,
    handleValue,
    handleError
  );

  return () => {
    off(
      workersRef,
      "value",
      handleValue
    );
  };
};

export const getWorkers = async () => {
  const snapshot = await get(
    ref(db, WORKERS_PATH)
  );

  if (!snapshot.exists()) {
    return [];
  }

  const workers = [];

  snapshot.forEach((child) => {
    workers.push({
      id: child.key,
      ...child.val(),
    });
  });

  return workers;
};

export const sendWorkerConnectionRequest = async ({
  ownerId,
  fieldId,
  workerId,
}) => {
  if (!ownerId) {
    throw new Error("Owner ID is required");
  }

  if (!fieldId) {
    throw new Error("Field ID is required");
  }

  if (!workerId) {
    throw new Error("Worker ID is required");
  }

  const requestRef = push(
    ref(db, WORKER_REQUESTS_PATH)
  );

  await set(requestRef, {
    ownerId,
    fieldId,
    workerId,
    status: "pending",
    createdAt: new Date().toISOString(),
  });

  return requestRef.key;
};
/**
 * Live list of connection requests sent by this owner.
 * Requires  "workerRequests": { ".indexOn": ["ownerId"] }  in the
 * Realtime Database rules.
 */
export const subscribeOwnerWorkerRequests = (
  ownerId,
  onUpdate,
  onError
) => {
  if (!ownerId) {
    onUpdate([]);
    return () => {};
  }

  const ownerRequests = query(
    ref(db, WORKER_REQUESTS_PATH),
    orderByChild("ownerId"),
    equalTo(ownerId)
  );

  return onValue(
    ownerRequests,
    (snapshot) => {
      const requests = [];

      snapshot.forEach((child) => {
        requests.push({ id: child.key, ...child.val() });
      });

      onUpdate(requests);
    },
    (error) => onError?.(error)
  );
};

/**
 * Live profile of the logged-in worker (workers/{workerId}).
 */
export const subscribeWorkerProfile = (workerId, onUpdate, onError) => {
  if (!workerId) {
    onUpdate(null);
    return () => {};
  }

  return onValue(
    ref(db, `${WORKERS_PATH}/${workerId}`),
    (snapshot) =>
      onUpdate(
        snapshot.exists() ? { id: workerId, ...snapshot.val() } : null
      ),
    (error) => onError?.(error)
  );
};

/**
 * Live list of connection requests addressed to this worker.
 * Requires  "workerRequests": { ".indexOn": ["ownerId", "workerId"] }
 */
export const subscribeWorkerRequests = (workerId, onUpdate, onError) => {
  if (!workerId) {
    onUpdate([]);
    return () => {};
  }

  const mine = query(
    ref(db, WORKER_REQUESTS_PATH),
    orderByChild("workerId"),
    equalTo(workerId)
  );

  return onValue(
    mine,
    (snapshot) => {
      const requests = [];

      snapshot.forEach((child) => {
        requests.push({ id: child.key, ...child.val() });
      });

      requests.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );

      onUpdate(requests);
    },
    (error) => onError?.(error)
  );
};

/**
 * Accept or decline a request. Accepting also writes assignedWorkerId on
 * the owner's field, in the same atomic update, so the owner's dashboard
 * flips to "Connected".
 */
export const respondToWorkerRequest = async ({ request, workerId, accept }) => {
  if (!request?.id) throw new Error("Request is required");
  if (!workerId) throw new Error("Worker ID is required");
  if (request.workerId !== workerId) {
    throw new Error("This request is not addressed to you");
  }

  const statusSnap = await get(
    ref(db, `${WORKER_REQUESTS_PATH}/${request.id}/status`)
  );

  if (statusSnap.val() !== "pending") {
    throw new Error("This request has already been answered");
  }

  if (accept) {
    const assigned = await get(
      ref(
        db,
        `users/${request.ownerId}/fields/${request.fieldId}/assignedWorkerId`
      )
    );

    if (assigned.exists() && assigned.val() !== workerId) {
      throw new Error("This field already has another worker assigned");
    }
  }

  const updates = {
    [`${WORKER_REQUESTS_PATH}/${request.id}/status`]: accept
      ? "accepted"
      : "rejected",
    [`${WORKER_REQUESTS_PATH}/${request.id}/respondedAt`]:
      new Date().toISOString(),
  };

  if (accept) {
    updates[
      `users/${request.ownerId}/fields/${request.fieldId}/assignedWorkerId`
    ] = workerId;
  }

  await update(ref(db), updates);
};