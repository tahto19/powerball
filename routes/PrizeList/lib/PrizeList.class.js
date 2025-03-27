import PrizeList from "../../../models/PrizeList.model.js";
import { WhereFilters } from "../../../util/util.js";

class PrizeList_class {
  constructor() {}
  async Fetch(offset = 0, limit = 10, sort = [["id", "ASC"]], filter = []) {
    let query = {
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: sort,
    };
    if (filter.length !== 0) query["where"] = WhereFilters(filter);

    // ✅ Fetch both filtered list and total count
    let { count, rows } = await PrizeList.findAndCountAll(query);

    // let list = await PrizeList.findAll(query);
    return { list: rows, total: count };
  }
  async Insert(_data) {
    const create = await PrizeList.create(_data);
    return create.id;
  }
}

export default new PrizeList_class();
