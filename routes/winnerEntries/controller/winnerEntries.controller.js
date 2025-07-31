import wc from "../lib/WinnerEntries.class.js";
export const getDataController = async (req, res) => {
  try {
    const _r = await wc.FetchWithInclude(req.body);

    res.send(_r);
  } catch (err) {
    throw err;
  }
};

export const getWinnersTableController = async (req, res) => {
  try {
    const { limit, sort, where, filter, url, offset } = req.body;
    if (req.url.includes("myWinners")) {
      filter.push({
        field: "$ticket_detail.user_id$",
        filter: req.user_id,
        type: "number",
      });
    }
    const _r = await wc.FetchWithInclude(req.body);
    console.log(_r.list);
    res.send(_r);
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const getWinnersTablePerScheduleController = async (req, res) => {
  try {
    const { id, limit, offset, filter, sort } = req.body;

    const _r = await wc.getWinnersPerSchedule(id);
    res.send(_r);
  } catch (err) {
    throw err;
  }
};
export const getOnlyTotalPerRaffleScheduleController = async (req, res) => {
  try {
    const { id } = req.body;
    const _r = await wc.getWinnersPerSchedule(id);
    const toReturn = [];
    _r.list.forEach((v) => {
      let prizeType = v.Raffle_Prize.Prize_List;
      let ticketHistory = v.ticket_history;
      let findIndex = toReturn.findIndex((v) => prizeType.id === v.id);
      if (findIndex === -1)
        toReturn.push({
          ticketsWinner: [ticketHistory],
          ...{
            prizeName: prizeType.name,
            prizeType: prizeType.type,
            prize: prizeType.value,
          },
        });
      else {
        console.log(findIndex);
        toReturn[findIndex].ticketsWinner.push({
          ticketHistory,
        });
      }
    });
    res.send(
      toReturn.map((v) => {
        v["totalWinners"] = v.ticketsWinner.length;
        return v;
      })
    );
  } catch (err) {
    throw err;
  }
};
