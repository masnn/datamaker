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
function getInputFiles(files) {
    const regs = [
        [/^([a-zA-Z]*)([0-9]+).in$/, a => { return a[1] + a[2] + '.out' }, a => { return Number(a[2]) }],
        [/^([a-zA-Z0-9]*)\.in([0-9]*)$/, a => { return a[1] + '.ou' + a[2]; }, a => { return Number(a[2]) }],
        [/^(input)([0-9]*).txt$/, a => { return 'output' + a[2] + '.txt' }, a => { return Number(a[2]) }],
    ]
    var cases = []
    for (i in files)
        for (j in regs)
            if (regs[j][0].test(files[i])) {
                var data = regs[j][0].exec(files[i])
                cases.push({ input: files[i], output: regs[j][1](data), sort: regs[j][2](data) })
                break;
            }
    cases.sort((a, b) => { return a.sort - b.sort })
    return cases;
}
module.exports = {
    deleteFolder: deleteFolder,
    copy: copy,
    rename: rename,
    mkdirSync: mkdirSync,
    getInputFiles: getInputFiles
}