export default function formatLastSeen(lastSeen) {
	const last = new Date(lastSeen);
	const now = new Date();
	const diffInSeconds = (now - last) / 1000;

	if (diffInSeconds <= 60) return "Online";

	if (last.toDateString() === now.toDateString()) {
		return `today at ${last.toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		})}`;
	}

	const yesterday = new Date();
	yesterday.setDate(now.getDate() - 1);
	if (last.toDateString() === yesterday.toDateString()) return "yesterday";

	return last.toLocaleDateString([], {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
}
