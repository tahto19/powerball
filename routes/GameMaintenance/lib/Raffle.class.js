import RaffleDetails from "../../../models/RaffleDetails.model.js";
import RafflePrize from "../../../models/RafflePrize.model.js";
import RaffleSchedule from "../../../models/RaffleSchedule.model.js";
import Files from "../../../models/Files.model.js";
import PrizeList from "../../../models/PrizeList.model.js";

import { WhereFilters } from "../../../util/util.js";

/**
 * Filter structure:
 * [{filter:"", field:"", type:""}]
 */

class Raffle_class {
  constructor() {}

  async Insert(_data, newPrizeList) {
    delete _data.id;

    if (!_data.fileInfo) {
    }

    _data.file_id = _data.fileInfo ? _data.fileInfo.id : null;
    delete _data.fileInfo;

    const createRaffleDetails = await RaffleDetails.create(_data);

    //======== Create Raffle schedule data ===============//
    const scheduleData = {
      raffle_id: createRaffleDetails.id,
      schedule_date: _data.starting_date,
      status: _data.active ? 2 : 3,
    };

    const createRaffleSchedule = await RaffleSchedule.create(scheduleData);

    //======== Create Raffle prize data ===============//

    for (const x of newPrizeList) {
      const prizeData = {
        raffle_schedule_id: createRaffleSchedule.id,
        prize_id: x.id,
        amount: x.value,
      };

      try {
        const createRafflePrizeInfo = await RafflePrize.create(prizeData);
      } catch (error) {
        console.error("Error creating raffle prize:", error);
        throw new Error("Failed to create prize info");
      }
    }

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
      include: [
        {
          model: RaffleSchedule,
          order: [["id", "DESC"]],
          as: "raffleSchedule",
          attributes: ["id"],
          include: [
            {
              model: RafflePrize,
              order: [["id", "DESC"]],
              as: "prizeInfo",
              attributes: ["id", "prize_id"],
              where: { status: 1 },
              required: false, // This ensures the RaffleSchedule is included even if there's no matching RafflePrize
            },
          ],
        },
        {
          model: Files,
          order: [["id", "DESC"]],
          as: "fileInfo",
          attributes: ["id", "name", "description"],
        },
      ],
    };

    if (filter.length !== 0) query["where"] = WhereFilters(filter);

    // ✅ Fetch both filtered list and total count
    let { count, rows } = await RaffleDetails.findAndCountAll(query);

    return { list: rows, total: count };
  }
  async FetchAll(sort = [["id", "ASC"]], filter = []) {
    let query = {
      order: sort,
      include: [
        {
          model: RaffleSchedule,
          order: [["id", "DESC"]],
          as: "raffleSchedule",
          include: [
            {
              model: RafflePrize,
              order: [["id", "DESC"]],
              as: "prizeInfo",
              where: { status: 1 },
              required: false, // This ensures the RaffleSchedule is included even if there's no matching RafflePrize
              include: [
                {
                  model: PrizeList,
                  required: false, // This ensures the RaffleSchedule is included even if there's no matching RafflePrize
                },
              ],
            },
          ],
        },
        {
          model: Files,
          order: [["id", "DESC"]],
          as: "fileInfo",
          attributes: ["id", "name", "description"],
        },
      ],
    };

    if (filter.length !== 0) query["where"] = WhereFilters(filter);

    // ✅ Fetch both filtered list and total count
    let { count, rows } = await RaffleDetails.findAndCountAll(query);
    return { list: rows, total: count };
  }

  async Edit(_data, newPrizeList) {
    let count = await RaffleDetails.count({ where: { id: _data.id } });
    if (count === 0) throw new Error("User Not found");
    const id = _data.id;
    delete _data.id;

    _data.file_id = _data.fileInfo ? _data.fileInfo.id : null;
    delete _data.fileInfo;

    await RaffleDetails.update(_data, { where: { id }, individualHooks: true });

    const prizeInfo = _data.raffleSchedule[0].prizeInfo;

    // Update prize info status to 2 if the old prize info is not present in the new prize info.
    for (const item of prizeInfo) {
      const filter = newPrizeList.filter((x) => x.id === item.prize_id);
      const prizeInfo_id = item.id;

      if (filter.length === 0) {
        const prizeData = {
          status: 2,
        };

        try {
          await RafflePrize.update(prizeData, {
            where: { id: prizeInfo_id },
            individualHooks: true,
          });
        } catch (error) {
          console.error("Error updating prize info:", error);
          throw new Error("Failed to update prize info");
        }
      }
    }

    // Add new data in PrizeInfo Table
    for (const item of newPrizeList) {
      const filter = prizeInfo.filter((x) => x.prize_id === item.id);
      if (filter.length === 0) {
        const prizeData = {
          raffle_schedule_id: _data.raffleSchedule[0].id,
          prize_id: item.id,
          amount: item.value,
        };

        try {
          const createRafflePrizeInfo = await RafflePrize.create(prizeData);
        } catch (error) {
          console.error("Error creating raffle prize:", error);
          throw new Error("Failed to create prize info");
        }
      }
    }

    return id;
  }

  async _2ndChanceFetchAll(sort = [["id", "ASC"]], filter = []) {
    let query = {
      order: sort,
      include: [
        {
          model: RaffleSchedule,
          order: [["id", "DESC"]],
          as: "raffleSchedule",
          attributes: ["id", "schedule_date"],
          limit: 1, // Tries to get only the latest RaffleSchedule
        },
        {
          model: Files,
          order: [["id", "DESC"]],
          as: "fileInfo",
          attributes: ["id", "name", "description"],
        },
      ],
    };

    if (filter.length !== 0) query["where"] = WhereFilters(filter);

    // ✅ Fetch both filtered list and total count
    let { count, rows } = await RaffleDetails.findAndCountAll(query);
    return { list: rows };
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
