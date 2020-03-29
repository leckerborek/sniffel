/* eslint-disable no-unused-vars */
import firebase from "firebase/app"
import "firebase/firestore"
import ScoreCard from "@/data/ScoreCard"
import { v4 as uuidv4 } from 'uuid';

const collection = "rooms";

function createScoreCard() {
    const card = {
        name: "",
        one: undefined,
        two: undefined,
        three: undefined,
        four: undefined,
        five: undefined,
        six: undefined,
        threeofakind: undefined,
        fourofakind: undefined,
        fullhouse: undefined,
        smallstraight: undefined,
        largestraight: undefined,
        chance: undefined,
        yahtzee: undefined
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

async function observeRoom(roomName, callback) {
    firebase.firestore()
        .collection(collection)
        .doc(roomName)
        // .withConverter(scoreCardsConverter)
        .onSnapshot(function (doc) {
            console.log(`rooms.observeRoom(${roomName})`, doc.data());
            const data = doc.data();
            if (Array.isArray(data.cards)) {
                data.cards = data.cards.map(card => ({ ...card, id: uuidv4() }));
            }
            callback(data);
        });

    // db.collection("users").get().then((querySnapshot) => {
    //     querySnapshot.forEach((doc) => {
    //         console.log(`${doc.id} => ${doc.data()}`);
    //     });
    // });
}

async function updateRoom(roomName, data) {
    try {
        const result = await firebase.firestore()
            .collection(collection)
            .doc(roomName)
            .set(data);
        console.log("New data pushed", result)
    } catch (error) {
        console.error("Could not push new data", error);
    }
}

export default {
    initRoom,
    observeRoom,
    updateRoom
}