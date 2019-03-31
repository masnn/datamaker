var readline = require('readline')
var util = require('util')
var rl = {}
var cursorDx = 0, cursorDy = 0, dxInfo, iStream, oStream
function getDisplayLength(str) {
    var realLength = 0, len = str.length, charCode = -1
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i)
        if (charCode >= 0 && charCode <= 128) realLength += 1
        else realLength += 2
    }
    return realLength
}
function getStrOccRowColumns(str) {
    var consoleMaxColumns = oStream.columns
    var strDisplayLength = getDisplayLength(str)
    var rows = parseInt(strDisplayLength / consoleMaxColumns, 10)
    var columns = parseInt(strDisplayLength - rows * consoleMaxColumns, 10)
    return {
        rows: rows,
        columns: columns
    }
}
function write(data) {
    outputContent = util.format(data)
    readline.moveCursor(oStream, cursorDx * -1, cursorDy * -1)
    readline.clearScreenDown(oStream)
    oStream.write(outputContent)
    dxInfo = getStrOccRowColumns(outputContent)
    cursorDx = dxInfo.columns
    cursorDy = dxInfo.rows
}
function writeln() {
    oStream.write(util.format('\r\n'))
}
function createInterface(inputStream, outputStream, terminal) {
    //if (rl != {}) throw new Error('Interface Already Exist!')
    rl = readline.createInterface({
        input: inputStream,
        output: outputStream,
        terminal: terminal
    })
    iStream = inputStream
    oStream = outputStream
}
function close() {
    //if (rl == {}) throw new Error('No Interface Created!')
    rl.close()
    rl = {}
}
module.exports = {
    createInterface: createInterface,
    write: write,
    writeln: writeln,
    close: close
}