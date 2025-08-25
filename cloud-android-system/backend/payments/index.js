// backend/payments/index.js
import * as paypalModule from "./paypal.js";
import * as opnModule from "./opn.js";

export async function createPaymentIntent({ provider, method, amount, currency="THB", metadata={} }) {
  switch ((provider||"").toLowerCase()) {
    case "paypal":
      return await paypalModule.createOrder({ amount, currency, metadata });
    case "opn":
    case "omise":
      return await opnModule.createChargeOrSource({ method, amount, currency, metadata });
    default:
      throw new Error("Unsupported provider");
  }
}

export async function handleWebhook({ provider, req }) {
  switch ((provider||"").toLowerCase()) {
    case "paypal":
      return await paypalModule.handleWebhook(req);
    case "opn":
    case "omise":
      return await opnModule.handleWebhook(req);
    default:
      throw new Error("Unsupported provider");
  }
}
