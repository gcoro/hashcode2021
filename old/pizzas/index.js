const fs = require('fs');

try {
  // read contents of the file
  const data = fs.readFileSync('./input/sample1.txt', 'UTF-8');


  /****** READ INPUT  ****+*/

  // split the contents by new line
  const lines = data.split(/\r?\n/);

  const inputDatas = lines[0].split(' ')

  const input = {
    rows: inputDatas[0],
    columns: inputDatas[1],
    minSingle: inputDatas[2],
    maxCells: inputDatas[3]
  }

  console.log('rows', input.rows);
  console.log('columns', input.columns);
  console.log('minSingle', input.minSingle);
  console.log('maxCells', input.maxCells);

  const tempData = {
    numMushroom: 0,
    numTomato: 0,
  }

  let inputPizza = []
  let inputPizzaCols = 0

  let output = []

  const tomatosCoords = []
  const mushroomsCoords = []

  for (let i = 1, l = lines.length; i < l; i++) {
    const row = lines[i].split('')

    for (let j = 0, jl = row.length; j < jl; j++) {
      if ((row[j] === 'T')) {
        tempData.numTomato++
        tomatosCoords.push([i - 1, j])
      }
      if (row[j] === 'M') {
        mushroomsCoords.push([i - 1, j])
        tempData.numMushroom++
      }
    }

    console.log(row);
    inputPizza.push(row)
  }

  console.log('numTomato', tempData.numTomato);
  console.log('numMushroom', tempData.numMushroom);

  console.log('tomatosCoords', tomatosCoords);
  console.log('mushroomsCoords', mushroomsCoords);

  console.log('inputPizza');
  console.table(inputPizza)

  const tempPizza = [...Array(inputPizza.length)].map(x => Array(inputPizza[0].length).fill(0))

  console.log('tempPizza');
  console.table(tempPizza)


  /************  CODE *******/

  let maxSlice = Math.floor((Math.min(tempData.numTomato, tempData.numMushroom)) / input.minSingle)

  let coords = Array(maxSlice)

  let found = true;
  let inc = 0

  let [currentRow, currentCol] = (tomatosCoords.length > mushroomsCoords.length) ? mushroomsCoords[0] : tomatosCoords[0];

  let nextRow, nextCol;

  console.log('currentRow, currentCol', currentRow, currentCol);


  /******** */
  let item = inputPizza[currentRow, currentCol]

  nextRow = currentRow;
  nextCol = currentCol;

  let incTomato = incMushroom = 0

  /*
  while (found) {

    // TODO: move from 0,0 until slice has the minimum requirement

  }
*/

  /******+ */

  /*
  
  while (found) {
  
  
    currentCol
  
    for (let i = 0, l = inputPizza.length; i < l; i++) {
      for (let k = 0, lk = inputPizza[i].length; k < lk; k++) {
  
  
  
        console.log(inputPizza[i][k]);
      }
    }
  
  
  
  
    inc++
    if (inc === 1000) found = false;
  }
  */

  console.log('maxSlice', maxSlice)

  console.log('output', output)

} catch (err) {
  console.error(err);
}