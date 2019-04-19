var data_n = [0, 1e3, 1e3, 1e5, 1e5, 1e5, 1e5, 1e5, 1e5, 1e5, 1e5]
const masnn = require('./masnn')
module.exports=function generate(num) {
    var t = data_n[num];
    var n = masnn.math.randInt(t / 10 * 9, t);
    var tmp = new Array();
    for (var i = 1; i <= n / 2; i++) {
        var k = masnn.math.randInt(1, masnn.math.pow(2, 30));
        tmp.push(k);
        tmp.push(k);
    }
    var ans = masnn.math.randInt(1, masnn.math.pow(2, 30));
    tmp.push(ans);
    tmp = masnn.random.shuffle(tmp);
    output = n + 1 + '\n'
    for (var j = 0; j <= n; j++)
        output += tmp[j] + ' '
    return output
}