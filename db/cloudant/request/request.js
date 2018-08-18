'use strict';

const http = require('http');
const https = require('https');

/**
options is an object with possible properties
	* 	method <string> Default: 'GET'
	* 	family <number> IP address family. When unspecified, both 4 and 6 will be used.
	* 	protocol <string> Default: 'http:'
	* 	hostname <string> Default: 'localhost'
	* 	port <number> Default: 80
	* 	socketPath <string> Unix domain socket. Used in stead of hostname and port.
	* 	path <string> Default: '/'
	* 	localAddress <string>
	*	headers <Object> Object containing request headers
	*	auth <string> Basic authentication 'user:password'
	*	agent <http.Agent> Default: undefined, other possible values: false or an instance 	
			of class http.Agent
	*	createConnection <Function>
	* 	timeout <number> Socket timeout in milliseconds
*/

module.exports = (options, body, encoding = 'utf-8') => {

	let req;

	if (!options.protocol || options.protocol === 'https:') {			
		req = https.request(options);
	} else if (options.protocol === 'http:') {
		req = http.request(options);
	} else {
		throw new Error(`Protocol not supported`);
	}

	return new Promise( (resolve, reject) => {
		
		req.on('error', (err) => {
			// DNS resolution error, TCP level error, HTTP parse error for example non-existing address
			reject(err);
		}); 

		req.on('timeout', () => {
			req.abort();
			reject( new Error('aborted due to timeout') );
		});

		req.on('response', (res) => {
				
			res.on('error', (err) => {
				reject(err); 
			});

			let data = '';

			res.on('data', (chunk) => {
				data += chunk.toString();
			});

			res.on('end', () => {
				if (data) {
					res.body = data;
				}
				resolve(res);
			});		
		});

		if (body) {
			req.write(body, encoding);
		}

		req.end();
	});
}


/** Order of events: 

 'socket'
	| 
	|_______________________________________________________________________________
	|				|				|				|				|				|
	|				|				|				|				|				|
 'error'		'timeout'		'response'		'connect'		'upgrade'		'continue'
	|				|				|				|_______________|________________|
	|				|				|								|
 'close'		 'abort'		res: 'data' 				when not listened for, these
					|			zero or more				events will hang up socket
					|				|
				 'close'			|_______________________
					|				|						|
					|				|						|
				 'error'		'timeout'				res: 'end'
									|						|
									|						|
								 'abort'				 'close'
									|
									|
								 'close'
								 	|
								 	|
							  	res: 'aborted'
							    	|
							    	|
							    res: 'end'
							    	|
							    	|
							   	res: 'close'

*/