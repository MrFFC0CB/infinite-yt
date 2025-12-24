import { useEffect, useState } from "react";
import { Outlet, useMatches } from "react-router";
import Header from "./components/Header";

export default function AppLayout() {
	const matches = useMatches();
	const routeHandle = matches.map(m => m.handle as RouteHandle | undefined).find(Boolean);

	const sectionTitle = routeHandle?.title ?? 'Home';
	const currentSection = routeHandle?.section ?? 'home';

	const [ title, setTitle ] = useState<string>(sectionTitle);
	const [ activeVideoId, setActiveVideoId ] = useState<string>('');

	useEffect(() => {
		setTitle(sectionTitle);
	}, [sectionTitle]);

	return (
		<div id="app" className={currentSection}>
			<Header title={title} currentSection={currentSection} activeVideoId={activeVideoId} />

			<main>
				<Outlet context={{ currentSection, setTitle, setActiveVideoId }} />
			</main>
		</div>
	);
}