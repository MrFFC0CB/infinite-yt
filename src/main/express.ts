export const runServer = (port: number): Promise<void> => {
	const express = require('express');
	const server = express();

	server.use(express.static(__dirname));

	return new Promise(resolve => {
		server.listen(port, () => {
			console.log(`Server running on port ${port}`);
			resolve();
		});
	});
};