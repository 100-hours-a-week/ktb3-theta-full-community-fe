import { client } from "../api/client";

const ABSOLUTE_URL_REGEX = /^https?:\/\//i;

export function resolveImageUrl(path) {
  if (!path || typeof path !== "string") return "";
  const trimmed = path.trim();
  if (!trimmed) return "";
  if (ABSOLUTE_URL_REGEX.test(trimmed)) {
    return trimmed;
  }
  if (trimmed.startsWith("/uploads/")) {
    const base = (client.defaults?.baseURL || "").replace(/\/$/, "");
    return `${base}${trimmed}`;
  }
  return "";
}
