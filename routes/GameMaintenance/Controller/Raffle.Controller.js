import moment from "moment";
import { cSend } from "../../../util/util.js";
import rc from "../lib/Raffle.class.js";
import { fn, col, literal } from "sequelize";

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

    /** Check End Date validation */
    const now = moment();
    const end_date = moment(formData.end_date);
    const starting_date = moment(formData.starting_date);
    if (starting_date.isSameOrAfter(end_date)) throw new Error("ErrorCODE x73");
    /** END Check */

    /** Check Draw Date validation */
    const draw_date = moment(formData.draw_date);
    // const starting_date = moment(formData.starting_date);
    // if (
    //   draw_date.isSameOrBefore(starting_date) ||
    //   draw_date.isSameOrAfter(end_date)
    // )
    if (draw_date.isSameOrBefore(end_date)) throw new Error("ErrorCODE x74");
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
  /** Check End Date validation */
  const now = moment();
  const end_date = moment(formData.end_date);
  const starting_date = moment(formData.starting_date);
  if (starting_date.isSameOrAfter(end_date)) throw new Error("ErrorCODE x73");
  /** END Check */

  /** Check Draw Date validation */
  const draw_date = moment(formData.draw_date);
  // const starting_date = moment(formData.starting_date);
  // if (
  //   draw_date.isSameOrBefore(starting_date) ||
  //   draw_date.isSameOrAfter(end_date)
  // )
  if (draw_date.isSameOrBefore(end_date)) throw new Error("ErrorCODE x74");

  let a = await rc.Edit(formData, newPrizeList);
  res.send(cSend(a));
};

export const get2ndChanceControllerAll_old = async (req, res) => {
  const { limit, offset, sort, filter, user_id } = req.body;
  let parsedSort = !sort ? [["id", "DESC"]] : JSON.parse(sort);
  let parsedFilter = !filter ? [] : JSON.parse(filter);

  parsedSort = [
    [literal(`CASE WHEN end_date > NOW() THEN 0 ELSE 1 END`), "ASC"],
  ];

  const new_offset = limit * offset; // Calculate offset

  let a = await rc._2ndChanceFetchAll(
    new_offset,
    limit,
    parsedSort,
    parsedFilter,
    req.user_id
  );
  res.send(cSend(a));
};

export const get2ndChanceControllerAll = async (req, res) => {
  const { limit, offset, sort, filter, user_id } = req.body;
  // let parsedSort = !sort ? [["id", "DESC"]] : JSON.parse(sort);
  let parsedFilter = !filter ? [] : JSON.parse(filter);

  const new_offset = limit * offset; // Calculate offset

  let a = await rc._2ndChanceFetchAll(
    new_offset,
    limit,
    parsedFilter,
    req.user_id
  );

  console.log("======", a);
  res.send(cSend(a));
};
