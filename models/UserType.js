import { DataTypes, Model } from "sequelize";
import conn from "../dbConnections/conn.js";

class UserType extends Model {}

UserType.init(
  {
    Name: {
      allowNull: false,
      type: DataTypes.TEXT("short"),
    },
    active: {
      allowNull: true,
      defaultValue: true,
      type: DataTypes.BOOLEAN,
    },
    permissions: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      get() {
        let val = this.getDataValue("permissions");
        return !val ? null : JSON.parse(val);
      },
      set(val) {
        this.setDataValue("permissions", JSON.stringify(val));
      },
    },
    // createdBy: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: process.env.DB_PREFIX + "users",
    //     key: "id",
    //   },
    // },
  },
  {
    timestamps: true,
    sequelize: conn.sequelize,
    modelName: "user_type",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "user_type",
  }
);
export default UserType;
