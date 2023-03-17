self.addEventListener("notificationclick", function (event) {
  event.stopImmediatePropagation();
  event.notification.close();
  clients.openWindow("https://csed2024assignments.geeekyboy.com/");
});

importScripts("https://www.gstatic.com/firebasejs/9.18.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.18.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBRTHLN9HHQjevO4yHIqQeokv3VCzaZHXw",
  authDomain: "csed-assignments-4deb5.firebaseapp.com",
  databaseURL: "https://csed-assignments-4deb5-default-rtdb.firebaseio.com",
  projectId: "csed-assignments-4deb5",
  storageBucket: "csed-assignments-4deb5.appspot.com",
  messagingSenderId: "435235328157",
  appId: "1:435235328157:web:51647b0916d880972b8474",
  measurementId: "G-3HB4Z9SEGM",
});

const messaging = firebase.messaging();
