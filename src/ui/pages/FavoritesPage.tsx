import ListVideos from "../components/ListVideos";
import { useFavorites } from "../hooks/useFavorites";

export default function FavoritesPage() {
	const { favorites } = useFavorites();
	
	return (
		<ListVideos videos={favorites} />
	);
};