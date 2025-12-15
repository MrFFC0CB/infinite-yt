import { useParams } from "react-router";
import { useFavorites } from "../hooks/useFavorites";
import IconHeart from "./icons/IconHeart";

export default function FavButton() {
	const params = useParams();
	const { favorites, setFavorites } = useFavorites();
	
	const handleAddToFavorites = (e: any) => {
		// if (currentSection != 'watch') return;
		if (!params.videoId) return;

		window.api.addFavorite({ videoId: params.videoId, videoTitle: '' })
			.then((favs) => {
				e.target.classList.add('active');
				setFavorites(favs);
			});
	};

	return(
		<button onClick={handleAddToFavorites}>
			<IconHeart />
		</button>
	);
};