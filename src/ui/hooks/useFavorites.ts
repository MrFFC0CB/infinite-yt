import { useEffect, useState } from "react";

export function useFavorites() {
	const [favorites, setFavorites] = useState<Favorite[]>([]);

	useEffect(() => {
		window.api.getFavorites().then(favs => {
			setFavorites(favs);
		});
	}, []);

	return { favorites, setFavorites };
}