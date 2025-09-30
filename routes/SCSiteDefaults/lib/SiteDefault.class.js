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
}

export default new SiteDefault();
