import express from "express";
import Stripe from "stripe";
import { Payment } from "../models/payment.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2024-06-20" });

router.post("/create-intent", async (req, res) => {
  try {
    const { userId, amount } = req.body;
    const intent = await stripe.paymentIntents.create({ amount: Math.round(amount * 100), currency: "usd" });
    await Payment.create({ userId, amount, status: "pending", provider: "stripe", providerRef: intent.id });
    res.json({ clientSecret: intent.client_secret });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// webhook endpoint (set STRIPE_WEBHOOK_SECRET in prod)
router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  try {
    const event = secret ? stripe.webhooks.constructEvent(req.body, sig, secret) : JSON.parse(req.body);
    if (event.type === "payment_intent.succeeded") {
      const pi = event.data.object;
      await Payment.update({ status: "succeeded" }, { where: { providerRef: pi.id } });
    }
    res.json({ received: true });
  } catch (e) { res.status(400).send(`Webhook Error: ${e.message}`); }
});

export default router;
