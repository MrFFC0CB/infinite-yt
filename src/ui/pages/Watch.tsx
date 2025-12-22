type PlaylistMode = 'loop' | 'infinite-search';
type Playlist = {
	items: VideoDataType[];
	currentIndex: number;
	mode: PlaylistMode;
};

import { useEffect, useMemo, useState } from "react";
import { useMatch, useParams } from "react-router";
import { useFavorites } from "../hooks/useFavorites";
import Player from "../components/Player";
import './Watch.css';

export default function Watch() {
	const { favorites } = useFavorites();
	const videoIdParam: string = useParams().videoId || '';
	const isVideo = useMatch('/watch/video/:videoId');
	const isFavorites = useMatch('/watch/favorites/:videoId');
	// const [ playlist, setPlaylist ] = useState<Playlist>({ items: [], currentIndex: 0, mode: 'loop' });
	const [playlist, setPlaylist] = useState<Playlist | null>(null);
	// const [ currentVideo, setCurrentVideo ] = useState<VideoDataType>({ videoId: '', videoTitle: '' });

	useEffect(() => {
		if (!videoIdParam) return;

		if (isFavorites && favorites.length > 0) {
			const index = Math.max(favorites.findIndex(v => v.videoId === videoIdParam), 0);

			setPlaylist({
				items: favorites,
				currentIndex: index,
				mode: 'loop'
			});
		}

		if (isVideo) {
			const relateds: VideoDataType[] = [{
				videoId: videoIdParam,
				videoTitle: ''
			}];
			const index = Math.max(relateds.findIndex(v => v.videoId === videoIdParam), 0);
			setPlaylist({
				items: relateds,
				currentIndex: index,
				mode: 'infinite-search'
			});
		}
	}, [videoIdParam, isFavorites, isVideo, favorites]);

	const currentVideoId = useMemo(() => {
		if (!playlist) return '';

		return playlist.items[playlist.currentIndex].videoId;
	}, [playlist]);

	if (!playlist || !currentVideoId) {
		return <div>Loading...</div>;
	}
	return (
		<Player videoId={currentVideoId} />
	);
};