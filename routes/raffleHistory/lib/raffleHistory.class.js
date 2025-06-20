import { col, fn } from "sequelize";
import TicketHistory from "../../../models/TicketHistory.model.js";
import { WhereFilters } from "../../../util/util.js";
import WiningDrawDetails from "../../../models/WiningDrawDetails.model.js";
import TicketDetails from "../../../models/TicketDetails.model.js";
import Users from "../../../models/Users.model.js";
import RaffleSchedule from "../../../models/RaffleSchedule.model.js";
import RaffleDetails from "../../../models/RaffleDetails.model.js";

class TicketHistory_class {
  constructor() {}
  async Fetch(offset = 0, limit = 10, sort = [["id", "ASC"]], filter = []) {
    let query = {
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: sort,
    };

    if (filter.length !== 0) query["where"] = WhereFilters(filter);

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
    return { list: rows.map((v) => v.toJSON()), total: count };
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
  async fetchTicketsInRaffle(id) {
    if (!id) throw new Error("ErrorCODE x098");
    let { count, rows } = await TicketHistory.findAndCountAll({
      where: { raffle_id: id, "$wining_draw_detail.id$": null },
      include: [
        {
          model: WiningDrawDetails,
          required: false,
        },
      ],
    });

    if (count <= 0) throw new Error("x675");
    return { list: rows.map((v) => v.toJSON()), count };
  }
  async FetchWithInclude(
    offset = 0,
    limit = 10,
    sort = [["id", "DESC"]],
    filter = []
  ) {
    let query = {
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: sort.length === 0 ? [["id", "DESC"]] : sort,
    };

    if (filter.length !== 0) query["where"] = WhereFilters(filter);
    query["include"] = [
      {
        model: TicketDetails,
        // required: true,
        include: [
          {
            model: Users,
          },
        ],
      },
      {
        model: RaffleSchedule,
        // alias: "raffleSchedule",
        include: [{ model: RaffleDetails, as: "raffleDetails" }],
      },
      { model: WiningDrawDetails, required: false },
    ];
    // ✅ Fetch both filtered list and total count

    let { count, rows } = await TicketHistory.findAndCountAll(query);

    // let list = await TicketDetails.findAll(query);
    return { list: rows.map((v) => v.toJSON()), count };
  }
}

export default new TicketHistory_class();
