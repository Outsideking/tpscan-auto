import { DataTypes } from "sequelize";
import { sequelize } from "../sequelize.js";

export const Payment = sequelize.define("Payment", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: "pending" }, // pending|succeeded|failed
  provider: { type: DataTypes.STRING, defaultValue: "stripe" },
  providerRef: { type: DataTypes.STRING },
});
