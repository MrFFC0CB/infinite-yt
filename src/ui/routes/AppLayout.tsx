import { Outlet, useLocation } from "react-router";

export default function AppLayout() {
	const pathname = useLocation().pathname;
	let currentSection: string = '';

	if (pathname === '/') {
		currentSection = 'home';
	} else {
		currentSection = pathname.split('/')[1];
	}

	return (
		<main id={currentSection}>
			<Outlet />
		</main>
	);
}