import RaffleDetails from "../../../models/RaffleDetails.model.js";
import RafflePrize from "../../../models/RafflePrize.model.js";
import RaffleSchedule from "../../../models/RaffleSchedule.model.js";
import { WhereFilters } from "../../../util/util.js";

/**
 * Filter structure:
 * [{filter:"", field:"", type:""}]
 */

class Raffle_class {
  constructor() {}

  async Insert(_data) {
    const amount = _data.amount;

    delete _data.id;
    delete _data.amount;

    const createRaffleDetails = await RaffleDetails.create(_data);

    //======== Create Raffle schedule data ===============//
    const scheduleData = {
      raffle_id: createRaffleDetails.id,
      schedule_date: _data.starting_date,
    };

    const createRaffleSchedule = await RaffleSchedule.create(scheduleData);

    //======== Create Raffle prize data ===============//
    const prizeData = {
      raffle_schedule_id: createRaffleSchedule.id,
      prize_id: _data.prize_id,
      amount: amount,
    };
    const createRafflePrizeInfo = await RafflePrize.create(prizeData);

    return createRaffleDetails.id;
  }

  async FetchOne(filter) {
    if (filter.length === 0) throw new Error("ErrorCode X1");
    let query = {};
    query["where"] = WhereFilters(filter);
    let list = await RaffleDetails.findOne(query);
    return list;
  }

  async Fetch(offset = 0, limit = 10, sort = [["id", "ASC"]], filter = []) {
    let query = {
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: sort,
    };

    if (filter.length !== 0) query["where"] = WhereFilters(filter);

    // ✅ Fetch both filtered list and total count
    let { count, rows } = await RaffleDetails.findAndCountAll(query);

    return { list: rows, total: count };
  }
  async FetchAll(sort = [["id", "ASC"]], filter = []) {
    let query = {
      order: sort,
    };

    if (filter.length !== 0) query["where"] = WhereFilters(filter);

    // ✅ Fetch both filtered list and total count
    let { count, rows } = await RaffleDetails.findAndCountAll(query);
    return { list: rows, total: count };
  }

  async Edit(_data) {
    let count = await RaffleDetails.count({ where: { id: _data.id } });
    if (count < 0) throw new Error("User Not found");
    const id = _data.id;
    delete _data.id;

    await RaffleDetails.update(_data, { where: { id }, individualHooks: true });

    return id;
  }
  // async Delete(_data) {
  //   let count = await RaffleDetails.count({ where: { id: _data.id } });
  //   if (count < 0) throw new Error("User Not found");
  //   const id = _data.id;
  //   delete _data.id;

  //   await RaffleDetails.destroy({ where: { id }, individualHooks: true });

  //   return id;
  // }
}
export default new Raffle_class();
