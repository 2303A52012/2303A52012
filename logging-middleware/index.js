// Reusable Logging Middleware Package

let credentialsConfig = {
  email: "2303a52012@sru.edu.in",
  name: "palakurthi lalith prakash",
  rollNo: "2303a52012",
  accessCode: "bDreAq",
  clientID: "d4c29e03-c674-42cf-8e13-c0ef374901fb",
  clientSecret: "aReZwsRGTsZzHKAt"
};

let cachedToken = null;
let tokenExpiryTime = 0; // ms timestamp

// Decodes a JWT token payload across both Browser and Node.js environments
function decodeJWT(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      (typeof atob === "function" 
        ? atob(base64) 
        : Buffer.from(base64, "base64").toString("binary")
      )
        .split("")
        .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

// Configures the logging middleware credentials if custom ones are needed
export function initLogger(config) {
  credentialsConfig = { ...credentialsConfig, ...config };
}

// Authenticates with the test server to get a Bearer token
export async function getAuthToken() {
  // If we have a cached token and it is still valid (with a 10s buffer), return it
  if (cachedToken && tokenExpiryTime > Date.now() + 10000) {
    return cachedToken;
  }

  try {
    const res = await fetch("http://4.224.186.213/evaluation-service/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(credentialsConfig)
    });

    if (!res.ok) {
      throw new Error(`Auth API failed with status ${res.status}: ${await res.text()}`);
    }

    const data = await res.json();
    if (data.access_token) {
      cachedToken = data.access_token;
      
      // Try to parse the token's expiration
      const payload = decodeJWT(cachedToken);
      if (payload && payload.MapClaims && payload.MapClaims.exp) {
        tokenExpiryTime = payload.MapClaims.exp * 1000;
      } else if (data.expires_in) {
        tokenExpiryTime = Date.now() + data.expires_in * 1000;
      } else {
        tokenExpiryTime = Date.now() + 3600 * 1000; // default 1 hour
      }

      return cachedToken;
    } else {
      throw new Error("No access_token found in auth response");
    }
  } catch (error) {
    console.error("Logger Authentication failed:", error);
    throw error;
  }
}

// Allowed constraints per API requirements
const ALLOWED_STACKS = new Set(["backend", "frontend"]);
const ALLOWED_LEVELS = new Set(["debug", "info", "warn", "error", "fatal"]);

const ALLOWED_FRONTEND_PACKAGES = new Set([
  "api", "component", "hook", "page", "state",
  "auth", "config", "middleware", "utils", "style"
]);

const ALLOWED_BACKEND_PACKAGES = new Set([
  "cache", "controller", "cron_job", "db", "domain",
  "handler", "repository", "route", "service",
  "auth", "config", "middleware", "utils", "style"
]);

// Main Log Function
export async function Log(stack, level, packageName, message) {
  // 1. Inputs Normalization to lower case
  const normStack = String(stack).toLowerCase();
  const normLevel = String(level).toLowerCase();
  const normPackage = String(packageName).toLowerCase();
  
  // Truncate messages exceeding 48 characters to respect API size limits
  const rawMessage = String(message);
  const normMessage = rawMessage.length > 48 ? rawMessage.slice(0, 45) + "..." : rawMessage;

  // 2. Constraints Validation
  if (!ALLOWED_STACKS.has(normStack)) {
    console.warn(`[Logger Warning] Invalid stack: "${normStack}". Allowed: backend, frontend.`);
  }
  if (!ALLOWED_LEVELS.has(normLevel)) {
    console.warn(`[Logger Warning] Invalid level: "${normLevel}". Allowed: debug, info, warn, error, fatal.`);
  }

  const allowedPackages = normStack === "frontend" ? ALLOWED_FRONTEND_PACKAGES : ALLOWED_BACKEND_PACKAGES;
  if (!allowedPackages.has(normPackage)) {
    console.warn(`[Logger Warning] Invalid package "${normPackage}" for stack "${normStack}".`);
  }

  // 3. Make POST request with token, retrying on token expiration
  let attempt = 0;
  while (attempt < 2) {
    try {
      const token = await getAuthToken();
      const res = await fetch("http://4.224.186.213/evaluation-service/logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          stack: normStack,
          level: normLevel,
          package: normPackage,
          message: normMessage
        })
      });

      if (res.status === 401 || res.status === 403) {
        // Token might have expired, invalidate cache and retry
        cachedToken = null;
        tokenExpiryTime = 0;
        attempt++;
        continue;
      }

      if (!res.ok) {
        console.error(`[Logger Error] Log API failed with status ${res.status}:`, await res.text());
        return null;
      }

      const responseData = await res.json();
      return responseData; // e.g. { logID, message }
    } catch (err) {
      console.error("[Logger Error] Failed to publish log:", err);
      return null;
    }
  }

  return null;
}
