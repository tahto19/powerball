import "dotenv/config";
import conn from "../dbConnections/conn.js";
import { Model, DataTypes } from "sequelize";
import {
  emailSender,
  generateRandomNumber,
  mobileSender,
} from "../util/util.js";
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
      console.log("here");
      await emailSender({
        from: null,
        to: this.emailAddress,
        subject: "otp code",
        text: "otp code",
        html: `<span>${this.code}</span>`,
      });
      return true;
    } catch (err) {
      console.log(err, "here");
      return false;
    }
  }
  async mobileCode() {
    try {
      await mobileSender({
        otp: this.code,
        number: this.mobileNumber,
      });
      return true;
    } catch (err) {
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
      allowNull: true,
      type: DataTypes.STRING,
    },
    mobileNumber: { allowNull: true, type: DataTypes.STRING },
    isLogin: { type: DataTypes.BOOLEAN, allowNull: true, default: false },
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
    hooks: {
      afterUpdate: async (otp, options) => {
        let val = otp.toJSON();
        if (val.mobileNumber) {
          await otp.mobileCode();
        }
        if (val.emailAddress) {
          await otp.emailCode();
        }
        // For example: send notification after update is committed
        // await otp.emailCode();
        await otp.mobileCode();
      },
      afterSave: async (otp, options) => {
        let val = otp.toJSON();
        if (val.mobileNumber) {
          await otp.mobileCode();
        }
        if (val.emailAddress) {
          await otp.emailCode();
        }
        // For example: send notification after update is committed
        // await otp.emailCode();
      },
    },
  }
);

export default OTP;
