import MockAdapter from 'axios-mock-adapter';

// Lightweight mock server that attaches to an axios instance
// Tokens are simple base64 JSON payloads { email, exp }

function encodeToken(payload) {
  return btoa(JSON.stringify(payload));
}

function decodeToken(token) {
  try {
    const json = atob(token);
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

function isTokenExpired(token) {
  const data = decodeToken(token);
  if (!data || !data.exp) return true;
  return Date.now() > data.exp;
}

export function setupMockServer(api) {
  const mock = new MockAdapter(api, { delayResponse: 600 });

  // In-memory "users" for demo purposes
  const users = [];

  function createAccessToken(email) {
    // short lived access token: 15 seconds
    return encodeToken({ email, type: 'access', exp: Date.now() + 15 * 1000 });
  }

  function createRefreshToken(email) {
    // longer lived refresh token: 24 hours
    return encodeToken({ email, type: 'refresh', exp: Date.now() + 24 * 60 * 60 * 1000 });
  }

  // Register - delegate to real backend if implemented (pass-through)
  mock.onPost('/user/register').reply(async (config) => {
    try {
      const body = JSON.parse(config.data);
      const { email, password } = body;
      if (!email || !password) {
        return [400, { message: 'Missing email or password' }];
      }
      const exists = users.find((u) => u.email === email);
      if (exists) return [409, { message: 'Email already exists' }];
      const user = { email, password, id: Date.now().toString() };
      users.push(user);
      return [201, { message: 'User registered successfully', user: { id: user.id, email: user.email } }];
    } catch (e) {
      return [500, { message: 'Invalid request' }];
    }
  });

  // Login
  mock.onPost('/auth/login').reply((config) => {
    const { email, password } = JSON.parse(config.data || '{}');
    // For demo, accept any credentials if user exists; otherwise allow login as well
    const user = users.find((u) => u.email === email) || { email, id: 'demo' };
    const accessToken = createAccessToken(email);
    const refreshToken = createRefreshToken(email);
    return [200, { accessToken, refreshToken, user: { email: user.email, id: user.id } }];
  });

  // Refresh
  mock.onPost('/auth/refresh').reply((config) => {
    try {
      const { refreshToken } = JSON.parse(config.data || '{}');
      if (!refreshToken) return [401, { message: 'Missing refresh token' }];
      if (isTokenExpired(refreshToken)) return [401, { message: 'Refresh token expired' }];
      const payload = decodeToken(refreshToken);
      if (!payload || !payload.email) return [401, { message: 'Invalid refresh token' }];
      const newAccess = createAccessToken(payload.email);
      return [200, { accessToken: newAccess }];
    } catch (e) {
      return [401, { message: 'Invalid token' }];
    }
  });

  // Protected /me endpoint
  mock.onGet('/me').reply((config) => {
    const auth = config.headers?.Authorization || '';
    const match = auth.match(/Bearer\s+(.*)$/i);
    if (!match) return [401, { message: 'No token provided' }];
    const token = match[1];
    if (isTokenExpired(token)) return [401, { message: 'Access token expired' }];
    const payload = decodeToken(token);
    return [200, { user: { email: payload.email } }];
  });

  // Passthrough everything else if needed
  mock.onAny().passThrough();
}

export default setupMockServer;
