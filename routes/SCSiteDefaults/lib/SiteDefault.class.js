import Files from "../../../models/Files.model.js";
import { WhereFilters } from "../../../util/util.js";

class SiteDefault {
  constructor() {}

  async Insert(_data) {
    let create = await Files.create(_data);
    return create.id;
  }

  async FetchOne(filter) {
    if (filter.length === 0) throw new Error("ErrorCode X1");
    let query = {};
    query["where"] = WhereFilters(filter);
    console.log(query);
    let list = await Files.findOne(query);
    return list;
  }
}

export default new SiteDefault();
