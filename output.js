const fs = require('fs')
const child_process = require('child_process')
const masnn = require('./masnn')
const inquirer = require('inquirer')
inquirer.prompt([
    {
        type: 'list',
        name: 'mem_limit',
        message: 'Memory_Limit:',
        choices: ['128', '256', '512', '64', '32']
    },
    {
        type: 'list',
        name: 'time_limit',
        message: 'Timt_Limit:',
        choices: ['1', '2', '3', '4', '5']
    }
]).then((ans) => {
    var mem_limit = ans.mem_limit;
    var time_limit = ans.time_limit;
    var files = fs.readdirSync('.')
    var { list, prefix } = masnn.file.getInputFiles(files);
    list.sort((a, b) => { return a - b })
    masnn.console.createInterface(process.stdin, process.stdout, true)
    masnn.file.deleteFolder('./Data/Output')
    masnn.file.mkdirSync('./Data/Output')
    var config_data = testcnt + '\n'
    for (var i in list) {
        masnn.console.write('Making: ' + i)
        config_data += prefix + list[i] + '.in|' + prefix + list[i] + '.out|' + time_limit + '|' + (100 / list.length) + '|' + mem_limit + '\n'
        var input = fs.readFileSync('./' + prefix + list[i] + '.in').toString()
        masnn.console.write("Executing std:")
        var stdout = child_process.spawnSync('./std.exe', { input: input }).stdout
        fs.writeFileSync('./Data/Output/' + prefix + list[i] + '.out', stdout)
        masnn.console.write('Output ' + list[i] + ' generated.')
        masnn.console.writeln()
    }
    fs.writeFileSync('./Data/Config.ini', config_data)
    masnn.console.write('Archiving...')
    masnn.archiver.archive('./Data', './data.zip')
    masnn.console.write('Archived!')
    masnn.console.writeln()
    masnn.console.close()
})