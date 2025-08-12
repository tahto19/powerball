import { Op, Sequelize } from "sequelize";
import Users from "../../../models/Users.model.js";
import ExcelJS from "exceljs";
import PrizeList from "../../../models/PrizeList.model.js";
import TicketDetails from "../../../models/TicketDetails.model.js";
import TicketHistory from "../../../models/TicketHistory.model.js";
import {
  decryptData,
  decryptPassword,
  WhereFilters,
} from "../../../util/util.js";
import RaffleSchedule from "../../../models/RaffleSchedule.model.js";
import WiningDrawDetails from "../../../models/WiningDrawDetails.model.js";
import RaffleDetails from "../../../models/RaffleDetails.model.js";
import moment from "moment";
import AlphaCode from "../../../models/AlphaCode.js";
class Export_data_class {
  constructor() {}
  async getData(type, date_range, filter) {
    switch (type) {
      case 1:
        return await this.User_data(date_range);
      case 2:
        return await this.Costumer_data(date_range);
      case 3:
        return await this.Admin_data(date_range);
      case 4:
        return await this.prizeList_data(date_range);
      case 5:
        return await this.TicketDetails_data(date_range);
      case 6:
        return await this.TicketHistory_data(date_range);
      case 7:
        return await this.getRaffleEntries_data(date_range, filter);
      case 8:
        return await this.myRaffle_data(date_range, filter);
      case 9:
        return await this.GameMaintenance_data(date_range, filter);
      case 10:
        return await this.alpha_code_data(date_range);
      case 11:
        return await this.get_ticket_scanned(date_range);
    }
  }

