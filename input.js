const generate = require('./generator')
const fs = require('fs')
const masnn = require('./masnn')
const { prompt } = require('enquirer');
prompt([
    {
        type: 'select',
        name: 'testcnt',
        message: 'Testdata_count:',
        choices: ['10', '20', '5']
    },
    {
        type: 'input',
        name: 'prefix',
        message: 'Filename_prefix:',
    }
]).then(ans => {
    var testcnt = ans.testcnt;
    var prefix = ans.prefix;
    masnn.console.createInterface(process.stdin, process.stdout, true)
    masnn.file.deleteFolder('./Data')
    masnn.file.mkdirSync('./Data/Input')
    for (var i = 1; i <= testcnt; i++) {
        masnn.console.write('Making: ' + i)
        var output = generate(i)
        masnn.console.write("Writing Input file:")
        fs.writeFileSync('./Data/Input/' + prefix + i + '.in', output)
        masnn.console.write('Input ' + i + ' generated.')
        masnn.console.writeln()
    }
    masnn.console.writeln()
    masnn.console.close()
});