export const AUTH_STATES = {
  LOGIN: 'login',
  RECOVERY: 'recovery',
  RECOVERY_SUCCESS: 'recovery_success',
  REGISTRATION: 'registration',
  REGISTRATION_SUCCESS: 'registration_success',
  WELCOME: 'welcome',
} as const;

export type AuthModalState = keyof typeof AUTH_STATES;
export type AuthModalStateValue = typeof AUTH_STATES[AuthModalState];
