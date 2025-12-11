const { app, BrowserWindow } = require('electron');
const path = require('path');
const express = require('express');

const runServer = () => {
	let port = 1312;
	const server = express();

	// server.use(express.static(path.join(__dirname, 'public')));
	server.use(express.static('build'));

	server.listen(port, () => {
		console.log(`Server running on port ${port}`);
	});
};

const createWindow = () => {
	const win = new BrowserWindow({
		width: 1024,
		height: 768,
		icon: './assets/images/favicon.ico',
		// autoHideMenuBar: true,
	});

	// win.loadFile(path.join(__dirname, 'index.html'));
	win.loadURL('http://localhost:1312');
};

app.whenReady().then(() => {
	runServer();
	createWindow();
});