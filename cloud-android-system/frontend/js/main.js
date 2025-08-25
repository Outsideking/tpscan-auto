// existing code...
const providerRadios = document.getElementsByName("provider");
function getProvider(){ for(const r of providerRadios) if(r.checked) return r.value; return "opn"; }

document.getElementById("opnMethod").onchange = () => {
  document.getElementById("cardBox").style.display = document.getElementById("opnMethod").value === "card" ? "block":"none";
};

document.getElementById("payBtn").onclick = async () => {
  const provider = getProvider();
  const amount = Number(document.getElementById("amount").value || 0);
  const metadata = { reason: "topup", userId: 1 };

  if (provider === "paypal") {
    const r = await fetch("/api/payments/create", {
      method: "POST", headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ provider:"paypal", amount, currency:"USD", metadata })
    });
    const data = await r.json();
    if (data.approveUrl) window.location.href = data.approveUrl;
    else document.getElementById("payMsg").textContent = data.error || "Error";
    return;
  }

  // opn / omise
  const method = document.getElementById("opnMethod").value;
  let meta = metadata;

  if (method === "card") {
    // simple tokenization via Omise.js if available
    if (!window.OMISE_PUBLIC_KEY) { document.getElementById("payMsg").textContent = "Missing OMISE public key"; return; }
    Omise.setPublicKey(window.OMISE_PUBLIC_KEY);
    const card = {
      number: document.getElementById("cardNumber").value,
      name: document.getElementById("cardName").value,
      expiration_month: document.getElementById("cardExpM").value,
      expiration_year: document.getElementById("cardExpY").value,
      security_code: document.getElementById("cardCVC").value
    };
    try {
      const tokenRes = await new Promise((resolve, reject) => {
        Omise.createToken("card", card, (status, response) => {
          if (status === 200) resolve(response.id);
          else reject(response.message || "token error");
        });
      });
      meta.cardToken = tokenRes;
    } catch (e) {
      document.getElementById("payMsg").textContent = e;
      return;
    }
  }

  const r = await fetch("/api/payments/create", {
    method: "POST", headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ provider:"opn", method, amount, currency:"THB", metadata: meta })
  });
  const data = await r.json();
  if (data.authorizeUrl) window.location.href = data.authorizeUrl;
  else document.getElementById("payMsg").textContent = data.status ? `สถานะ: ${data.status}` : (data.error||"Error");
};
