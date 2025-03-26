import "dotenv/config";
import conn from "../dbConnections/conn.js";
import { Model, DataTypes } from "sequelize";
import { generateRandomNumber } from "../util/util.js";
class OTP extends Model {}

OTP.init(
  {
    mobile: {
      allowNull: true,
      type: DataTypes.STRING,
      defaultValue: "",
    },
    ip_address: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    platformversion: { allowNull: true, type: DataTypes.STRING },
    platform: { allowNull: true, type: DataTypes.STRING },
    code: {
      allowNull: true,
      type: DataTypes.STRING,
      defaultValue: generateRandomNumber,
    },
    emailAddress: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    auth: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    sequelize: conn.sequelize,
    modelName: "OTP",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "OTP",
  }
);

export default OTP;
