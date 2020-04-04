/* eslint-disable no-unused-vars */
import firebase from "firebase/app"
import "firebase/firestore"
import { v4 as uuidv4 } from "uuid";
import { createCard } from "@/data/card"
const collection = "rooms";

async function createDefaultRoom(roomName) {
    const data = {
        cards: [
            createCard(),
            createCard(),
            createCard()
        ]
    };

    try {
        const docRef = await firebase.firestore()
            .collection(collection)
            .doc(roomName)
            // .withConverter(scoreCardsConverter)
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
        // .withConverter(scoreCardsConverter)
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
        .onSnapshot(function (doc) {
            console.log(`rooms.observeRoom(${roomName})`, doc.data());
            const data = doc.data();
            // just a fallback for old data without id
            if (Array.isArray(data.cards)) {
                data.cards = data.cards.map(card => {
                    if (card.id === undefined) {
                        return { ...card, id: uuidv4() };
                    }
                    return card;
                });
            }
            callback(data);
        });
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