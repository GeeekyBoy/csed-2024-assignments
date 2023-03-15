import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, onMessage, getToken } from "firebase/messaging";
import { initializeFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env["FIREBASE_CLIENT_API_KEY"],
  authDomain: process.env["FIREBASE_CLIENT_AUTH_DOMAIN"],
  databaseURL: process.env["FIREBASE_CLIENT_DATABASE_URL"],
  projectId: process.env["FIREBASE_CLIENT_PROJECT_ID"],
  storageBucket: process.env["FIREBASE_CLIENT_STORAGE_BUCKET"],
  messagingSenderId: process.env["FIREBASE_CLIENT_MESSAGING_SENDER_ID"],
  appId: process.env["FIREBASE_CLIENT_APP_ID"],
  measurementId: process.env["FIREBASE_CLIENT_MEASUREMENT_ID"],
};

const app = initializeApp(firebaseConfig);
getAnalytics(app);

const messaging = getMessaging(app);

const db = initializeFirestore(app, {
  cacheSizeBytes: 5e6,
});

enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === "failed-precondition") {
    console.error(
      "Multiple tabs open, persistence can only be enabled in one tab at a a time."
    );
  } else if (err.code === "unimplemented") {
    console.error(
      "The current browser does not support all of the features required to enable persistence"
    );
  }
});

getToken(messaging, {
  vapidKey: process.env["FIREBASE_CLIENT_VAPID_KEY"],
}).then(async (currentToken) => {
  if (currentToken) {
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        body: JSON.stringify({
          token: currentToken,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      onMessage(
        messaging,
        (payload) => {
          console.log("payload", payload);
        },
        (error) => {
          console.error("Error while subscribing to notifications", error);
        }
      );
    } catch {
      console.error(`Can't subscribe to notifications`);
    }
  }
});
