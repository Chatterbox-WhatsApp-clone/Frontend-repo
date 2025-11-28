// utils/firebaseClient.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

let auth, provider;

if (typeof window !== "undefined") {
	// Initialize Firebase only once
	if (!getApps().length) {
		const app = initializeApp({
			apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
			authDomain: process.env.NEXT_FIREBASE_AUTH_DOMAIN,
			projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
			messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDERID,
			appId: process.env.NEXT_PUBLIC_APPID,
		});
		auth = getAuth(app);
		provider = new GoogleAuthProvider();
	}
}

export { auth, provider };
