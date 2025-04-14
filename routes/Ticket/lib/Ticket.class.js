import TicketDetails from "../../../models/ticketDetails.model.js";
import { WhereFilters } from "../../../util/util.js";

class TicketDetails_class {
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
}

export default new TicketDetails_class();
