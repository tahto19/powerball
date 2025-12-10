import cc from "../lib/Cron.class.js";
import { cSend } from "../../../util/util.js";
import moment from "moment";

export const dailyRaffleController = async (req, res) => {
  try {
    const filter = [
      { field: "schedule_type", filter: 1, type: "number" },
      { field: "active", filter: true, type: "boolean" },
    ];
    const sort = [["id", "ASC"]];
    const raffleList = await cc.FetchRaffleDetails(sort, filter);

    let raffleSchedList = [];
    for (const x of raffleList.list) {
      try {
        const raffleSched = await cc.CreateRaffleSched(x);
        raffleSchedList.push(raffleSched);
      } catch (error) {
        console.error("Error creating raffle schedule:", error);
        throw new Error("Failed to raffle schedule");
      }
    }
    console.log(JSON.stringify(raffleSchedList));
    res.send(cSend(raffleList));
  } catch (error) {
    throw error;
  }
};

export const checkActiveRaffles = async (req, res) => {
  // update active raffles to inactive if end date is after current date
  try {
    const filter = [{ field: "active", filter: 1, type: "boolean" }];
    const sort = [["id", "ASC"]];

    let raffleList = await cc.FetchRaffleDetails(sort, filter);

    const now = moment();
    let raffleIdList = raffleList.list
      .filter((x) => now.isAfter(moment(x.end_date)))
      .map((x) => x.id);
    if (raffleIdList.length > 0) {
      await cc.EditRafflesActiveStatus(raffleIdList);
    }

    // let raffleIdList = [];
    // for (const x of raffleList.list) {
    //   try {
    //     const end_date = moment(x.end_date);
    //     if(now.isAfter(end_date)){
    //       raffleIdList.push(x.id)
    //     }
    //   } catch (error) {
    //     console.error("Error creating raffle schedule:", error);
    //     throw new Error("Failed to raffle schedule");
    //   }
    // }
    // const updateRaffles = await cc.EditRafflesActiveStatus(raffleIdList);

    console.log(JSON.stringify(raffleIdList));
    res.send(cSend(raffleList));
  } catch (error) {
    throw error;
  }
};

export const autoActiveRaffleController = async (req, res) => {
  /**
   * Auto activation of raffle, bsaed on start date
   */
  const server_date = new Date(); // interprets as UTC

  // parse as UTC
  const utcMoment = moment.utc(server_date);

  // convert to local timezone (Philippines / UTC+8)
  const localTime = utcMoment.tz("Asia/Manila").format("YYYY-MM-DD");

  console.log(server_date);
  console.log(localTime);

  const filter = [
    { type: "date", field: "starting_date", filter: { start: localTime } },
    { type: "number", field: "active", filter: 0 },
  ];
  const list = await cc.Fetch2([["id", "ASC"]], filter);
  console.log("=======", list);

  if (list.list.length > 0) {
    const _x = list.list.map((x) => x.id);
    const filter2 = [{ type: "array", field: "id", filter: _x }];

    const data = {
      active: 1,
    };
    const list2 = await cc.Edit(data, filter2);
    console.log(list2);
  }
};
