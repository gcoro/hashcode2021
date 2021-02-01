const path = process.argv[2];
const name = path.split('/')[path.split('/').length - 1].split('.')[0];
const fs = require('fs');
const now = require('performance-now');

// node index.js a_example.in

const readContent = () => {
	return fs.readFileSync(path, 'utf8');
};

const writeToFile = (rows) => {
	fs.writeFileSync('./' + name + '.out', rows.join('\n'), 'utf8');
};

const parseInput = (contentToParse) => {
	const start = now();
	const lines = contentToParse.split('\n');
	const [pizzaTotal, team2ppl, team3ppl, team4ppl] = lines.shift().split(' ');
	const pizzaList = [];

	for (let i = 0; i < pizzaTotal; i++) {
		const elements = lines[i].split(' ');
		const ingredientsCount = +elements.shift();
		const ingredients = elements.sort();
		pizzaList.push({ index: i, ingredientsCount, ingredients });
	}
	const end = now();
	console.log(`parseInput took ${(end - start).toFixed(3)} ms`);
	return { pizzaTotal, team2ppl, team3ppl, team4ppl, pizzaList };
};

const parseOutput = (selectedPizzas) => {
	const start = now();
	// todo
	const end = now();
	console.log(`parseOutput took ${(end - start).toFixed(3)} ms`);
	return [selectedPizzas.length.toString(), selectedPizzas.join(' ')];
};

const getResult = (teams, pizzas) => {
	const start = now();
	// add logic here


	const end = now();
	console.log(`getResult took ${(end - start).toFixed(3)} ms`);
	return []
};

const content = readContent();
const { team2ppl, team3ppl, team4ppl, pizzaList } = parseInput(content);
const deliveries = getResult({ 2: team2ppl, 3: team3ppl, 4: team4ppl }, pizzaList);
const parsedOutput = parseOutput(deliveries);
writeToFile(parsedOutput);