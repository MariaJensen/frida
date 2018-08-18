'use strict';

const Cloudant = require('./cloudant');
const cloudant = new Cloudant(process.env.DB_HOSTNAME, process.env.DB_ADMIN_USERNAME, process.env.DB_ADMIN_PASSWORD);

const contentMap = function(doc) {
	if (doc._id !== 'foodName' && doc._id !== 'compName') {
		doc.content.forEach( function(row) {
			// doc._id: foodId
			// row: [compId, content]

			emit( row[0], row[1]);
		});
	}
};

(async () => {
	try{

		const doc = {
			_id: '_design/frida',
			views: {
				content: {
					map: contentMap.toString()
				}
			}
		};

		const createDesignDoc = await cloudant.createDoc('frida', doc);
		console.log('createDesignDoc: ', createDesignDoc);

	} catch(err) {
		console.log(err);
	}
	
})();