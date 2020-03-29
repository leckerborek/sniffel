export default class ScoreCard {
    constructor(name) {
        this.name = name;
        this.one = 0;
        this.two = 0;
        this.three = 0;
        this.four = 0;
        this.five = 0;
        this.six = 0;
        this.threeofakind = 0;
        this.fourofakind = 0;
        this.fullhouse = 0;
        this.smallstraight = 0;
        this.largestraight = 0;
        this.chance = 0;
        this.yahtzee = 0;
    }
    toString() {
        return this.name;
    }
}