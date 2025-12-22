import { useState } from "react";
import { useParams } from "react-router";
import { useFavorites } from "../hooks/useFavorites";
import Player from "../components/Player";
import './Watch.css';

export default function Watch() {
	const { source, videoId } = useParams<{ source: string, videoId: string }>();
	if (!videoId) return;
	const [ playlist, setPlaylist ] = useState<VideoDataType[]>([]);
	const { favorites, setFavorites } = useFavorites();

	if (source === 'favorites') {
	}

	return (
		<Player videoId={videoId} />
	);
};