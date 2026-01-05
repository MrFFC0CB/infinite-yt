import { Link, useOutletContext } from "react-router";
import FavButton from "./FavButton";
import "./ListVideos.css";

export default function ListVideos({ videos }: { videos: VideoDataType[] }) {
	const { currentSection } = useOutletContext<LayoutContext>();
	const cardBaseLink = (currentSection === 'favorites') ? '/watch/favorites/' : '/watch/video/';

	return (
		<div id="wrapper-cards">
			{videos.map((video) => (
				<div className="card" key={video.videoId}>
					<Link to={`${cardBaseLink}${video.videoId}`}></Link>
					<FavButton videoId={video.videoId} videoTitle={video.videoTitle} />
					<img src={`https://img.youtube.com/vi/${video.videoId}/0.jpg`} alt="" />
					<div className="video-data">
						<p className="video-title">{video.videoTitle}</p>
					</div>
				</div>
			))}
		</div>
	);
};