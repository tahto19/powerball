import { DataTypes, Model } from "sequelize";
import conn from "../dbConnections/conn.js";

class AlphaCode extends Model {}

AlphaCode.init(
  {
    name: {
      allowNull: false,
      type: DataTypes.CHAR(20),
    },
    active: {
      allowNull: true,
      default: true,
      type: DataTypes.BOOLEAN,
    },
    entries: {
      allowNull: false,
      type: DataTypes.INTEGER(14),
    },
  },
  {
    indexes: [{ name: "name_idx", fields: ["name"] }],
    timestamps: true,
    sequelize: conn.sequelize,
    modelName: "AlphaCode",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "AlphaCode",
  }
);
export default AlphaCode;
