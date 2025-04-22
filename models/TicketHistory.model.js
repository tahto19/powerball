import { DataTypes, Model } from "sequelize";
import conn from "../dbConnections/conn.js";
import { randomLetters } from "../util/util.js";

class TicketHistory extends Model {}
TicketHistory.init(
  {
    ticket_history_generate: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    raffle_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: process.env.DB_PREFIX + "raffle_details_schedule",
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
    modelName: "ticket_history",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "ticket_history",
    indexes: [
      {
        name: "ticket_history_generate_idx",
        fields: ["ticket_history_generate"],
      },
      { name: "ticket_id_idx", fields: ["ticket_id"] },
      { name: "raffle_id_idx", fields: ["raffle_id"] },
    ],
    hooks: {
      beforeSave: async (ticket_history) => {
        ticket_history.ticket_history_generate = randomLetters(13);
      },
    },
  }
);
export default TicketHistory;
