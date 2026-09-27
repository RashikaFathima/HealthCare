// Centralized localStorage keys used by the mock auth system.
// NOTE: This is a frontend-only mock. Replace with a real token/session
// strategy (e.g. httpOnly cookies) when backend auth is integrated.
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'healthcare_auth_token',
  AUTH_USER: 'healthcare_auth_user',
  THEME: 'healthcare_theme_preference'
};
