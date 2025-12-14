export {};

declare global {
	declare const YT: any;

	interface Window {
		api: {
			getFavorites: () => Promise<Favorite[]>;
			addFavorite: (videoData: Favorite) => Promise<Favorite[]>;
			removeFavorite: (videoData: Favorite) => Promise<Favorite[]>;
		};
	}

	interface Favorite {
		videoId: string;
		videoTitle: string;
	}

	type Section = 'home' | 'watch' | 'search' | 'favorites' | string

	type HeaderProps = {
		currentSection: Section
	}
}