import PasswordResets from "../../../models/PasswordResets.model.js";
import { WhereFilters } from "../../../util/util.js";
import Users from "../../../models/Users.model.js";

class PasswordResets_class {
  constructor() {}
  async Insert(_data) {
    const create = await PasswordResets.create(_data);
    return create;
  }
  async Edit(_data) {
    const id = _data.id;
    delete _data.id;
    await PasswordResets.update(_data, {
      where: { id },
    });

    // Fetch the updated row as a model instance
    const updatedInstance = await PasswordResets.findByPk(id, {
      include: [
        {
          model: Users,
          attributes: ["firstname", "emailAddress"],
          required: true,
        },
      ],
    });

    return updatedInstance;
  }
  async EditBulk(_data, w) {
    const id = _data.id;
    delete _data.id;
    const updated = await PasswordResets.update(_data, {
      where: w,
    });

    return updated;
  }
  async FindUser(filter = []) {
    let query = {};
    if (filter.length !== 0) query["where"] = WhereFilters(filter);

    // ✅ Fetch both filtered list and total count
    let row = await Users.findOne(query);

    // let list = await PrizeList.findAll(query);
    return row;
  }

  async Find(filter = []) {
    let query = {};
    if (filter.length !== 0) query["where"] = WhereFilters(filter);

    let row = await PasswordResets.findOne(query);
    return row;
  }
}

export default new PasswordResets_class();
