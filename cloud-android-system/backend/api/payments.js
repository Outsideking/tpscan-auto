// backend/api/payments.js
import express from "express";
import { createPaymentIntent, handleWebhook } from "../payments/index.js";

const router = express.Router();

// Create payment (returns provider response: approveUrl / authorizeUrl / clientSecret / etc.)
router.post("/create", async (req, res) => {
  try {
    const { provider, method, amount, currency, metadata } = req.body;
    const out = await createPaymentIntent({ provider, method, amount, currency, metadata });
    res.json(out);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Webhook endpoint (generic)
router.post("/webhook/:provider", express.raw({ type: "application/json" }), async (req, res) => {
  try {
    const out = await handleWebhook({ provider: req.params.provider, req });
    // TODO: update Payment model status based on out
    res.json(out);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
