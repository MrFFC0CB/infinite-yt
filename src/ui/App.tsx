import { createBrowserRouter, RouterProvider } from "react-router";

import AppLayout from "./AppLayout";
import Home from "./pages/Home";
import Watch from "./pages/Watch";
import SearchResults from "./pages/SearchResults";
import FavoritesPage from "./pages/FavoritesPage";

import './App.css';

const router = createBrowserRouter([
	{
		Component: AppLayout,
		children: [
			{
				index: true,
				Component: Home,
				handle: {
					section: 'home',
					title: 'Home',
				} satisfies RouteHandle
			},
			{
				path: 'watch/video/:videoId',
				Component: Watch,
				handle: {
					section: 'watch',
					title: 'Watch',
				} satisfies RouteHandle
			},
			{
				path: 'watch/favorites/:videoId',
				Component: Watch,
				handle: {
					section: 'watch',
					title: 'Watch',
				} satisfies RouteHandle
			},
			{
				path: "search/:query",
				Component: SearchResults,
				handle: {
					section: 'search',
					title: 'Search',
				} satisfies RouteHandle
			},
			{
				path: "favorites",
				Component: FavoritesPage,
				handle: {
					section: 'favorites',
					title: 'Favorites',
				} satisfies RouteHandle
			},
			/* {
				path: "*",
				Component: Home,
				handle: {
					section: 'home',
					title: 'Home',
				} satisfies RouteHandle
			} */
		]
	}
]);

export default function App() {
	return <RouterProvider router={router} />;
};