import "dotenv/config";
import conn from "../dbConnections/conn.js";
import { Model, DataTypes } from "sequelize";

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
        return `${this.firstname} ${this.lastname}`;
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
    },
    lastname: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: {
          msg: "Please enter your lastname",
        },
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
      unique: { msg: "Email address already in use!" },
      validate: { isEmail: { args: true, msg: "Email is not valid" } },
    },
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
        console.log(user.previous().password);
        let decrypted = await decryptPassword(user.previous().password);
        console.log(user.changed("password") && decrypted !== user.password);
        if (user.changed("password") && decrypted !== user.password) {
          user.password =
            user.password && user.password !== ""
              ? await encrpytPassword(user.password)
              : "";
        } else if (!decrypted)
          user.password =
            user.password && user.password !== ""
              ? await encrpytPassword(user.password)
              : "";
        else {
          user.password = user.previous().password;
        }
      },
    },
  }
);

export default Users;
