package com.gitlab.joemama

import java.io.FileReader
import java.util.LongSummaryStatistics
import kotlin.math.max
import kotlin.math.min
import kotlin.time.ExperimentalTime
import kotlin.time.measureTime

fun parseInput(path: String): List<String> {
    val reader = FileReader(path)

    return reader.readLines()
}

data class Pos(val x: Int, val y: Int)
data class Node(val pos: Pos, val riskLevel: Int, val neighbours: List<Pos>)

fun getNeighbours(input: List<String>, pos: Pos): List<Pos> = listOf(
    Pos(max(0, pos.x - 1), pos.y),
    Pos(min(input.size - 1, pos.x + 1), pos.y),
    Pos(pos.x, max(0, pos.y - 1)),
    Pos(pos.x, min(input[pos.x].length - 1, pos.y + 1))
).filter { it != pos }

fun parseAsNodes(input: List<String>): Array<Node> {
    val out = mutableListOf<Node>()

    for (i in input.indices) {
        for (j in input[i].indices) {
            val pos = Pos(i, j)
            out.add(Node(pos, input[i][j].digitToInt(), getNeighbours(input, pos)))
        }
    }

    return out.toTypedArray()
}

val reduction: (Node, Node, Map<Pos, Long>) -> Node = { acc, it, distances ->
    if (distances.getValue(acc.pos) < distances.getValue(it.pos)) acc else it
}

/**
 * Inefficient implementation for Dijkstra's algorithm
 */
fun dijkstra(graph: Map<Pos, Node>, start: Node): Pair<Map<Node, Node?>, Map<Pos, Long>> {
    val set = mutableSetOf(start)
    val distances = mutableMapOf<Pos, Long>()
    val previouses = mutableMapOf<Node, Node?>()

    for (node in graph.values) {
        distances[node.pos] = Long.MAX_VALUE
        previouses[node] = null
        set.add(node)
    }

    distances[start.pos] = 0

    while (set.isNotEmpty()) {
        val curr = set.first { distances.getValue(it.pos) < Long.MAX_VALUE}
        set.remove(curr)

        curr.neighbours.filter { set.contains(graph[it]) }.forEach {
            val dist = distances.getValue(it) + curr.riskLevel

            if (dist < distances.getValue(it) && distances.getValue(it) < Long.MAX_VALUE) {
                distances[it] = dist
                previouses[graph.getValue(it)] = curr
                set.add(graph.getValue(it))
            }
        }
    }

    return Pair(previouses, distances)
}

@ExperimentalTime
fun main(args: Array<String>) {
    val timeFor1 = measureTime { println(part1(args)) }
    println("Task 1 took $timeFor1")
    val timeFor2 = measureTime { println(part2(args)) }
    println("Task 2 took $timeFor2")
}

internal fun part1(args: Array<String>): Long {
    val input = parseInput(args[0])
    val (res, lowerLeft) = calculateShortestPath(input)
    return res.second[lowerLeft] ?: -1
}

fun mutateInput(input: List<String>): List<String> {
    val newInput = mutableListOf<String>()
    for (i in 0 until 5 * input.size) {
        newInput.add("")
    }
    for (j in 0 until 5) {
        val newBrick = input.map { line ->
            line.map {
                val newVal = it.digitToInt() + j
                (newVal % 10 + newVal / 10).digitToChar()
            }
        }

        for (i in 0 until 5) {
            newBrick.map { line ->
                line.map {
                    val newVal = it.digitToInt() + i
                    (newVal % 10 + newVal / 10).digitToChar()
                }.joinToString("")
            }.forEachIndexed { index, line ->
                newInput[j * input.size + index] += line
            }
        }
    }

    return newInput
}

internal fun part2(args: Array<String>): Long {
    val input = mutateInput(parseInput(args[0]))
    val (res, lowerLeft) = calculateShortestPath(input)
    return res.second[lowerLeft] ?: -1
}

private fun calculateShortestPath(input: List<String>): Pair<Pair<Map<Node, Node?>, Map<Pos, Long>>, Pos> {
    val nodes = parseAsNodes(input).associateBy { it.pos }
    val res = dijkstra(nodes, nodes.getValue(Pos(0, 0)))
    val lowerLeft = Pos(input.size - 1, input[0].length - 1)
    return Pair(res, lowerLeft)
}