// backend/payments/paypal.js
import paypal from "@paypal/checkout-server-sdk";

const ENV = process.env.PAYPAL_ENV === "live" ? "live" : "sandbox";

function client() {
  if (ENV === "live") {
    return new paypal.core.PayPalHttpClient(
      new paypal.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET)
    );
  }
  return new paypal.core.PayPalHttpClient(
    new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET)
  );
}

export async function createOrder({ amount, currency = "USD", metadata = {} }) {
  const request = new paypal.orders.OrdersCreateRequest();
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [{
      amount: { currency_code: currency, value: String(amount) },
      custom_id: metadata.userId ? String(metadata.userId) : undefined
    }],
    application_context: {
      return_url: process.env.PAYPAL_RETURN_URL,
      cancel_url: process.env.PAYPAL_CANCEL_URL
    }
  });

  const res = await client().execute(request);
  const approve = res.result.links.find(l => l.rel === "approve")?.href;
  return { provider: "paypal", id: res.result.id, approveUrl: approve };
}

// Basic stub for webhook handler (expand as needed)
export async function handleWebhook(req) {
  // For PayPal webhook verification you should verify the signature,
  // here we assume sandbox or you handle verification externally.
  const event = req.body && typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  // example: event.event_type === "CHECKOUT.ORDER.APPROVED"
  return { ok: true, event };
}
