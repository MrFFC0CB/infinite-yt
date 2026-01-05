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

	type Section = 'home' | 'watch' | 'search' | 'favorites';

	type RouteHandle = {
		section: Section;
		title?: string;
	};

	type LayoutContext = {
		currentSection: Section;
		setTitle: React.Dispatch<React.SetStateAction<string>>;
	};

	interface VideoDataType {
		videoId: string;
		videoTitle: string;
	};

	type HeaderProps = {
		title: string;
		currentSection: Section;
		activeVideoId?: string;
	};
}