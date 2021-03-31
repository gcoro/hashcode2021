const path = process.argv[2];
const name = path.split('/')[path.split('/').length - 1].split('.')[0];
const fs = require('fs');

let numberOfTeamCompleted = 0;
let numberOfPizzasDelivered = 0;

const readContent = () => {
    return fs.readFileSync(path, 'utf8');
};

const writeToFile = (rows) => {
    fs.writeFileSync('./' + name + '.out', rows.join('\n'), 'utf8');
};

const parseInput = (contentToParse) => {
    const lines = contentToParse.split('\n');
    const pizzaNumber = parseInt(lines[0].split( ' ')[0]);
    const numTeamOf2 = parseInt(lines[0].split( ' ')[1]);
    const numTeamOf3 = parseInt(lines[0].split( ' ')[2]);
    const numTeamOf4 = parseInt(lines[0].split( ' ')[3]);
    let result = [];
    const pizzas = [];
    const countOfUniqueIngredientsForPizzaMap = new Map();
    const ingredientToPizzas = new Map();

    for( let i=1; i<lines.length ;i++) {
        pizzas.push({'pizza':i-1, 'ingridients':(lines[i].split(' ', ).slice(1))});

        countOfUniqueIngredientsForPizzaMap.set(i-1, lines[i].split(' ', ).length-1);

        let ingredients = pizzas[i-1].ingridients;

        for( let j=0; j<ingredients.length ;j++) {
            if (ingredientToPizzas.has(ingredients[j])) {
                ingredientToPizzas.set(ingredients[j], [...ingredientToPizzas.get(ingredients[j]), pizzas[i-1].pizza]);
            } else {
                ingredientToPizzas.set(ingredients[j], [pizzas[i-1].pizza]);
            }
        }
    }

    for( let t=0; t<numTeamOf3 && numberOfPizzasDelivered+3<=pizzaNumber;t++) {
        let teamPizzas = findPizzasForTeam(3, new Map(countOfUniqueIngredientsForPizzaMap),
            countOfUniqueIngredientsForPizzaMap, pizzas, ingredientToPizzas);
        result.push('3 ' + teamPizzas.join(' '));
        numberOfTeamCompleted++;
    }


    for( let t=0; t<numTeamOf2 && numberOfPizzasDelivered+2<=pizzaNumber;t++) {
        let teamPizzas = findPizzasForTeam(2, new Map(countOfUniqueIngredientsForPizzaMap),
            countOfUniqueIngredientsForPizzaMap, pizzas, ingredientToPizzas);
        result.push('2 ' + teamPizzas.join(' '));
        numberOfTeamCompleted++;
    }

    for( let t=0; t<numTeamOf4 && numberOfPizzasDelivered+4<=pizzaNumber;t++) {
        let teamPizzas = findPizzasForTeam(4, new Map(countOfUniqueIngredientsForPizzaMap),
            countOfUniqueIngredientsForPizzaMap, pizzas, ingredientToPizzas);
        result.push('4 ' + teamPizzas.join(' '));
        numberOfTeamCompleted++;
    }
    result.unshift(numberOfTeamCompleted);
    writeToFile(result);
};

const findPizzasForTeam = (numberOfMembers, copyOfingredientsForPizzaMap, countOfUniqueIngredientsForPizzaMap, pizzas, ingredientToPizzas) => {
    let ingredientsPresentInTeamPizzas = new Set();
    let teamPizzasId = [];

    for( let j=0; j<numberOfMembers ;j++) {
        let pizzaIdWithMaxIngredients = findPizzaWithMaxIngredients(copyOfingredientsForPizzaMap);
        teamPizzasId.push(pizzaIdWithMaxIngredients);
        numberOfPizzasDelivered++;
        countOfUniqueIngredientsForPizzaMap.delete(pizzaIdWithMaxIngredients);
        copyOfingredientsForPizzaMap.delete(pizzaIdWithMaxIngredients);

        //for each "new" ingredient added from the selected pizza we need to update the count of unique ingredient in the pizza map
        updateCountOfIngredientsForPizza(ingredientsPresentInTeamPizzas, pizzas[pizzaIdWithMaxIngredients].ingridients, ingredientToPizzas,copyOfingredientsForPizzaMap);

        //add the new ingredients to the set that is storing the ones already used for the team
        pizzas[pizzaIdWithMaxIngredients].ingridients.forEach(ingredientsPresentInTeamPizzas.add, ingredientsPresentInTeamPizzas);
    }

    return teamPizzasId;
}

const updateCountOfIngredientsForPizza = (ingredientsPresentInTeamPizzas, ingredients, pizzaForIngredientsMap, copyOfIngredientsForPizzaMap) => {
    for(let i=0; i<ingredients.length ;i++){
        if (!ingredientsPresentInTeamPizzas.has(ingredients[i])) {
            let pizzasForIngredient = pizzaForIngredientsMap.get(ingredients[i]);
            for (let pizza = 0; pizza < pizzasForIngredient.length; pizza++) {
                if(copyOfIngredientsForPizzaMap.has(pizzasForIngredient[pizza])){ //if the pizza has not already been assigned to a team
                    copyOfIngredientsForPizzaMap.set(pizzasForIngredient[pizza],  copyOfIngredientsForPizzaMap.get(pizzasForIngredient[pizza]) - 1);
                }
            }
        }
    }
}

const findPizzaWithMaxIngredients = (pizzasMap) => {
    //select a random pizza
    let keys = Array.from(pizzasMap.keys());
    let bestPizza = keys[Math.floor(Math.random() * keys.length)];
    let max = pizzasMap.get(bestPizza);

    for (let [key, value] of pizzasMap) { //find the pizza with the max number ingredients
        if(value >= max){
            bestPizza=key;
            max = value;
        }
    }
    return bestPizza;
};


const content = readContent();
parseInput(content);