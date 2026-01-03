/**
 * Import function triggers from their respective submodules:
 */
const { setGlobalOptions } = require("firebase-functions");
const { onRequest } = require("firebase-functions/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK for database access
admin.initializeApp();
const db = admin.firestore();

// Set global options for all functions (max 10 instances)
setGlobalOptions({ maxInstances: 10 });

// Simple Hello World function
exports.helloWorld = onRequest((req, res) => {
  logger.info("Hello logs!", { structuredData: true });
  res.send("Hello from Firebase Functions v2!");
});

// Example Firestore write function
exports.addMessage = onRequest(async (req, res) => {
  try {
    const text = req.query.text || "Hello Firestore!";
    const docRef = await db.collection("messages").add({
      text: text,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.send(`Message added with ID: ${docRef.id}`);
  } catch (error) {
    logger.error("Error adding message:", error);
    res.status(500).send("Error adding message");
  }
});
