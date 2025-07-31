import AlphaCode from "../../../models/AlphaCode.js";
import { WhereFilters } from "../../../util/util.js";

class alphaCode_class {
  constructor() {}
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

    let list = await AlphaCode.findAndCountAll(query);

    return { list };
  }
  async Insert(data) {
    console.log(data);
    let a = await AlphaCode.create(data);
    return a;
  }
  async FetchOne(filter = []) {
    let query = {};
    if (filter && filter.length !== 0) query["where"] = WhereFilters(filter);
    let list = await AlphaCode.findOne(query);
    return list;
  }
  async Update(filter, data) {
    if (filter.length === 0) throw new Error("No Filter");
    let where = WhereFilters(filter);

    let a = await AlphaCode.update(data, { where });
    return a;
  }
  async FetchAll() {
    let a = await AlphaCode.find({ where: { active: true } });
    return a;
  }
}
export default new alphaCode_class();
