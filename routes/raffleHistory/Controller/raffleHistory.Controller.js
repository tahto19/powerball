import RaffleClass from "../../GameMaintenance/lib/Raffle.class.js";
import td from "../../Ticket/lib/Ticket.class.js";
import th from "../lib/raffleHistory.class.js";
export const insertRaffleHistoryController = async (req, res) => {
  try {
    const { raffle_id, entries } = req.body;
    if (entries === "") throw new Error("ERRORCode X921");
    const getRaffleInfo = await RaffleClass.getRaffleSchedule([
      { field: "id", filter: raffle_id, type: "number" },
    ]);
    let getAlphaCode = getRaffleInfo.raffleDetails.alpha_code;

    if (!entries || entries === "") throw new Error("ErrorCode X921");
    // first check if the entries are not more than the total entries available

    let r = await td.getTotalEntries([
      { field: "user_id", type: "number", filter: req.user_id },
      { field: "active", type: "boolean", filter: true },
      { field: "alpha_code", type: "string_eq", filter: getAlphaCode },
    ]);

    if (!!!r || r.length === 0) throw new Error("ERRORCODE x268");
    let totalEntries = r[0].toJSON();
    let totalEntriesRemaining =
      totalEntries.totalEntries - totalEntries.totalUsedEntries;
    if (totalEntriesRemaining < entries) throw new Error("ERRORCode x369");
    var getEntries = entries;
    const getUserTicketDetails = await td.FetchAll(null, [
      { field: "user_id", type: "number", filter: req.user_id },
      { field: "active", type: "boolean", filter: true },
      { field: "alpha_code", type: "string_eq", filter: getAlphaCode },
    ]);

    for (let val of getUserTicketDetails.list) {
      let v = val.toJSON();
      let getEntriesAvailable = v.entries - v.entries_used;
      let entries_using =
        getEntriesAvailable - getEntries <= 0
          ? getEntriesAvailable
          : getEntriesAvailable - getEntries;
      //   let remainingEntries = getEntriesAvailable - getEntries;
      getEntries = getEntries - entries_using;
      //   break if the entries is 0
      if (getEntries < 0) {
        break;
      }
      v.active = entries_using + v.entries_used < getEntriesAvailable;
      v.entries_used = entries_using + v.entries_used;

      //   console.log(v);
      // insert first to the ticket history
      for (let i = 0; i < entries_using; i++) {
        // inserting data per entry
        await th.Insert({ raffle_id, ticket_id: v.id });
      }
      //   update the ticket details
      await td.Edit(v);
    }
    res.send(getUserTicketDetails);
  } catch (err) {
    throw err;
  }
};
export const getRaffleHistoryController = async (req, res) => {
  try {
    const { raffle_id } = req.body;
    let query = "a";
  } catch (err) {
    throw err;
  }
};
export const getRaffleEntriesController = async (req, res) => {
  try {
    const { filter, offset, limit, sort } = req.body;

    if (req.url.includes("myEntries")) {
      filter.push({
        field: "$ticket_detail.user_id$",
        filter: req.user_id,
        type: "number",
      });
    }
    let _r = await th.FetchWithInclude(offset, limit, sort, filter);

    res.send(_r);
  } catch (err) {
    console.log(err);
    throw err;
  }
};
