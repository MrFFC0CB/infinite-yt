import fs from 'node:fs';
import path from 'node:path';
import { port, runServer } from './express';

const { app, BrowserWindow, ipcMain } = require('electron');

let favorites: Array<string> = [];
try {
	fs.readFileSync(path.join(__dirname, 'playlists/favorites.json'));
	favorites = JSON.parse(fs.readFileSync(path.join(__dirname, 'playlists/favorites.json')).toString());
} catch (error) {
	console.log('Favorites file not found.');
}
const getFavorites = () => {
	return favorites;
};
const addFavorite = (videoId: string) => {
	favorites.push(videoId);
};
const removeFavorite = (videoId: string) => {
	favorites = favorites.filter((video) => video !== videoId);
};

const createWindow = () => {
	const win = new BrowserWindow({
		width: 1024,
		height: 768,
		icon: path.join(__dirname, 'assets/images/favicon.ico'),
		// autoHideMenuBar: true,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
		}
	});

	win.loadURL(`http://localhost:${port}`);
};

app.whenReady().then(() => {
	runServer();
	ipcMain.handle('favorites:get', getFavorites);
	ipcMain.handle('favorites:add', addFavorite);
	ipcMain.handle('favorites:remove', removeFavorite);
	createWindow();
});