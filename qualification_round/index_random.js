const path = process.argv[2];
const name = path.split('/')[path.split('/').length - 1].split('.')[0];
const fs = require('fs');
const now = require('performance-now');

const readContent = () => {
	return fs.readFileSync(path, 'utf8');
};


/**
 * intersections Map {
 *     1: {
 *         atene: [[verde, black]],
 *         amsterdam: [[verde]],
 *         cars: [verde, black]
 *     },
 *     0: {
 *         londra: [[arancione]]
 *     }
 * }
 *
 *
 * amsterdam:cars: [null,  auto1, null,   null,  ......nSecondi], intersectionId:1, L:1
 * atene:    cars: [auto2, null,  null,  auto1,  ......nSecondi], intersectionId:1, L:2
 *
 * londres:  cars: [auto1, null,  auto2,  null, ......nSecondi], intersectionId:0, L:1
 *
 * moscou:   cars: [null,  auto2, auto1, null,   ......nSecondi], intersectionId:2, L:3
 *
 * rome:     cars: [null,  null,  null,   auto1, ......nSecondi], intersectionId:3, L:1
 *
 * auto1:[ ]
 *
 * groupByIntersection, groupByNumberOfCars
 */
const writeToFile = (rows) => {
	fs.writeFileSync('./' + name + '.out', rows.join('\n'), 'utf8');
};

const getResult = (contentToParse) => {
	const start = now();
	let result = [];

	const rows = contentToParse.split('\n');
	let streets = [];
	let streetsMap = new Map();
	let cars = [];
	const [simulationDuration, intersectionsNumber, streetsNumber, carsNumber] = rows[0].split(' ').map(el => parseInt(el));
	let intersectionMap = new Map();

	let i;
	for(i =1; i<=streetsNumber; i++){
		let data = rows[i].split(' ');
        streets.push({
			startIntersection: parseInt(data[0]),
			endIntersection: parseInt(data[1]),
			name: data[2],
			length: parseInt(data[3])
        });

        streetsMap.set(streets[streets.length-1].name, {
			// eslint-disable-next-line no-mixed-spaces-and-tabs
        	'length': streets[streets.length-1].length,
			'intersection': streets[streets.length-1].endIntersection,
			'streetName': streets[streets.length-1].name
		});
        if(!intersectionMap.has(streets[streets.length-1].endIntersection)){
			intersectionMap.set(streets[streets.length-1].endIntersection, {
				value: 1,
				streets: [streets[streets.length-1].name]
			});
		} else {
			// eslint-disable-next-line no-mixed-spaces-and-tabs
        	let intersectionEntry = intersectionMap.get(streets[streets.length-1].endIntersection);
			// eslint-disable-next-line no-mixed-spaces-and-tabs
        	intersectionMap.set(streets[streets.length-1].endIntersection, {
				value: intersectionEntry.value + 1,
				streets: [... intersectionEntry.streets, streets[streets.length-1].name]
			});
		}
	}

	for(i; i<=streetsNumber + carsNumber; i++){
		let streets = rows[i].split(' ').slice(1);
		cars.push({
			id: i-1-streetsNumber,
			streets
		});
	}

	let carsMatrix = new Array(cars.length); //rows


	for(let k=0; k<cars.length; k++){
		let streetLength = new Array();
		for(let s=0; s<cars[k].streets.length; s++){
			let streetEntry = streetsMap.get(cars[k].streets[s])
			streetLength = streetLength
				.concat(new Array(streetEntry.length).fill({id:-1}))
				.concat([{'id':streetEntry.intersection,  'streetname': streetEntry.streetName}]);
		}

		carsMatrix[k]=streetLength;
	}

	console.log('************')
	let status = new Array().fill(' ');

	for(let h=0; h<simulationDuration;h++){
		for(let y=0; y< carsMatrix.length ;y++) {
			let tmpStatus = carsMatrix[y][h];
			if(tmpStatus.id!=-1){
				status[h] = (carsMatrix[y][h]);
			}
		}
	}
	console.log(status);

	for(let h=0; h<status.length;h++){

	}
	//let intersectionsScheduled = 0;
	//let scheduledStreets = [];
	// let scheduledStreets = [{
	// 	intersectionId : 0,
	// 	numberOfStreets: 0,
	// 	streets: [['streetName', 'secondsOfGreen']]
	// }];


	const [intersectionsScheduled, scheduledStreets] = execute(simulationDuration, intersectionMap);


	result.push(intersectionsScheduled);
	for(let j =0; j< scheduledStreets.length; j++){
		result.push(scheduledStreets[j].intersectionId);
		result.push(scheduledStreets[j].numberOfStreets);
		for(let k=0; k< scheduledStreets[j].streets.length; k++){
			result.push(scheduledStreets[j].streets[k].join(' '));
		}
	}

	const end = now();
	console.log(`process result took ${(end - start).toFixed(3)} ms`);
    writeToFile(result);
};


const execute = (simulationDuration, intersectionMap) => {
	let intersectionsScheduled = 0;
	let scheduledStreets = [];

	for (let [key, entry] of intersectionMap) {
		let streets = entry.streets.map(el => [el, Math.floor(simulationDuration/entry.value)]);
		scheduledStreets.push({
			'intersectionId': key,
			'numberOfStreets': entry.value,
			streets
		});
	}

	return [intersectionMap.size, scheduledStreets];
};

const content = readContent();
getResult(content);
