document.getElementById("openEmulator").addEventListener("click", async () => {
    const res = await fetch("/api/emulator/url");
    const data = await res.json();
    window.open(data.url, "_blank");
});
