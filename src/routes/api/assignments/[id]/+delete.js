import * as dotenv from 'dotenv';
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

dotenv.config()

const app = getApps()[0] || initializeApp({
  credential: cert({
    projectId: process.env["FIREBASE_ADMIN_PROJECT_ID"],
    clientEmail: process.env["FIREBASE_ADMIN_CLIENT_EMAIL"],
    privateKey: process.env["FIREBASE_ADMIN_PRIVATE_KEY"].replace(/\\n/g, "\n"),
  }),
  databaseURL: `https://${process.env["FIREBASE_ADMIN_PROJECT_ID"]}.firebaseio.com`,
});

const db = getFirestore(app);

export default async ({ body, route, headers }) => {
  const token = headers.authorization?.split(" ")[1];
  if (token !== process.env["ADMIN_TOKEN"]) {
    return {
      statusCode: 401,
      data: {
        message: "Unauthorized",
      },
    };
  }
  const assignmentId = route.params.id;
  await db.doc(`assignments/${assignmentId}`).delete();
  return {
    data: {
      message: "Assignment updated",
    },
  };
};
