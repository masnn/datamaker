var testcnt = 20
var data_n = [100, 100, 100, 100, 100, 100, 100, 1000, 1000, 1000, 1000,
    1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000]
var prefix = ''
var time_limit = 1
var memory_limit = 12800
function generate(num) {
    var map = new Array()
    for (var i = 0; i < 1010; i++) {
        map[i] = new Array()
        for (var j = 0; j < 1010; j++)
            map[i][j] = 0
    }
    var n = masnn.math.randInt(data_n[i] / 10, data_n[i])
    var m = masnn.math.randInt(data_n[i] / 10, data_n[i])
    var output = n + ' ' + m + '\n'
    for (var j = 0; j <= n; j++)
        for (var l = 0; l <= m; l++)
            map[j][l] = masnn.math.randInt(-1, 10)
    var x = masnn.math.randInt(1, n)
    var y = masnn.math.randInt(1, m)
    var k = masnn.math.randInt(1, n)
    var t = masnn.math.randInt(1, m)
    while (x == k && y == t) {
        k = masnn.math.randInt(1, n)
        t = masnn.math.randInt(1, m)
    }
    map[x][y] = -3
    map[k][t] = -2
    for (var j = 1; j <= n; j++) {
        for (var l = 1; l <= m; l++)
            output += map[j][l] + ' '
        output += '\n'
    }
    return output
}

var fs = require('fs')
var util = require('util')
var readline = require('readline')
var child_process = require('child_process')
var archiver = require('archiver')
var masnn = require('masnn')
var inputStream = process.stdin
var outputStream = process.stdout
var rl = readline.createInterface({
    input: inputStream,
    output: outputStream,
    terminal: true
})
var cursorDx = 0, cursorDy = 0, dxInfo
var getDisplayLength = function (str) {
    var realLength = 0, len = str.length, charCode = -1
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i)
        if (charCode >= 0 && charCode <= 128) realLength += 1
        else realLength += 2
    }
    return realLength
}
var getStrOccRowColumns = function (str) {
    var consoleMaxColumns = outputStream.columns
    var strDisplayLength = getDisplayLength(str)
    var rows = parseInt(strDisplayLength / consoleMaxColumns, 10)
    var columns = parseInt(strDisplayLength - rows * consoleMaxColumns, 10)
    return {
        rows: rows,
        columns: columns
    }
}
function deleteFolderRecursive(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file) {
            var curPath = path + "/" + file
            if (fs.statSync(curPath).isDirectory())
                deleteFolderRecursive(curPath)
            else fs.unlinkSync(curPath)
        });
        fs.rmdirSync(path)
    }
}
function writeline(data) {
    outputContent = util.format(data)
    readline.moveCursor(outputStream, cursorDx * -1, cursorDy * -1)
    readline.clearScreenDown(outputStream)
    outputStream.write(outputContent)
    dxInfo = getStrOccRowColumns(outputContent)
    cursorDx = dxInfo.columns
    cursorDy = dxInfo.rows
}
function writeln() {
    outputStream.write(util.format('\r\n'))
}
if (fs.existsSync('./Data')) deleteFolderRecursive('./Data')
fs.mkdirSync('./Data')
fs.mkdirSync('./Data/Input')
fs.mkdirSync('./Data/Output')
var config_data = testcnt + '\n'
for (var i = 1; i <= testcnt; i++)
    config_data += prefix + i + '.in|' + prefix + i + '.out|' + time_limit + '|' + (100 / testcnt) + '|' + memory_limit + '\n'
fs.writeFileSync('./Data/Config.ini', config_data)
for (var i = 1; i <= testcnt; i++) {
    writeline('Making: ' + i)
    var output = generate(i)
    writeline("Writing Input file:")
    fs.writeFileSync('./Data/Input/' + prefix + i + '.in', output)
    writeline("Executing std:")
    var stdout = child_process.spawnSync('./std', { input: output }).stdout
    fs.writeFileSync('./Data/Output/' + prefix + i + '.out', stdout)
    writeline('Testdata ' + i + ' generated.')
    writeln()
}
writeline('Archiving...')
var archive = archiver('zip')
archive.pipe(fs.createWriteStream('data.zip'))
archive.directory('Data', false)
archive.finalize()
writeline('Archived!')
writeln()
rl.close()