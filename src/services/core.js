import firebase from "firebase/app"
import "firebase/firestore"
import config from "@/config"

async function init() {
    console.log("core.init");
    firebase.initializeApp(config.firebase);
    const db = firebase.firestore();

    // The timestampsInSnapshots setting now defaults to true and you no
    // longer need to explicitly set it. In a future release, the setting
    // will be removed entirely and so it is recommended that you remove it
    // from your firestore.settings() call now.
    db.settings({
        // timestampsInSnapshots: true,
    });

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

    const boardName = "snifflers";

    function createBoard(name) {
        const data = {
            cards: [
                {
                    ...card, name: "sniffler #1"
                },
                {
                    ...card, name: "sniffler #2"
                }
            ]
        };

        db.collection("boards").doc(name).set(data)
            .then(function (docRef) {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch(function (error) {
                console.error("Error adding document: ", error);
            });
    }

    const snap = await db.collection("boards").doc(boardName).get();
    if (snap.exists) {
        console.log("board.room found!");
    } else {
        console.log("board.room does not exist, creating...");
        createBoard(boardName);
    }

    // db.collection("users").get().then((querySnapshot) => {
    //     querySnapshot.forEach((doc) => {
    //         console.log(`${doc.id} => ${doc.data()}`);
    //     });
    // });
}

export default {
    init
}