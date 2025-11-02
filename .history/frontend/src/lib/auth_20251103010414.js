// Token helpers: access token in-memory, refresh token in localStorage
let accessToken = null;
const REFRESH_KEY = 'refresh_token_v1';

export function setAccessToken(token) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export function setRefreshToken(token) {
  try {
    localStorage.setItem(REFRESH_KEY, token);
  } catch (e) {}
}

export function getRefreshToken() {
  try {
    return localStorage.getItem(REFRESH_KEY);
  } catch (e) {
    return null;
  }
}

export function clearTokens() {
  accessToken = null;
  try {
    localStorage.removeItem(REFRESH_KEY);
  } catch (e) {}
}

export default {
  setAccessToken,
  getAccessToken,
  setRefreshToken,
  getRefreshToken,
  clearTokens,
};
