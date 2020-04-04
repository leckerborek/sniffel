import { getName } from "ikea-name-generator";
import { v4 as uuidv4 } from "uuid";

const upperProps = ["one", "two", "three", "four", "five", "six"];
const lowerProps = ["threeofakind", "fourofakind", "fullhouse", "smallstraight", "largestraight", "chance", "sniffel"];
const allProps = upperProps.concat(lowerProps);
const displayName = {
    one: "1-er",
    two: "2-er",
    three: "3-er",
    four: "4-er",
    five: "5-er",
    six: "6-er",
    threeofakind: "3 gleiche",
    fourofakind: "4 gleiche",
    fullhouse: "Full House",
    smallstraight: "Kleine Straße",
    largestraight: "Große Straße",
    chance: "Chance",
    sniffel: "Sniffel"
}

function create() {
    const ikeaName = getName(true);
    const card = {
        player: ikeaName.charAt(0).toUpperCase() + ikeaName.slice(1),
        // unique id is required by v-for and other stuff
        id: uuidv4()
    }
    // undefined is not supperted by firebase
    upperProps.forEach(prop => card[prop] = null);
    lowerProps.forEach(prop => card[prop] = null);
    return card;
}

function clear(card) {
    upperProps.forEach(prop => card[prop] = null);
    lowerProps.forEach(prop => card[prop] = null);
}

function intOrZero(value) {
    const int = parseInt(value);
    return isNaN(int) ? 0 : int;
}

function sumUpper(card) {
    return upperProps.map(prop => intOrZero(card[prop])).reduce((a, b) => a + b)
}

function bonusUpper(card) {
    return sumUpper(card) >= 63 ? 35 : 0;
}

function sumLower(card) {
    return lowerProps.map(prop => intOrZero(card[prop])).reduce((a, b) => a + b)
}

function sumTotal(card) {
    return sumUpper(card) + bonusUpper(card) + sumLower(card);
}

function diff(left, right) {
    if (left === undefined || right === undefined) {
        return undefined;
    }

    if (left.player !== right.player) {
        return `${left.player} ist jetzt unter dem Namen ${right.player} bekannt.`;
    }

    for (let prop of allProps) {
        if (left[prop] !== right[prop] && right[prop] !== undefined) {
            return `${right.player} hat für ${displayName[prop]} eine ${right[prop]} eingetragen.`
        }
    }

    return undefined;
}

export default {
    create,
    clear,
    sumUpper,
    bonusUpper,
    sumLower,
    sumTotal,
    diff
}