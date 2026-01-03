type PlaylistMode = 'loop' | 'infinite-search';
type Playlist = {
	items: VideoDataType[];
	currentIndex: number;
	mode: PlaylistMode;
};

import { useEffect, useMemo, useState } from "react";
import { useMatch, useOutletContext, useParams } from "react-router";
import { useFavorites } from "../hooks/useFavorites";
import Player from "../components/Player";
import './Watch.css';

export default function Watch() {
	const { favorites } = useFavorites();
	const videoIdParam: string = useParams().videoId || '';
	const isVideo = useMatch('/watch/video/:videoId');
	const isFavorites = useMatch('/watch/favorites/:videoId');
	const [ playlist, setPlaylist ] = useState<Playlist | null>(null);
	const { setActiveVideoId } = useOutletContext<{ setActiveVideoId: (id: string) => void }>();

	(globalThis as any).playlist = playlist;

	const currentVideoId = useMemo(() => {
		if (!playlist) return '';
		if (!playlist.items[playlist.currentIndex]) return '';

		console.log('playlist.currentIndex: ', playlist.currentIndex);
		console.log('playlist: ', playlist);

		return playlist.items[playlist.currentIndex].videoId;
	}, [playlist]);

	const getRelateds = () => {
		const id = playlist?.items[playlist?.currentIndex].videoId;

		console.log('id on getRelateds: ', id);
		console.log('currentVideoId on getRelateds: ', currentVideoId);
		console.log('playlist.items[playlist.currentIndex].videoId on getRelateds: ', playlist?.items[playlist?.currentIndex].videoId);

		if (!id) return;

		window.api.fetchRelateds(id).then(results => {
			// console.log('results: ', results);

			setPlaylist(prev => {
				if (!prev) return prev;
				
				let resultsFiltered = results.filter(r =>
					!prev.items.some(p => p.videoId === r.videoId)
				);

				if (resultsFiltered.length === 0) {
					// getRelateds();
				}

				return { ...prev, items: [...prev.items, ...resultsFiltered] };
			});
		});
	};

	const handlePlayerReady = (title: string) => {
		if (!playlist && !isVideo) return;

		setPlaylist(prev => {
			if (!prev) return prev;
			
			const updated = [...prev.items];
			updated[prev.currentIndex] = {
				...updated[prev.currentIndex],
				videoTitle: title
			};
			return { ...prev, items: updated };
		});
	};

	const handleVideoEnded = () => {
		if (!playlist) return;

		setPlaylist(prev => {
			if (!prev) return prev;

			let nextIndex = prev.currentIndex + 1;

			if (nextIndex >= prev.items.length && prev.mode === 'loop') {
				nextIndex = 0;
			}
			/* if (nextIndex >= prev.items.length - 1 && prev.mode === 'infinite-search') {
				getRelateds(prev.items[prev.items.length - 1].videoId);
			} */

			return {
				...prev,
				currentIndex: nextIndex
			};
		});
	};

	const handlePlayerCued = () => {
		if (!playlist) return;

		if (playlist.currentIndex >= playlist.items.length - 1 && playlist.mode === 'infinite-search') {
			getRelateds();
		}
	};

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

		getRelateds();
	}, [videoIdParam, isVideo, getRelateds]);

	useEffect(() => {
		if (currentVideoId) setActiveVideoId(currentVideoId);
	}, [currentVideoId]);

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
			<Player
				videoId={currentVideoId}
				onEnded={handleVideoEnded}
				onReady={handlePlayerReady}
				onCued={handlePlayerCued}
			/>
		</>
	);
};