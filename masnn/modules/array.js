function makeArray(n, m) {
    var arr = new Array()
    for (var i = 0; i < n; i++) {
        arr[i] = new Array()
        for (var j = 0; j < m; j++)
            arr[i][j] = 0
    }
    return arr;
}
module.exports={
    makeArray: makeArray
}