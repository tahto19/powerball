import "dotenv/config";
import conn from "../dbConnections/conn.js";
import { Model, DataTypes } from "sequelize";

class RaffleSchedule extends Model {}

RaffleSchedule.init(
  {
    schedule_date: {
      allowNull: true,
      type: DataTypes.DATE,
      defaultValue: null,
    },
    raffle_id: {
      allowNull: true,
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
  },
  {
    timestamps: true,
    sequelize: conn.sequelize,
    modelName: "Raffle Schedule",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "raffle_details_schedule",
    indexes: [{ name: "raffle_schedule_idx", fields: ["id"] }],
  }
);
export default RaffleSchedule;
