const rawBaseUrl = process.env.REACT_APP_API_BASE_URL || '';

// Trim trailing slash so endpoint joins are consistent.
const API_BASE_URL = rawBaseUrl.replace(/\/$/, '');

export const apiUrl = (path) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};
