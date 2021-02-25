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

	const [simulationDuration, intersections, streetsNumber, carsNumber] = rows[0].split(' ').map(el => parseInt(el));

	let i;
	for(i =1; i<=streetsNumber; i++){
        streets.push(rows[i]);
	}

	for(i; i<=streetsNumber + carsNumber; i++){
		cars.push(rows[i]);
	}

	console.log(cars)


	const end = now();
	console.log(`process result took ${(end - start).toFixed(3)} ms`);
    writeToFile(result);
};

const content = readContent();
getResult(content);
