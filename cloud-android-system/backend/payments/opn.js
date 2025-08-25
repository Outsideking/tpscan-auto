// backend/payments/opn.js
import Omise from "omise";

const omiseKey = process.env.OPN_SECRET_KEY || process.env.OMISE_SECRET_KEY;
if (!omiseKey) console.warn("OPN/OMISE secret missing");

const client = Omise({ secretKey: omiseKey, omiseVersion: "2019-05-29" });

/**
 * method examples:
 *  - "truemoney" (TrueMoney Wallet)
 *  - "promptpay" (PromptPay QR)
 *  - "internet_banking_bbl" / "internet_banking_kbank"
 *  - "card" (requires token from Omise.js in frontend)
 */
export async function createChargeOrSource({ method, amount, currency="THB", metadata = {} }) {
  if (!method) throw new Error("method required");
  const amountInt = Math.round(amount * 100);

  if (method === "card") {
    if (!metadata.cardToken) throw new Error("cardToken required for card payments");
    const charge = await client.charges.create({
      amount: amountInt,
      currency,
      card: metadata.cardToken,
      metadata
    });
    return { provider: "opn", type: "charge", id: charge.id, status: charge.status };
  }

  // create source
  const source = await client.sources.create({
    amount: amountInt,
    currency,
    type: method,
    metadata
  });

  // create charge using the source
  const charge = await client.charges.create({
    amount: amountInt,
    currency,
    source: source.id,
    return_uri: process.env.OPN_RETURN_URL
  });

  return {
    provider: "opn",
    type: "charge",
    id: charge.id,
    status: charge.status,
    authorizeUrl: charge.authorize_uri || null
  };
}

// basic webhook handler
export async function handleWebhook(req) {
  const event = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  // event.key might be "charge.complete", examine provider docs to map
  return { ok: true, eventKey: event?.key || null, data: event?.data || event };
    }
