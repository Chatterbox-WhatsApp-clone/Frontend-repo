import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase configuration from environment variables
const firebaseConfig = {
	apiKey: process.env.FIREBASE_API_KEY,
	authDomain: process.env.FIREBASE_AUTH_DOMAIN,
	projectId: process.env.FIREBASE_PROJECT_ID,
	projectNumber: process.env.FIREBASE_PROJECT_NUMBER,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth and provider for use in components
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
