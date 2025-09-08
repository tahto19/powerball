import { col, fn } from "sequelize";
import WiningDrawDetails from "../../../models/WiningDrawDetails.model.js";
import { WhereFilters } from "../../../util/util.js";
import RafflePrize from "../../../models/RafflePrize.model.js";
import TicketHistory from "../../../models/TicketHistory.model.js";
import RaffleSchedule from "../../../models/RaffleSchedule.model.js";
import RaffleDetails from "../../../models/RaffleDetails.model.js";
import PrizeList from "../../../models/PrizeList.model.js";
import TicketDetails from "../../../models/TicketDetails.model.js";
import Users from "../../../models/Users.model.js";
import Files from "../../../models/Files.model.js";

class WiningDrawDetails_class {
  constructor() {}
  async Fetch(offset = 0, limit = 10, sort = [["id", "ASC"]], filter = []) {
    let query = {
      limit: parseInt(limit),
      offset: parseInt(offset) * parseInt(limit),
      order: sort,
    };

    if (filter.length !== 0) query["where"] = WhereFilters(filter);

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
      offset: parseInt(offset) * parseInt(limit),
      order: sort,
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
    };
    var getFilters = filter;

    // if (url !== undefined && url.includes("myWinners")) {
    //   // getFilters.push()
    // }

    query["where"] = WhereFilters(getFilters);

    const { count, rows } = await WiningDrawDetails.findAndCountAll(query);
    console.log(count);
    return {
      count,
      list: rows.map((v) => {
        console.log("##############");
        console.log(v.toJSON());
        console.log("##############");
        return v.toJSON();
      }),
    };
  }
  async getWinnersPerSchedule(
    id,
    sort = [],
    limit = 50,
    offset = 0,
    filters = []
  ) {
    var query = {
      limit: parseInt(limit),
      offset: parseInt(offset) * parseInt(limit),
      order: sort,

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
      ],
    };

    if (id)
      filters.push({
        filter: id,
        type: "number",
        field: "$Raffle_Prize.raffle_schedule_id$",
      });

    query["where"] = WhereFilters(filters);

    const _r = await WiningDrawDetails.findAndCountAll(query);
    const { count, rows } = _r;

    return { list: rows.map((v) => v.toJSON()), count };
  }
}
export default new WiningDrawDetails_class();
