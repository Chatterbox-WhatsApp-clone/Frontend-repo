// utils/firebaseClient.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

let app;
let auth;
let provider;

if (typeof window !== "undefined") {
	// Only initialize once
	if (!getApps().length) {
		if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
			console.error("Firebase API Key is missing. Please check your .env file.");
		}
		try {
			app = initializeApp({
				apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
				authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
				projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
				messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDERID,
				appId: process.env.NEXT_PUBLIC_APPID
			});
		} catch (error) {
			console.error("Error initializing Firebase app:", error);
		}
	} else {
		app = getApp();
	}

	if (app) {
		auth = getAuth(app);
		provider = new GoogleAuthProvider();
	}
}

export { auth, provider };
