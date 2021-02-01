import java.io.File
import kotlin.random.Random

class Pizza constructor(index: Int, pizzaRow: String) {
    val index = index
    val ingredientsCount = pizzaRow.split(' ')[0]
    val ingredients = pizzaRow.split(' ').slice(1..pizzaRow.split(' ').size - 1).sorted()
}

//  kotlinc -script test.kts ./a_example.in

var pizzaTotal: Int = 0
var team2ppl: Int = 0
var team3ppl: Int = 0
var team4ppl: Int = 0
var pizzaList = ArrayList<Pizza>()
var countTeam: Int = 0
var teamDeliveries = ArrayList<Array<String>>()

args.forEach {
    println("input file -> $it")
    doStuff(it)
}

fun readFileLineByLineUsingForEachLine(fileName: String) {
    var index: Int = 0
    File(fileName).forEachLine {
        if (index == 0) {
            // first line parsing
            val (npizzaTotal, nteam2ppl, nteam3ppl, nteam4ppl) = it.split(' ')
            pizzaTotal = npizzaTotal.toInt()
            team2ppl = nteam2ppl.toInt()
            team3ppl = nteam3ppl.toInt()
            team4ppl = nteam4ppl.toInt()
        } else {
            var pizza = Pizza(index - 1, it)
            pizzaList.add(pizza)
        }
        index++
    }
    pizzaList.sortByDescending {
        it.ingredientsCount
    }

    fun selectPizza(ingredients:Array<String>) : Pizza {
        var selectedPizza = pizzaList.find {
            println(ingredients.joinToString())
            println(it.ingredients.joinToString())
            println((((ingredients.size + it.ingredients.size) - ingredients.intersect(it.ingredients).size).toFloat().div(ingredients.size+it.ingredients.size)).toString())
            ((ingredients.size + it.ingredients.size) - ingredients.intersect(it.ingredients).size).toFloat().div(ingredients.size+it.ingredients.size) >= 0.8
        }
        if (selectedPizza != null){
            pizzaList.remove(selectedPizza)
        } else {
            if (pizzaList.size != 1) {
                selectedPizza = pizzaList.removeAt(Random.nextInt(0, pizzaList.size - 1))
            }
            else {
                selectedPizza = pizzaList[0]
            }
        }
        return selectedPizza
    }

    (1..team2ppl).forEach {
        if (pizzaList.size >= 2) {
            val firstPizza = pizzaList.removeAt(0)
            val secondPizza = selectPizza(firstPizza.ingredients.toTypedArray())
            teamDeliveries.add(arrayOf("2", firstPizza.index.toString(), secondPizza.index.toString()))
            countTeam++;
        }
    }


    (1..team3ppl).forEach {
        if (pizzaList.size >= 3) {
            val firstPizza = pizzaList.removeAt(0)
            val secondPizza = selectPizza(firstPizza.ingredients.toTypedArray())
            val thirdPizza = selectPizza(firstPizza.ingredients.union(secondPizza.ingredients).toTypedArray())
            teamDeliveries.add(arrayOf("3", firstPizza.index.toString(), secondPizza.index.toString(), thirdPizza.index.toString()))
            countTeam++;
        }
    }

    (1..team4ppl).forEach {
        if (pizzaList.size >= 4) {
            val firstPizza = pizzaList.removeAt(0)
            val secondPizza = selectPizza(firstPizza.ingredients.toTypedArray())
            val thirdPizza = selectPizza(firstPizza.ingredients.union(secondPizza.ingredients).toTypedArray())
            val forthPizza = selectPizza(firstPizza.ingredients.union(secondPizza.ingredients).union(thirdPizza.ingredients).toTypedArray())
            teamDeliveries.add(arrayOf("4", firstPizza.index.toString(), secondPizza.index.toString(), thirdPizza.index.toString(),forthPizza.index.toString()))
            countTeam++;
        }
    }



    teamDeliveries.add(0, arrayOf(countTeam.toString()))
}

fun doStuff(fileName: String) {
    readFileLineByLineUsingForEachLine(fileName)
    File("./" + fileName.split('.').toTypedArray().first() + ".out")
    .writeText(teamDeliveries.map {
        it.joinToString(" ")
    }.joinToString("\n"))
}