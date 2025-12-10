import RaffleDetails from "../../../models/RaffleDetails.model.js";
import RaffleSchedule from "../../../models/RaffleSchedule.model.js";
import RafflePrize from "../../../models/RafflePrize.model.js";
import moment from "moment";
import { WhereFilters } from "../../../util/util.js";

class Cron_class {
  constructor() {}

  async FetchRaffleDetails(sort = [["id", "ASC"]], filter = []) {
    // let RafflePrizeDateFilter =
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
            },
          ],
        },
      ],
    };

    if (filter.length !== 0) query["where"] = WhereFilters(filter);

    // ✅ Fetch both filtered list and total count
    let { count, rows } = await RaffleDetails.findAndCountAll({
      ...query,
      distinct: true,
    });

    return { list: rows, total: count };
  }

  async EditRafflesActiveStatus(_ids) {
    await RaffleDetails.update(
      { active: false },
      { where: { id: _ids }, individualHooks: true }
    );
  }

  async CreateRaffleSched(_data) {
    //======== Create Raffle schedule data ===============//
    const old_schedule_date = _data.raffleSchedule[0].schedule_date;
    // Convert Date object to ISO string
    const old_schedule_date_str = moment(old_schedule_date).toISOString();
    const getTime = old_schedule_date_str.split("T")[1];
    const today = moment().format("YYYY-MM-DD");
    const new_schedule_date = today + "T" + getTime;

    const scheduleData = {
      raffle_id: _data.id,
      schedule_date: new_schedule_date,
      status: 2,
    };
    const createRaffleSchedule = await RaffleSchedule.create(scheduleData);

    //======== Create Raffle prize data ===============//

    for (const x of _data.raffleSchedule[0].prizeInfo) {
      const prizeData = {
        raffle_schedule_id: createRaffleSchedule.id,
        prize_id: x.prize_id,
        amount: x.amount,
      };

      try {
        const createRafflePrizeInfo = await RafflePrize.create(prizeData);
      } catch (error) {
        console.error("Error creating raffle prize:", error);
        throw new Error("Failed to create prize info");
      }
    }

    return createRaffleSchedule.id;
  }

  async Fetch2(sort = [["id", "ASC"]], filter = []) {
    let query = {
      order: sort,
      attributes: ["id", "createdAt"],
    };

    if (filter.length !== 0) query["where"] = WhereFilters(filter);

    // ✅ Fetch both filtered list and total count
    let { count, rows } = await RaffleDetails.findAndCountAll(query);

    console.log(
      "Data size:",
      Buffer.byteLength(JSON.stringify(rows)) / 1024 / 1024,
      "MB"
    );

    return { list: JSON.parse(JSON.stringify(rows)), total: count };
  }

  async Edit(_data, filter) {
    try {
      let query = {
        individualHooks: true,
      };

      if (filter.length !== 0) query["where"] = WhereFilters(filter);
      await RaffleDetails.update(_data, query);

      return true;
    } catch (err) {
      throw err;
    }
  }
}

export default new Cron_class();
