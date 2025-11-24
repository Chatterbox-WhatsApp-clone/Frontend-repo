export function generateChatId(userId, activeUserId) {
	return [userId, activeUserId].sort().join("_");
}
