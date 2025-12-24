export {};

declare global {
	declare const YT: any;

	interface Window {
		api: {
			getFavorites: () => Promise<VideoDataType[]>;
			addFavorite: (videoData: VideoDataType) => Promise<VideoDataType[]>;
			removeFavorite: (videoId: string) => Promise<VideoDataType[]>;
			fetchSearchResults: (searchString: string) => Promise<VideoDataType[]>;
			fetchRelateds: (videoId: string) => Promise<VideoDataType[]>;
		};
	};

	type RouteHandle = {
		section: Section;
		title?: string;
	};

	interface VideoDataType {
		videoId: string;
		videoTitle: string;
	};

	type Section = 'home' | 'watch' | 'search' | 'favorites';

	type HeaderProps = {
		title: string;
		currentSection: Section;
		activeVideoId?: string;
	};
}