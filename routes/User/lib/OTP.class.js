import { WhereFilters } from "../../../util/util.js";

import OTP from "../../../models/OTP.model.js";
class OTP_class {
  constructor() {}
  async Fetch(offset = 0, limit = 10, sort = [["id", "ASC"]], filter = []) {
    let query = {
      limit: parseInt(limit),
      offset: parseInt(offset),
      sort: sort,
    };
    if (filter.length !== 0) query["where"] = WhereFilters(filter);

    let list = await OTP.findAll(query);
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
      offset: parseInt(offset),
      sort: sort,
    };
    if (filter.length !== 0) query["where"] = WhereFilters(filter);
    let list = await Users.findAndCountAll(query);
    return { list };
  }
  async Insert(_data) {
    let create = await OTP.create(_data);
    return create.id;
  }
  async Edit(_data) {
    let count = await OTP.count({ where: { id: _data.id } });
    if (count < 0) throw new Error("User Not found");
    const id = _data.id;
    delete _data.id;

    await OTP.update(_data, { where: { id }, individualHooks: true });

    return id;
  }
  async FetchOne(filter) {
    if (filter.length === 0) throw new Error("ErrorCode X1");
    let query = {};
    query["where"] = WhereFilters(filter);

    let list = await OTP.findOne(query);
    return { list };
  }
}

export default new OTP_class();
