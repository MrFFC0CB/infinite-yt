import { Outlet, useLocation } from "react-router";
import Header from "./components/Header";

export default function AppLayout() {
	const pathname = useLocation().pathname;
	let currentSection: string = '';

	if (pathname === '/') {
		currentSection = 'home';
	} else {
		currentSection = pathname.split('/')[1];
	}

	return (
		<>
			<Header />

			<main id={currentSection}>
				<Outlet />
			</main>
		</>
	);
}