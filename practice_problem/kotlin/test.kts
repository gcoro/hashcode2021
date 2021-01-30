import java.io.File


class Pizza constructor(index: Int, pizzaRow: String) {
    val index= index
    val ingredientsCount = pizzaRow.split(' ')[0]
    val ingredients = pizzaRow.split(' ').slice(1..pizzaRow.split(' ').size - 1).sorted()
}

//  kotlinc -script test.kts ./a_example.in

var pizzaTotal : Int = 0
var team2ppl: Int = 0
var team3ppl: Int = 0
var team4ppl: Int = 0
var pizzaList =  ArrayList<Pizza>()
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

    (1..team4ppl).forEach{
        if (pizzaList.size >= 4){
            teamDeliveries.add(arrayOf("4",pizzaList.removeAt(0).index.toString(), pizzaList.removeAt(0).index.toString(), pizzaList.removeAt(0).index.toString(),pizzaList.removeAt(0).index.toString() ))
            countTeam++;
        }
        println(it)
    }
    (1..team3ppl).forEach{
        if (pizzaList.size >= 3){
            teamDeliveries.add(arrayOf("3",pizzaList.removeAt(0).index.toString(), pizzaList.removeAt(0).index.toString(), pizzaList.removeAt(0).index.toString()))
            countTeam++;
        }
        println(it)
    }
    (1..team2ppl).forEach{
        if (pizzaList.size >= 2){
            teamDeliveries.add(arrayOf("2",pizzaList.removeAt(0).index.toString(), pizzaList.removeAt(0).index.toString()))
            countTeam++;
        }
        println(it)
    }
    teamDeliveries.add(0,arrayOf(countTeam.toString()) )
}

fun doStuff(fileName: String) {
        readFileLineByLineUsingForEachLine(fileName)
        File("./"+fileName +"out").writeText(teamDeliveries.map {
            it.joinToString(" ")
        }.joinToString("\n"))
}