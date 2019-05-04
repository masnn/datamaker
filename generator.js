var data_n = [0, 10, 10, 10, 10, 10, 100, 100, 100, 100, 100, 100, 100, 1e3, 1e3, 1e3, 1e3, 1500, 1500, 1500, 1500]
var maxp = [0, 1, 1, 1, 1, 1, 1, 3, 5, 7, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
const masnn = require('./masnn')
module.exports = function generate(num) {
    var t = data_n[num];
    var n = masnn.math.randInt(t * 0.99, t);
    var m = masnn.math.randInt(t * 0.99, t);
    var map = [];
    for (var i = 0; i < n; i++) {
        map.push([]);
        for (var j = 0; j < m; j++)
            map[i].push(masnn.math.randInt(0, 20));
    }
    var x = 0, y = 0;
    var stp = masnn.math.randInt(1, maxp[num]);
    var edp = masnn.math.randInt(1, maxp[num]);
    var cnt = 0;
    while (cnt < stp) {
        x = masnn.math.randInt(1, n - 1);
        y = masnn.math.randInt(1, m - 1);
        if (map[x][y] == -1 || map[x][y] == -2) continue;
        map[x][y] = -1;
        cnt++;
    }
    cnt = 0;
    while (cnt < edp) {
        x = masnn.math.randInt(1, n - 1);
        y = masnn.math.randInt(1, m - 1);
        if (map[x][y] == -1 || map[x][y] == -2) continue;
        map[x][y] = -2;
        cnt++;
    }
    output = n + ' ' + m + '\n';
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < m; j++)
            output += map[i][j] + ' ';
        output += '\n';
    }
    return output
}
