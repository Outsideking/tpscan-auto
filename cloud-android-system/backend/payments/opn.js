import omise from "omise";

// ตั้งค่า Key
const omiseClient = omise({
  secretKey: process.env.OPN_SECRET_KEY || process.env.OMISE_SECRET_KEY,
  omiseVersion: "2019-05-29"
});

/**
 * method ที่รองรับ:
 * - "truemoney"                   -> TrueMoney Wallet
 * - "promptpay"                   -> พร้อมเพย์ (QR)
 * - "internet_banking_bbl"        -> กรุงเทพ
 * - "internet_banking_kbank"      -> กสิกร
 * - "card" + token (จาก Omise.js) -> บัตรเครดิต/เดบิต
 */
export async function createChargeOrSource({ method, amount, currency = "THB", metadata = {} }) {
  if (method === "card") {
    // ต้องมี token จากหน้าเว็บ (Omise.js) ส่งมาใน metadata.cardToken
    const charge = await omiseClient.charges.create({
      amount: Math.round(amount * 100),
      currency,
      card: metadata.cardToken,
      metadata
    });
    return { provider: "opn", type: "charge", id: charge.id, status: charge.status };
  }

  // สร้าง source สำหรับวิธีที่ต้อง redirect/authorize
  const source = await omiseClient.sources.create({
    amount: Math.round(amount * 100),
    currency,
    type: method,   // truemoney | promptpay | internet_banking_bbl | internet_banking_kbank | ...
    metadata
  });

  // สร้าง charge จาก source (บางวิธีจะได้ authorize URI กลับมาใน charge.authorize_uri)
  const charge = await omiseClient.charges.create({
    amount: Math.round(amount * 100),
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

// Webhook จาก Opn (ตั้งใน Dashboard) — ตรวจสถานะชำระเงิน
export async function handleWebhook(req) {
  // Opn ส่ง JSON ตรง ๆ มากับ event (ไม่มีลายเซ็นบังคับเหมือนบางเจ้า)
  const event = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  // ตัวอย่าง: event.key === "charge.complete"
  return { ok: true, eventKey: event?.key, data: event?.data };
            }
