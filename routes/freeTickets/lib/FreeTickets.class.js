import { col, fn, literal, Op, where } from "sequelize";
import FreeTickets from "../../../models/FreeTickets.js";
import { WhereFilters } from "../../../util/util.js";
import moment from "moment";

class FreeTicket_class {
  constructor() {}
  async Insert(_data) {
    await FreeTickets.create(_data);
    return true;
  }
  async findAndCountPagination({
    filter = [],
    sort = [["id", "DESC"]],
    offset = 0,
    limit = 10,
    include = [],
    attributes = null,
  }) {
    let query = { sort, offset: limit * offset, limit };
    query["where"] = WhereFilters(filter);
    console.log(include);
    query["include"] = include;
    if (attributes) query["attributes"] = attributes;
    let r_ = await FreeTickets.findAndCountAll(query);

    const { count, rows } = r_;
    return {
      list: rows.map((v) => v.toJSON()),
      count,
    };
  }
  async patch(_data) {
    await FreeTickets.update(_data, { where: { id: _data.id } });
  }
  async findDate_range() {
    const targetDate = moment().toISOString();
    console.log(targetDate);
    let a = await FreeTickets.findAll({
      where: {
        [Op.and]: [
          where(
            literal(
              "CAST(JSON_UNQUOTE(JSON_EXTRACT(`date_range`, '$[0]')) AS DATETIME)"
            ),
            { [Op.lte]: targetDate }
          ),
          where(
            literal(
              "CAST(JSON_UNQUOTE(JSON_EXTRACT(`date_range`, '$[1]')) AS DATETIME)"
            ),
            { [Op.gte]: targetDate }
          ),
        ],
      },
    });

    return a;
  }
}
export default new FreeTicket_class();
