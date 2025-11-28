import { auth, provider } from "./FirebaseConfig";
import { signInWithPopup, signOut, GoogleAuthProvider } from "firebase/auth";

export const signInButton = async () => {
	try {
		if (!auth || !provider) {
			console.error("Firebase not initialized");
			return null;
		}

		const result = await signInWithPopup(auth, provider);

	
		let credential = null;
		try {
			credential = GoogleAuthProvider.credentialFromResult(result);
		} catch (err) {
			console.warn("Could not get Google credential:", err);
		}

		// Optional: access token (if you ever need it)
		const token = credential?.accessToken || null;

		// Get signed-in user info
		const user = result.user;

		return user;
	} catch (error) {
		console.error("Sign-in failed:", error);
		return null;
	}
};


// LOGOUT
export const logOutButton = async () => {
	try {
		if (!auth) {
			console.error("Firebase not initialized");
			return;
		}

		await signOut(auth);
		return true;
	} catch (error) {
		console.error("Sign-out failed:", error);
		return false;
	}
};
