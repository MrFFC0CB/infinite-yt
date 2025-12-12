import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from "react-router";

import App from './App';
import Header from './components/Header';
import Watching from './components/Watching';

const root = createRoot(document.getElementById('root')!);
root.render(
	<BrowserRouter>
		<Header />
		<Routes>
			<Route>
				<Route path="/" element={<App />} />
				<Route path="watching" element={<Watching />} />

				<Route path="*" element={<App />} />
			</Route>
		</Routes>
	</BrowserRouter>
);