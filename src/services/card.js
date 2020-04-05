import { getName } from "ikea-name-generator";
import { v4 as uuidv4 } from "uuid";

const fields = [
    {
        key: "one",
        name: "1-er",
        hint: "1, 2, 3, 4, 5",
        upper: true
    },
    {
        key: "two",
        name: "2-er",
        hint: "2, 4, 6, 8, 10",
        upper: true
    },
    {
        key: "three",
        name: "3-er",
        hint: "3, 6, 9, 12, 15",
        upper: true
    },
    {
        key: "four",
        name: "4-er",
        hint: "4, 8, 12, 16, 20",
        upper: true
    },
    {
        key: "five",
        name: "5-er",
        hint: "5, 10, 15, 20, 25",
        upper: true
    },
    {
        key: "six",
        name: "1-er",
        hint: "6, 12, 18, 24, 30",
        upper: true
    },
    {
        key: "threeofakind",
        name: "3 gleiche",
        hint: "Alle Augen",
        upper: false
    },
    {
        key: "fourofakind",
        name: "4 gleiche",
        hint: "Alle Augen",
        upper: false
    },
    {
        key: "fullhouse",
        name: "Full House",
        hint: "25",
        upper: false
    },
    {
        key: "smallstraight",
        name: "Kleine Straße",
        hint: "30",
        upper: false
    },
    {
        key: "largestraight",
        name: "Große Straße",
        hint: "40",
        upper: false
    },
    {
        key: "chance",
        name: "Chance",
        hint: "Alle Augen",
        upper: false
    },
    {
        key: "sniffel",
        name: "Sniffel",
        hint: "50",
        upper: false
    }
]

function create() {
    const ikeaName = getName(true);
    const card = {
        player: ikeaName.charAt(0).toUpperCase() + ikeaName.slice(1),
        // unique id is required by v-for and other stuff
        id: uuidv4()
    }
    // undefined is not supperted by firebase
    fields.map(field => field.key).forEach(key => card[key] = null);
    return card;
}

function clear(card) {
    fields.map(field => field.key).forEach(key => card[key] = null);
}

function intOrZero(value) {
    const int = parseInt(value);
    return isNaN(int) ? 0 : int;
}

function sumUpper(card) {
    return fields
        .filter(field => field.upper)
        .map(field => intOrZero(card[field.key]))
        .reduce((a, b) => a + b);
}

function bonusUpper(card) {
    return sumUpper(card) >= 63 ? 35 : 0;
}

function sumLower(card) {
    return fields
        .filter(field => !field.upper)
        .map(field => intOrZero(card[field.key]))
        .reduce((a, b) => a + b);
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

    for (let field of fields) {
        if (left[field.key] !== right[field.key] && right[field.key] !== undefined) {
            return `${right.player} hat für ${field.name} eine ${right[field.key]} eingetragen.`
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
    diff,
    fields
}