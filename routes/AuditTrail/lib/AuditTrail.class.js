import AuditTrail from "../../../models/AuditTrail.js";

class AuditTrail_class {
  constructor() {}
  async Fetch(offset = 0, limit = 10, sort = [["id", "ASC"]], filter = []) {
    let query = {
      limit: parseInt(limit),
      offset: parseInt(offset) * parseInt(limit),
      order: sort,
    };

    if (filter.length !== 0) query["where"] = WhereFilters(filter);

    // ✅ Fetch both filtered list and total count
    let { count, rows } = await AuditTrail.findAndCountAll(query);

    // let list = await AuditTrail.findAll(query);
    return { list: rows, total: count };
  }
  async FetchAll(sort = [["id", "ASC"]], filter = []) {
    let query = {
      order: sort,
    };

    if (filter.length !== 0) query["where"] = WhereFilters(filter);

    // ✅ Fetch both filtered list and total count
    let { count, rows } = await AuditTrail.findAndCountAll(query);

    // let list = await AuditTrail.findAll(query);
    return { list: rows, total: count };
  }
  async Insert(_data) {
    const create = await AuditTrail.create(_data);
    return create.id;
  }

  async Edit(_data) {
    let count = await AuditTrail.count({ where: { id: _data.id } });
    if (count < 0) throw new Error("User Not found");
    const id = _data.id;
    delete _data.id;

    await AuditTrail.update(_data, { where: { id }, individualHooks: true });

    return id;
  }
}
export default new AuditTrail_class();
