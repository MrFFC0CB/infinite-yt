import fs from 'node:fs';
import path from 'node:path';
import { runServer } from './express';
import { fetchRelateds, fetchSearchResults } from './puppeteer';
import { app, BrowserWindow, ipcMain, session } from 'electron';

const isProd = app.isPackaged;
const PORT = isProd ? 4545 : 3040;
let favorites: VideoDataType[] = [];
const userDataDir = path.join(process.cwd(), 'data');
const listsDir = path.join(userDataDir, 'lists');
const pathToFavs = path.join(listsDir, 'favorites.json');
const pathToCookieFile = path.join(userDataDir, 'cookies.json');

fs.mkdirSync(listsDir, { recursive: true });
if (!fs.existsSync(pathToFavs)) {
	fs.writeFileSync(pathToFavs, "[]");
}

async function exportYoutubeCookies() {
	const ytCookies = await session.defaultSession.cookies.get({ domain: 'youtube.com' });
	fs.writeFileSync(pathToCookieFile, JSON.stringify(ytCookies, null, 2));
	console.log('Exported Electron cookies to electron-cookies.json');
}

/* console.log('__dirname: ', path.join(__dirname, 'data'));
console.log('process.cwd(): ', path.join(process.cwd(), 'data')); */

const readFavorites = () => {
	try {
		favorites = JSON.parse(fs.readFileSync(pathToFavs).toString());
	} catch (error) {
		console.error('Favorites file not found.');
	}
	return favorites;
};
const writeFavorites = (favorites: VideoDataType[]): VideoDataType[] | string => {
	try {
		fs.writeFileSync(pathToFavs, JSON.stringify(favorites));
		favorites = readFavorites();
	} catch (error) {
		console.error('Favorites file not found.');
		return `ERROR READING FAVORITES: ${error}`;
	}
	return favorites;
};

const getFavorites = () => {
	favorites = readFavorites();

	return favorites;
};
const addFavorite = (_e: any, videoData: VideoDataType) => {
	favorites = readFavorites();
	favorites.push({
		videoId: videoData.videoId,
		videoTitle: videoData.videoTitle,
	});
	
	return writeFavorites(favorites);
};
const removeFavorite = (_e: any, videoId: string) => {
	favorites = readFavorites();
	favorites = favorites.filter((video) => video.videoId !== videoId);

	return writeFavorites(favorites);
};

const createWindow = () => {
	const win = new BrowserWindow({
		width: 1024,
		height: 768,
		icon: path.join(__dirname, 'assets/images/favicon.ico'),
		autoHideMenuBar: isProd,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
		}
	});

	win.loadURL(`http://localhost:${PORT}`);
};

app.whenReady().then(() => {
	runServer(PORT);
	createWindow();

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});

	ipcMain.handle('favorites:get', getFavorites);
	ipcMain.handle('favorites:add', addFavorite);
	ipcMain.handle('favorites:remove', removeFavorite);

	ipcMain.handle('relateds:get', (_e, videoId: string) => fetchRelateds(videoId));
	ipcMain.handle('search:get', (_e, keyword: string) => fetchSearchResults(keyword));
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
	exportYoutubeCookies();
});