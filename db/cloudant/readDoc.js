'use strict';

const request = require('./request/request.js'); 
const querystring = require('querystring');

module.exports = async (dbHostname, adminUsername, adminPassword, dbName, docId, queryParameters) => {

	// validate dbName: 

	if (!dbName || typeof dbName !== 'string') {
		throw new Error('dbName must be a non-empty string');
	}

	const dbNameRule = /^[a-z](([a-z]|[0-9]|[_$()+-/])*)$/;
		
	if (!dbNameRule.test(dbName)) {
		throw new Error('dbName is not valid');
	}

	// Validate docId: 

	if (!docId) {
		throw new Error('docId missing');
	}

	if (typeof docId !== 'string') {
		throw new Error('docId must be a string');
	}

	// Validate queryParams: 

	if (queryParameters && typeof queryParameters !== 'object') {
		throw new Error('queryParameters must be an object');
	}

		// TODO: Validate that queryParameters object contains valid query parameters

	// Generate querystring: 

	let str = ''; 

	if (queryParameters) {
		str = '?' + querystring.stringify(queryParameters);
	}

	// Make request: 

	const options = {
		method: 'GET',
		hostname: dbHostname, 
		path: `/${dbName}/${docId}${str}`,
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

	if (response.statusCode === 200) {
		return {
			status: 200,
			ok: true,
			id: responseBody._id,
			rev: responseBody._rev,
			doc: responseBody,
		};
	}

	responseBody.status = response.statusCode; 

	return responseBody; 
};

