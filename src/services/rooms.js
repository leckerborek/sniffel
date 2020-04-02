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
            if (Array.isArray(data.cards)) {
                // unique id is required by v-for
                data.cards = data.cards.map(card => ({ ...card, id: uuidv4() }));
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