import { col, fn } from "sequelize";
import TicketHistory from "../../../models/TicketHistory.model.js";
import { WhereFilters } from "../../../util/util.js";
import TicketHistory from "../../../models/TicketHistory.model.js";

class TicketHistory_class {
  constructor() {}
  async Fetch(offset = 0, limit = 10, sort = [["id", "ASC"]], filter = []) {
    let query = {
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: sort,
    };

    if (filter.length !== 0) query["where"] = WhereFilters(filter);
    console.log(query);
    // ✅ Fetch both filtered list and total count
    let r = await TicketHistory.findAndCountAll();
    let { count, rows } = await TicketHistory.findAndCountAll(query);

    // let list = await TicketHistory.findAll(query);
    return { list: rows, count };
  }
  async FetchAll(sort = [["id", "ASC"]], filter = []) {
    let query = {
      order: sort,
    };

    if (filter.length !== 0) query["where"] = WhereFilters(filter);

    // ✅ Fetch both filtered list and total count
    let { count, rows } = await TicketHistory.findAndCountAll(query);

    // let list = await TicketHistory.findAll(query);
    return { list: rows, total: count };
  }
  async Insert(_data) {
    const create = await TicketHistory.create(_data);
    return create.id;
  }

  async Edit(_data) {
    let count = await TicketHistory.count({ where: { id: _data.id } });
    if (count < 0) throw new Error("User Not found");
    const id = _data.id;
    delete _data.id;

    await TicketHistory.update(_data, { where: { id }, individualHooks: true });

    return id;
  }
  async getTotalEntries(filter = []) {
    let query = {
      attributes: [
        [fn("SUM", col("entries")), "totalEntries"],
        [fn("SUM", col("entries_used")), "totalUsedEntries"],
        [fn("SUM", col("id")), "totalTicket"],
      ],
      group: ["user_id"],
    };
    if (filter.length !== 0) query["where"] = WhereFilters(filter);

    let r = await TicketHistory.findAll(query);
    return r;
  }
}

export default new TicketHistory_class();
