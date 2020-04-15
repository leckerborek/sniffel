import { getName } from "ikea-name-generator";
import { v4 as uuidv4 } from "uuid";

function validate(value, valid) {
    if (value === null ||
        value === undefined ||
        value === "" ||
        value === 0) {
        return true;
    } else if (Array.isArray(valid)) {
        if (valid.includes(value)) {
            return true;
        }
    } else if (Number.isInteger(valid)) {
        if (valid === value) {
            return true;
        }
    } else if (Number.isInteger(value)) {
        if (value >= 3 && value <= 30) {
            return true;
        }
    }

    return "Nope...";
}

const fields = [
    {
        key: "one",
        name: "1er",
        hint: "1, 2, 3, 4, 5",
        upper: true,
        validator: value => validate(value, [1, 2, 3, 4, 5])
    }, {
        key: "two",
        name: "2er",
        hint: "2, 4, 6, 8, 10",
        upper: true,
        validator: (value) => validate(value, [2, 4, 6, 8, 10])
    }, {
        key: "three",
        name: "3er",
        hint: "3, 6, 9, 12, 15",
        upper: true,
        validator: (value) => validate(value, [3, 6, 9, 12, 15])
    }, {
        key: "four",
        name: "4er",
        hint: "4, 8, 12, 16, 20",
        upper: true,
        validator: (value) => validate(value, [4, 8, 12, 16, 20])
    }, {
        key: "five",
        name: "5er",
        hint: "5, 10, 15, 20, 25",
        upper: true,
        validator: (value) => validate(value, [5, 10, 15, 20, 25])
    }, {
        key: "six",
        name: "6er",
        hint: "6, 12, 18, 24, 30",
        upper: true,
        validator: (value) => validate(value, [6, 12, 18, 24, 30])
    }, {
        key: "threeofakind",
        name: "3 gleiche",
        hint: "Alle Augen",
        upper: false,
        validator: (value) => validate(value)
    }, {
        key: "fourofakind",
        name: "4 gleiche",
        hint: "Alle Augen",
        upper: false,
        validator: (value) => validate(value)
    }, {
        key: "fullhouse",
        name: "Full House",
        hint: "25",
        upper: false,
        validator: (value) => validate(value, 25)
    }, {
        key: "smallstraight",
        name: "Kleine Straße",
        hint: "30",
        upper: false,
        validator: (value) => validate(value, 30)
    }, {
        key: "largestraight",
        name: "Große Straße",
        hint: "40",
        upper: false,
        validator: (value) => validate(value, 40)
    }, {
        key: "chance",
        name: "Chance",
        hint: "Alle Augen",
        upper: false,
        validator: (value) => validate(value)
    }, {
        key: "sniffel",
        name: "Sniffel",
        hint: "50",
        upper: false,
        validator: (value) => validate(value, 50)
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
    const diffs = [];
    if (left === undefined || right === undefined) {
        return diffs;
    }

    if (left.player !== right.player) {
        diffs.push(`${left.player} ist jetzt unter dem Namen ${right.player} bekannt.`);
    }

    for (let field of fields) {
        if (left[field.key] !== right[field.key]) {
            const newValue = right[field.key];
            if (newValue === 0) {
                diffs.push(`${right.player} hat ${field.name} gestrichen.`);
            } else if (!isNaN(parseInt(newValue))) {
                diffs.push(`${right.player} hat für ${field.name} eine ${newValue} eingetragen.`);
            }
        }
    }

    return diffs;
}

function rank(card, cards) {
    const score = sumTotal(card);
    if (score === 0) {
        return 0;
    }
    const scores = cards.map(c => sumTotal(c))
    const distinctSorted = [...new Set(scores)].sort((a, b) => b - a)
    const rank = distinctSorted.indexOf(score) + 1;
    // console.log("scores", scores);
    // console.log("distinctSorted", distinctSorted);
    // console.log(`${score} -> ${rank}`);
    return rank;
}

export default {
    fields,
    create,
    clear,
    sumUpper,
    bonusUpper,
    sumLower,
    sumTotal,
    diff,
    rank
}