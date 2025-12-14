import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import "./Home.css";

interface Window {
	api: {
		getFavorites: () => Promise<any[]>;
		addFavorite: (videoId: string) => Promise<any[]>;
		removeFavorite: (videoId: string) => Promise<any[]>;
	}
}

declare const window: Window;

export default function Home() {
	const [favorites, setFavorites] = useState<any[]>([]);

	useEffect(() => {
		window.api.getFavorites().then((favs: any) => {
			setFavorites(favs);
		});
	}, []);

	let navigate = useNavigate();
	const goWatch = () => {
		const videoId = document.getElementById('video-id') as HTMLInputElement;
		(videoId.value) ? navigate(`/watch/${videoId.value}`) : navigate(`/watch/aDaOgu2CQtI`);
	};
	const goSearch = () => {
		const keyword = document.getElementById('keyword') as HTMLInputElement;
		(keyword.value) ? navigate(`/search/${keyword.value}`) : navigate(`/search/Pearl Jam`);
	};

	return(
		<div className="container">
			<input type="text" name="video-id" id="video-id" placeholder="Video URL" />
			<button onClick={goWatch}>Watch</button>
			<input type="text" name="keyword" id="keyword" placeholder="Keyword, like 'Pearl Jam'" />
			<button onClick={goSearch}>Search</button>

			{favorites.length > 0 &&
				<div className="favorites-options">
					<button onClick={() => navigate(`/watch/${favorites[0]}`)}>Watch favorites</button>
					<button onClick={() => navigate(`/favorites`)}>List favorites</button>
				</div>
			}
		</div>
	)
};