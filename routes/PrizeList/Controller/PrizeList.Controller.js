import { cSend } from "../../../util/util.js";
import plc from "../lib/PrizeList.class.js";

export const insertController = async (req, res) => {
  if (!req.body) throw new Error("ErrorCODE X2");
  const a = await plc.Insert(req.body);
  res.send(cSend(a));
};

export const getController = async (req, res) => {
  const { limit, offset, sort } = req.query;
  let parsedSort = JSON.parse(sort);

  const new_offset = limit * offset; // Calculate offset
  parsedSort = parsedSort.length > 0 ? parsedSort : [["id", "ASC"]];
  //   if (!limit || !offset) throw new Error("limit or offset is required");
  console.log(">>>>>>>>>>>>>>>>>>>", parsedSort);
  let a = await plc.Fetch(new_offset, limit, parsedSort);
  // let b = a.list;

  res.send(cSend(a));
};
