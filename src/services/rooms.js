import firebase from "firebase/app"
import "firebase/firestore"
import { v4 as uuidv4 } from "uuid";
import snackbear from "@/services/snackbear"
import card from "@/services/card";
const rdiff = require('recursive-diff');

const collection = "rooms";

async function createDefaultRoom(roomName) {
    const data = {
        cards: [
            card.create(),
            card.create(),
            card.create()
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
        console.log("rooms.observeRoom: Unsubscribing from previous snapshot...");
        this.unsubscribe();
    }

    this.unsubscribe = firebase.firestore()
        .collection(collection)
        .doc(roomName)
        .onSnapshot(function (doc) {
            console.log("rooms.observeRoom.onSnapshot", doc.data());
            const data = doc.data();

            // check for diffs, if nothing changed dont fire callback to avoid disturbance in transitions
            const diffs = rdiff.getDiff(this.data, data);
            console.info(`rooms.observeRoom: Deep Diff Result`, diffs);
            if (diffs.length === 0) {
                console.info(`rooms.observeRoom: Update contains no new data, will not fire callback.`);
                return;
            }

            // just a fallback for old data without id
            if (Array.isArray(data.cards)) {
                data.cards = data.cards.map(card => {
                    if (card.id === undefined) {
                        return { ...card, id: uuidv4() };
                    }
                    return card;
                });
            }

            this.data = data;
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

function diff(left, right) {
    let diffs = [];
    if (left === undefined || right === undefined) {
        return diffs;
    }

    // spieler hinzugefügt
    if (left.cards.length < right.cards.length) {
        for (let rightCard of right.cards) {
            const leftCard = left.cards.find(leftCard => leftCard.id === rightCard.id);
            if (leftCard === undefined) {
                diffs.push(`${rightCard.player} wurde dem Spiel hinzugefügt.`);
            }
        }
    }

    // spieler entfernt
    if (left.cards.length > right.cards.length) {
        for (let leftCard of left.cards) {
            const rightCard = right.cards.find(rightCard => rightCard.id === leftCard.id);
            if (rightCard === undefined) {
                diffs.push(`${leftCard.player} hat das Spiel verlassen.`);
            }
        }
    }

    // name geändert oder punktestand eingetragen
    for (let leftCard of left.cards) {
        const rightCard = right.cards.find(rightCard => rightCard.id === leftCard.id);
        if (rightCard !== undefined) {
            const cardDiffs = card.diff(leftCard, rightCard);
            diffs = diffs.concat(cardDiffs);
        }
    }

    return diffs;
}

export default {
    initRoom,
    observeRoom,
    updateRoom,
    diff
}