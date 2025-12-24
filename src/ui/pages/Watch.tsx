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
	const [ playlist, setPlaylist ] = useState<Playlist | null>(null);

	useEffect(() => {
		if (!videoIdParam) return;
		if (!isFavorites || favorites.length === 0) return;

		const index = Math.max(favorites.findIndex(v => v.videoId === videoIdParam), 0);

		setPlaylist({
			items: favorites,
			currentIndex: index,
			mode: 'loop'
		});
	}, [videoIdParam, isFavorites, favorites]);

	useEffect(() => {
		if (!videoIdParam) return;
		if (!isVideo) return;

		const relateds: VideoDataType[] = [{
			videoId: videoIdParam,
			videoTitle: ''
		}];
		setPlaylist({
			items: relateds,
			currentIndex: 0,
			mode: 'infinite-search'
		});

		window.api.fetchRelateds(videoIdParam).then(results => {
			relateds.push(...results);

			setPlaylist({
				items: relateds,
				currentIndex: 0,
				mode: 'infinite-search'
			});
			// console.log(`fetch relateds results: ${JSON.stringify(results)}`);
		});
	}, [videoIdParam, isVideo]);
	
	const handleVideoEnded = () => {
		if (!playlist) return;

		setPlaylist(prev => {
			if (!prev) return prev;

			let nextIndex = prev.currentIndex + 1;

			if (nextIndex >= prev.items.length) {
				if (prev.mode === 'loop') {
					nextIndex = 0;
				} else if (prev.mode === 'infinite-search') {
					/* 
					 * TODO: implement infinite search
					 */
					nextIndex = prev.currentIndex;
				}
			}

			return {
				...prev,
				currentIndex: nextIndex
			};
		});
	};

	const currentVideoId = useMemo(() => {
		if (!playlist) return '';

		return playlist.items[playlist.currentIndex].videoId;
	}, [playlist]);

	if (!playlist || !currentVideoId) {
		return <div>Loading...</div>;
	}
	return (
		<>
			{playlist && 
				<div id="wrapper-playlist">
					<div id="playlist-controls">
						<button onClick={() => setPlaylist({ ...playlist, currentIndex: Math.max(playlist.currentIndex - 1, 0) })}>Prev</button>
						<button onClick={() => setPlaylist({ ...playlist, currentIndex: Math.min(playlist.currentIndex + 1, playlist.items.length - 1) })}>Next</button>
					</div>
					<div id="playlist">
						{playlist.items.map((v, i) => (
							<div key={v.videoId} className={`playlist-item ${i === playlist.currentIndex ? 'active' : ''}`} onClick={() => setPlaylist({ ...playlist, currentIndex: i })}>
								<img src={`https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`} alt={v.videoTitle} />
								<p className="video-title">{v.videoTitle}</p>
							</div>
						))}
					</div>
				</div>
			}
			<Player videoId={currentVideoId} onEnded={handleVideoEnded} />
		</>
	);
};