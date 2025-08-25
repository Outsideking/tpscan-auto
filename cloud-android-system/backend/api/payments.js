import express from "express";
import { createPaymentIntent, handleWebhook } from "../payments/index.js";
const router = express.Router();

// Create payment
router.post("/create", async (req, res) => {
  try {
    const { provider, method, amount, currency, metadata } = req.body;
    const result = await createPaymentIntent({ provider, method, amount, currency, metadata });
    res.json(result);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// Webhook (Opn/PayPal)
router.post("/webhook/:provider", express.raw({ type: "application/json" }), async (req, res) => {
  try {
    const out = await handleWebhook({ provider: req.params.provider, req });
    res.json(out);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

export default router;
