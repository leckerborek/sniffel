export default class ScoreCard {
    constructor(name) {
        this.name = name;
        this.one = undefined;
        this.two = undefined;
        this.three = undefined;
        this.four = undefined;
        this.five = undefined;
        this.six = undefined;
        this.threeofakind = undefined;
        this.fourofakind = undefined;
        this.fullhouse = undefined;
        this.smallstraight = undefined;
        this.largestraight = undefined;
        this.chance = undefined;
        this.yahtzee = undefined;
    }
    toString() {
        return this.name;
    }
}