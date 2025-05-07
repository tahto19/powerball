import "dotenv/config";
import conn from "../dbConnections/conn.js";
import { Model, DataTypes } from "sequelize";

class AuditTrail extends Model {}

AuditTrail.init(
  {
    performedBy: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: process.env.DB_PREFIX + "users",
        key: "id",
      },
    },
    changes: {
      type: DataTypes.TEXT("medium"),
      allowNull: true,
      get() {
        return this.getDataValue("changes");
      },
      set(val) {
        this.setDataValue("changes", JSON.stringify(val));
      },
    },
    targetId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    errorDetails: {
      allowNull: true,
      type: DataTypes.TEXT("medium"),
      default: null,
    },
    statusText: {
      type: DataTypes.VIRTUAL,
      get() {
        const status = this.getDataValue("status");
        switch (status) {
          case 0:
            return "loading";
          case 1:
            return "success";
          case 2:
            return "error";
        }
      },
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
    },
    typeOfRequest: {
      allowNull: false,
      type: DataTypes.TINYINT,
    },
    typeOfRequestText: {
      type: DataTypes.VIRTUAL,
      get() {
        let getTypeOfRequest = this.getDataValue("typeOfRequest");
        switch (getTypeOfRequest) {
          case 1:
            return "POST";
          case 2:
            return "PUT";
          case 3:
            return "DELETE";
        }
      },
    },
    path: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: true,
    sequelize: conn.sequelize,
    modelName: "Audit_trail",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "audit_trail",
  }
);

export default AuditTrail;
