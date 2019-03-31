var archiver = require('archiver')
var fs = require('fs')
function archive(path,target) {
    var a = archiver('zip')
    a.pipe(fs.createWriteStream(target))
    a.directory(path, false)
    a.finalize()
}
module.exports={
    archive:archive
}