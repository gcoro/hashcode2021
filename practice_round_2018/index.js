const path = process.argv[2];
const name = path.split('/')[path.split('/').length - 1].split('.')[0];
const fs = require('fs');

const readContent = () => {
	return fs.readFileSync(path, 'utf8');
};

const writeToFile = (rows) => {
	fs.writeFileSync('./' + name + '.out', rows.join('\n'), 'utf8');
};

const validateSlices = (slices) => {
	for (let i = 0; i < slices.length; i++) {
		let slice1 = slices[i];
		for (let k = 0; k < slices.length; k++) {
			if (i != k) {
				if (checkOverLap(slice1, slices[k])) {
					console.log(`Slices ${i} and ${k} overlap`);
				}
			}
		}
	}
}


const calculatePoints = (slices) => {
	let points = 0;
	let result = [slices.length];
	for (let i = 0; i < slices.length; i++) {
		points += slices[i].area;
		result.push(`${slices[i].rStart} ${slices[i].cStart} ${slices[i].rEnd} ${slices[i].cEnd}`);
	}

	writeToFile(result);
	validateSlices(slices);
	console.log('Total points:', points);
}

const parseInput = (contentToParse) => {
	let content = contentToParse.split(' ');
	let pizza = content[3].split('\n')

	let min = parseInt(contentToParse.split(' ')[2])
	let maxArea = parseInt(pizza.shift())

	for(let i =0; i<pizza.length ;i++){
		pizza[i]=pizza[i].split('');
	}

	let tomatos = 0;
	let mushroom = 0;

	for(let i=0; i<pizza.length; i++){
		for(let k=0; k<pizza[i].length; k++){
			if(pizza[i][k]=='T') tomatos++
			else mushroom++;
		}
	}

	let maxSlice = Math.floor(Math.min(tomatos, mushroom)/min);
	let slices = [];

	for(let i=0; i<pizza.length; i++){
		for(let k=0; k<pizza[i].length; k++){ //for each cells in the pizza
			if(pizza[i][k] !== 'X') {
				let ingridients = new Map();
				ingridients.set('T', 0)
				ingridients.set('M', 0)
				ingridients.set(pizza[i][k], 1);

				let maybeNewPizza = pizza.map(inner => inner.slice());
				maybeNewPizza[i][k] = 'X'; //mark cell as taken

				let sliceData = expand(maybeNewPizza, i, k, maxArea, min, maxSlice, ingridients);

				if(ingridients.get('T') >= min && ingridients.get('M')>= min ){ //slice is valid
					let rowDiff = 1+sliceData.rEnd-sliceData.rStart;
					let columnDiff  = 1+sliceData.cEnd-sliceData.cStart;
					sliceData.area = rowDiff * columnDiff;
					slices.push(sliceData);
					updatePizza(pizza, sliceData.rStart, sliceData.rEnd, sliceData.cStart, sliceData.cEnd);
				}
			}
		}
	}

	calculatePoints(slices);
};

const checkOverLap = (slice1, slice2) => {
	let leftX   = Math.max(slice1.cStart, slice2.cStart);
	let rightX  = Math.min(slice1.cEnd, slice2.cEnd);
	let topY    = Math.max(slice1.rStart, slice2.rStart);
	let bottomY = Math.min(slice1.rEnd, slice2.rEnd);

	if (leftX<rightX && topY<bottomY) return true;

	//return ((slice1.rStart < slice2.rStart &&  slice2.rStart<slice1.rEnd) && (slice1.cStart <slice2.cStart && slice2.cStart<slice1.cEnd));
}

const updatePizza = (pizza, rStart, rEnd, cStart, cEnd) => {
	for(let i=rStart; i<=rEnd; i++){
		for(let k=cStart; k<=cEnd; k++) { //for each cells in the pizza
			pizza[i][k] = 'X'; //mark cell as taken
		}
	}
}

function createSlice(r, currentIndexRow, c, currentIndexColumnTmp) {
	return {'rStart': r, 'rEnd': currentIndexRow, 'cStart': c, 'cEnd': currentIndexColumnTmp, 'area': 0};
}

