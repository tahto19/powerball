import { WhereFilters } from "../../../util/util.js";
import Users from "../../../models/Users.model.js";
import Files from "../../../models/Files.model.js";
import { col, fn } from "sequelize";
import TicketDetails from "../../../models/TicketDetails.model.js";
import UserType from "../../../models/UserType.js";
class User_class {
  constructor() {}
  async Fetch(offset = 0, limit = 10, sort = [["id", "ASC"]], filter = []) {
    let query = {
      limit: parseInt(limit),
      offset: parseInt(offset) * parseInt(limit),
      sort: sort,
    };
    if (filter.length !== 0) query["where"] = WhereFilters(filter);

    let list = await Users.findAll(query);
    return { list };
  }
  async FetchAndCount(
    offset = 0,
    limit = 10,
    sort = [["id", "ASC"]],
    filter = []
  ) {
    let query = {
      limit: parseInt(limit),
      offset: parseInt(offset) * parseInt(limit),
      sort: sort,
    };
    if (filter && filter.length !== 0) query["where"] = WhereFilters(filter);
    let list = await Users.findAndCountAll(query);
    return { list };
  }
  async Insert(_data) {
    let create = await Users.create(_data);
    return create.id;
  }
  async Edit(_data) {
    let count = await Users.count({ where: { id: _data.id } });
    if (count < 0) throw new Error("User Not found");
    const id = _data.id;
    delete _data.id;
    if (_data.password === "") {
      delete _data.password;
    }
    if (_data.isAdmin) {
      Object.keys(_data).forEach((v) => {
        let val = _data[v];
        if (val === "" || !val) {
          delete _data[v];
        }
      });
    }
    await Users.update(_data, {
      where: { id },
      individualHooks: true,
      fields: Object.keys(_data),
    });

    return id;
  }
  async FetchOne(filter) {
    if (filter.length === 0) throw new Error("ErrorCode X1");
    let query = {
      include: [
        {
          model: Files,
          as: "fileInfo",
          required: false,
        },
        {
          model: TicketDetails,
          attributes: [
            [fn("SUM", col("entries")), "totalEntries"],
            [fn("SUM", col("entries_used")), "totalUsedEntries"],
          ],
          required: false,
        },
        {
          model: UserType,
          as: "myUserType",
        },
      ],
      attributes: [
        [fn("SUM", col("entries")), "totalEntries"],
        [fn("SUM", col("TicketDetails.entries_used")), "totalUsedEntries"],
      ],
      distinct: true, // ensure proper count when joins are present
      group: ["Users.id"], // group by user to get correct counts
    };
    query["where"] = WhereFilters(filter);
    console.log(query["where"], filter);
    let list = await Users.findAll(query);

    return list.length > 0 ? list[0] : null;
  }
  async FetchOneV2(filter) {
    var query = {};
    query["where"] = WhereFilters(filter);
    let list = await Users.findOne(query);
    return list.length > 0 ? list[0] : null;
  }
}

export default new User_class();
