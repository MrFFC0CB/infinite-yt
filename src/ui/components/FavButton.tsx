import { useFavorites } from "../hooks/useFavorites";
import IconHeart from "./icons/IconHeart";
import "./FavButton.css";

export default function FavButton({ videoId = '', videoTitle = '' }: { videoId?: string, videoTitle?: string }) {
	const { favorites, setFavorites } = useFavorites();

	if (!videoId) return null;

	const isFav = favorites.some(f => f.videoId === videoId);
	
	const handleAddToFavorites = (e: any) => {
		if (!videoId) return;

		if (isFav) {
			window.api.removeFavorite(videoId)
				.then((favs) => {
					setFavorites(favs);
				});
		} else {
			console.log(`videoTitle**: ${videoTitle}`);

			window.api.addFavorite({ videoId: videoId, videoTitle: videoTitle })
				.then((favs) => {
					setFavorites(favs);
				});
		}
	};

	return(
		<button className={`fav-button ${isFav ? 'active' : ''}`} onClick={handleAddToFavorites}>
			<IconHeart />
		</button>
	);
};