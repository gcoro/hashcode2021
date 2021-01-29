import java.io.File

class Pizza constructor(index: Int, pizzaRow: String) {
    val index= index
    val ingredientsCount = pizzaRow.split(' ')[0]
    val ingredients = pizzaRow.split(' ').slice(1..pizzaRow.split(' ').size - 1)
}

//  kotlinc -script test.kts ./a_example.in

args.forEach {
    println("input file -> $it")
    doStuff(it)
}

var pizzaTotal : Int = 0
var team2ppl: Int = 0
var team3ppl: Int = 0
var team4ppl: Int = 0
var pizzaList = ArrayList<Pizza>()

fun readFileLineByLineUsingForEachLine(fileName: String) {
    var index: Int = 0
    var npizzaList = ArrayList<Pizza>()
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
          npizzaList.add(pizza) 
        }
        index++
    }
    pizzaList = npizzaList
}

fun doStuff(fileName: String) {
        readFileLineByLineUsingForEachLine(fileName)
        // todo
}