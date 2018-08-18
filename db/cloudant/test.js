'use strict';

const Cloudant = require('../cloudant');

const cloudant = new Cloudant(process.env.DB_HOSTNAME, process.env.DB_ADMIN_USERNAME, process.env.DB_ADMIN_PASSWORD);

(async () => {
	try {

		await cloudant.createDb('test');
		
		const createDoc = await cloudant.createDoc('test', {
			_id: 'test',
			jeremiah: 'Bullfrog',
		});
		console.log(createDoc);

		const updateDoc = await cloudant.updateDoc('test', {
			_id: 'test1',
			_rev: createDoc.rev,
			jeremiah: 'A good friend of mine',
		});
		console.log(updateDoc);		

	} catch(err) {
		console.log(err);
	} finally {
		await cloudant.deleteDb('test');
	}
})();