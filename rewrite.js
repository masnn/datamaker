var time_limit = 10;
var memory_limit = 64000;

const fs = require('fs');
const archiver = require('archiver');
var masnn = require('./masnn/index');
var cases = masnn.file.getInputFiles(fs.readdirSync('.'));
masnn.file.copy = masnn.file.rename
var cnt = cases.length;
var config = cnt + '\n';
var sc = Math.floor(100 / cnt);
var d = cnt - 100 % sc
masnn.file.deleteFolder('./Data');
masnn.file.mkdirSync('./Data/Input');
masnn.file.mkdirSync('./Data/Output');
for (var i in cases) {
    config += cases[i].input + '|' + cases[i].output + '|' + time_limit + '|' + (i >= d ? sc + 1 : sc) + '|' + memory_limit + '\n';
    masnn.file.copy('./' + cases[i].input, './Data/Input/' + cases[i].input);
    masnn.file.copy('./' + cases[i].output, './Data/Output/' + cases[i].output);
}
fs.writeFileSync('./Data/Config.ini', config);
var archive = archiver('zip');
archive.on('error', function (err) {
    throw err;
});
archive.pipe(fs.createWriteStream('data.zip'));
archive.directory('Data', false);
archive.finalize();
console.log('done');
