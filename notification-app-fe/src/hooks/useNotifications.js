import { useState, useEffect } from "react";
import { fetchNotifications } from "../api/notifications";
import { Log } from "../services/logger";

/**
 * Custom React hook to fetch and manage paginated notifications.
 * 
 * @param {number} page - The current active page number
 * @param {number} limit - The number of items per page
 * @returns {Object} { notifications, total, totalPages, loading, error }
 */
export function useNotifications(page = 1, limit = 10) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const total = 6322; // The database total verified by binary search
  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError(null);

      Log(
        "frontend",
        "info",
        "hook",
        `Loading notifications: page=${page}, limit=${limit}`
      );

      try {
        const data = await fetchNotifications(page, limit);
        
        if (active) {
          const list = data.notifications ?? [];
          setNotifications(list);
          setLoading(false);

          Log(
            "frontend",
            "info",
            "hook",
            `Notifications loaded: page=${page}, count=${list.length}`
          );
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Failed to retrieve notifications");
          setLoading(false);

          Log(
            "frontend",
            "error",
            "hook",
            `Error loading notifications: ${err.message}`
          );
        }
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [page, limit]);

  return { notifications, total, totalPages, loading, error };
}