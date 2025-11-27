export default function sitemap() {
	return [
		{
			url: "https://your-domain.com",
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 1.0,
		},
		{
			url: "https://your-domain.com/login",
			lastModified: new Date(),
		},
		{
			url: "https://your-domain.com/chats",
			lastModified: new Date(),
		},
	];
}
