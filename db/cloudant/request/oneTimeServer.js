'use strict';

/**
	- Opens a server on an arbitrary available port on localhost
	- Calls request(requestOptions, requestBody)
	- Uses requestHandler to generate response
	- Returns response
	- Closes server

	If port is not set in requestOptions, the request will be send to the port on which the server is running. 
	If port is set in requestOptions, the request will be send to this port. 
*/

const http = require('http');
const https = require('https');
const request = require('./request.js');

module.exports = (requestOptions, requestBody, requestHandler) => {

	return new Promise( (resolve, reject) => async {

		let server; 

		if ( !requestOptions.protocol || requestOptions.protocol === 'http:') {
			server = http.createServer();
		} else if (requestOptions.protocol === 'https:') {
			server = https.createServer();
		}

		let response;
		let error; 
	
		server.on('listening', () => {

			const port = server.address().port;	

			if (!requestOptions.port) {
				requestOptions.port = port;	
			}
			
			try {
				response = await request(requestOptions, requestBody);
			} catch(err) {
				error = err;
			}
			server.close();

		});

		server.on('error', (err) => {
			console.log(`server: 'error'`);
			error = err; 
		});

		server.on('clientError', (err, sock) => {
			console.log(`server: 'clientError'`);
			error = err;
		});

		server.on('connection', (sock) => {
			console.log(`server: 'connection'`);
		});

		server.on('request', (req, res) => {
			console.log(`server: 'request'`);
			requestHandler(req, res);
		});
	
		server.on('close', () => {
			console.log(`server: 'close'`);
			
			if (error) {
				reject(error);
			}

			if (response) {
				resolve(response);
			}

			reject(new Error(`unknown error`));
		});

		server.listen(); // localhost, arbitrary available port
	});
};

