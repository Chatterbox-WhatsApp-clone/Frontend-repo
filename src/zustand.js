import { create } from "zustand";

export const useAuthenticatedStore = create((set) => ({
	authenticated:
		typeof window !== "undefined"
			? JSON.parse(localStorage.getItem("authenticated") || "false")
			: false,
	setAuthenticated: (value) => {
		localStorage.setItem("authenticated", JSON.stringify(value));
		set({ authenticated: value });
	},
	token:
		typeof window !== "undefined"
			? JSON.parse(localStorage.getItem("token") || false)
			: false,
	setToken: (value) => {
		localStorage.setItem("token", JSON.stringify(value));
		set({ token: value });
	},
	userId: null,
	setUserId: (value) => set({ userId: value }),
}));

export const useClickedStore = create((set) => ({
	clicked: false,
	setClicked: (value) => set({ clicked: value }),
}));

export const useUpdateUserStore = create((set) => ({
	userUpdated: null,
	setUserUpdated: (value) => set({ userUpdated: value }),
}));

export const useRequestedId = create((set) => ({
	userRequestedId: null,
	setUserRequestedId: (value) => set({ userRequestedId: value }),
}));
