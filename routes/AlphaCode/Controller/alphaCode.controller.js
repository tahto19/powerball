import { cSend } from "../../../util/util.js";
import acc from "../lib/alphaCode.class.js";

export const getDataController = async (req, res) => {
  try {
    const { limit, offset, sort, filter } = req.body;
    console.log(req.body);
    const fetch = await acc.FetchAndCount(offset, limit, sort, filter);
    res.send(fetch);
  } catch (err) {
    throw err;
  }
};
export const insertDataController = async (req, res) => {
  try {
    let a = await acc.FetchOne([
      { field: "name", filter: req.body.name, type: "string" },
    ]);

    if (a) throw new Error("ErrorCode x77");
    const insert = await acc.Insert(req.body);
    res.send(cSend(insert));
  } catch (err) {
    throw err;
  }
};
export const putDataController = async (req, res) => {
  try {
    // let a = await acc.FetchOne([
    //   { field: "name", filter: req.body.name, type: "string" },
    // ]);

    // if (a) throw new Error("ErrorCode x77");
    // const insert = await acc.Insert(req.body);
    let filter = [{ field: "id", type: "number", filter: req.body.id }];

    const insert = await acc.Update(filter, req.body);
    console.log(insert);
    res.send(cSend(req.body));
  } catch (err) {
    throw err;
  }
};
export const getAllController = async (req, res) => {
  try {
    let fetchAll = await acc.FetchAll();
    res.send(cSend(fetchAll));
  } catch (err) {
    throw err;
  }
};
