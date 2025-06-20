import { WhereFilters } from "../../../util/util.js";
import Users from "../../../models/Users.model.js";
import Files from "../../../models/Files.model.js";

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
      ],
    };
    query["where"] = WhereFilters(filter);
    let list = await Users.findOne(query);
    return list;
  }
}

export default new User_class();
