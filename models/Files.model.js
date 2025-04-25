import "dotenv/config";
import conn from "../dbConnections/conn.js";
import { Model, DataTypes } from "sequelize";

class Files extends Model {}

Files.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please enter file name.",
        },
      },
    },
    mimetype: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    file_location: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please enter file type.",
        },
      },
    },
    status: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 1, // 1 for active
    },
  },
  {
    timestamps: true,
    sequelize: conn.sequelize,
    modelName: "files",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "files",
  }
);

export default Files;
