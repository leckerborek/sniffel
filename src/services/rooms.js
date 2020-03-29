/* eslint-disable no-unused-vars */
import firebase from "firebase/app"
import "firebase/firestore"
import ScoreCard from "@/data/ScoreCard"

const collection = "rooms";

function createScoreCard() {
    const card = {
        name: "",
        one: 0,
        two: 0,
        three: 0,
        four: 0,
        five: 0,
        six: 0,
        threeofakind: 0,
        fourofakind: 0,
        fullhouse: 0,
        smallstraight: 0,
        largestraight: 0,
        chance: 0,
        yahtzee: 0
    };

    return card;
}

const scoreCardsConverter = {
    toFirestore: function (data) {
        return {
            cards: data.cards.map(scoreCard => {
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
            })
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

async function createDefaultRoom(roomName) {
    const data = {
        cards: [
            new ScoreCard("ready player"),
            new ScoreCard("twu!"),
            new ScoreCard("tree")
        ]
    };

    try {
        const docRef = await firebase.firestore()
            .collection(collection)
            .doc(roomName)
            .withConverter(scoreCardsConverter)
            .set(data);

        console.log("Document written (undefined is ok): ", docRef);
    } catch (error) {
        console.error("Error adding document: ", error);
    }
}


async function initRoom(roomName) {
    const snapshot = await firebase.firestore()
        .collection(collection)
        .doc(roomName)
        .withConverter(scoreCardsConverter)
        .get();

    if (snapshot.exists) {
        console.log(`Room ${roomName} already exists`);
    } else {
        console.log(`Room ${roomName} could not be found, creating...`);
        await createDefaultRoom(roomName);
    }
}

async function observeRoom(roomName) {
    firebase.firestore()
        .collection(collection)
        .doc(roomName)
        // .withConverter(scoreCardsConverter)
        .onSnapshot(function (doc) {
            console.log("Current data: ", doc.data());
        });

    // db.collection("users").get().then((querySnapshot) => {
    //     querySnapshot.forEach((doc) => {
    //         console.log(`${doc.id} => ${doc.data()}`);
    //     });
    // });
}

export default {
    initRoom,
    observeRoom
}