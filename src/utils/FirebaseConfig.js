// utils/firebaseClient.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

let app;
let auth;
let provider;

if (typeof window !== "undefined") {
	// Only initialize once
	if (!getApps().length) {
		app = initializeApp({
			apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
			authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
			projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
			messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDERID,
			appId: process.env.NEXT_PUBLIC_APPID
			
		});
	} else {
		app = getApp();
	}

	auth = getAuth(app);
	provider = new GoogleAuthProvider();
}

export { auth, provider };
