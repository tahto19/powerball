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

  async Edit(_data) {
    let count = await PrizeList.count({ where: { id: _data.id } });
    if (count < 0) throw new Error("User Not found");
    const id = _data.id;
    delete _data.id;

    await PrizeList.update(_data, { where: { id }, individualHooks: true });

    return id;
  }
}

export default new PrizeList_class();
