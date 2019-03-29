var fs = require('fs');
const { execFile, execFileSync } = require('child_process');
var archiver = require('archiver');
var testcnt = 20;
var data_n=[100,100,100,100,100,100,100,1000,1000,1000,1000,
    1000,1000,1000,1000,1000,1000,1000,1000,1000,1000];
var prefix = '';
var time_limit = 1;
var memory_limit = 12800;

function deleteFolderRecursive(path) {
    if( fs.existsSync(path) ) {
        fs.readdirSync(path).forEach(function(file) {
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory())
                deleteFolderRecursive(curPath);
            else fs.unlinkSync(curPath);
        });
        fs.rmdirSync(path);
    }
}
function randInt(min,max){
    return Math.floor(Math.random()*Math.floor(max-min)+min);
}
if (fs.existsSync('./Data')) deleteFolderRecursive('./Data');
fs.mkdirSync('./Data');
fs.mkdirSync('./Data/Input');
fs.mkdirSync('./Data/Output');
var config_data = testcnt + '\n';
for (var i = 1; i <= testcnt; i++)
    config_data += prefix + i + '.in|' + prefix + i + '.out|' + time_limit + '|' + (100 / testcnt) + '|' + memory_limit + '\n';
fs.writeFileSync('./Data/Config.ini', config_data);

for (var i = 1; i <= testcnt; i++) {
    console.log('Making: '+i)
    var map = new Array();
			for(var j=0;j<1010;j++){
				map[j] = new Array();
				for(var k=0;k<1010;k++)
					map[j][k] =0;
			}
    var n=randInt(data_n[i]/10,data_n[i]);
    var m=randInt(data_n[i]/10,data_n[i])
    var output=n+' '+m+'\n';
    for(var j=0;j<=n;j++)
        for(var l=0;l<=m;l++)
            map[j][l]=randInt(-1,10)
    var x=randInt(1,n);
    var y=randInt(1,m);
    var k=randInt(1,n);
    var t=randInt(1,m);
    if (x==k&&y==t) k++;
    map[x][y]=-3;
    map[k][t]=-2;
    for(var j=1;j<=n;j++){
        for(var l=1;l<=m;l++)
            output+=map[j][l]+' ';
        output+='\n';
    }
    fs.writeFileSync('./Data/Input/'+prefix+i+'.in',output);
    var stdout=execFileSync('./std', {input:output})
    console.log(stdout.toString());
    fs.writeFileSync('./Data/Output/'+prefix+i+'.out',stdout);
}

var archive = archiver('zip');
archive.on('error', function(err){
    throw err;
});
archive.pipe(fs.createWriteStream('data.zip'));
archive.directory('Data', false);
archive.finalize();