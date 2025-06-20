import { col, fn } from "sequelize";
import TicketDetails from "../../../models/TicketDetails.model.js";
import { WhereFilters } from "../../../util/util.js";

class TicketDetails_class {
  constructor() {}
  async Fetch(offset = 0, limit = 10, sort = [["id", "DESC"]], filter = []) {
    const sort_ = sort.length === 0 ? [["id", "DESC"]] : sort;
    let query = {
      limit: parseInt(limit),
      offset: parseInt(offset) * parseInt(limit),
      order: sort_,
    };

    if (filter.length !== 0) query["where"] = WhereFilters(filter);

    // ✅ Fetch both filtered list and total count
    let r = await TicketDetails.findAndCountAll();
    let { count, rows } = await TicketDetails.findAndCountAll(query);

    // let list = await TicketDetails.findAll(query);
    return { list: rows, count };
  }
  async FetchAll(sort = [["id", "ASC"]], filter = []) {
    let query = {
      order: sort,
    };

    if (filter.length !== 0) query["where"] = WhereFilters(filter);

    // ✅ Fetch both filtered list and total count
    let { count, rows } = await TicketDetails.findAndCountAll(query);

    // let list = await TicketDetails.findAll(query);
    return { list: rows, total: count };
  }
  async Insert(_data) {
    const create = await TicketDetails.create(_data);
    return create.id;
  }

  async Edit(_data) {
    let count = await TicketDetails.count({ where: { id: _data.id } });
    if (count < 0) throw new Error("User Not found");
    const id = _data.id;
    delete _data.id;

    await TicketDetails.update(_data, { where: { id }, individualHooks: true });

    return id;
  }
  async getTotalEntries(filter = []) {
    let query = {
      attributes: [
        [fn("SUM", col("entries")), "totalEntries"],
        [fn("SUM", col("entries_used")), "totalUsedEntries"],
        [fn("COUNT", col("id")), "totalTicket"],
      ],
      group: ["user_id"],
    };
    if (filter.length !== 0) query["where"] = WhereFilters(filter);

    let r = await TicketDetails.findAll(query);

    return r.length === 0
      ? [{ totalEntries: 0, totalUsedEntries: 0, totalTicket: 0, error: true }]
      : r;
  }
}

export default new TicketDetails_class();
