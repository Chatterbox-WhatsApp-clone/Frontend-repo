import { auth, provider } from "./FirebaseConfig";
import { signInWithPopup, signOut, GoogleAuthProvider, getAuth } from "firebase/auth";

export const signInButton = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    // Get Google Access Token
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    // Get signed-in user info
    const user = result.user;
    console.log("User signed in:", user);
    return user;
  } catch (error) {
    console.error("Sign-in failed:", error);
    return null;
  }
};

export const logOutButton = async () => {
  try {
    await signOut(auth);
    console.log("User signed out.");
  } catch (error) {
    console.error("Sign-out failed:", error);
  }
};