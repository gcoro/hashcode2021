const path = process.argv[2];
const name = path.split('/')[path.split('/').length - 1].split('.')[0];
const fs = require('fs');
const now = require('performance-now');

// node index.js a_example.in

let teams = {
	'2': 0,
	'3': 0,
	'4': 0
};

const pizzaList = [];

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
	teams = { 2: +team2ppl, 3: +team3ppl, 4: +team4ppl }

	for (let i = 0; i < pizzaTotal; i++) {
		const elements = lines[i].split(' ');
		const ingredientsCount = +elements.shift();
		const ingredients = elements.sort();
		pizzaList.push({ index: i, ingredientsCount, ingredients });
	}
	const end = now();
	console.log(`parseInput took ${(end - start).toFixed(3)} ms`);
};

const parseOutput = (deliveries) => {
	const start = now();
	const rows = [];
	rows.push(deliveries.length);
	deliveries.forEach(d => {
		rows.push(`${d.members} ${d.selectedPizzas.map(el => el.index).join(' ')}`)
	})
	const end = now();
	console.log(`parseOutput took ${(end - start).toFixed(3)} ms`);
	return rows;
};

// Return elements of array a that are also in b in linear time:
const intersect = (a, b) => {
	return a.filter(Set.prototype.has, new Set(b));
}

const removeAtIndex = (array, index) => {
	return array.splice(index, 1);
}

const removePizzaFromList = (pizza) => {
	var index = pizzaList.map((e) => e.index).indexOf(pizza.index);
	let remaining;
	if (index > -1) {
		remaining = arr.splice(index, 1);
	}
	return remaining;
}

const selectPizzas = (membersNumber) => {
	if(pizzaList.length < membersNumber) {
		return null
	}

	const arr = []
	for (let i = 0; i < membersNumber; i++) {
		arr.push(pizzaList.shift())
	}
	return arr;
}

const getResult = () => {
	const start = now();
	// add logic here
	const deliveries = [];
	// deliveries model is { members(int), selectedPizzas(obj)}
	['2', '3', '4'].forEach(numerosity => {
		for (let i = 0; i < +teams[numerosity]; i++) {
			if(!pizzaList.length) return; 
			let selected =  selectPizzas(+numerosity);
			if(!selected) return;

			deliveries.push({
				members: numerosity,
				selectedPizzas: selected
			})
		}
	})

	console.log(deliveries)

	const end = now();
	console.log(`getResult took ${(end - start).toFixed(3)} ms`);
	return deliveries;
};

const content = readContent();
parseInput(content);
const deliveries = getResult();
const parsedOutput = parseOutput(deliveries);
writeToFile(parsedOutput);