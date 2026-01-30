type PlaylistMode = 'loop' | 'infinite-search';
type Playlist = {
	items: VideoDataType[];
	currentIndex: number;
	mode: PlaylistMode;
};

import { useEffect, useMemo, useRef, useState } from "react";
import { useMatch, useOutletContext, useParams } from "react-router";
import { useFavorites } from "../hooks/useFavorites";
import IconNext from "../components/icons/IconNext";
import IconRemove from "../components/icons/IconRemove";

import './Watch.css';

export default function Watch() {
	const { favorites } = useFavorites();
	const videoIdParam: string = useParams().videoId || '';
	const isVideo = useMatch('/watch/video/:videoId');
	const isFavorites = useMatch('/watch/favorites/:videoId');
	const [ playlist, setPlaylist ] = useState<Playlist | null>(null);
	const playlistRef = useRef<Playlist | null>(null);
	const { setActiveVideoId } = useOutletContext<{ setActiveVideoId: (id: string) => void }>();
	const { setTitle } = useOutletContext<LayoutContext>();
	const wrapperPlayerRef = useRef<HTMLDivElement | null>(null);
	const ytPlayerRef = useRef<any>(null);
	const isPlayerReadyRef = useRef<boolean>(false);

	const currentVideoId = useMemo(() => {
		if (!playlist) return '';
		if (!playlist.items[playlist.currentIndex]) return '';

		return playlist.items[playlist.currentIndex].videoId;
	}, [playlist]);

	const getRelateds = () => {
		const id: string = playlistRef.current?.items[playlistRef.current?.currentIndex].videoId || videoIdParam;
		if (!id) return;

		window.api.fetchRelateds(id).then(results => {
			if (results.length === 0) {
				const titleToSearch = playlistRef.current?.items[playlistRef.current?.currentIndex].videoTitle;
				if (!titleToSearch) return [];

				window.api.fetchSearchResults(titleToSearch).then(res => {
					setPlaylist(prev => {
						if (!prev) return prev;
						
						const resultsFiltered = res.filter(r =>
							!prev.items.some(p => p.videoId === r.videoId)
						);

						return { ...prev, items: [...prev.items, ...resultsFiltered] };
					});
				});
			}

			setPlaylist(prev => {
				if (!prev) return prev;
				
				const resultsFiltered = results.filter(r =>
					!prev.items.some(p => p.videoId === r.videoId)
				);

				/* if (resultsFiltered.length === 0) {
					getRelateds();
				} */

				return { ...prev, items: [...prev.items, ...resultsFiltered] };
			});
		});
	};

	const removeVideoFromPlaylist = (id: string) => {
		setPlaylist(prev => {
			if (!prev) return prev;
			const newItems = prev.items.filter(p => p.videoId !== id);
			let newIndex = newItems.findIndex(p => p.videoId === currentVideoId);
			
			if (newIndex < 0) newIndex = prev.currentIndex;

			console.log(`newIndex: ${newIndex}`);

			return {
				...prev,
				items: newItems,
				currentIndex: newIndex
			};
		});
	};

	const handlePlayerReady = (title: string) => {
		isPlayerReadyRef.current = true;
		ytPlayerRef.current.playVideo();

		setTitle(title);
		if (!playlistRef.current && !isVideo) return;

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
		if (!playlistRef.current) return;

		setPlaylist(prev => {
			if (!prev) return prev;

			let nextIndex = prev.currentIndex + 1;

			if (nextIndex >= prev.items.length && prev.mode === 'loop') {
				nextIndex = 0;
			}

			return {
				...prev,
				currentIndex: nextIndex
			};
		});
	};

	const handlePlayerCued = () => {
		setTitle(ytPlayerRef.current.getVideoData().title);
		ytPlayerRef.current.playVideo();

		const pl = playlistRef.current;
		if (!pl) return;

		if (pl.currentIndex >= pl.items.length - 1 && pl.mode === 'infinite-search') {
			getRelateds();
		}

		document.querySelector('#playlist .playlist-item.active')?.scrollIntoView();
	};

	const onPlayerReady = (event: any) => {
		// console.log('%cPlayer ready!', 'color: #bada55; font-weight: bold;');
		handlePlayerReady(event.target.getVideoData().title || '');
	};
	const onPlayerStateChange = (event: any) => {
		/* UNSTARTED: -1, ENDED: 0, PLAYING: 1, PAUSED: 2, BUFFERING: 3, CUED: 5 */
		// console.log('%cPlayer state change!', 'color: #393ce2; font-weight: bold;');
		// console.log(`event.data: ${event.data}`);

		if (event.data == YT.PlayerState.ENDED) {
			// console.log('%cPlayer ended!', 'color: #39cee2; font-weight: bold;');
			handleVideoEnded();
		}

		if (event.data == YT.PlayerState.CUED) {
			// console.log('%cPlayer cued!', 'color: #54d9eb; font-weight: bold;');
			handlePlayerCued();
		}
	};

	useEffect(() => {
		if (!wrapperPlayerRef.current) return;
		if (!YT || !YT.Player) return;

		ytPlayerRef.current = new YT.Player('player', {
			width: '1024',
			height: '768',
			videoId: videoIdParam,
			events: {
				'onReady': onPlayerReady,
				'onStateChange': onPlayerStateChange,
				// 'onError': onPlayerError
			}
		});

		return () => {
			if (ytPlayerRef.current) {
				ytPlayerRef.current.destroy();
				ytPlayerRef.current = null;
			}
			if (wrapperPlayerRef.current) {
				wrapperPlayerRef.current.innerHTML = '';
			}
			if (isPlayerReadyRef.current) {
				isPlayerReadyRef.current = false;
			}
		};
	}, []);

	useEffect(() => {
		playlistRef.current = playlist;
	}, [playlist]);

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
	}, [videoIdParam, isVideo]);

	useEffect(() => {
		if (currentVideoId) {
			setActiveVideoId(currentVideoId);

			if (!ytPlayerRef.current) return;
			if (!isPlayerReadyRef.current) return;

			ytPlayerRef.current.cueVideoById(currentVideoId);
		}
	}, [currentVideoId]);

	return (
		<>
			{playlist && 
				<div id="wrapper-playlist">
					{playlist.items.length > 1 && <div id="playlist-controls">
						<button className="prev" onClick={() => setPlaylist({ ...playlist, currentIndex: Math.max(playlist.currentIndex - 1, 0) })}>
							<IconNext />
						</button>
						<button className="next" onClick={() => setPlaylist({ ...playlist, currentIndex: Math.min(playlist.currentIndex + 1, playlist.items.length - 1) })}>
							<IconNext />
						</button>
					</div>}
					<div id="playlist">
						{playlist.items.map((v, i) => (
							<div key={v.videoId} className={[
									'playlist-item',
									i === playlist.currentIndex && 'active'
								].filter(Boolean).join(' ')} onClick={() => setPlaylist({ ...playlist, currentIndex: i })}
							>
								<button className="remove" onClick={(e) => {
										e.stopPropagation();
										removeVideoFromPlaylist(v.videoId);
									}}
								>
									<IconRemove />
								</button>
								<img src={`https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`} alt={v.videoTitle} />
								<p className="video-title">{v.videoTitle}</p>
							</div>
						))}
					</div>
				</div>
			}
			<div id="wrapper-player" ref={wrapperPlayerRef}>
				<div id="player"></div>
			</div>
		</>
	);
};