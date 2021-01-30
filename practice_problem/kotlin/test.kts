import java.io.File
import java.util.*


class Pizza constructor(index: Int, pizzaRow: String) {
    val index= index
    val ingredientsCount = pizzaRow.split(' ')[0]
    val ingredients = pizzaRow.split(' ').slice(1..pizzaRow.split(' ').size - 1)
}

//  kotlinc -script test.kts ./a_example.in

var pizzaTotal : Int = 0
var team2ppl: Int = 0
var team3ppl: Int = 0
var team4ppl: Int = 0
var pizzaList =  ArrayList<Pizza>()

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
}

fun doStuff(fileName: String) {
        readFileLineByLineUsingForEachLine(fileName)
        // todo
}