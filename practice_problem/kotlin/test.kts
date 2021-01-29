import java.io.File

//  kotlinc -script test.kts ./a_example.in

args.forEach {
    println("input file -> $it")
    doStuff(it)
}

fun readFileLineByLineUsingForEachLine(fileName: String) 
  = File(fileName).forEachLine { println(it) }

fun doStuff(fileName: String) {
    readFileLineByLineUsingForEachLine(fileName);
    // todo
}