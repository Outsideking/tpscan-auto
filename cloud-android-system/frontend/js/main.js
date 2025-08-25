const api = (p)=> fetch(p).then(r=>r.json());

document.getElementById("openEmu").onclick = async () => {
  const info = await api("/api/emulator/url");
  window.open(info.url, "_blank");
};

(async () => {
  const info = await api("/api/emulator/url");
  document.getElementById("emuVer").textContent = `เวอร์ชัน Emulator: ${info.version}`;
})();

document.getElementById("payBtn").onclick = async () => {
  const amount = Number(document.getElementById("amount").value || 0);
  const r = await fetch("/api/payments/create-intent",{
    method:"POST",
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ userId: 1, amount })
  });
  const data = await r.json();
  document.getElementById("payMsg").textContent = data.clientSecret ? "สร้าง Payment Intent แล้ว" : (data.error||"error");
};
