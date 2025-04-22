import td from "../../Ticket/lib/Ticket.class.js";
import th from "../lib/raffleHistory.class.js";
export const insertRaffleHistoryController = async (req, res) => {
  try {
    const { raffle_id, entries } = req.body;
    console.log(raffle_id);
    // first check if the entries are not more than the total entries available
    let r = await td.getTotalEntries([
      { field: "user_id", type: "number", filter: req.user_id },
      { field: "active", type: "boolean", filter: true },
    ]);
    console.log(r);
    if (!!!r) throw new Error("ERRORCODE x268");
    let totalEntries = r[0].toJSON();
    let totalEntriesRemaining =
      totalEntries.totalEntries - totalEntries.totalUsedEntries;
    if (totalEntriesRemaining < entries) throw new Error("ERRORCode x369");
    var getEntries = entries;
    const getUserTicketDetails = await td.FetchAll(null, [
      { field: "user_id", type: "number", filter: req.user_id },
      { field: "active", type: "boolean", filter: true },
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
