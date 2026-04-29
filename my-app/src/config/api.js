const explicitBaseUrl = (process.env.REACT_APP_API_BASE_URL || "")
  .trim()
  .replace(/\/+$/, "");

const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

const fallbackBaseUrl = isLocalhost ? "http://127.0.0.1:8000" : "";

export const API_BASE_URL = explicitBaseUrl || fallbackBaseUrl;

export const apiUrl = (path) => `${API_BASE_URL}${path}`;
