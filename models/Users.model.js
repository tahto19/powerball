import "dotenv/config";
import conn from "../dbConnections/conn.js";
import { Model, DataTypes } from "sequelize";
import validator from "validator";
import { decryptPassword, encrpytPassword } from "../util/util.js";
class Users extends Model {
  async validPassword(password) {
    var hash =
      password && password !== ""
        ? await decryptPassword(this.password)
        : false;
    if (password === hash) return true;
    else hash;
  }
}

Users.init(
  {
    fullname: {
      allowNull: true,
      type: DataTypes.VIRTUAL,
      get() {
        return this.firstname && this.firstname
          ? `${this.firstname} ${this.lastname}`
          : null;
      },
    },
    firstname: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: {
          msg: "Please enter your firstname",
        },
      },
      get() {
        let val = this.getDataValue("firstname");

        return val ? decryptPassword(val) : this.getDataValue("firstname");
      },
      set(val) {
        this.setDataValue("firstname", encrpytPassword(val));
      },
    },
    lastname: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: {
          msg: "Please enter your lastname",
        },
      },
      get() {
        let val = this.getDataValue("lastname");

        return val ? decryptPassword(val) : this.getDataValue("lastname");
      },
      set(val) {
        this.setDataValue("lastname", encrpytPassword(val));
      },
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: {
          msg: "Please enter your Password",
        },
      },
    },
    idPath: { allowNull: true, type: DataTypes.STRING, defaultValue: null },
    birthdate: { allowNull: true, type: DataTypes.DATE, defaultValue: null },
    active: { allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true },
    block: { allowNull: false, type: DataTypes.BOOLEAN, defaultValue: false },
    emailAddress: {
      allowNull: false,
      type: DataTypes.STRING,

      get() {
        let val = this.getDataValue("emailAddress");

        return val ? decryptPassword(val) : this.getDataValue("emailAddress");
      },
      async set(val) {
        if (!val || !validator.isEmail(val)) {
          throw new Error("Invalid email format");
        }
        this.setDataValue("emailAddress", encrpytPassword(val));
      },
    },
    isAdmin: { allowNull: false, type: DataTypes.BOOLEAN, defaultValue: false },
    mobileNumber: { allowNull: true, type: DataTypes.STRING },
  },
  {
    timestamps: true,
    sequelize: conn.sequelize,
    modelName: "Users",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "users",
    indexes: [{ name: "fullname_idx", fields: ["firstname", "lastname"] }],
    hooks: {
      beforeSave: async (user) => {
        const prevPassword = user.previous().password;
        const currentPassword = user.password;

        // If password is empty or unchanged, skip processing
        if (
          !user.changed("password") ||
          !currentPassword ||
          currentPassword === ""
        ) {
          user.password = prevPassword; // Restore the old password
          return;
        }

        const decrypted = decryptPassword(prevPassword);

        if (decrypted !== currentPassword) {
          user.password = encrpytPassword(currentPassword);
        } else {
          user.password = prevPassword;
        }
      },
    },
  }
);

export default Users;
