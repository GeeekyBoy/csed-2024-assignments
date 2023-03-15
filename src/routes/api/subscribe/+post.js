import * as dotenv from "dotenv";
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

dotenv.config()

const app = getApps()[0] || initializeApp({
  credential: cert({
    projectId: process.env["FIREBASE_ADMIN_PROJECT_ID"],
    clientEmail: process.env["FIREBASE_ADMIN_CLIENT_EMAIL"],
    privateKey: process.env["FIREBASE_ADMIN_PRIVATE_KEY"].replace(/\\n/g, "\n"),
  }),
  databaseURL: `https://${process.env["FIREBASE_ADMIN_PROJECT_ID"]}.firebaseio.com`,
});

const messaging = getMessaging(app);

export default async ({ body }) => {
  const token = body["token"];
  await messaging.subscribeToTopic(token, "assignments");
  return {
    data: {
      message: "Subscribed",
    },
  };
};
