import { cSend } from "../../../util/util.js";
import plc from "../lib/PrizeList.class.js";

export const insertController = async (req, res) => {
  if (!req.body) throw new Error("ErrorCODE X2");
  const a = await plc.Insert(req.body);
  res.send(cSend(a));
};

export const getController = async (req, res) => {
  const { limit, offset, sort, filter } = req.body;
  let parsedSort = JSON.parse(sort);
  let parsedFilter = JSON.parse(filter);

  const new_offset = limit * offset; // Calculate offset
  parsedSort = parsedSort.length > 0 ? parsedSort : [["id", "ASC"]];
  //   if (!limit || !offset) throw new Error("limit or offset is required");
  let a = await plc.Fetch(new_offset, limit, parsedSort, parsedFilter);
  // let b = a.list;

  res.send(cSend(a));
};

export const getControllerAll = async (req, res) => {
  const { sort, filter } = req.body;
  let parsedSort = !sort ? [["id", "DESC"]] : JSON.parse(sort);
  let parsedFilter = !filter ? [] : JSON.parse(filter);
  parsedSort = parsedSort.length > 0 ? parsedSort : [["id", "DESC"]];
  let a = await plc.FetchAll(parsedSort, parsedFilter);
  res.send(cSend(a));
};

export const updateController = async (req, res) => {
  if (!req.body) throw new Error("ErrorCODE X2");
  let a = await plc.Edit(req.body);
  res.send(cSend(a));
};
