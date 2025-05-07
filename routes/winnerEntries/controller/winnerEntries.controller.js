import wc from "../lib/WinnerEntries.class.js";
export const getDataController = async (req, res) => {
  try {
    const { raffle_schedule_id } = req.body;
    const _r = await wc.FetchAll([["id", "DESC"]], []);

    res.send(_r);
  } catch (err) {
    throw err;
  }
};

export const getWinnersTableController = async (req, res) => {
  try {
    const { limit, sort, where, filter, url, offset } = req.body;
    const _r = await wc.FetchWithInclude(req.body);
    console.log(_r);
    res.send(_r);
  } catch (err) {
    console.log(err);
    throw err;
  }
};
