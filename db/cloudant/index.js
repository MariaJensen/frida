'use strict';

const createDb = require('./createDb.js');
const deleteDb = require('./deleteDb.js');
const createDoc = require('./createDoc.js');
const readDoc = require('./readDoc.js');
const updateDoc = require('./updateDoc.js');
const deleteDoc = require('./deleteDoc.js');

module.exports = class Cloudant {

	constructor(dbHostname, adminUsername, adminPassword) {
		this.dbHostname = dbHostname;
		this.adminUsername = adminUsername;
		this.adminPassword = adminPassword;
	}

	createDb(dbName) {
		return createDb(this.dbHostname, this.adminUsername, this.adminPassword, dbName); 
	}

	deleteDb(dbName) {
		return deleteDb(this.dbHostname, this.adminUsername, this.adminPassword, dbName);
	}

	createDoc(dbName, doc) {
		return createDoc(this.dbHostname, this.adminUsername, this.adminPassword, dbName, doc);
	}

	readDoc(dbName, docId, queryParameters) {
		return readDoc(this.dbHostname, this.adminUsername, this.adminPassword, dbName, docId, queryParameters);
	}

	updateDoc(dbName, doc) {
		return updateDoc(this.dbHostname, this.adminUsername, this.adminPassword, dbName, doc);
	}

	deleteDoc(dbName, id, rev) {
		return deleteDoc(this.dbHostname, this.adminUsername, this.adminPassword, dbName, id, rev);
	}
	
}