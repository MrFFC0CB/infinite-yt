import { useEffect } from "react";

declare const YT: any;

let player: any = null;

const Watching = () => {
	function onYouTubeIframeAPIReady() {
		player = new YT.Player('player', {
			width: '640',
			height: '390',
			videoId: 'aDaOgu2CQtI',
			autoplay: 1,
			events: {
				// 'onReady': onPlayerReady,
				// 'onStateChange': onPlayerStateChange,
				// 'onError': onPlayerError
			}
		});
	};

	useEffect(() => {
		onYouTubeIframeAPIReady();

		return () => {
			if (player) player.destroy();
		};
	}, []);

	return (
		<>
			<div id="player">Loading...</div>
		</>
	);
};

export default Watching;