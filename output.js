const fs = require('fs')
const child_process = require('child_process')
const masnn = require('./masnn')
const { prompt } = require('enquirer')
prompt([
    {
        type: 'select',
        name: 'mem_limit',
        message: 'Memory_Limit:',
        choices: ['128', '256', '512', '64', '32']
    },
    {
        type: 'select',
        name: 'time_limit',
        message: 'Timt_Limit:',
        choices: ['1', '2', '3', '4', '5']
    }
]).then((ans) => {
    var mem_limit = ans.mem_limit * 1024;
    var time_limit = ans.time_limit;
    var cases = masnn.file.getInputFiles(fs.readdirSync('./Data/Input/'));
    masnn.console.createInterface(process.stdin, process.stdout, true)
    masnn.file.deleteFolder('./Data/Output')
    masnn.file.mkdirSync('./Data/Output')
    var cnt = cases.length;
    var config = cnt + '\n';
    var sc = Math.floor(100 / cnt);
    var d = cnt - 100 % sc
    masnn.console.write('Founded ' + cnt + ' cases.');
    masnn.console.writeln()
    masnn.console.writeln()
    for (var i in cases) {
        masnn.console.write('Making: ' + i)
        config += cases[i].input + '|' + cases[i].output + '|' + time_limit + '|' + (i >= d ? sc + 1 : sc) + '|' + mem_limit + '\n'
        var input = fs.readFileSync('./Data/Input/' + cases[i].input).toString()
        masnn.console.write("Executing std:")
        var stdout = child_process.spawnSync('./std.exe', { input: input }).stdout
        fs.writeFileSync('./Data/Output/' + cases[i].output, stdout)
        masnn.console.write('Output ' + cases[i].sort + ' generated.')
        masnn.console.writeln()
    }
    fs.writeFileSync('./Data/Config.ini', config)
    masnn.console.write('Archiving...')
    masnn.archiver.archive('./Data', './data.zip')
    masnn.console.write('Archived!')
    masnn.console.writeln()
    masnn.console.close()
})