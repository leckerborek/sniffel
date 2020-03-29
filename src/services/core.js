import firebase from "firebase/app"
import "firebase/firestore"
import config from "@/config"

async function init() {
    firebase.initializeApp(config.firebase);
    const db = firebase.firestore();

    // The timestampsInSnapshots setting now defaults to true and you no
    // longer need to explicitly set it. In a future release, the setting
    // will be removed entirely and so it is recommended that you remove it
    // from your firestore.settings() call now.
    db.settings({
        // timestampsInSnapshots: true,
    });
}

export default {
    init
}