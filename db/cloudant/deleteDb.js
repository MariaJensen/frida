'use strict';

const request = require('./request/request.js'); 

module.exports = async (dbHostname, adminUsername, adminPassword, dbName) => {

	const dbNameRule = /^[a-z](([a-z]|[0-9]|[_$()+-/])*)$/;
		
	if (!dbName || typeof dbName !== 'string' || !dbNameRule.test(dbName)) {
		return {
			error: 'request_not_send',
			reason: 'Illegal database name.',
			status: 0,
		};
	}

	const options = {
		method: 'DELETE',
		hostname: dbHostname, 
		path: `/${dbName}`,
		headers: {
			'Accept': 'application/json',
		},
		auth: `${adminUsername}:${adminPassword}`,
	}

	const response = await request(options); 

	if (!response.statusCode || !response.body) {
		throw new Error('something wicked');
	}

	const responseBody = JSON.parse(response.body);

	responseBody.status = response.statusCode; 

	return responseBody;
};