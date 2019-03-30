var fs = require('fs');
var archiver = require('archiver');
var time_limit = 1;
var memory_limit = 12800;

function deleteFolderRecursive(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file) {
            var curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory())
                deleteFolderRecursive(curPath);
            else fs.unlinkSync(curPath);
        });
        fs.rmdirSync(path);
    }
}
var files = fs.readdirSync('.')
function getdir(url) {
    var arr = url.split('.');
    var len = arr.length;
    return arr[len - 1];
}
var list = [], cnt = 0;
for (var i in files)
    if (getdir(files[i]) == 'in') {
        cnt++;
        list.push(files[i].split('.')[0]);
    }
var config = cnt + '\n';
if (fs.existsSync('./Data')) deleteFolderRecursive('./Data');
fs.mkdirSync('./Data');
fs.mkdirSync('./Data/Input');
fs.mkdirSync('./Data/Output');
for (var i in list) {
    config += list[i] + '.in|' + list[i] + '.out|' + time_limit + '|' + Math.floor(100 / cnt) + '|' + memory_limit + '\n';
    fs.renameSync('./' + list[i] + '.in', './Data/Input/' + list[i] + '.in');
    try {
        fs.renameSync('./' + list[i] + '.out', './Data/Output/' + list[i] + '.out');
    } catch{
        fs.renameSync('./' + list[i] + '.ans', './Data/Output/' + list[i] + '.out');
    }
}
fs.writeFileSync('./Data/Config.ini', config);
var archive = archiver('zip');
archive.on('error', function (err) {
    throw err;
});
archive.pipe(fs.createWriteStream('data.zip'));
archive.directory('Data', false);
archive.finalize();
