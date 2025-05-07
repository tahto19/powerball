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
    status: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 2, //2 for active
    },
    status_text: {
      type: DataTypes.VIRTUAL,
      allowNull: true,
      get() {
        switch (this.status) {
          case 1:
            return "done";
          case 2:
            return "active";
          case 3:
            return "inactive";
        }
      },
    },
  },
  {
    timestamps: true,
    sequelize: conn.sequelize,
    modelName: "Raffle_Schedule",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "raffle_details_schedule",
    indexes: [{ name: "raffle_schedule_idx", fields: ["id"] }],
  }
);
export default RaffleSchedule;
