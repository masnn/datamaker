var testcnt = 20
var data_n = [100, 100, 100, 100, 100, 100, 100, 1000, 1000, 1000, 1000,
    1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000]
var prefix = ''
var time_limit = 1
var memory_limit = 128000
function generate(num) {
    var map = new Array()
    for (var i = 0; i < 1010; i++) {
        map[i] = new Array()
        for (var j = 0; j < 1010; j++)
            map[i][j] = 0
    }
    var n = masnn.math.randInt(data_n[num] / 10*7, data_n[num])
    var m = masnn.math.randInt(data_n[num] / 10*7, data_n[num])
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
var child_process = require('child_process')
var masnn = require('./masnn')
masnn.file.deleteFolder('./Data')
masnn.file.mkdirSync('./Data/Input')
masnn.file.mkdirSync('./Data/Output')
var config_data = testcnt + '\n'
for (var i = 1; i <= testcnt; i++)
    config_data += prefix + i + '.in|' + prefix + i + '.out|' + time_limit + '|' + (100 / testcnt) + '|' + memory_limit + '\n'
fs.writeFileSync('./Data/Config.ini', config_data)
masnn.console.createInterface(process.stdin,process.stdout,true)
for (var i = 1; i <= testcnt; i++) {
    masnn.console.write('Making: ' + i)
    var output = generate(i)
    masnn.console.write("Writing Input file:")
    fs.writeFileSync('./Data/Input/' + prefix + i + '.in', output)
    masnn.console.write("Executing std:")
    var stdout = child_process.spawnSync('./std', { input: output }).stdout
    fs.writeFileSync('./Data/Output/' + prefix + i + '.out', stdout)
    masnn.console.write('Testdata ' + i + ' generated.')
    masnn.console.writeln()
}
masnn.console.write('Archiving...')
masnn.archiver.archive('./Data','./data.zip')
masnn.console.write('Archived!')
masnn.console.writeln()
masnn.console.close()