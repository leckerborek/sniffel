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

    db.collection("users").add({
        first: "Ada",
        last: "Lovelace",
        born: 1815
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
}

export default {
    init
}