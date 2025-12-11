const path = require('path');
const { app, BrowserWindow } = require('electron');

const createWindow = () => {
	const win = new BrowserWindow({
		width: 1024,
		height: 768,
		icon: './public/images/favicon.ico',
		// autoHideMenuBar: true,
	});

	win.loadFile(path.join(__dirname, 'index.html'));
};

app.whenReady().then(() => {
	createWindow();
});