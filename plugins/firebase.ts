import { getApp, initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
} from 'firebase/auth';


import { getFunctions, httpsCallable } from 'firebase/functions';


export default defineNuxtPlugin(() => {
  const createFirebaseApp = () => {
    try {
      return getApp();
    } catch {
      const { public: { firebase } } = useRuntimeConfig();

      return initializeApp(firebase);
    }
  };

  const app = createFirebaseApp();
  const auth = getAuth(app);
  const functions = getFunctions(app);

  return {
    provide: {
      fire: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        https: async (name: string, params?: Record<string, any>) => {
          const callable = httpsCallable(functions, name);
          const response = await callable(params);

          return response.data;
        },
        auth: {
          signIn: (email: string, password: string) => signInWithEmailAndPassword(auth, email, password),

          async signInWithGoogle() {
            const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
            const provider = new GoogleAuthProvider();

            return signInWithPopup(auth, provider);
          },

          async signInWithFacebook() {
            const { FacebookAuthProvider, signInWithPopup } = await import('firebase/auth');
            const provider = new FacebookAuthProvider();

            return signInWithPopup(auth, provider);
          },

          signUp: async (email: string, password: string, displayName: string) => {
            const { user } = await createUserWithEmailAndPassword(auth, email, password);

            if (!user) {
              throw new Error('Failed to create user.');
            }

            await updateProfile(user, { displayName });

            await sendEmailVerification(user);

            return user;
          },

          sendPasswordResetEmail: (email: string) => sendPasswordResetEmail(auth, email),

          signOut: () => signOut(auth),

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onAuthStateChanged: (callback: (user: any) => void) => onAuthStateChanged(auth, callback),
        },
        app,
      },
    },
  };
});
