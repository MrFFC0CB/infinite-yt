import { useEffect, useState } from "react";

export function useFavorites() {
	const [favorites, setFavorites] = useState<VideoDataType[]>([]);

	useEffect(() => {
		window.api.getFavorites().then(favs => {
			setFavorites(favs);
		});
	}, []);

	return { favorites, setFavorites };
}