const expand = (pizza, r, c, maxArea, min, maxSlice, ingridients) => { //we always try to expand to the right bottom first

	let currentIndexRow = r;
	let currentIndexColumnTmp = c;
	let currentIndexColumn = c;
	let currentArea = 1;

	while(currentArea<=maxArea){
		currentIndexRow = expandToBottomRow(pizza, currentIndexRow, maxArea, min, maxSlice, currentIndexColumn, ingridients, c);
		let tempCurrentAreaAfterRow = (currentIndexRow-r+1) * (currentIndexColumn-c > 0 ? currentIndexColumn-c: 1);

		currentIndexColumnTmp = expandToRightColumn(pizza, currentIndexRow, maxArea, min, maxSlice, currentIndexColumn, ingridients, r);
		let tempCurrentAreaAfterRowAndColumn = (currentIndexRow-r+1) * (currentIndexColumnTmp-c+1);

		if(currentIndexColumnTmp == currentIndexColumn || tempCurrentAreaAfterRowAndColumn==currentArea || tempCurrentAreaAfterRow ==currentArea){
			return createSlice(r, currentIndexRow, c, currentIndexColumnTmp);
		} else{
			if(tempCurrentAreaAfterRowAndColumn>maxArea && tempCurrentAreaAfterRow<=maxArea){
				return createSlice(r, currentIndexRow, c, currentIndexColumnTmp-1);
			} else if (tempCurrentAreaAfterRow>maxArea){
				return createSlice(r, currentIndexRow-1, c, currentIndexColumnTmp-1);
			}
		}

		currentIndexColumn = currentIndexColumnTmp;
		currentArea = tempCurrentAreaAfterRowAndColumn;
	}
};

const expandToBottomRow = (pizza, currentIndexRow, maxArea, min, maxSlice, currentIndexColumn, ingredients, c) => { //we always try to expand to the right bottom first, width always valid
	let i = c;

	if(currentIndexRow+1>=pizza.length ||
		!canExpandRow(i, currentIndexRow, pizza, currentIndexColumn)) return currentIndexRow;

	i = c;

	expandRow(i, currentIndexRow, pizza, currentIndexColumn, ingredients);

	return currentIndexRow+1; //added a row
};

const expandRow = (i, currentIndexRow, pizza, currentIndexColumn, ingredients) =>{
	while(i<=currentIndexColumn) { //try to expand each time by a row
		ingredients.set(pizza[currentIndexRow+1][i], ingredients.get(pizza[currentIndexRow+1][i])+1)
		pizza[currentIndexRow+1][i] = 'X';
		i++;
	}
}

const canExpandRow = (i, currentIndexRow, pizza, currentIndexColumn) =>{
	while(i<=currentIndexColumn) { //try to expand each time by a row
		if(pizza[currentIndexRow+1][i] == 'X'){
			return false;
		}
		i++;
	}
	return true;
}

const expandToRightColumn = (pizza, currentIndexRow, maxArea, min, maxSlice, currentIndexColumn, ingredients, r) => { //we always try to expand to the right bottom first, width always valid
	let i=r;
	if(currentIndexColumn + 1 >= pizza[0].length ||
		!canExpandColumn(i, currentIndexRow, pizza, currentIndexColumn)) return currentIndexColumn;

	i=r;
	expandColumn(i, currentIndexRow, pizza, currentIndexColumn, ingredients);

	return currentIndexColumn+1; //added a row
};

const expandColumn = (i, currentIndexRow, pizza, currentIndexColumn, ingredients) =>{
	while(i<=currentIndexRow) { //try to expand each time by a column
		ingredients.set(pizza[i][currentIndexColumn+1], ingredients.get(pizza[i][currentIndexColumn+1])+1);
		pizza[i][currentIndexColumn+1] = 'X';
		i++;
	}
}

const canExpandColumn = (i, currentIndexRow, pizza, currentIndexColumn) =>{
	while (i <= currentIndexRow) { //try to expand each time by a column
		if (pizza[i][currentIndexColumn + 1] == 'X') {
			return false;
		}
		i++;
	}
	return true;
}


const content = readContent();
parseInput(content);
