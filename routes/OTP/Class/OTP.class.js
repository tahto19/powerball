import { generateRandomNumber, WhereFilters } from "../../../util/util.js";

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
    return list;
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
    return create;
  }
  async Edit(_data) {
    let count = await OTP.findByPk(_data.id);
    if (!count) throw new Error("User Not found");
    Object.keys(_data).forEach((v) => {
      if (v !== "id") count[v] = _data[v];
    });

    // let a = await OTP.update(_data, { where: { id }, individualHooks: true });
    let a = await count.save();
    return a;
  }
  async FetchOne(filter) {
    if (filter.length === 0) throw new Error("ErrorCode X1");
    let query = {};
    query["where"] = WhereFilters(filter);
    console.log(query["where"]);
    let list = await OTP.findOne(query);
    return list;
  }
  async findAndUpdateAuth(data) {
    let getOTP = await this.FetchOne([
      { filter: data.id, field: "id", type: "number" },
      { filter: data.code, field: "code", type: "number" },
    ]);
    if (getOTP === null) throw new Error("ERRORCODE x58");
    let _data = getOTP.toJSON();
    _data.auth = true;
    // if (!getOTP) throw new Error("ErrorCode x58");
    const a = await this.Edit(_data);
    return a;
  }
  async findAndUpdateAuthV2(data) {
    let getOTP = await this.FetchOne([
      { filter: data.id, field: "id", type: "number" },
      { filter: data.code, field: "code", type: "number" },
      { filter: false, field: "auth", type: "boolean" },
    ]);
    if (getOTP === null) throw new Error("ERRORCODE x58");
    let _data = getOTP.toJSON();
    _data.auth = true;
    // if (!getOTP) throw new Error("ErrorCode x58");
    const a = await this.Edit(_data);
    return a;
  }
  async upsert(filter, data) {
    let list = await this.FetchOne(filter);
    if (list === null) {
      let id = await this.Insert(data);

      return id.toJSON();
    } else {
      let b = { ...list.toJSON() };
      if (!b.auth) b.code = generateRandomNumber().toString();
      const a = await this.Edit(b);
      return a.toJSON();
    }
  }
}

export default new OTP_class();
