import { getName } from "ikea-name-generator";
import { v4 as uuidv4 } from "uuid";

function createCard() {
    const ikeaName = getName(true);
    // undefined is not supperted by firebase
    return {
        player: ikeaName.charAt(0).toUpperCase() + ikeaName.slice(1),
        // unique id is required by v-for and other stuff
        id: uuidv4(),
        one: null,
        two: null,
        three: null,
        four: null,
        five: null,
        six: null,
        threeofakind: null,
        fourofakind: null,
        fullhouse: null,
        smallstraight: null,
        largestraight: null,
        chance: null,
        yahtzee: null
    };
}

function clearCard(card) {
    card.one = null;
    card.two = null;
    card.three = null;
    card.four = null;
    card.five = null;
    card.six = null;
    card.threeofakind = null;
    card.fourofakind = null;
    card.fullhouse = null;
    card.smallstraight = null;
    card.largestraight = null;
    card.chance = null;
    card.yahtzee = null
}

function intOrZero(value) {
    const int = parseInt(value);
    return isNaN(int) ? 0 : int;
}

function sumUpper(card) {
    return (
        intOrZero(card.one) +
        intOrZero(card.two) +
        intOrZero(card.three) +
        intOrZero(card.four) +
        intOrZero(card.five) +
        intOrZero(card.six)
    );
}

function bonusUpper(card) {
    return sumUpper(card) >= 63 ? 35 : 0;
}

function sumLower(card) {
    return (
        intOrZero(card.threeofakind) +
        intOrZero(card.fourofakind) +
        intOrZero(card.fullhouse) +
        intOrZero(card.smallstraight) +
        intOrZero(card.largestraight) +
        intOrZero(card.chance) +
        intOrZero(card.yahtzee)
    );
}

function sumTotal(card) {
    return sumUpper(card) + bonusUpper(card) + sumLower(card);
}

export {
    createCard,
    clearCard,
    sumUpper,
    bonusUpper,
    sumLower,
    sumTotal
}