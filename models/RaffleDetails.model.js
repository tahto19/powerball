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
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please enter Alpha Code",
        },
      },
      get() {
        if (this.getDataValue("alpha_code").trim() !== "") {
          return this.getDataValue("alpha_code").toUpperCase();
        }
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
  }
);
export default RaffleDetails;
