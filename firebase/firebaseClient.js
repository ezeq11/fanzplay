// firebaseClient.ts

import { FirebaseOptions, getApp, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { PUBLIC_FIREBASE_API_KEY, PUBLIC_FIREBASE_AUTH_DOMAIN, PUBLIC_FIREBASE_PROJECT_ID, PUBLIC_FIREBASE_STORAGE_BUCKET, PUBLIC_FIREBASE_MESSAGING_SENDER_ID, PUBLIC_FIREBASE_APP_ID } from "@envLocal";
import firebase from 'firebase/compat';

const clientCredentials = {
    apiKey: PUBLIC_FIREBASE_API_KEY,
    authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: PUBLIC_FIREBASE_APP_ID,
    databaseURL: 'https://fanzplay-95bfa-default-rtdb.firebaseio.com/'
};



// function createFirebaseApp(config) {
//     try {
//         return getApp();
//     } catch {
//         let app = initializeApp(config);

//         return app
//     }
// }




// //firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);


// export const firebase = createFirebaseApp(clientCredentials);

firebase.initializeApp(clientCredentials);
export const auth=firebase.auth;
export const db=firebase.firestore();
export const timestamp=firebase.firestore.Timestamp;