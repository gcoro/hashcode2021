import java.io.File

//  kotlinc -script test.kts ./a_example.in
args.forEach {
    println("input file -> $it")
    doStuff(it)
}

var pizzaTotal : Int = 0
var team2ppl: Int = 0
var team3ppl: Int = 0
var team4ppl: Int = 0

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
        }
        index++
        println(it)
    }
}

    fun doStuff(fileName: String) {
        readFileLineByLineUsingForEachLine(fileName)
        // todo

    }