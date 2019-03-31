var array = require("./modules/array")
var file = require("./modules/file")
var math = require("./modules/math")
var archiver = require("./modules/archiver")
var console = require("./modules/console")
var Graph = require("./modules/CYaRon/Graph")
var IO = require("./modules/CYaRon/IO")
var Sequence = require("./modules/CYaRon/Sequence")
var String = require("./modules/CYaRon/String")
var CYaRon={
    Graph,IO,Sequence,String
}
module.exports = { array, file, math, archiver, console, CYaRon }