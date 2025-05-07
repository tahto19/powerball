import cc from "../lib/Cron.class.js";
import { cSend } from "../../../util/util.js";

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
