import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router";
import ListVideos from "../components/ListVideos";
import IconLoading from "../components/icons/IconLoading";

export default function SearchResults() {
	const keyword: string = useParams().query || '';
	const [ loading, setLoading ] = useState<boolean>(false);
	const [ searchResults, setSearchResults ] = useState<VideoDataType[]>([]);
	const { setTitle } = useOutletContext<LayoutContext>();

	useEffect(() => {
		if (!keyword) return;

		setLoading(true);

		window.api.fetchSearchResults(keyword)
			.then(results => {
				setSearchResults(results);
			})
			.finally(() => {
				setLoading(false);
				setTitle(`Results for: ${keyword}`);
			});
	}, [keyword]);

	if (loading) {
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
	}
	if (searchResults.length === 0) {
		return (
			<div style={{position: "absolute", inset: "0", display: "grid", placeItems: "center"}}>
				<p style={{textAlign: "center"}}>No results for: {keyword}</p>
			</div>
		)
	}

	return (
		<>
			{searchResults.length > 0 &&
				<ListVideos videos={searchResults} />
			}
		</>
	);
};