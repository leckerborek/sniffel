import firebase from "firebase/app"
import "firebase/firestore"
import { v4 as uuidv4 } from "uuid";
import { createCard } from "@/data/card"
import snackbear from "@/services/snackbear"

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
            .set(data);

        console.log("rooms.createDefaultRoom - New document created (undefined is ok)", docRef);
    } catch (error) {
        console.error("rooms.createDefaultRoom - Could not add new docuent", error);
    }
}

async function initRoom(roomName) {
    const snapshot = await firebase.firestore()
        .collection(collection)
        .doc(roomName)
        // .withConverter(scoreCardsConverter)
        .get();

    if (snapshot.exists) {
        console.log(`rooms.initRoom - ${roomName} already exists`);
    } else {
        console.log(`rooms.initRoom - ${roomName} could not be found, creating...`);
        await createDefaultRoom(roomName);
    }
}

async function observeRoom(roomName, callback) {
    if (this.unsubscribe !== undefined) {
        console.log("rooms.observeRoom - Unsubscribing from previous snapshot...");
        this.unsubscribe();
    }

    this.unsubscribe = firebase.firestore()
        .collection(collection)
        .doc(roomName)
        .onSnapshot(function (doc) {
            console.log("rooms.observeRoom.onSnapshot", doc.data());
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
        console.log("rooms.updateRoom", result)
    } catch (error) {
        console.error("rooms.updateRoom", error);
        snackbear.error("Deine Änderungen konnten nicht gespeichert werden.");
    }
}

export default {
    initRoom,
    observeRoom,
    updateRoom
}