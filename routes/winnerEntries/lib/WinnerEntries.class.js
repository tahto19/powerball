import { col, fn } from "sequelize";
import WiningDrawDetails from "../../../models/WiningDrawDetails.model.js";
import { WhereFilters } from "../../../util/util.js";
import RafflePrize from "../../../models/RafflePrize.model.js";
import TicketHistory from "../../../models/TicketHistory.model.js";
import RaffleSchedule from "../../../models/RaffleSchedule.model.js";
import RaffleDetails from "../../../models/RaffleDetails.model.js";

class WiningDrawDetails_class {
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
    let r = await WiningDrawDetails.findAndCountAll();
    let { count, rows } = await WiningDrawDetails.findAndCountAll(query);

    // let list = await WiningDrawDetails.findAll(query);
    return { list: rows, count };
  }
  async FetchOne(query) {
    let { count, rows } = await WiningDrawDetails.findAndCountAll(query);
    return { count, rows };
  }
  async FetchAll(sort = [["id", "ASC"]], filter = []) {
    let query = {
      order: sort,
    };

    if (filter.length !== 0) query["where"] = WhereFilters(filter);

    // ✅ Fetch both filtered list and total count
    let { count, rows } = await WiningDrawDetails.findAndCountAll(query);

    // let list = await WiningDrawDetails.findAll(query);
    return { list: rows.map((v) => v.toJSON()), total: count };
  }
  async Insert(_data) {
    const create = await WiningDrawDetails.create(_data);
    return create.id;
  }

  async Edit(_data) {
    let count = await WiningDrawDetails.count({ where: { id: _data.id } });
    if (count < 0) throw new Error("User Not found");
    const id = _data.id;
    delete _data.id;

    await WiningDrawDetails.update(_data, {
      where: { id },
      individualHooks: true,
    });

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

    let r = await WiningDrawDetails.findAll(query);
    return r;
  }
  async FetchWithInclude(body) {
    const { limit, sort, where, filter, url, offset } = body;
    var query = {
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: sort,
      include: [
        {
          model: RafflePrize,
          include: [
            {
              model: RaffleSchedule,
              include: [{ model: RaffleDetails, as: "raffleDetails" }],
            },
          ],
        },
        { model: TicketHistory },
      ],
    };
    var getFilters = filter;
    if (url !== undefined && url.includes("myWinners")) {
      // getFilters.push()
    }
    query["wheres"] = WhereFilters(getFilters);
    const { count, rows } = await WiningDrawDetails.findAndCountAll(query);
    return { count, list: rows.map((v) => v.toJSON()) };
  }
}

export default new WiningDrawDetails_class();
