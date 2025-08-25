import React from "react";

function App() {
  const noVNCUrl = "http://<ALB-DNS>:6080/vnc.html"; // แทนด้วย ALB DNS หลัง deploy

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Cloud Android Web</h1>
      <p>กดปุ่มด้านล่างเพื่อเข้าสู่ Android Emulator ผ่าน noVNC</p>
      <a href={noVNCUrl} target="_blank" rel="noopener noreferrer">
        <button style={{ padding: "10px 20px", fontSize: "16px" }}>Open Emulator</button>
      </a>
    </div>
  );
}

export default App;
