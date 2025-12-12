import { port, runServer } from './express';
const { app, BrowserWindow } = require('electron');

const createWindow = () => {
	const win = new BrowserWindow({
		width: 1024,
		height: 768,
		icon: './assets/images/favicon.ico',
		// autoHideMenuBar: true,
	});

	win.loadURL(`http://localhost:${port}`);
};

app.whenReady().then(() => {
	runServer();
	createWindow();
});