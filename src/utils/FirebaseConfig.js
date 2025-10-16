import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase configuration from environment variables
const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	projectNumber: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_NUMBER,
};

// Initialize Firebase
if (typeof window !== "undefined") {
	app = initializeApp(firebaseConfig);
}

// Export auth and provider for use in components
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
