import paypal from "@paypal/checkout-server-sdk";

const env = process.env.PAYPAL_ENV || "sandbox";
const client = new paypal.core.PayPalHttpClient(
  env === "live"
    ? new paypal.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET)
    : new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET)
);

export async function createOrder({ amount, currency = "THB", metadata = {} }) {
  const request = new paypal.orders.OrdersCreateRequest();
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [{ amount: { currency_code: currency, value: String(amount) }, custom_id: metadata?.userId ? String(metadata.userId) : undefined }],
    application_context: { return_url: process.env.PAYPAL_RETURN_URL, cancel_url: process.env.PAYPAL_CANCEL_URL }
  });
  const order = await client.execute(request);
  const approve = order.result.links.find(l => l.rel === "approve")?.href;
  return { provider: "paypal", id: order.result.id, approveUrl: approve };
}

// (ถ้าต้องใช้ webhook ให้ตั้ง PAYPAL webhook แยก แล้วตรวจ event ที่คุณต้องการ)
// ที่นี่ให้ stub ไว้
export async function handleWebhook(req) {
  return { ok: true };
}
