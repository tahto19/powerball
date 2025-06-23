import { Op } from "sequelize";
import Users from "../../../models/Users.model.js";
import ExcelJS from "exceljs";
import PrizeList from "../../../models/PrizeList.model.js";
import TicketDetails from "../../../models/TicketDetails.model.js";
import TicketHistory from "../../../models/TicketHistory.model.js";
class Export_data_class {
  constructor() {}
  async getData(type, date_range) {
    console.log(type);
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
    return await this.toExcel(r, "Prize List");
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
  async toExcel(data, type) {
    var columns;
    if (data[0])
      columns = Object.keys(data[0]).map((v) => {
        return { header: v.toUpperCase(), key: v, width: 10 };
      });
    else throw new Error("no data found");
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(type);
    worksheet.columns = columns;
    data.forEach((v) => {
      worksheet.addRow(v);
    });
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer).toString("base64");
    // worksheet.columns = data;
    // console.log(data);
  }
}
export default new Export_data_class();
