import { WhereFilters } from "../../../util/util.js";
import Users from "../../../models/Users.model.js";
import TicketDetails from "../../../models/TicketDetails.model.js";

class User_class {
  constructor() {}
  async FetchOne(filter) {
    if (filter.length === 0) throw new Error("ErrorCode X1");
    let query = {
      attributes: ["id", "mobileNumber"],
    };
    query["where"] = WhereFilters(filter);

    let list = await Users.findAll(query);

    return list.length > 0 ? list[0] : null;
  }

  async Edit(_data) {
    let count = await TicketDetails.count({ where: { id: _data.id } });
    if (count < 0) throw new Error("User Not found");
    const id = _data.id;
    delete _data.id;

    await TicketDetails.update(_data, { where: { id }, individualHooks: true });

    return id;
  }

  async FetchTicketDetails(filter = []) {
    let query = {
      order: [["id", "ASC"]],
    };

    if (filter.length !== 0) query["where"] = WhereFilters(filter);
    let { count, rows } = await TicketDetails.findAndCountAll(query);

    return { list: rows, total: count };
  }
}

export default new User_class();
