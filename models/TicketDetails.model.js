import { DataTypes, Model } from "sequelize";
import conn from "../dbConnections/conn.js";

class TicketDetails extends Model {}

TicketDetails.init(
  {
    ticket_info: {
      allowNull: true,
      type: DataTypes.JSON,
    },
    entries: {
      allowNull: false,
      type: DataTypes.SMALLINT,
    },
    entries_used: {
      allowNull: false,
      type: DataTypes.SMALLINT,
      defaultValue: 0,
    },
    user_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: process.env.DB_PREFIX + "users",
        key: "id",
      },
    },
    active: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    alpha_code: {
      allowNull: false,
      type: DataTypes.TEXT("medium"),
    },
  },
  {
    timestamps: true,
    sequelize: conn.sequelize,
    modelName: "ticket_details",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "ticket_details",
    indexes: [{ name: "user_id_idx", fields: ["user_id"] }],
  }
);
export default TicketDetails;
