import { DataTypes, Model } from "sequelize";
import conn from "../dbConnections/conn.js";

class WiningDrawDetails extends Model {}

WiningDrawDetails.init(
  {
    admin_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: process.env.DB_PREFIX + "users",
        key: "id",
      },
    },
    raffle_prize_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: process.env.DB_PREFIX + "raffle_prize_info",
        key: "id",
      },
    },
    ticket_history_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: process.env.DB_PREFIX + "ticket_history",
        key: "id",
      },
    },
    ticket_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: process.env.DB_PREFIX + "ticket_details",
        key: "id",
      },
    },
  },
  {
    timestamps: true,
    sequelize: conn.sequelize,
    modelName: "wining_draw_details",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "wining_draw_details",
    indexes: [
      { name: "admin_idx", fields: ["admin_id"] },
      { name: "raffle_prize_idx", fields: ["raffle_prize_id"] },
      { name: "ticket_history_idx", fields: ["ticket_history_id"] },
      { name: "ticket_idx", fields: ["ticket_id"] },
    ],
  }
);
export default WiningDrawDetails;
