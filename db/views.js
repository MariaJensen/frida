'use strict';

const request = require('./cloudant/request/request.js');
const Cloudant = require('./cloudant');
const cloudant = new Cloudant(process.env.DB_HOSTNAME, process.env.DB_ADMIN_USERNAME, process.env.DB_ADMIN_PASSWORD);

const foodNameMap = function(doc) {
	if (doc._id === 'foodName') {
		doc.foodName.forEach( function(row) {
			emit(row[0], row[1]);
		});
	}
};

const compNameMap = function(doc) {
	if (doc._id === 'compName') {
		doc.compName.forEach( function(row) {
			emit(row[0], row[1]);
		});
	}
};

const contentMap = function(doc) {
	if (doc._id !== 'foodName' && doc._id !== 'compName') {
		doc.content.forEach( function(row) {
			// doc._id: foodId
			// row: [compId, content]

			emit( [ doc._id, row[0] ], row[1]);
		});
	}
};

const contentReduce = function(keys, values, rereduce) {

	if (rereduce) {
		return 'rereduce';
	}

	return 'not rereduce';
};

const contentByCompMap = function(doc) {
	if (doc._id !== 'foodName' && doc._id !== 'compName') {
		doc.content.forEach( function(row) {
			// doc._id: foodId
			// row: [compId, content]

			emit(row[0], row[1]);
		});
	}
}

const body = {
	_id: "_design/frida",
	views: {
		foodName: {
			map: foodNameMap.toString(),
		},
		compName: {
			map: compNameMap.toString(),
		},
		content: {
			map: contentMap.toString(),
			reduce: contentReduce.toString(),
		},
		contentByComp: {
			map: contentByCompMap.toString(),
		}
	},
};

(async () => {
	try{

		const getDesignDoc = await cloudant.readDoc('frida', '_design/frida');

		console.log('\n* getDesignDoc: \n');
		console.log(getDesignDoc._id);
		console.log(getDesignDoc._rev);

		body._rev = getDesignDoc._rev;

		const updateDesignDoc = await cloudant.updateDoc('frida', body);
		console.log('\n* updateDesignDoc: \n');
		console.log(updateDesignDoc);

		const getView = await cloudant.readDoc('frida', '_design/frida/_view/contentByComp?key="10"');
		console.log('\n* getView: \n');	
		console.log(getView);

	} catch(err) {
		console.log(err);
	}
	
})();