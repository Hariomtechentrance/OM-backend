const isProd = process.env.NODE_ENV === 'production';

// Cookie name — keep it generic to avoid revealing the auth scheme
export const AUTH_COOKIE = 'bl_sid';

export const cookieOptions = {
  httpOnly: true,           // JS can NEVER read this — the key protection
  secure: isProd,           // HTTPS only in production
  sameSite: isProd ? 'strict' : 'lax',
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  path: '/'
};

export const setAuthCookie = (res, token) => {
  res.cookie(AUTH_COOKIE, token, cookieOptions);
};

export const clearAuthCookie = (res) => {
  res.clearCookie(AUTH_COOKIE, { path: '/' });
};
