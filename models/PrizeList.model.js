import "dotenv/config";
import conn from "../dbConnections/conn.js";
import { Model, DataTypes } from "sequelize";

class PrizeList extends Model {}

PrizeList.init(
  {
    value: {
      allowNull: true,
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: {
          msg: "Please enter prize name",
        },
      },
    },
    type: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: {
          msg: "Please enter prize type",
        },
      },
    },
  },
  {
    timestamps: true,
    sequelize: conn.sequelize,
    modelName: "Prize_List",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "prize_list",
    indexes: [{ name: "prize_list_idx", fields: ["id"] }],
  }
);

export default PrizeList;
