import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
} from 'firebase/auth';

import { getFirestore } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';


export default defineNuxtPlugin(() => {
  const { public: { firebase } } = useRuntimeConfig();

  const app = initializeApp(firebase);

  const auth = getAuth(app);
  const firestore = getFirestore(app);
  const functions = getFunctions(app);

  const googleProvider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();

  return {
    provide: {
      fire: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        https: (name: string, params?: Record<string, any>) => {
          const callable = httpsCallable(functions, name);

          return callable(params);
        },
        auth: {
          signIn: (email: string, password: string) => signInWithEmailAndPassword(auth, email, password),
          signInWithGoogle: () => signInWithPopup(auth, googleProvider),
          signInWithFacebook: () => signInWithPopup(auth, facebookProvider),

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
        firestore,
      },
    },
  };
});
