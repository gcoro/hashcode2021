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
	let carsMap = new Map();
	let cars = [];
	const [simulationDuration, intersectionsNumber, streetsNumber, carsNumber, bonusPoints] = rows[0].split(' ').map(el => parseInt(el));
	let intersectionMap = new Map();

	let i;
	for (i=1; i<=streetsNumber; i++) {
		let data = rows[i].split(' ');
		streetsMap.set(data[2], {
			intersectionId: parseInt(data[1]),
			name: data[2],
			length: parseInt(data[3]),
			carsQueue: [],
			points: 0
        });
	}
	//console.log("streetsMap", streetsMap);

    // calcolo il costo di ogni macchina
    let maxPoints = 0;
    let totalPoints = 0;
	for (i=1; i<=carsNumber; i++) {
		let carId = i+streetsNumber;
		let intersectionCount = rows[carId].split(' ').slice(0)[0];
		let streets = rows[carId].split(' ').slice(1, intersectionCount+1);
		let pathCost = 0;
		if (streets) {
		    streets[streets.length-1] = streets[streets.length-1].replace("\r", "");
            for (k=1; k<=streets.length-1; k++) {
                pathCost += streetsMap.get(streets[k]).length;
            }
        }
	    //console.log("pathCost", pathCost);
		let points = bonusPoints + (simulationDuration - pathCost);
		carsMap.set(carId, {
            carId: carId,
             intersectionCount: intersectionCount,
             streets: streets,
             points: points
        });
        maxPoints += points;
        let secondOnTimeline = 0;
	        //console.log("carssssssssssssssss");
		for (k=0; k<=streets.length-1; k++) {
	        //console.log("streets", streetsMap.get(streets[k]).length);
		    if (k!=0) {
		        secondOnTimeline += streetsMap.get(streets[k]).length;
		    }
            //if (streetsMap.get(streets[k]).carsQueue) {
                streetsMap.get(streets[k]).carsQueue.push(carsMap.get(carId));
                // calcolo il traffico di ogni strada durante tutta la durata del tempo secondo
                // * + punteggio macchine
                // * + punto nel tempo in cui si trova
                // * + coda di macchine
                if (secondOnTimeline == 0) {
                    //console.log("points = ",carsMap.get(carId).points);
                    streetsMap.get(streets[k]).points += carsMap.get(carId).points * 4 + (simulationDuration - secondOnTimeline) + streetsMap.get(streets[k]).carsQueue.length;
                } else {
                    streetsMap.get(streets[k]).points += carsMap.get(carId).points + (simulationDuration - secondOnTimeline) + streetsMap.get(streets[k]).carsQueue.length;
                }
                streetsMap.get(streets[k]).second = 0;
            /*}
            else {
                streetsMap.get(streets[k]).carsQueue = [carsMap.get(carId)];
                streetsMap.get(streets[k]).points += carsMap.get(carId).points + (simulationDuration - secondOnTimeline);
            }*/
		}
	}
	console.log("maxPoints", maxPoints);
	//console.log("streetsMap", streetsMap);

	// riordino le strade per intersezione
	let intersectionMaps = new Map();
	for (let [key, entry] of streetsMap) {
		let intersection = intersectionMaps.get(entry.intersectionId);
		if (intersection) {
			intersection.set(key, entry);
		} else {
		    let street = new Map();
		    street.set(key, entry);
			intersectionMaps.set(entry.intersectionId, street);
		}
        // punteggio di ogni strada
	}
    //console.log("intersectionMaps", intersectionMaps);

	//console.log("intersectionMaps 1", intersectionMaps);
	// calcolo i secondi a seconda della pesantezza delle strade
	let streetDeleted = 0;
	for (let [keyIntersection, entryIntersection] of intersectionMaps) {
	    if (entryIntersection.size == 1) {
	        let firstStreet = entryIntersection.entries().next().value[1];
	        firstStreet.second = 1;
	    } else {
	        let sumPointStreets = 0;
	        entryIntersection.forEach((street) => {
	            sumPointStreets += street.points;
            });
	        entryIntersection.forEach((street) => {
	            if (street.points == 0) {
	                streetDeleted++;
                    entryIntersection.delete(street.name);
                } else {
                    let percent = (street.points/sumPointStreets) * 100;
                    //console.log("percent", percent);
                    let second = (percent/100) * street.carsQueue.length;
                    //let second = (percent/simulationDuration) * street.carsQueue.length;
                    // simulationDuration : x = totCars : queue
                    // x = simulationDuration * queue / totCars
                    //let second = simulationDuration * street.carsQueue.length / carsNumber;
                    //let second = (percent/simulationDuration) * 5;
                    //console.log("second", second);
                    if (second < 1) {
                        second = Math.ceil(second);
                    } else {
                        second = Math.round(second);
                    }
                    street.second = 1;
                }
            });
	    }
	}
    console.log("strade eliminate", streetDeleted);

	// rimuovo le strade che non hanno macchine
	for (let [keyIntersection, entryIntersection] of intersectionMaps) {
	    if (entryIntersection.size == 0) {
            intersectionMaps.delete(keyIntersection);
	    }
	}
	//console.log("intersectionMaps 2", intersectionMaps);

    result.push(intersectionMaps.size);
	for (let [key, entry] of intersectionMaps) {
		result.push(key);
		result.push(entry.size);
        let sortedIntersectionMaps = new Map([...entry].sort((a, b) => a[1].points - b[1].points));
        for (let [name, value] of sortedIntersectionMaps) {
			result.push(name + ' ' + value.second);
		}
	}
	//console.log(result);

	const end = now();
	console.log(`process result took ${(end - start).toFixed(3)} ms`);
    writeToFile(result);
};


const content = readContent();
getResult(content);
