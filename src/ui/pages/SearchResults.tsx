import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router";
import ListVideos from "../components/ListVideos";
import IconLoading from "../components/icons/IconLoading";

export default function SearchResults() {
	const keyword: string = useParams().query || '';
	const [ searchResults, setSearchResults ] = useState<VideoDataType[] | null>(null);
	const { setTitle } = useOutletContext<LayoutContext>();

	useEffect(() => {
		if (!keyword) return;

		window.api.fetchSearchResults(keyword)
			.then(results => {
				setSearchResults(results);
			})
			.finally(() => {
				setTitle(`Results for: ${keyword}`);
			});
	}, [keyword]);

	if (searchResults) {
		if (searchResults.length === 0) {
			return (
				<div style={{position: "absolute", inset: "0", display: "grid", placeItems: "center"}}>
					<p style={{textAlign: "center"}}>No results for: {keyword}</p>
				</div>
			)
		}

		if (searchResults.length > 0) {
			return (
				<ListVideos videos={searchResults} />
			);
		}
	}

	return (
		<div style={{position: "absolute", inset: "0", display: "grid", placeItems: "center"}}>
			<p style={{fontSize: "1.5rem", textAlign: "center", lineHeight: "1.2"}}>
				Searching for:
				<br/>
				<strong style={{color: "#b88be1"}}>{keyword}</strong>
				<br/><br/>
				<IconLoading />
			</p>
		</div>
	)
};