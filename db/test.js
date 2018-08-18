'use strict';

const Cloudant = require('./cloudant');
const cloudant = new Cloudant(process.env.DB_HOSTNAME, process.env.DB_ADMIN_USERNAME, process.env.DB_ADMIN_PASSWORD);

const contentByFood = async (foodId) => {
	const getArray = await cloudant.readDoc('frida', foodId);
	return new Map(getArray.doc.content);
}; 

const contentByComp = async (compId) => {
	const str = `_design/frida/_view/content?key="${compId}"`;
	const getArray = await cloudant.readDoc('frida', str);
	return new Map(getArray.doc.rows.map(obj => [obj.id, obj.value]));
};


(async () => {
	try {

		const getFoodName = await cloudant.readDoc('frida', 'foodName');
		const foodName = new Map(getFoodName.doc.foodName);
		
		const getCompName = await cloudant.readDoc('frida', 'compName');
		const compName = new Map(getCompName.doc.compName);



		const test211 = await contentByComp('211');
		console.log(test211);
		

	} catch(err) {
		console.log(err);
	}
})();