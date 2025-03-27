import "dotenv/config";
import conn from "../dbConnections/conn.js";
import { Model, DataTypes } from "sequelize";
import { emailSender, generateRandomNumber } from "../util/util.js";
class OTP extends Model {
  getNewCode() {
    return this.code;
  }
  generateNewCode() {
    this.code = generateRandomNumber();
    return this.code;
  }
  async emailCode() {
    try {
      await emailSender({
        from: null,
        to: this.emailAddress,
        subject: "otp code",
        text: "otp code",
        html: `<span>${this.code}</span>`,
      });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}

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
