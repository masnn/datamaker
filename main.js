const generate = require('./generate')
const fs = require('fs')
const child_process = require('child_process')
const masnn = require('./masnn')
const inquirer = require('inquirer')
inquirer.prompt([
    {
        type: 'list',
        name: 'testcnt',
        message: 'Testdata_count:',
        choices: ['10', '20', '5']
    },
    {
        type: 'list',
        name: 'mem_limit',
        message: 'Memory_Limit:',
        choices: ['128', '256', '512', '64', '32']
    },
    {
        type: 'list',
        name: 'time_Limit',
        message: 'Timt_Limit:',
        choices: ['1', '2', '3', '4', '5']
    },
    {
        type: 'input',
        name: 'prefix',
        message: 'Filename_prefix:',
    }
]).then((ans) => {
    var testcnt = ans.testcnt;
    var mem_limit = ans.mem_limit;
    var time_limit = ans.time_limit;
    var prefix = ans.prefix;
    masnn.console.createInterface(process.stdin, process.stdout, true)
    masnn.file.deleteFolder('./Data')
    masnn.file.mkdirSync('./Data/Input')
    masnn.file.mkdirSync('./Data/Output')
    var config_data = testcnt + '\n'
    for (var i = 1; i <= testcnt; i++) {
        masnn.console.write('Making: ' + i)
        config_data += prefix + i + '.in|' + prefix + i + '.out|' + time_limit + '|' + (100 / testcnt) + '|' + mem_limit + '\n'
        var output = generate(i)
        masnn.console.write("Writing Input file:")
        fs.writeFileSync('./Data/Input/' + prefix + i + '.in', output)
        masnn.console.write("Executing std:")
        var stdout = child_process.spawnSync('./std.exe', { input: output }).stdout;
        fs.writeFileSync('./Data/Output/' + prefix + i + '.out', stdout)
        masnn.console.write('Testdata ' + i + ' generated.')
        masnn.console.writeln()
    }
    fs.writeFileSync('./Data/Config.ini', config_data)
    masnn.console.write('Archiving...')
    masnn.archiver.archive('./Data', './data.zip')
    masnn.console.write('Archived!')
    masnn.console.writeln()
    masnn.console.close()
})