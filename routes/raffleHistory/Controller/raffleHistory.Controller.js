import RaffleClass from "../../GameMaintenance/lib/Raffle.class.js";
import winnerClass from "../../winnerEntries/lib/WinnerEntries.class.js";
import td from "../../Ticket/lib/Ticket.class.js";
import th from "../lib/raffleHistory.class.js";
export const insertRaffleHistoryController = async (req, res) => {
  try {
    const { entriesDetails, alphaCodeChosen } = req.body;
    const { raffle_id, entries } = entriesDetails;
    let getAlphaCode_chosen = alphaCodeChosen.map((v) => v.alpha_code);
    for (let aac of alphaCodeChosen) {
      getAlphaCode_chosen = aac.alpha_code;
      if (aac.entriesInput === "") throw new Error("ERRORCode X921");
      const getRaffleInfo = await RaffleClass.getRaffleSchedule([
        { field: "id", filter: raffle_id, type: "number" },
      ]);

      // first check if the raffle is already drawn
      if (getRaffleInfo.length === 0) throw new Error("ErrorCode x999");
      let getWinners = await winnerClass.FetchWithInclude({
        limit: 5,
        sort: [],
        where: {},
        filter: [
          {
            field: "$ticket_history.raffle_id$",
            filter: raffle_id,
            type: "string",
          },
        ],
        offset: 0,
      });
      // if (getWinners.count > 0) throw new Error("ErrorCode x663");

      let getAlphaCode = getRaffleInfo.raffleDetails.alpha_code;

      if (!aac.entriesInput || aac.entriesInput === "")
        throw new Error("ErrorCode X921");

      // double check if array chosen is include
      let hasCommonElement = getAlphaCode.filter((vv) => {
        return getAlphaCode_chosen.includes(vv);
      });

      // first check if the entries are not more than the total entries available

      let r = await td.getTotalEntries([
        { field: "user_id", type: "number", filter: req.user_id },
        { field: "active", type: "boolean", filter: true },
        { field: "alpha_code", type: "array", filter: hasCommonElement },
      ]);

      if (!!!r || r.length === 0) throw new Error("ERRORCODE x268");
      if (r[0].error) throw new Error("ERRORCODE x268");
      let totalEntries = r[0].toJSON();

      let totalEntriesRemaining =
        totalEntries.totalEntries - totalEntries.totalUsedEntries;
      if (totalEntriesRemaining < aac.entriesInput)
        throw new Error("ERRORCode x369");
      var getEntries = aac.entriesInput;
      const getUserTicketDetails = await td.FetchAll(null, [
        { field: "user_id", type: "number", filter: req.user_id },
        { field: "active", type: "boolean", filter: true },
        { field: "alpha_code", type: "array", filter: hasCommonElement },
      ]);

      for (let val of getUserTicketDetails.list) {
        let v = val.toJSON();
        let remainingEntriesInOneTicket = v.entries - v.entries_used;
        let getRemainingEntriesIfEntryIsAdded =
          remainingEntriesInOneTicket - getEntries <= 0
            ? 0
            : remainingEntriesInOneTicket - getEntries;
        let toAddInTicketHistory =
          remainingEntriesInOneTicket - getRemainingEntriesIfEntryIsAdded;

        for (let i = 0; i < toAddInTicketHistory; i++) {
          // inserting data per entry
          await th.Insert({ raffle_id, ticket_id: v.id });

          let b = i + 1;
        }

        getEntries = getEntries - toAddInTicketHistory;

        await td.Edit({
          id: v.id,
          active: getRemainingEntriesIfEntryIsAdded > 0,
          entries_used:
            parseInt(v.entries_used) + parseInt(toAddInTicketHistory),
        });
        if (getEntries <= 0) {
          break;
        }
        // getEntries = getEntries
      }
    }

    res.send(req.body);
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
export const getRaffleEntriesInScheduleController = async (req, res) => {
  try {
    const { id, limit, sort, filter, offset } = req.body;
    let filters = filter;
    if (id) {
      filters.push({
        field: "$Raffle_Schedule.id$",
        filter: id,
        type: "number",
      });
    }

    const _r = await th.FetchWithInclude(offset, limit, sort, filters);
    let reEditList = _r.list.map((v) => {
      return {
        ticket_history_generate: v.ticket_history_generate,
        createdAt: v.createdAt,
        ticketCode: v.ticket_detail.ticket_code,
      };
    });

    res.send({ count: _r.count, list: reEditList });
  } catch (err) {
    throw err;
  }
};
