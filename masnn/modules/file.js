var fs = require('fs')
var path = require('path')
function deleteFolder(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file) {
            var curPath = path + "/" + file
            if (fs.statSync(curPath).isDirectory()) deleteFolder(curPath)
            else fs.unlinkSync(curPath)
        })
        fs.rmdirSync(path)
    }
}
function mkdirSync(dirname) {
    if (fs.existsSync(dirname)) return true;
    else if (mkdirSync(path.dirname(dirname)))
        fs.mkdirSync(dirname);
    return true;
}
function copy(source, target) {
    var readStream = fs.createReadStream(source)
    var writeStream = fs.createWriteStream(target)
    readStream.pipe(writeStream)
}
function rename(source, target) {
    fs.renameSync(source, target)
}
module.exports = {
    deleteFolder: deleteFolder,
    copy: copy,
    rename: rename,
    mkdirSync: mkdirSync
}