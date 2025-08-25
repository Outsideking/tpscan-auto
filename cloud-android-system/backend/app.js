import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { sequelize } from "./sequelize.js";
import "./models/user.js";
import "./models/payment.js";
import users from "./api/users.js";
import payments from "./api/payments.js";
import emulator from "./api/emulator.js";

dotenv.config();

const app = express();
app.use(cors());
app.use("/api/payments/webhook", payments);         // raw body เฉพาะ webhook
app.use(bodyParser.json({ limit: "1mb" }));
app.use("/api/users", users);
app.use("/api/payments", payments);
app.use("/api/emulator", emulator);

const PORT = process.env.PORT || 4000;

(async () => {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true }); // ใช้ migration ก็ได้ในภายหลัง
  app.listen(PORT, () => console.log(`Backend on :${PORT}`));
})();
