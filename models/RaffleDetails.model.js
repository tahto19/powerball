import "dotenv/config";
import conn from "../dbConnections/conn.js";
import { Model, DataTypes } from "sequelize";

class RaffleDetails extends Model {}

RaffleDetails.init(
  {
    details: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: "unique_details",
        msg: "Raffle ID must be unique",
      },
      validate: {
        notNull: {
          msg: "Please enter Raffle ID",
        },
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please enter Raffle Name",
        },
      },
    },
    alpha_code: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
      // defaultValue: null,
      validate: {
        notNull: {
          msg: "Please enter Alpha Code",
        },
      },
      get() {
        const code = this.getDataValue("alpha_code");
        if (!code || code.trim() === "") {
          return [];
        }
        return JSON.parse(code);
      },
      set(val) {
        this.setDataValue("alpha_code", JSON.stringify(val));
      },
    },
    more_details: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    draw_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please enter Draw Date",
        },
      },
    },
    starting_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please enter Starting Date",
        },
      },
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    schedule_type: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please enter Schedule Type",
        },
      },
    },
  },
  {
    timestamps: true,
    sequelize: conn.sequelize,
    modelName: "Raffle_Details",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "raffle_details",
    indexes: [
      { name: "raffle_details_idx", fields: ["id"] },
      { unique: true, name: "unique_details_idx", fields: ["details"] },
    ],
    beforeCreate(raffle, options) {
      const timestamp = new Date()
        .toISOString()
        .replace(/[-T:.Z]/g, "")
        .slice(0, 14);
      const id = `RID-${timestamp}`;
      raffle.details = id;
    },
  }
);
RaffleDetails.after;
RaffleDetails.afterCreate(async (raffle, options) => {
  const timestamp = new Date()
    .toISOString()
    .replace(/[-T:.Z]/g, "")
    .slice(0, 14); // UTC+8, plus 8 hours in local time

  const tid = Math.floor(raffle.id);
  const finalId = `RID-${timestamp}-${tid.toString().padStart(6, "0")}`;
  await raffle.update({ details: finalId });
});

export default RaffleDetails;
