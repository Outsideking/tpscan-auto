import * as paypal from "./paypal.js";
import * as opn from "./opn.js";

export async function createPaymentIntent({ provider, method, amount, currency="THB", metadata={} }) {
  switch (provider) {
    case "paypal":      return paypal.createOrder({ amount, currency, metadata });
    case "opn":         return opn.createChargeOrSource({ method, amount, currency, metadata });
    default: throw new Error("Unsupported provider");
  }
}

export async function handleWebhook({ provider, req }) {
  switch (provider) {
    case "paypal":      return paypal.handleWebhook(req);
    case "opn":         return opn.handleWebhook(req);
    default: throw new Error("Unsupported provider");
  }
  }
