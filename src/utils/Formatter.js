const formatLastSeen = (lastSeen) => {
	const last = new Date(lastSeen);
	const now = new Date();
	const diffInSeconds = (now - last) / 1000;

	// User is online if lastSeen was within 60 seconds
	if (diffInSeconds <= 60) {
		return "Online";
	}

	// If within today, return time
	if (last.toDateString() === now.toDateString()) {
		return `today at ${last.toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		})}`;
	}

	// Yesterday
	const yesterday = new Date();
	yesterday.setDate(now.getDate() - 1);
	if (last.toDateString() === yesterday.toDateString()) {
		return "yesterday";
	}

	// Otherwise return full date
	return last.toLocaleDateString([], {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
};
