const path = process.argv[2];
const name = path.split('/')[path.split('/').length - 1].split('.')[0];
const fs = require('fs');
const now = require('performance-now');

const readContent = () => {
	return fs.readFileSync(path, 'utf8');
};

const writeToFile = (rows) => {
	fs.writeFileSync('./' + name + '.out', rows.join('\n'), 'utf8');
};

const getResult = (contentToParse) => {
	const start = now();
	let result = [];

	const rows = contentToParse.split('\n');
	let streets = [];
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

	return [intersectionsScheduled, scheduledStreets];
};

const content = readContent();
getResult(content);
