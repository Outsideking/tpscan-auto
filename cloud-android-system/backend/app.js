// backend/app.js (เฉพาะส่วน relevant)
import express from "express";
import bodyParser from "body-parser";
import paymentsRouter from "./api/payments.js";

const app = express();

// mount webhook raw for route /api/payments/webhook/:provider will be handled in router
app.use("/api/payments", paymentsRouter);

// for regular JSON endpoints
app.use(bodyParser.json({ limit: "2mb" }));

// ... other routes
