import express from "express";
const router = express.Router();

// เก็บค่าเวอร์ชันปัจจุบันไว้ใน env หรือ KV ภายนอกก็ได้
const CLOUD_ANDROID_HOST = process.env.CLOUD_ANDROID_HOST || "http://localhost";
const CLOUD_ANDROID_PORT = process.env.CLOUD_ANDROID_PORT || "6080";
let ANDROID_IMAGE_TAG = process.env.ANDROID_IMAGE_TAG || "latest";

router.get("/url", (_req, res) => {
  res.json({ url: `${CLOUD_ANDROID_HOST}:${CLOUD_ANDROID_PORT}/vnc.html`, version: ANDROID_IMAGE_TAG });
});

router.post("/version", (req, res) => {
  const { tag } = req.body;
  if (!tag) return res.status(400).json({ error: "tag required" });
  ANDROID_IMAGE_TAG = tag; // ในโปรดักชันควร trigger deploy ผ่าน CI/CD แทนการเปลี่ยนในหน่วยความจำ
  res.json({ ok: true, tag });
});

export default router;
