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

    // console.log(rows)
    const [simulationTime, intersectionCount, streetsCount, carCount, carScore] = rows[0].split(' ').map(el => +el);
    const streets = [];
    const cars_paths = [];

    for (let i = 1; i <= +streetsCount; i++) { // cicliamo le strade
        const [startIntersection, endItersection, streetName, streetTime] = rows[i].split(' ');
        streets.push({
            startIntersection,
            endItersection,
            streetName,
            streetTime: +streetTime
        });
    }

    const firstStreetsToGo = []
    const pathOccurrences = {};
    for (let i = +streetsCount + 1; i < rows.length; i++) { // cicliamo i path
        const splittedRow = rows[i].split(' ');
        const pathLenght = +splittedRow[0];
        const path = [];
        for (let j = 1; j < pathLenght; j++) {
            const streetName = (splittedRow[j]);
            if (j === 1) { // prima strada x ogni macch
                firstStreetsToGo.push(streetName)
            }
            path.push(streetName);
            if (pathOccurrences[streetName]) {
                pathOccurrences[streetName] = pathOccurrences[streetName] + (1 / pathLenght) * 10;
                let streetTime = streets.find(a => a.streetName == streetName).streetTime
                pathOccurrences[streetName] = pathOccurrences[streetName] + (1 / +streetTime) * 10;
            }
            else pathOccurrences[streetName] = 1
        }

        cars_paths.push({
            length: pathLenght,
            path
        });

    }

    const intersectionMap = {}
    // conto quante strade ci sono a un determinato incrocio
    for (var i = 0; i < intersectionCount; i++) {
        intersectionMap[i] = {
            in: streets.filter(street => +street.endItersection === i),
            out: streets.filter(street => +street.startIntersection === i)
        }
    }

    // console.log('intersectionMap', intersectionMap);

    // save puntatore al next/prev
    /* streets.forEach(street => {
        street.prev = streets.filter(st => st.endItersection === street.startIntersection)
        street.next = streets.filter(st => st.startIntersection === street.endItersection)
    }) */

    // console.log('streets', streets)
    // console.log('cars_paths', cars_paths)
    // console.log(pathOccurrences)

    // quante volte la strada è prima 
    const mapFirstStreetsToGo = {}
    firstStreetsToGo.forEach(el => {
        if (!mapFirstStreetsToGo[el]) {
            mapFirstStreetsToGo[el] = 1
        } else {
            mapFirstStreetsToGo[el] = mapFirstStreetsToGo[el] + 1
        }
    })

    // console.log(mapFirstStreetsToGo)

    // output build
    let streetsNumber = 0;
    let outputArray = [];
    Object.keys(intersectionMap).forEach(key => {

        const streetsArr = intersectionMap[key].in.map(street => {
            // not working ok 
            let n = pathOccurrences[street.streetName];
            if (!pathOccurrences[street.streetName]) return;
            //if (pathOccurrences[street.streetName] > simulationTime) n = simulationTime;
            return (street.streetName + ' ' + Math.ceil(n / simulationTime))
        })
            .filter(a => a)
            .sort((a, b) => {
                if (mapFirstStreetsToGo[a.split(' ')[0]] < mapFirstStreetsToGo[b.split(' ')[0]]) {
                    return 1;
                }
                if (mapFirstStreetsToGo[a.split(' ')[0]] > mapFirstStreetsToGo[b.split(' ')[0]]) {
                    return -1;
                }

                // i nomi devono essere uguali
                return 0;
            })

        if (streetsArr.length) {
            streetsNumber++;
            outputArray.push(key);
            outputArray.push(streetsArr.length);
            outputArray = outputArray.concat(streetsArr);
        }
    })

    outputArray.unshift(streetsNumber);

    const end = now();
    console.log(`process result took ${(end - start).toFixed(3)} ms`);
    writeToFile(outputArray);
};

const content = readContent();
getResult(content);
