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
			? JSON.parse(localStorage.getItem("token") || "null")
			: null,
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

	openMessage: false,
	setOpenMessage: (value) => set({ openMessage: value }),
}));

export const useUpdateUserStore = create((set) => ({
	userUpdated: null,
	setUserUpdated: (value) => set({ userUpdated: value }),
}));

export const useRequestedId = create((set) => ({
	userRequestedId: null,
	setUserRequestedId: (value) => set({ userRequestedId: value }),
}));

export const useFriendsStore = create((set, get) => ({
	sentRequests: [], // list of user IDs with pending friend requests
	removedFriends: [], // list of user IDs removed/cancelled

	localStatus: {},
	setLocalStatus: (userId, value) =>
		set((state) => ({
			localStatus: { ...state.localStatus, [userId]: value },
		})),
	// Add to sentRequests
	addSentRequest: (userId) =>
		set((state) => ({
			sentRequests: [...state.sentRequests, userId],
		})),
	getLocalStatus: (userId) => get().localStatus[userId] || "not sent",

	// Remove from sentRequests (e.g. cancelled request)
	removeSentRequest: (userId) =>
		set((state) => ({
			sentRequests: state.sentRequests.filter((id) => id !== userId),
		})),

	// Add to removedFriends
	addRemovedFriend: (userId) =>
		set((state) => ({
			removedFriends: [...state.removedFriends, userId],
		})),

	// Remove from removedFriends if needed
	removeRemovedFriend: (userId) =>
		set((state) => ({
			removedFriends: state.removedFriends.filter((id) => id !== userId),
		})),
}));

export const useRemovedStore = create((set) => ({
	removed: null,
	setRemoved: (value) => set({ removed: value }),

	accepted: null,
	setAccepted: (value) => set({ accepted: value }),
}));

export const useUserProfile = create((set) => ({
	activeUser: null,
	setActiveUser: (value) => set({ activeUser: value }),

	chatId: null,
	setChatId: (value) => set({ chatId: value }),

	activeChat: null,
	setActiveChat: (value) => set({ activeChat: value }),

	activeMessage: '',
	setActiveMessage: (value) => set({ activeMessage: value }),

	myMessage: null,
	setMyMessage: (value) => set({ myMessage: value }),

	messageId: null,
	setMessageId: (value) => set({ messageId: value }),

	isEditing: false,
	setIsEditing: (value) => set({ isEditing: value }),
}));

export const useUserData = create((set) => ({
	user: null,
	setUser: (value) => set({ user: value }),
}));

export const useMessagesStore = create((set) => ({
	messageStatus: "",
	setMessageStatus: (value) => set({ messageStatus: value }),
	messages: [], // sent messages
	setMessages: (message) =>
		set((state) => ({
			messages: [...state.messages, message],
		})),

	recievedMessages: [], // received messages
	setRecievedMessages: (message) =>
		set((state) => ({
			recievedMessages: [...state.recievedMessages, message],
		})),
}));
