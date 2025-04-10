import { cSend } from "../../../util/util.js";
import rc from "../lib/Raffle.class.js";

export const insertController = async (req, res) => {
  try {
    if (!req.body) throw new Error("ErrorCODE X2");
    const { formData, newPrizeList } = req.body;

    /** Check Raffle ID */
    const { details } = formData;
    const findRaffle = await rc.FetchOne([
      { filter: details, field: "details", type: "string_eq" },
    ]);
    if (findRaffle !== null) throw new Error("ErrorCODE x71");
    /** END Check */

    const a = await rc.Insert(formData, newPrizeList);
    res.send(cSend(a));
  } catch (error) {
    throw error;
  }
};

export const getController = async (req, res) => {
  const { limit, offset, sort, filter } = req.body;
  let parsedSort = JSON.parse(sort);
  let parsedFilter = JSON.parse(filter);

  const new_offset = limit * offset; // Calculate offset
  parsedSort = parsedSort.length > 0 ? parsedSort : [["id", "ASC"]];
  let a = await rc.Fetch(new_offset, limit, parsedSort, parsedFilter);

  res.send(cSend(a));
};

export const getControllerAll = async (req, res) => {
  const { sort, filter } = req.body;
  let parsedSort = !sort ? [["id", "DESC"]] : JSON.parse(sort);
  let parsedFilter = !filter ? [] : JSON.parse(filter);
  parsedSort = parsedSort.length > 0 ? parsedSort : [["id", "DESC"]];
  let a = await rc.FetchAll(parsedSort, parsedFilter);
  res.send(cSend(a));
};

export const updateController = async (req, res) => {
  if (!req.body) throw new Error("ErrorCODE X2");
  const { formData, newPrizeList } = req.body;
  let a = await rc.Edit(formData, newPrizeList);
  res.send(cSend(a));
};
