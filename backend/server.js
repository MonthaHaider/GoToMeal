require("dotenv").config();
const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");
const admin = require("firebase-admin");

// Firestore service account
const serviceAccount = require("./mealstogo-55fe4-firebase-adminsdk-fbsvc-0947aa7394.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

// Create payment intent
app.post("/create-payment-intent", async (req, res) => {
  try {
    let { amount, userId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    // Ensure amount is in cents
    if (amount < 100) amount = 100; 

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    // Save initial payment record in Firestore
    const paymentRef = await db.collection("payments").add({
      userId: userId || "anonymous",
      amount: amount / 100, // USD
      status: "pending",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      clientSecret: paymentIntent.client_secret,
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: paymentRef.id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update payment status
app.post("/update-payment", async (req, res) => {
  try {
    const { paymentId, status } = req.body;
    if (!paymentId || !status) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    await db.collection("payments").doc(paymentId).update({ status });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
