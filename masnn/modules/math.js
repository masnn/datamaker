function randInt(min, max) {
    return Math.floor(Math.random() * Math.floor(max - min) + min)
}
function pow(a, b, p = 0) {
    if (p == 0) return Math.pow(a, b);
    var t = b, k = 1;
    while (t)
        if (t % 2 == 0) {
            k *= k;
            k %= p;
            t /= 2;
        } else {
            k *= a;
            k %= p;
            t /= 2;
        }
    return t;
}
module.exports = {
    randInt: randInt,
    pow: pow
}