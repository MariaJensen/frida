'use strict'; 

const request = require('./request/request.js');

module.exports = async (dbHostname, adminUsername, adminPassword, dbName, doc) => {

	if (!dbName || typeof dbName !== 'string') {
		throw new Error('dbName must be a non-empty string');
	}

	const dbNameRule = /^[a-z](([a-z]|[0-9]|[_$()+-/])*)$/;
		
	if (!dbNameRule.test(dbName)) {
		throw new Error('dbName is not valid');
	}

	// validate doc: 

	if (!doc || typeof doc !== 'object') {
		throw new Error('doc must be an object'); // empty allowed by cloudant? 
	}

	const keyNameRule = /^[^_]/; 

	for (let key in doc) {

		if (key === '_id') {
			continue;
		}

		if (!keyNameRule.test(key)) {
			throw new Error('doc contains a non-valid key');
		}
	}

	const requestBody = JSON.stringify(doc);

	const options = {
		method: 'POST',
		hostname: dbHostname,
		path: `/${dbName}`,
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Content-Length': Buffer.byteLength(requestBody),
		},
		auth: `${adminUsername}:${adminPassword}`,
	};

	const response = await request(options, requestBody);

	if (!response.statusCode || !response.body) {
		throw new Error('toil and trouble'); 
	}

	const responseBody = JSON.parse(response.body);

	responseBody.status = response.statusCode; 

	return responseBody;	
};