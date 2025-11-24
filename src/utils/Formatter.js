export default function formatLastSeen(dateString) {
	const date = new Date(dateString);
	const now = new Date();

	const isToday = date.toDateString() === now.toDateString();

	const yesterday = new Date();
	yesterday.setDate(now.getDate() - 1);
	const isYesterday = date.toDateString() === yesterday.toDateString();

	const time = date.toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
	});

	const month = date.toLocaleString("en-US", { month: "short" }); // Oct, Nov, Dec…

	// TODAY
	if (isToday) {
		return `today at ${time}`;
	}

	// YESTERDAY
	if (isYesterday) {
		return `yesterday at ${time}`;
	} 

	// OTHER DAYS -> “Oct 30, 2025”
	const formattedDate = `${month} ${date.getDate()}, ${date.getFullYear()}`;

	return `${formattedDate}`;
}
