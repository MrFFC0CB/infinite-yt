type LayoutContext = {
	setTitle: React.Dispatch<React.SetStateAction<string>>;
};

import { useEffect, useRef } from "react";
import { useOutletContext } from "react-router";

import './Player.css';

export default function Player({ videoId, onEnded }: { videoId: string, onEnded: () => void }) {
	const { setTitle } = useOutletContext<LayoutContext>();
	const wrapperPlayerRef = useRef<HTMLDivElement | null>(null);
	const ytPlayerRef = useRef<any>(null);
	const isPlayerReadyRef = useRef<boolean>(false);

	const onPlayerReady = (event: any) => {
		console.log('%cPlayer ready!', 'color: #bada55; font-weight: bold;');
		isPlayerReadyRef.current = true;
		event.target.playVideo();

		setTitle(event.target.getVideoData().title || '');
	};
	const onPlayerStateChange = (event: any) => {
		/* UNSTARTED: -1, ENDED: 0, PLAYING: 1, PAUSED: 2, BUFFERING: 3, CUED: 5 */
		// console.log('%cPlayer state change!', 'color: #393ce2; font-weight: bold;');
		// console.log(`event.data: ${event.data}`);

		if (event.data == YT.PlayerState.ENDED) {
			console.log('%cPlayer ended!', 'color: #39cee2; font-weight: bold;');
			onEnded();
		}

		if (event.data == YT.PlayerState.PLAYING) {
			setTitle(ytPlayerRef.current.getVideoData().title);
		}
	};

	useEffect(() => {
		if (!wrapperPlayerRef.current) return;
		if (!YT || !YT.Player) return;

		ytPlayerRef.current = new YT.Player('player', {
			width: '640',
			height: '390',
			videoId: videoId,
			autoplay: 1,
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
		if (!ytPlayerRef.current) return;
		if (!isPlayerReadyRef.current) return;

		// ytPlayerRef.current.cueVideoById(videoId);
		ytPlayerRef.current.loadVideoById(videoId);
	}, [videoId]);

	return (
		<div id="wrapper-player" ref={wrapperPlayerRef}>
			<div id="player"></div>
		</div>
	);
};