import { Op } from "sequelize";
import Users from "../../../models/Users.model.js";
import ExcelJS from "exceljs";
import PrizeList from "../../../models/PrizeList.model.js";
import TicketDetails from "../../../models/TicketDetails.model.js";
import TicketHistory from "../../../models/TicketHistory.model.js";
import { WhereFilters } from "../../../util/util.js";
import RaffleSchedule from "../../../models/RaffleSchedule.model.js";
import WiningDrawDetails from "../../../models/WiningDrawDetails.model.js";
import RaffleDetails from "../../../models/RaffleDetails.model.js";
import moment from "moment";
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
    }
  }

  async User_data(date_range) {
    let where = date_range
      ? { createdAt: { [Op.between]: [date_range[0], date_range[1]] } }
      : {};
    let _r = await Users.findAll({
      where: where,
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
    });
    let r = _r.map((v) => v.toJSON());
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
    console.log(filters, "here");
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
        let val = v[vv].toString();

        if (val.toUpperCase() === "TRUE") temp[vv] = "YES";
        else if (val.toUpperCase() === "FALSE") temp[vv] = "NO";
        else {
          if (moment(val).isValid())
            temp[vv] = moment(val).format("MMMM-DD-YYYY,hh:mm a");
          else temp[vv] = val;
        }
      });
      console.log(temp);
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
