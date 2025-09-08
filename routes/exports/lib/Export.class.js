import { fn, Op, Sequelize } from "sequelize";
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
import RafflePrize from "../../../models/RafflePrize.model.js";
import Files from "../../../models/Files.model.js";
import AuditTrail from "../../../models/AuditTrail.js";
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
        return await this.get_ticket_scanned_only(date_range);
      case 12:
        return await this.get_ticket_scanned_without_raffle_code(date_range);
      case 13:
        return await this.get_ticket_scanned_dont_include_no_details(
          date_range
        );
      case 14:
        return await this.get_ticket_scanned(date_range);
      case 15: {
        return await this.get_winners(date_range);
      }
      case 16: {
        // return await this.get_raffleDraw(date_range);
        return await this.get_raffleDraw_new(date_range);
      }
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
        "hbnandstr",
        "barangay",
        "province",
        "city",
      ],
    });
    let r = _r.map((v) => v.toJSON());
    return await this.toExcel(r, "Costumer");
  }
  async Admin_data(date_range) {
    let where = date_range
      ? {
          createdAt: { [Op.between]: [date_range[0], date_range[1]] },
          isAdmin: true,
        }
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
        ["details", "Raffle ID"],
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
      attributes: ["name", "entries", "createdAt", "active", "id"],
    });
    let r = [];
    for (let val of r_) {
      let v = val.toJSON();

      let getAuditTrail = await AuditTrail.findOne({
        attributes: [],
        where: {
          path: "/alphacode/insert",
          targetId: v.id,
          typeOfRequest: 1,
        },
        include: { model: Users },
      });
      let g = getAuditTrail?.toJSON();

      let getAuditJSON = g?.User?.fullname || null;
      v["created by"] = getAuditJSON;
      r.push(v);
    }
    // r_.map((v) => v.toJSON());
    return await this.toExcel(r, "Alpha Code List");
  }
  async get_ticket_scanned(date_range) {
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
          include: [
            {
              model: RaffleSchedule,
              include: [{ model: RaffleDetails, as: "raffleDetails" }],
            },
          ],
        },
        {
          model: Users,
        },
      ],
      raw: true,
    });
    let toSend = [];
    for (const v of r_) {
      // let v = val.toJSON();

      if (v.entries_used === 0) {
        // find if exists
        let f = toSend.find(
          (x) => x["ticket number"] === v.ticket_code && v.VIN === x["VIRN"]
        );

        if (f !== undefined) continue;
      } else {
        let f = toSend.filter(
          (x) => x["ticket number"] === v.ticket_code && v.VIN === x["VIRN"]
        );

        if (f.length > v.entries_used) continue;
      }
      let middleName = v["User.middlename"] || "";

      let temp = {
        "Raffle ID":
          v["ticket_histories.Raffle_Schedule.raffleDetails.details"] || "",
        "raffle Ticket": v["ticket_histories.ticket_history_generate"] || "",
        "raffle joined": v["ticket_histories.createdAt"]
          ? moment(v["ticket_histories.createdAt"]).format(
              "MMMM DD yyyy hh:ss a"
            )
          : "",
        "ticket scanned": moment(v.createdAt).format("MMMM DD yyyy hh:ss a"),
        "ticket number": v.ticket_code,
        "Alpha Code": v.alpha_code,
        "Full Name":
          decryptPassword(v["User.firstname"]) +
          " " +
          middleName +
          " " +
          decryptPassword(v["User.lastname"]),
        VIRN: v.VIN,
        entries: v.entries,
        "entries used": v.entries_used,
      };
      toSend.push(temp);
    }

    return await this.toExcel(toSend, "TICKET SCANNED");
  }
  async get_ticket_scanned_without_raffle_code(date_range) {
    let r_ = await TicketDetails.findAll({
      where: {
        [Op.and]: [
          { createdAt: { [Op.gte]: date_range[0] } },
          { createdAt: { [Op.lte]: date_range[1] } },
          { entries_used: { [Op.gte]: 1 } },
        ],
      },
      include: [
        {
          model: Users,
        },
        {
          model: TicketHistory,
          include: [
            {
              model: RaffleSchedule,
              include: [{ model: RaffleDetails, as: "raffleDetails" }],
            },
          ],
        },
      ],
      raw: true,
    });
    let toSend = [];
    for (const v of r_) {
      // find if exists

      let middleName = v["User.middlename"] || "";
      let temp = {
        "ticket scanned": moment(v.createdAt).format("MMMM DD yyyy hh:ss a"),
        "Raffle Ticket": v.ticket_code,
        " raffle ID":
          v["ticket_histories.Raffle_Schedule.raffleDetails.details"],
        // "Alpha Code": v.alpha_code,
        Active: v.active ? "Yes" : "No",
        "Full Name":
          decryptPassword(v["User.firstname"]) +
          " " +
          middleName +
          " " +
          decryptPassword(v["User.lastname"]),
        VIRN: v.VIN,
        entries: v.entries,
        "entries used": v.entries_used,
      };

      toSend.push(temp);
    }

    return await this.toExcel(toSend, "Ticket Scanned");
  }
  async get_ticket_scanned_dont_include_no_details(date_range) {
    let r_ = await TicketHistory.findAll({
      where: {
        [Op.and]: [
          { createdAt: { [Op.gte]: date_range[0] } },
          { createdAt: { [Op.lte]: date_range[1] } },
        ],
      },
      include: [
        {
          model: TicketDetails,
          include: [
            {
              model: Users,
            },
          ],
        },
        {
          model: RaffleSchedule,

          include: [{ model: RaffleDetails, as: "raffleDetails" }],
        },
      ],
    });
    let toSend = [];
    r_.forEach((val) => {
      let v = val.toJSON();

      let middleName = v["User.middlename"] || "";
      let temp = {
        "raffle Ticket": v.ticket_history_generate,
        "raffle joined": moment(v.createdAt).format("MMMM DD yyyy hh:ss a"),
        "Ticket number": v.ticket_detail.ticket_code,
        "Ticket Scanned": v.ticket_detail.createdAt,
        "Alpha Code": v.ticket_detail.alpha_code,
        "Full Name": v.ticket_detail.User.fullname,
        Active: v.ticket_detail.active ? "Yes" : "No",
        VIRN: v.VIN,
        entries: v.ticket_detail.entries,
        "entries used": v.ticket_detail.entries_used,
        "Raffle ID": v.Raffle_Schedule.raffleDetails.details,
        VIRN: v.ticket_detail.VIN,
      };
      toSend.push(temp);
    });
    return await this.toExcel(toSend, "Ticket Scanned");
  }
  async get_ticket_scanned_only(date_range) {
    let r_ = await TicketDetails.findAll({
      where: {
        [Op.and]: [
          { createdAt: { [Op.gte]: date_range[0] } },
          { createdAt: { [Op.lte]: date_range[1] } },
          { entries_used: { [Op.lte]: 0 } },
        ],
      },
      include: [
        {
          model: Users,
        },
      ],
    });
    let toSend = [];
    r_.forEach((val) => {
      let v = val.toJSON();

      let temp = {
        entries: v.entries,
        "entries used": v.entries_used,
        "Ticket number": v.ticket_code,
        "Date Scanned": v.createdAt,
        "Alpha Code": v.alpha_code,
        Active: v.active ? "Yes" : "No",
        fullname: v.User.fullname,
        VIRN: v.VIN,
      };
      toSend.push(temp);
    });
    return await this.toExcel(toSend, "Ticket Scanned");
  }
  async get_winners(date_range) {
    let r_ = await WiningDrawDetails.findAll({
      where: {
        [Op.and]: [
          { createdAt: { [Op.gte]: date_range[0] } },
          { createdAt: { [Op.lte]: date_range[1] } },
        ],
      },
      include: [
        {
          model: RafflePrize,
          include: [
            {
              model: RaffleSchedule,
              include: [{ model: RaffleDetails, as: "raffleDetails" }],
            },
            { model: PrizeList },
          ],
        },
        { model: TicketHistory },
        { model: TicketDetails, include: [{ model: Users }] },
        { model: Files },
      ],
    });
    let toSend = [];
    r_.forEach((val) => {
      let v = val.toJSON();

      let temp = {
        Name: v.ticket_detail.User.fullname,
        "Contact Number": v.ticket_detail.User.mobileNumber,
        "Email Address": v.ticket_detail.User.emailAddress,
        "Raffle Ticket": v.ticket_history.ticket_history_generate,
        "ticket number": v.ticket_detail.ticket_code,
        VIRN: v.ticket_detail.VIN,
        amount: v.Raffle_Prize.amount,
        "Raffle id": v.Raffle_Prize.Raffle_Schedule.raffleDetails.details,
        Date: v.Raffle_Prize.createdAt,
        claimed: v.file ? "YES" : "NO",
      };
      toSend.push(temp);
    });
    return await this.toExcel(toSend, "Winners");
  }
  async get_raffleDraw(date_range) {
    let r_ = await RaffleSchedule.findAll({
      where: {
        [Op.and]: [
          { createdAt: { [Op.gte]: date_range[0] } },
          { createdAt: { [Op.lte]: date_range[1] } },
          { status: 3 },
        ],
      },
      include: [
        { model: RaffleDetails, as: "raffleDetails" },
        {
          model: RafflePrize,
          as: "prizeInfo",
          include: [{ model: PrizeList }],
        },
      ],
    });

    let toSend = [];
    for (let val of r_) {
      let v = val.toJSON();
      let temp = {
        "Raffle Id": v.raffleDetails.details,
        "Draw raffle ticket": v.raffleDetails.draw_date,
        "Date Created": v.raffleDetails.createdAt,
      };

      for (let pVal of v.prizeInfo) {
        temp[`${pVal.Prize_List.name}`] = pVal.amount;
      }

      toSend.push(temp);
    }
    return await this.toExcel(toSend, "Raffle Draw");
  }
  async get_raffleDraw_new(date_range) {
    let r_ = await RaffleSchedule.findAll({
      where: {
        [Op.and]: [
          { createdAt: { [Op.gte]: date_range[0] } },
          { createdAt: { [Op.lte]: date_range[1] } },
          { status: "2" },
        ],
      },
      include: [
        { model: RaffleDetails, as: "raffleDetails" },
        {
          model: RafflePrize,
          as: "prizeInfo",
          include: [
            { model: PrizeList },
            {
              model: WiningDrawDetails,
              include: [
                {
                  model: TicketHistory,
                  include: [
                    { model: TicketDetails, include: [{ model: Users }] },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    let toSend = [];
    for (let val of r_) {
      let v = val.toJSON();

      let temp = { "Raffle Id": "", "Draw raffle ticket": "" };

      for (let pVal of v.prizeInfo) {
        const winning_ticket =
          pVal.wining_draw_detail?.ticket_history?.ticket_history_generate ||
          "Ticket not found";

        const winner = pVal.wining_draw_details
          ?.map((vv) => {
            return vv.ticket_history.ticket_detail?.User?.fullname;
          })
          .join("\n");
        const ticketsWinner = pVal.wining_draw_details
          ?.map((vv) => {
            return vv.ticket_history?.ticket_history_generate;
          })
          .join("\n");
        console.log(ticketsWinner);
        console.log(pVal.Prize_List.type === "grand" ? winner : "none", winner);
        temp["Raffle Id"] = v.raffleDetails.details;
        temp["Draw raffle ticket"] += ticketsWinner ? ticketsWinner : "";

        temp["Minor winner"] =
          pVal.Prize_List.type === "minor"
            ? winner
            : temp["Minor winner"]
            ? temp["Minor winner"]
            : null;
        temp["Major winner"] =
          pVal.Prize_List.type === "major"
            ? winner
            : temp["Major winner"]
            ? temp["Major winner"]
            : null;
        temp["Grands winner"] =
          pVal.Prize_List.type === "grand"
            ? winner
            : temp["Grands winner"]
            ? temp["Grands winner"]
            : null;

        temp["Date Created"] = v.raffleDetails.createdAt;
        temp["Draw Date"] = v.raffleDetails.draw_date;
      }

      toSend.push(temp);
    }

    return await this.toExcel(toSend, "Raffle Draw");
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
          ) {
            temp[vv] = moment(
              val,
              "ddd MMM DD YYYY HH:mm:ss [GMT]Z (zz)"
            ).format("MMMM-DD-YYYY,hh:mm a");
          } else temp[vv] = val;
        }
      });

      const row = worksheet.addRow(temp);
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        if (typeof cell.value === "string" && cell.value.includes("\n")) {
          cell.alignment = { wrapText: true };
        } else {
          cell.alignment = { horizontal: "center", vertical: "middle" };
        }
      });
    });
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer).toString("base64");
    // worksheet.columns = data;
  }
  changeDetails(d) {
    switch (d) {
      case "TICKET_CODE":
        return "TICKET NUMBER";
      case "TICKET_HISTORY_GENERATE":
        return "raffle ticket";
      case "CREATEDAT":
        return "Created Date";
      case "HBNANDSTR":
        return "House/Building Number and Street Name";
      default:
        return d;
    }
  }
}
export default new Export_data_class();
