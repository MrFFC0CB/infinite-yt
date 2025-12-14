import { useEffect, useRef } from "react";
import { useParams } from "react-router";

import './Watch.css';

export default function Watch() {
	const wrapperPlayerRef = useRef<HTMLDivElement | null>(null);
	const ytPlayerRef = useRef<any>(null);
	const videoId = useParams().videoId as string || '';

	const onPlayerReady = (event: any) => {
		console.log('%cPlayer ready!', 'color: #bada55; font-weight: bold;');
		event.target.playVideo();
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
				// 'onStateChange': onPlayerStateChange,
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
		};
	}, []);

	return (
		<div id="wrapper-player" ref={wrapperPlayerRef}>
			<div id="player"></div>
		</div>
	);
};