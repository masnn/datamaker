var time_limit = 1;
var memory_limit = 128000;

const fs = require('fs');
const archiver = require('archiver');
const masnn = require('./masnn/index');
var files = fs.readdirSync('.')
var { list, prefix } = masnn.file.getInputFiles(files);
list.sort((a, b) => { return a - b })
var cnt = list.length;
var config = cnt + '\n';
if (fs.existsSync('./Data')) masnn.file.deleteFolder('./Data');
fs.mkdirSync('./Data');
fs.mkdirSync('./Data/Input');
fs.mkdirSync('./Data/Output');
for (var i in list) {
    config += list[i] + '.in|' + list[i] + '.out|' + time_limit + '|' + Math.floor(100 / cnt) + '|' + memory_limit + '\n';
    masnn.file.copy('./' + prefix + list[i] + '.in', './Data/Input/' + list[i] + '.in');
    try {
        masnn.file.copy('./' + prefix + list[i] + '.out', './Data/Output/' + list[i] + '.out');
    } catch{
        masnn.file.copy('./' + prefix + list[i] + '.ans', './Data/Output/' + list[i] + '.out');
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
