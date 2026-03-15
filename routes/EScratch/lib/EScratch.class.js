import { WhereFilters } from "../../../util/util.js";
import Users from "../../../models/Users.model.js";
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
}

export default new User_class();
