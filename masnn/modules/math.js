function randInt(min, max) {
    return Math.floor(Math.random() * Math.floor(max - min) + min)
}
module.exports={
    randInt: randInt
}