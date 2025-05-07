import wc from "../lib/WinnerEntries.class";
export const getDataController = async (req, res) => {
  try {
    const { raffle_schedule_id } = req.body;
    const _r = await wc.FetchAll([["id", "DESC"]], []);

    res.send(_r);
  } catch (err) {
    throw err;
  }
};
