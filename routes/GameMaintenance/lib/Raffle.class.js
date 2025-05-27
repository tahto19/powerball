import RaffleDetails from "../../../models/RaffleDetails.model.js";
import RafflePrize from "../../../models/RafflePrize.model.js";
import RaffleSchedule from "../../../models/RaffleSchedule.model.js";
import Files from "../../../models/Files.model.js";
import PrizeList from "../../../models/PrizeList.model.js";
import TicketHistory from "../../../models/TicketHistory.model.js";
import TicketDetails from "../../../models/TicketDetails.model.js";

import { WhereFilters } from "../../../util/util.js";
import { fn, col } from "sequelize";

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
          separate: true,
          order: [["id", "DESC"]],
          as: "raffleSchedule",
          // attributes: ["id"],
          include: [
            {
              model: RafflePrize,
              separate: true,
              order: [["id", "DESC"]],
              as: "prizeInfo",
              // attributes: ["id", "prize_id", "type", "name"],
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
  async FetchAll(sort = [["id", "ASC"]], filter = []) {
    let query = {
      order: sort,
      include: [
        {
          model: RaffleSchedule,
          as: "raffleSchedule",
          separate: true,
          limit: 1,
          order: [["id", "DESC"]],
          include: [
            {
              model: RafflePrize,
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
      // order: [
      //   [
      //     { model: RaffleSchedule, as: "raffleSchedule", limit: 1 },
      //     { model: RafflePrize, as: "prizeInfo" },
      //     "id",
      //     "DESC",
      //   ],
      // ],
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

  async _2ndChanceFetchAll(
    offset = 0,
    limit = 10,
    sort = [["id", "ASC"]],
    filter = [],
    user_id
  ) {
    let query = {
      limit: parseInt(limit),
      offset: parseInt(offset),
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

    // 2. Collect raffleSchedule IDs
    const scheduleIds = rows
      .map((x) => x.raffleSchedule[0]?.id)
      .filter(Boolean);

    // 3. Query all TicketHistory records with TicketDetails included
    const allTickets = await TicketHistory.findAll({
      where: { raffle_id: scheduleIds },
      include: [
        {
          model: TicketDetails,
          required: false, // ensures no exclusion
        },
      ],
    });

    // 4. Build maps
    const totalEntryMap = {};
    const userEntryMap = {};

    for (const ticket of allTickets) {
      const id = ticket.raffle_id;
      totalEntryMap[id] = (totalEntryMap[id] || 0) + 1;

      // if it includes ticket_detail with matching user_id
      if (ticket.ticket_detail && ticket.ticket_detail.user_id === user_id) {
        userEntryMap[id] = (userEntryMap[id] || 0) + 1;
      }
    }

    // 5. Merge into response
    const new_rows = rows.map((x) => {
      const raffleId = x.raffleSchedule[0]?.id;
      return {
        ...x.toJSON(),
        totalEntries: totalEntryMap[raffleId] || 0,
        yourEntries: userEntryMap[raffleId] || 0,
      };
    });

    return { list: new_rows };
  }
  // async Delete(_data) {
  //   let count = await RaffleDetails.count({ where: { id: _data.id } });
  //   if (count < 0) throw new Error("User Not found");
  //   const id = _data.id;
  //   delete _data.id;

  //   await RaffleDetails.destroy({ where: { id }, individualHooks: true });

  //   return id;
  // }
  async getRaffleSchedule(filter = []) {
    let query = { include: [{ model: RaffleDetails, as: "raffleDetails" }] };
    if (filter.length !== 0) query["where"] = WhereFilters(filter);
    let r = await RaffleSchedule.findOne(query);

    return !r ? [] : r.toJSON();
  }
}
export default new Raffle_class();
