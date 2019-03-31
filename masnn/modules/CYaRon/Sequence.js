function Sequence(formula, initial_values = []) {
    /*Class Sequence: the tool class for sequences.
        __init__(self, formula, initial_values=() -> None
        Create a sequence object.
        int formula(int, function) -> the formula function ...
    */
    this.formula = formula
    this.values = initial_values
    this.__get_one = function (i) {
        if (i in this.values)
            return this.values[i]
        this.values[i] = this.formula(i, this.__get_one)
        return this.values[i]
    }
    this.get = function (left_range, right_range = null) {
        if (right_range == null)
            return this.__get_one(left_range)
        var tmp = []
        for (i = left_range; i <= right_range; i++) tmp.push(this.__get_one(i));
        return tmp
    }
}
module.exports = Sequence