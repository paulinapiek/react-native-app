// src/auth/services/authService.ts
import firebase from '@react-native-firebase/app';
import {
  getAuth,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  FirebaseAuthTypes,
} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { UserProfileData } from '../../navigation/types';

export function subscribeToAuthChanges(
  callback: (user: FirebaseAuthTypes.User | null) => void
): () => void {
  const authInstance = getAuth(firebase.app());
  return firebaseOnAuthStateChanged(authInstance, callback);
}

export async function registerUser(
  email: string,
  pass: string,
  userProfileData: Partial<UserProfileData>
): Promise<FirebaseAuthTypes.UserCredential> {
  const authInstance = getAuth(firebase.app());
  try {
    const userCredential = await createUserWithEmailAndPassword(authInstance, email, pass);
    const user = userCredential.user;

    if (userProfileData.firstName && userProfileData.lastName) {
      await user.updateProfile({
        displayName: `${userProfileData.firstName} ${userProfileData.lastName}`
      });
    }
    await firestore()
      .collection('studentProfiles')
      .doc(user.uid)
      .set({
        ...userProfileData,
        uid: user.uid,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

    console.log('User registered and profile saved to Firestore:', user.uid);
    return userCredential;
  } catch (error) {
    console.error('Registration Error:', error);
    throw error as Error;
  }
}

export async function loginUser(email: string, pass: string): Promise<FirebaseAuthTypes.UserCredential> {
  const authInstance = getAuth(firebase.app());
  try {
    const userCredential = await signInWithEmailAndPassword(authInstance, email, pass);
    return userCredential;
  } catch (error) {
    console.error('Login Error:', error);
    throw error as Error;
  }
}

export async function logoutUser(): Promise<void> {
  const authInstance = getAuth(firebase.app());
  try {
    await firebaseSignOut(authInstance);
  } catch (error) {
    console.error('Logout Error:', error);
    throw error as Error;
  }
}
