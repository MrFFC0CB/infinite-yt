import { createBrowserRouter, RouterProvider } from "react-router";

import AppLayout from "./AppLayout";
import Home from "./components/Home";
import Watch from "./components/Watch";
import ListVideos from "./components/ListVideos";

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
				path: 'watch/:videoId',
				Component: Watch,
				handle: {
					section: 'watch',
					title: 'Watch',
				} satisfies RouteHandle
			},
			{
				path: "search/:query",
				Component: ListVideos,
				handle: {
					section: 'search',
					title: 'Search',
				} satisfies RouteHandle
			},
			{
				path: "favorites",
				Component: ListVideos,
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