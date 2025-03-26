import PrizeList from "../../../models/PrizeList.model.js";

class PrizeList_class {
  constructor() {}

  async Insert(_data) {
    const create = await PrizeList.create(_data);
    return create.id;
  }
}

export default new PrizeList_class();
