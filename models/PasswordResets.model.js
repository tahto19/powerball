import "dotenv/config";
import conn from "../dbConnections/conn.js";
import { Model, DataTypes } from "sequelize";
import { emailSender } from "../util/util.js";

class PasswordResets extends Model {
  async emailPasswordResetLink() {
    const url = "https://18.138.76.86/member-area/reset-password?token=";
    try {
      console.log("here");
      await emailSender({
        from: null,
        to: this.User.emailAddress,
        subject: "Password Reset Request",
        html: `
              Hello ${this.User.firstname},<br /><br /><br />
              We received a request to reset your password. Click the link below to choose a new password:
              <br /><br />
              🔗 <a href="${url + this.token}">Click Here</a>
              <br /><br />
              This link will expire in 15 minutes. If you didn't request a password reset, you can safely ignore this email.
              <br /><br /><br />
              Thank you,<br />
              Powerball Team
              `,
      });
      return true;
    } catch (err) {
      console.log(err, "here");
      return false;
    }
  }
}

PasswordResets.init(
  {
    token: {
      type: DataTypes.STRING(512),
      allowNull: true,
      defaultValue: null,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    sequelize: conn.sequelize,
    modelName: "Password_resets",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "password_resets",
    // indexes: [{ name: "prize_list_idx", fields: ["id"] }],
  }
);

export default PasswordResets;
