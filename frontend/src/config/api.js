/**
 * Single source for the backend API prefix (…/api).
 * Render often sets REACT_APP_API_URL to either:
 *   - https://host.com          → we append /api
 *   - https://host.com/api      → use as-is (avoid /api/api/)
 */
export function getApiBase() {
  const raw = (process.env.REACT_APP_API_URL || 'http://localhost:5002')
    .trim()
    .replace(/\/+$/, '');
  return /\/api$/i.test(raw) ? raw : `${raw}/api`;
}

const API_BASE = getApiBase();

export { API_BASE };
