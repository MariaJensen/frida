'use strict';

const request = require('./request/request.js'); 

module.exports = async (dbHostname, adminUsername, adminPassword, dbName, id, rev) => {

	// validate dbName: 

	if (!dbName || typeof dbName !== 'string') {
		throw new Error('dbName must be a non-empty string');
	}

	const dbNameRule = /^[a-z](([a-z]|[0-9]|[_$()+-/])*)$/;
		
	if (!dbNameRule.test(dbName)) {
		throw new Error('dbName is not valid');
	}

	// validate id and rev: 

	if (!id || typeof id !== 'string') {
		throw new Error('id must be a non-empty string');
	}

	if (!rev || typeof rev !== 'string') {
		throw new Error('rev must be a non-empty string');
	}

	// Make request: 

	const options = {
		method: 'DELETE',
		hostname: dbHostname, 
		path: `/${dbName}/${id}?rev=${rev}`,
		headers: {
			'Accept': 'application/json',
		},
		auth: `${adminUsername}:${adminPassword}`,
	}

	const response = await request(options);

	if (!response.body || !response.statusCode) {
		throw new Error(`nfg`);
	}

	const responseBody = JSON.parse(response.body);

	responseBody.status = response.statusCode; 

	return responseBody; 
};

