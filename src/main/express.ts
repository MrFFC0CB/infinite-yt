export let port = 3030;

export const runServer = () => {
	const express = require('express');
	const server = express();

	server.use(express.static('build'));

	server.listen(port, () => {
		console.log(`Server running on port ${port}`);
	});
};