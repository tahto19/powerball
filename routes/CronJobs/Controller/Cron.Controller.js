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
