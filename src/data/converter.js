import ScoreCard from "@/data/ScoreCard"

// Firestore data converter
const scoreCardConverter = {
    toFirestore: function (scoreCard) {
        return {
            name: scoreCard.name,
            one: scoreCard.one,
            two: scoreCard.two,
            three: scoreCard.three,
            four: scoreCard.four,
            five: scoreCard.five,
            six: scoreCard.six,
            threeofakind: scoreCard.threeofakind,
            fourofakind: scoreCard.fourofakind,
            fullhouse: scoreCard.fullhouse,
            smallstraight: scoreCard.smallstraight,
            largestraight: scoreCard.largestraight,
            chance: scoreCard.chance,
            yahtzee: scoreCard.yahtzee
        }
    },
    fromFirestore: function (snapshot, options) {
        const data = snapshot.data(options);
        const scoreCard = new ScoreCard(data.name);
        scoreCard.one = data.one;
        scoreCard.two = data.two;
        scoreCard.three = data.three;
        scoreCard.four = data.four;
        scoreCard.five = data.five;
        scoreCard.six = data.six;
        scoreCard.threeofakind = data.threeofakind;
        scoreCard.fourofakind = data.fourofakind;
        scoreCard.fullhouse = data.fullhouse;
        scoreCard.smallstraight = data.smallstraight;
        scoreCard.largestraight = data.largestraight;
        scoreCard.chance = data.chance;
        scoreCard.yahtzee = data.yahtzee;
        return scoreCard;
    }
}

const scoreCardsConverter = {
    toFirestore: function (data) {
        return {
            cards: data.cards.map(scoreCard => { return {
                name: scoreCard.name,
                one: scoreCard.one,
                two: scoreCard.two,
                three: scoreCard.three,
                four: scoreCard.four,
                five: scoreCard.five,
                six: scoreCard.six,
                threeofakind: scoreCard.threeofakind,
                fourofakind: scoreCard.fourofakind,
                fullhouse: scoreCard.fullhouse,
                smallstraight: scoreCard.smallstraight,
                largestraight: scoreCard.largestraight,
                chance: scoreCard.chance,
                yahtzee: scoreCard.yahtzee         
            }})
        }
    },
    fromFirestore: function (snapshot, options) {
        const data = snapshot.data(options);
        return data.cards.map(card => {
            const scoreCard = new ScoreCard(card.name)
            scoreCard.one = data.one;
            scoreCard.two = data.two;
            scoreCard.three = data.three;
            scoreCard.four = data.four;
            scoreCard.five = data.five;
            scoreCard.six = data.six;
            scoreCard.threeofakind = data.threeofakind;
            scoreCard.fourofakind = data.fourofakind;
            scoreCard.fullhouse = data.fullhouse;
            scoreCard.smallstraight = data.smallstraight;
            scoreCard.largestraight = data.largestraight;
            scoreCard.chance = data.chance;
            scoreCard.yahtzee = data.yahtzee;
            return scoreCard;
        });
    }
}

export default {
    scoreCardConverter,
    scoreCardsConverter
}