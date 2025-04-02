import "dotenv/config";
import conn from "../dbConnections/conn";
import { Model, DataTypes } from "sequelize";

class RaffleDetails extends Model {}

RaffleDetails.init(
  {
    details: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: {
          msg: "Please enter Raffle ID",
        },
      },
    },
    more_details: {
      allowNull: true,
      type: DataTypes.STRING,
      defaultValue: null,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    starting_date: {
      allowNull: false,
      type: DataTypes.DATE,
      validate: {
        notNull: {
          msg: "Please enter Starting Date",
        },
      },
    },
    end_date: {
      allowNull: true,
      type: DataTypes.DATE,
      defaultValue: null,
    },
    schedule_type: {
      allowNull: false,
      type: DataTypes.BIGINT,
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
    modelName: "Raffle Details",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "raffle_details",
    indexes: [{ name: "raffle_details_idx", fields: ["id"] }],
  }
);
