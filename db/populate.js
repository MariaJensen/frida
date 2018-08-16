'use strict';

const fs = require('fs');

const Cloudant = require('./cloudant');
const cloudant = new Cloudant(process.env.DB_HOSTNAME, process.env.DB_ADMIN_USERNAME, process.env.DB_ADMIN_PASSWORD);

// ---- Validating data and organizing it in maps: ----

let foods = fs.readFileSync('./foods.csv', 'utf8');
let comps = fs.readFileSync('./comps.csv', 'utf8');
let content = fs.readFileSync('./content.csv', 'utf8');

foods = foods.split('\n');
comps = comps.split('\n');
content = content.split('\n'); 
 
const foodName = new Map();
const compName = new Map();

foods.forEach( (value, index, array) => {
	
	const row = value.split('$');
	
	if (row.length !== 3 || !row[0] || !row[1] ) {
		console.log(`Something missing at line ${index + 1} in file foods.csv`);
		return;
	}
	
	const id = row[0]; 
	const name = row[1];

	if (typeof id !== 'string' || typeof name !== 'string') {
		console.log(`Typeerror at line ${index + 1} in file foods.csv`);
		return
	}

	if (foodName.has(id)) {
		console.log(`Duplicate foodId at line ${index + 1} in file foods.csv`);
		return;
	}

	foodName.set(id, name);
});

comps.forEach( (value, index, array) => {
	
	const row = value.split('$');
	
	if (row.length !== 4 || !row[0] || !row[1] ) {
		console.log(`Something missing at line ${index + 1} in file comps.csv`);
		return;
	}
	
	const id = row[0]; 
	const name = row[1];

	if (typeof id !== 'string' || typeof name !== 'string') {
		console.log(`Typeerror at line ${index + 1} in file comps.csv`);
		return;
	}

	if (compName.has(id)) {
		console.log(`Duplicate compId at line ${index + 1} in file comps.csv`);
		return;
	}

	compName.set(id, name);
});

const foodCompContent = new Map();

content.forEach( (value, index, array) => {
	
	const row = value.split('$');

	if (row.length !== 5) {
		console.log(`Something wrong at line ${index + 1} in file content.csv`);
		return;
	}

	if (!row[0]) {
		console.log(`FoodId missing at line ${index + 1} in file content.csv`);
		return;
	}

	if (!row[2]) {
		console.log(`compId missing at line ${index + 1} in file content.csv`);
		return;
	}

	if (!row[3]) {
		console.log(`content missing at line ${index + 1} in file content.csv`);
		return;
	}

	const foodId = row[0];
	const compId = row[2];
	const cont = Number(row[3]);
	
	if (typeof foodId !== 'string' || typeof compId !== 'string' || isNaN(cont)) {
		console.log(`Typeerror at line ${index + 1} in file content.csv`);
		return;
	}

	if (!foodName.has(foodId)) {
		console.log(`foodId with no foodName at line ${index + 1} in file content.csv`);
		return;
	}

	if (!compName.has(compId)) {
		console.log(`compId with no compName at line ${index + 1} in file content.csv`);
		return;
	}

	if (!foodCompContent.has(foodId)) {
		foodCompContent.set(foodId, new Map());
	}

	if (foodCompContent.get(foodId).has(compId)) {
		console.log(`Duplicate (foodId, compId) at line ${index + 1} in file content.csv`);
		return;
	}

	foodCompContent.get(foodId).set(compId, cont);
});

// ---- Creating doc and sending it to the db: ----

/**
	We now have three maps: 
			foodName: foodId -> foodName
		 	compName: compId -> compName
			foodCompContent: foodId -> [ foodMap: compId -> content ]
	Also we can be sure that maps foodName and compName are defined on every foodId and compId occurring in foodCompContent. 
*/

const docs = [];

foodCompContent.forEach( (foodMap, foodId) => {

	docs.push({
		_id: foodId,
		content: [...foodMap],
	});
});

console.log(Buffer.byteLength(JSON.stringify({
	docs: docs,
})));

(async () => {
	try{

		// const deleteDb = await cloudant.deleteDb('frida');

		// console.log('deleteDb: ', deleteDb);
		
		// const createDb = await cloudant.createDb('frida');

		// console.log('createDb: ', createDb);

		// if (!createDb.ok) {
		// 	return;
		// }

		////////

		const createDoc = await cloudant.createDoc('frida/_bulk_docs', {
			docs: docs,
		});

		createDoc.forEach( (response) => {
			if (!response.ok) {
				console.log(response);
			}
		});

		const createDoc2 = await cloudant.createDoc('frida', {
			_id: 'foodName',
			foodName: [...foodName],
		});

		if (!createDoc2.ok) {
			console.log(createDoc2);
		}

		const createDoc3 = await cloudant.createDoc('frida', {
			_id: 'compName',
			compName: [...compName],
		});

		if (!createDoc3.ok) {
			console.log(createDoc3);
		}

	} catch(err) {
		console.log(err.message);
	}
})();