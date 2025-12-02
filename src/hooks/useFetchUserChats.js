export const useFetchUserChats = async ({ token, chatId }) => {
	const endpoint = process.env.NEXT_PUBLIC_GET_MESSAGES.replace("{chatId}", chatId);
	try {
		const res = await fetch(endpoint, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return res.json();
	} catch (error) {
		console.log("Error fetching data", error);
	}
};

export const useFetchChats = (token, chatId) => {
	return useFetchUserChats({ token, chatId });
};