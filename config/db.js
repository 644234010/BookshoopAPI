'use strict';
  //Firebase Real Time
  var firebase = require("firebase-admin");
  var serviceAccount = require("../config/bookshopFirebaseKey.json");

  firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL:
    process.env.DATABASE_URL,
  });

  const db = firebase.database();
  console.log("Firebase Database Connected!");
  module.exports = db;
  