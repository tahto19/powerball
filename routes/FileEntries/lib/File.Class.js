import Files from "../../../models/Files.model.js";
import { WhereFilters } from "../../../util/util.js";

class File_class {
  constructor() {}

  async InsertImage(_data) {
    let create = await Files.create(_data);
    return create.id;
  }

  async Fetch(offset = 0, limit = 10, sort = [["id", "ASC"]], filter = []) {
    let query = {
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: sort,
    };

    if (filter.length !== 0) query["where"] = WhereFilters(filter);
    console.log(query);
    // ✅ Fetch both filtered list and total count
    let { count, rows } = await Files.findAndCountAll(query);

    return {
      list: rows.map((v) => {
        let val = v.toJSON();
        console.log(val);
        return val;
      }),
      total: count,
    };
  }

  async FetchOne(filter) {
    if (filter.length === 0) throw new Error("ErrorCode X1");
    let query = {};
    query["where"] = WhereFilters(filter);
    console.log(query);
    let list = await Files.findOne(query);
    return list;
  }

  async UpdateImage(_data) {
    let count = await Files.count({ where: { id: _data.id } });
    if (count === 0) throw new Error("User Not found");
    const id = _data.id;
    delete _data.id;

    await Files.update(_data, { where: { id }, individualHooks: true });
    return id;
  }
}

export default new File_class();
