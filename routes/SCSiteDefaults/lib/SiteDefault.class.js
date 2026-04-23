import Files from "../../../models/Files.model.js";
import { WhereFilters } from "../../../util/util.js";

class SiteDefault {
  constructor() {}

  async Insert(_data) {
    let create = await Files.create(_data);
    return create.id;
  }

  async Update(_data) {
    let count = await Files.count({ where: { id: _data.id } });
    if (count === 0) throw new Error("User Not found");
    const id = _data.id;
    delete _data.id;

    await Files.update(_data, { where: { id }, individualHooks: true });
    return id;
  }

  async FetchOne(filter) {
    if (filter.length === 0) throw new Error("ErrorCode X1");
    let query = {};
    query["where"] = WhereFilters(filter);

    let list = await Files.findOne(query);
    return list;
  }

  async FetchAll(sort = [["id", "ASC"]], filter = []) {
    if (filter.length === 0) throw new Error("ErrorCode X1");
    let query = {
      order: sort,
    };

    if (filter.length !== 0) query["where"] = WhereFilters(filter);

    // ✅ Fetch both filtered list and total count
    let { count, rows } = await Files.findAndCountAll(query);

    return { list: rows, total: count };
  }

  async Delete(id) {
    if (!id) throw new Error("Invalid ID");

    const count = await Files.count({ where: { id } });

    if (count === 0) throw new Error("Record not found");

    await Files.destroy({
      where: { id },
    });

    return { id };
  }
}

export default new SiteDefault();
