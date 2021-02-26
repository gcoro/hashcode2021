const path = process.argv[2];
const name = path.split('/')[path.split('/').length - 1].split('.')[0];
const fs = require('fs');
const now = require('performance-now');
const _ = require('lodash');

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
	let streetsMap = new Map();
	let cars = [];
	const [simulationDuration, intersectionsNumber, streetsNumber, carsNumber] = rows[0].split(' ').map(el => parseInt(el));
	let intersectionMap = new Map();

	let i;
	for(i =1; i<=streetsNumber; i++){
		let data = rows[i].split(' ');
		streetsMap.set(data[2],{
			intersectionId: parseInt(data[1]),
			name: data[2],
			length: parseInt(data[3]),
			carsQueue: [],
			points: 1
        });
	}
	for(i; i<=streetsNumber + carsNumber; i++){
		let streets = rows[i].split(' ').slice(1);
		let carId = i-1-streetsNumber;
		for(let j =0; j< streets.length; j++) {
			if(streetsMap.get(streets[j]).carsQueue[j]){//&& streetsMap.get(streets[j]).carsQueue[j].length>1
				streetsMap.get(streets[j]).carsQueue[j].push(carId);
			} else {
				streetsMap.get(streets[j]).carsQueue[j] = [carId];
			}
		}
		cars.push({
			id: carId,
			streets
		});
	}

	streetsMap = new Map([...streetsMap].filter(([k, value]) => value.carsQueue.length > 0 ));

	for (let [key, entry] of streetsMap) {
		let trafficEverySeconds = Math.floor((simulationDuration/((entry.carsQueue.length))*simulationDuration/entry.length));
		entry.points = 1 + Math.floor(entry.carsQueue.slice(0, trafficEverySeconds).filter(a=>a).length * 1/entry.length);
	}

	let intersectionMaps = new Map();

	for (let [key, entry] of streetsMap) {
		let intersection = intersectionMaps.get(entry.intersectionId);
		if(intersection){
			intersectionMaps.set(entry.intersectionId, (intersection + entry.points));
		} else {
			intersectionMaps.set(entry.intersectionId, entry.points);
		}
	}

	let sortedIntersectionMaps = new Map([...intersectionMaps.entries()].sort((a, b) => b[1] - a[1]));

	//const [intersectionsScheduled, scheduledStreets] = execute(simulationDuration, intersectionMap);

	result.push(sortedIntersectionMaps.size);

	for (let [key, entry] of sortedIntersectionMaps) {
		result.push(key);
		let numberOfStreets =Array.from(streetsMap.values()).filter(el => el.intersectionId==key);
		result.push(numberOfStreets.length);
		for(let k=0; k< numberOfStreets.length; k++){
			result.push(numberOfStreets[k].name + ' ' + numberOfStreets[k].points);
		}
	}

	const end = now();
	console.log(`process result took ${(end - start).toFixed(3)} ms`);
    writeToFile(result);
};


const content = readContent();
getResult(content);
