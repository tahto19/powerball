import "dotenv/config";
import conn from "../dbConnections/conn.js";
import { Model, DataTypes } from "sequelize";

class RafflePrize extends Model {}

RafflePrize.init(
  {
    amount: {
      allowNull: true,
      type: DataTypes.STRING,
      defaultValue: null,
    },
    number_of_winners: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    raffle_schedule_id: {
      allowNull: true,
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    prize_id: {
      allowNull: true,
      type: DataTypes.BIGINT,
      defaultValue: null,
    },
    status: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 1, //1 for not deleted
    },
  },
  {
    timestamps: true,
    sequelize: conn.sequelize,
    modelName: "Raffle_Prize",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "raffle_prize_info",
    indexes: [{ name: "raffle_prize_info_idx", fields: ["id"] }],
  }
);
export default RafflePrize;
