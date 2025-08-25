const el = (id)=>document.getElementById(id);
const providerRadios = document.getElementsByName("provider");

function getProvider() {
  for (const r of providerRadios) if (r.checked) return r.value;
  return "opn";
}

el("opnMethod").onchange = () => {
  el("cardBox").style.display = el("opnMethod").value === "card" ? "block" : "none";
};

el("payBtn").onclick = async () => {
  const provider = getProvider();
  const amount = Number(el("amount").value || 0);

  if (provider === "paypal") {
    const r = await fetch("/api/payments/create",{
      method:"POST", headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ provider:"paypal", amount, currency:"THB", metadata:{reason:"topup"} })
    });
    const data = await r.json();
    if (data.approveUrl) window.location.href = data.approveUrl;
    else el("payMsg").textContent = data.error || "Error";
    return;
  }

  // Opn/Omise
  let method = el("opnMethod").value;
  let metadata = { reason:"topup" };

  if (method === "card") {
    // ต้องตั้งค่า OMISE_PUBLIC_KEY ฝั่ง HTML (ผ่าน <script> window.OMISE_PUBLIC_KEY=... </script>)
    if (!window.OMISE_PUBLIC_KEY) { el("payMsg").textContent = "Missing OMISE_PUBLIC_KEY"; return; }
    Omise.setPublicKey(window.OMISE_PUBLIC_KEY);
    try {
      const card = {
        number: el("cardNumber").value,
        name: el("cardName").value,
        expiration_month: el("cardExpM").value,
        expiration_year: el("cardExpY").value,
        security_code: el("cardCVC").value
      };
      const tokenRes = await new Promise((resolve, reject)=>{
        Omise.createToken("card", card, (status, response)=>{
          if (status === 200) resolve(response.id);
          else reject(response.message || "Tokenization failed");
        });
      });
      metadata.cardToken = tokenRes;
    } catch (e) { el("payMsg").textContent = e; return; }
  }

  const r = await fetch("/api/payments/create",{
    method:"POST", headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ provider:"opn", method, amount, currency:"THB", metadata })
  });
  const data = await r.json();
  if (data.authorizeUrl) window.location.href = data.authorizeUrl;
  else if (data.status) el("payMsg").textContent = `สถานะ: ${data.status} (ID: ${data.id})`;
  else el("payMsg").textContent = data.error || "Error";
};
