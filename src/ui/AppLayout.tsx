import { Outlet, useLocation } from "react-router";
import Header from "./components/Header";

export default function AppLayout() {
	const pathname = useLocation().pathname;
	let currentSection: HeaderProps['currentSection'] = 'home';

	if (pathname === '/') {
		currentSection = 'home';
	} else {
		currentSection = pathname.split('/')[1];
	}

	return (
		<>
			<Header currentSection={currentSection} />

			<main id={currentSection}>
				<Outlet />
			</main>
		</>
	);
}