import { BrowserRouter, Route, Routes } from "react-router";

import Header from "./components/Header";
import AppLayout from "./routes/AppLayout";
import Home from "./components/Home";
import Watch from "./components/Watch";
import ListVideos from "./components/ListVideos";

import './App.css';

export default function App() {
	return (
		<BrowserRouter>
			<Header />

			<Routes>
				<Route element={<AppLayout />}>
					<Route path="/" element={<Home />} />
					<Route path="watch/:videoId" element={<Watch />} />
					<Route path="search/:query" element={<ListVideos />} />
					<Route path="favorites" element={<ListVideos />} />

					<Route path="*" element={<Home />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
};