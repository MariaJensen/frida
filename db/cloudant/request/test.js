'use strict';

const request = require('./request.js');
const oneTimeServer = require('./oneTimeServer.js');

const requestOptions = {
	method: 'GET',
	protocol: 'https:',
	hostname: 'localhost'
};

const requestBody = undefined;

const requestHandler = (req, res) => { // how should server respond? 
	res.end();
};

oneTimeServer(requestOptions, requestBody , requestHandler)
.then((res) => {
	console.log(`resolved!`);
	console.log(res.statusCode);
	console.log(res.body);
})
.catch( (err) => {
	console.log(`rejected!`);
	console.log(err);
});

	
