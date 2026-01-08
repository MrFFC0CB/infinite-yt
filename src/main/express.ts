export let port = 3040;

export const runServer = () => {
	const express = require('express');
	const server = express();

	server.use(express.static(__dirname));

	server.listen(port, () => {
		console.log(`Server running on port ${port}`);
	});
};