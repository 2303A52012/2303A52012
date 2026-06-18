import { Log } from "../services/logger";
import { getAuthToken } from "logging-middleware";

/**
 * Fetches a page of notifications from the evaluation service test server.
 * 
 * @param {number|string} page - The page number to fetch
 * @param {number|string} limit - The page size limit (max 10)
 * @returns {Promise<Object>} The API response payload { notifications: [...] }
 */
export async function fetchNotifications(page = 1, limit = 10) {
  Log(
    "frontend",
    "info",
    "api",
    `Fetching notifications: page=${page}, limit=${limit}`
  );

  try {
    const token = await getAuthToken();
    const response = await fetch(
      `http://4.224.186.213/evaluation-service/notifications?page=${page}&limit=${limit}`,
      {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();

    Log(
      "frontend",
      "info",
      "api",
      `Notifications fetched successfully: page=${page}, count=${data.notifications ? data.notifications.length : 0}`
    );

    return data;
  } catch (error) {
    Log(
      "frontend",
      "error",
      "api",
      `Failed fetching notifications: ${error.message}`
    );

    throw error;
  }
}