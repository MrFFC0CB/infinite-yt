import { Link, useNavigate } from "react-router";
import { useFavorites } from "../hooks/useFavorites";
import IconHeart from "./icons/IconHeart";

import "./Home.css";

export default function Home() {
	const { favorites, setFavorites } = useFavorites();

	let navigate = useNavigate();
	const goWatch = () => {
		let videoId = (document.querySelector('input#video-id') as HTMLInputElement).value as string;
		if (videoId.length > 11) {
			if (videoId.includes('https://youtu.be/')) videoId = videoId.replace('https://youtu.be/', '');
			if (videoId.includes('?v=')) videoId = videoId.split('?v=')[1].split('&')[0];
		}

		(videoId) ? navigate(`/watch/${videoId}`) : navigate(`/watch/aDaOgu2CQtI`);
	};
	const goSearch = () => {
		const keyword = document.querySelector('input#keyword') as HTMLInputElement;
		(keyword.value) ? navigate(`/search/${keyword.value}`) : navigate(`/search/Pearl Jam`);
	};

	return(
		<div className="container">
			<div id="main-options">
				<div className="form-group">
					<span>Paste video URL</span>
					<input type="text" name="video-id" id="video-id" placeholder="https://youtu.be/aDaOgu2CQtI" onKeyDown={(e) => e.key === 'Enter' && goWatch()} />
					<span>to</span>
					<button onClick={goWatch}>Watch</button>
				</div>
				<div className="form-group">
					<span>Type something like</span>
					<input type="text" name="keyword" id="keyword" placeholder="Pearl Jam" onKeyDown={(e) => e.key === 'Enter' && goSearch()} />
					<span>to</span>
					<button onClick={goSearch}>Search</button>
				</div>
			</div>

			{favorites.length > 0 &&
				<div id="favorites-options">
					<Link to={`/watch/${favorites[0].videoId}`}>
						Watch <IconHeart /> videos
					</Link>

					<Link to={`/favorites`}>
						List <IconHeart /> videos
					</Link>
				</div>
			}
		</div>
	)
};