export const AUTH_ACTIONS = {
  FAVORITES: 'favorites',
  CHAT: 'chat',
  CALL: 'call',
  ORDER: 'order',
} as const;

export type AuthAction = keyof typeof AUTH_ACTIONS;
