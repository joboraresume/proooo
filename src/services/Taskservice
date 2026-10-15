import {
  ref,
  onValue,
  update,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";

import { db } from "../firebase";

const TASKS_PATH = "workerTasks";

/**
 * Live list of tasks assigned to a worker.
 * Task shape: { ownerId, fieldId, workerId, title, type, scheduledAt,
 *               status: "pending" | "in_progress" | "completed" }
 * Requires  "workerTasks": { ".indexOn": ["workerId"] }  in the rules.
 */
export const subscribeWorkerTasks = (workerId, onUpdate, onError) => {
  if (!workerId) {
    onUpdate([]);
    return () => {};
  }

  const mine = query(
    ref(db, TASKS_PATH),
    orderByChild("workerId"),
    equalTo(workerId)
  );

  return onValue(
    mine,
    (snapshot) => {
      const tasks = [];

      snapshot.forEach((child) => {
        tasks.push({ id: child.key, ...child.val() });
      });

      tasks.sort(
        (a, b) =>
          new Date(a.scheduledAt || a.createdAt || 0) -
          new Date(b.scheduledAt || b.createdAt || 0)
      );

      onUpdate(tasks);
    },
    (error) => onError?.(error)
  );
};

export const updateTaskStatus = async (taskId, status) => {
  if (!taskId) throw new Error("Task ID is required");

  const now = new Date().toISOString();
  const changes = { status, updatedAt: now };

  if (status === "in_progress") changes.startedAt = now;
  if (status === "completed") changes.completedAt = now;

  await update(ref(db, `${TASKS_PATH}/${taskId}`), changes);
};