  async User_data(date_range) {
    let where = date_range
      ? { createdAt: { [Op.between]: [date_range[0], date_range[1]] } }
      : {};
    let _r = await Users.findAll({
      where: where,
      attributes: [
        "fullname",
        "firstname",
        "lastname",
        "emailAddress",
        "mobileNumber",
        "createdAt",
        "birthdate",
      ],
    });
    let r = _r.map((v) => v.toJSON());
    return await this.toExcel(r, "Users");
  }
  async Costumer_data(date_range) {
    let where = date_range
      ? { createdAt: { [Op.between]: [date_range[0], date_range[1]] } }
      : { isAdmin: false };
    let _r = await Users.findAll({
      where: where,
      attributes: [
        "fullname",
        "firstname",
        "lastname",
        "emailAddress",
        "active",
        "mobileNumber",
        "createdAt",
        "birthdate",
      ],
    });
    let r = _r.map((v) => v.toJSON());
    return await this.toExcel(r, "Costumer");
  }
  async Admin_data(date_range) {
    let where = date_range
      ? { createdAt: { [Op.between]: [date_range[0], date_range[1]] } }
      : { isAdmin: true };
    let _r = await Users.findAll({
      where: where,
      attributes: [
        "lastname",
        "emailAddress",
        "birthdate",
        "active",
        "mobileNumber",
        "createdAt",
      ],
    });
    let r = _r.map((v) => v.toJSON());
    return await this.toExcel(r, "Admin");
  }
  async prizeList_data(date_range) {
    let where = date_range
      ? { createdAt: { [Op.between]: [date_range[0], date_range[1]] } }
      : {};
    let _r = await PrizeList.findAll({
      where: where,
    });
    let r = _r.map((v) => v.toJSON());
    return await this.toExcel(r, "Prize List");
  }
  async TicketDetails_data(date_range) {
    let where = date_range
      ? { createdAt: { [Op.between]: [date_range[0], date_range[1]] } }
      : {};
    let _r = await TicketDetails.findAll({
      where: where,
      include: [
        { model: Users, attributes: [] },
        { model: TicketHistory, attributes: [] },
      ],
      attributes: [
        "entries",
        "entries_used",
        "ticket_code",
        "VIN",
        "alpha_code",
        "active",
        "createdAt",
        [
          Sequelize.fn(
            "GROUP_CONCAT",
            Sequelize.col("ticket_histories.ticket_history_generate")
          ),
          "ticket_histories_combined",
        ],
        [Sequelize.col("User.firstname"), "firstName"],
        [Sequelize.col("User.lastname"), "lastName"],
      ],
      group: ["id"],
    });
    let r = _r.map((v) => {
      let val = v.toJSON();
      console.log(val);
      console.log(decryptPassword(val.firstName), "here");

      val["fullname"] =
        decryptPassword(val.firstName) + " " + decryptPassword(val.lastName);
      val["VIRN"] = val.VIN;

      delete val["VIN"];
      delete val["firstName"];
      delete val["lastName"];

      return val;
    });
    return await this.toExcel(r, "Scanned Tickets");
  }
  async TicketHistory_data(date_range) {
    let where = date_range
      ? { createdAt: { [Op.between]: [date_range[0], date_range[1]] } }
      : {};
    let _r = await TicketHistory.findAll({
      where: where,
    });
    let r = _r.map((v) => v.toJSON());
    return await this.toExcel(r, "Prize List");
  }
  async getRaffleEntries_data(dr, f) {
    let filters = WhereFilters(f);

    if (dr && dr[0])
      filters["$ticket_histories.createdAt$"] = {
        [Op.between]: [dr[0], dr[1]],
      };

    let _r = await RaffleSchedule.findAll({
      where: filters,
      include: [
        {
          model: TicketHistory,
          include: { model: WiningDrawDetails, required: false },
        },
      ],
    });
    let r = _r.map((v) => v.toJSON());
    let b = [];
    r.forEach((v) => {
      v.ticket_histories.forEach((vv) =>
        b.push({
          ticket_history_generate: vv.ticket_history_generate,
          wining: !!vv.wining_draw_detail,
          createdAt: vv.createdAt,
        })
      );
    });
    // return _r;
    return this.toExcel(b, "Ticket History in raffle");
  }
  async myRaffle_data(dr, f) {
    let filters = WhereFilters(f);

    if (dr && dr[0])
      filters["$ticket_histories.createdAt$"] = {
        [Op.between]: [dr[0], dr[1]],
      };
    let b = await Users.findAll({
      include: [{ model: TicketDetails, include: [{ model: TicketHistory }] }],
    });
    const toReturn = [];
    b.forEach((val1) => {
      const v1 = val1.toJSON();

      const temp = {};
      v1.ticket_details.forEach((v2) => {
        temp["ticket_code"] = v2.ticket_code;
        temp["Scanned Date"] = v2.createdAt;
        v2.ticket_histories.forEach((v3) => {
          temp["ticket_history_generate"] = v3.ticket_history_generate;
          temp["Particapate Date"] = v3.createdAt;
          toReturn.push(temp);
        });
      });
    });
    return this.toExcel(toReturn, "Entries");
  }
  async GameMaintenance_data(date_range) {
    let where = date_range
      ? { createdAt: { [Op.between]: [date_range[0], date_range[1]] } }
      : {};
    let _r = await RaffleDetails.findAll({
      where: where,
      attributes: [
        "starting_date",
        "end_date",
        "schedule_type",
        "createdAt",
        "updatedAt",
        "deletedAt",
      ],
    });
    let r = _r.map((v) => v.toJSON());
    return await this.toExcel(r, "Game Maintenance List");
  }
  async alpha_code_data(date_range) {
    let where = date_range
      ? { createdAt: { [Op.between]: [date_range[0], date_range[1]] } }
      : {};
    let r_ = await AlphaCode.findAll({
      attributes: ["name", "entries", "createdAt", "active"],
    });
    let r = r_.map((v) => v.toJSON());
    return await this.toExcel(r, "Game Maintenance List");
  }
  async get_ticket_scanned(date_range) {
    console.log(date_range);
    let r_ = await TicketDetails.findAll({
      where: {
        [Op.and]: [
          { createdAt: { [Op.gte]: date_range[0] } },
          { createdAt: { [Op.lte]: date_range[1] } },
        ],
      },
      include: [
        {
          model: TicketHistory,
        },
        {
          model: Users,
        },
      ],
      raw: true,
    });
    let toSend = [];
    for (const v of r_) {
      // let val = v.toJSON();
      // console.log(val);

      if (v.entries_used === 0) {
        // find if exists
        let f = toSend.find(
          (x) => x["ticket code"] === v.ticket_code && v.VIN === x["VN"]
        );

        if (f !== undefined) continue;
      } else {
        let f = toSend.filter(
          (x) => x["ticket code"] === v.ticket_code && v.VIN === x["VN"]
        );
        console.log(f);
        if (f.length > v.entries_used) continue;
      }
      let middleName = v["User.middlename"] || "";
      let temp = {
        "raffle code": v["ticket_histories.ticket_history_generate"] || "",
        "raffle joined": v["ticket_histories.createdAt"]
          ? moment(v["ticket_histories.createdAt"]).format(
              "MMMM DD yyyy hh:ss a"
            )
          : "",
        "ticket scanned": moment(v.createdAt).format("MMMM DD yyyy hh:ss a"),
        "ticket code": v.ticket_code,
        "Alpha Code": v.alpha_code,
        "Full Name":
          decryptPassword(v["User.firstname"]) +
          " " +
          middleName +
          " " +
          decryptPassword(v["User.lastname"]),
        VN: v.VIN,
        entries: v.entries,
        "entries used": v.entries_used,
      };
      toSend.push(temp);
    }

    return await this.toExcel(toSend, "Winners");
  }
  async toExcel(data, type) {
    var columns;
    if (data[0])
      columns = Object.keys(data[0]).map((v) => {
        return {
          header: this.changeDetails(v.toUpperCase()),
          key: v,
          width: 10,
        };
      });
    else throw new Error("no data found");
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(type);
    worksheet.columns = columns;
    data.forEach((v) => {
      let temp = v;
      let changeValue = Object.keys(v).forEach((vv) => {
        let val =
          v[vv] || v[vv] === 0 || v[vv] === false
            ? v[vv].toString()
            : "No Details";

        if (val.toUpperCase() === "TRUE") temp[vv] = "YES";
        else if (val.toUpperCase() === "FALSE") temp[vv] = "NO";
        else {
          if (
            moment(
              v[vv],
              "ddd MMM DD YYYY HH:mm:ss [GMT]Z (zz)",
              true
            ).isValid()
          )
            temp[vv] = moment(val).format("MMMM-DD-YYYY,hh:mm a");
          else temp[vv] = val;
        }
      });

      worksheet.addRow(temp);
    });
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer).toString("base64");
    // worksheet.columns = data;
    // console.log(data);
  }
  changeDetails(d) {
    switch (d) {
      case "TICKET_HISTORY_GENERATE":
        return "TICKET NUMBER";
      case "CREATEDAT":
        return "Created Date";
      default:
        return d;
    }
  }
}
export default new Export_data_class();
