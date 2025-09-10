import { DataTypes, Model } from "sequelize";
import conn from "../dbConnections/conn.js";

class FreeTickets extends Model {}

FreeTickets.init(
  {
    user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      required: true,
      references: {
        model: process.env.DB_PREFIX + "users",
        key: "id",
      },
    },

    active: {
      type: DataTypes.BOOLEAN,
      default: true,
    },
    value: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      required: true,
      default: 0,
    },
    fixed: {
      type: DataTypes.BOOLEAN,

      default: false,
    },
    date_range: {
      allowNull: false,
      required: true,
      type: DataTypes.JSON,
    },
  },
  {
    timestamps: true,
    sequelize: conn.sequelize,
    modelName: "free_tickets",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "free_tickets",
    indexes: [{ name: "date_range_idx", fields: ["date_range"] }],
    // beforeCreate(raffle, options) {
    //   const timestamp = new Date()
    //     .toISOString()
    //     .replace(/[-T:.Z]/g, "")
    //     .slice(0, 14);
    //   const id = `RID-${timestamp}`;
    //   raffle.details = id;
    // },
  }
);
export default FreeTickets;
