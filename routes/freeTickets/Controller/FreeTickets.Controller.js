import Users from "../../../models/Users.model.js";
import fc from "../lib/FreeTickets.class.js";
import { col } from "sequelize";

export const getDataController = async (req, res) => {
  try {
    const { filter, offset, sort, limit } = req.body;
    const { count, list } = await fc.findAndCountPagination({
      filter,
      offset,
      sort,
      limit,
      include: [
        { model: Users, attributes: ["firstname", "lastname", "fullname"] },
      ],
    });

    res.send({
      count,
      list: list.map((v) => {
        return { ...v, ...{ fullname: v.User.fullname } };
      }),
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const postDataController = async (req, res) => {
  try {
    const { startDate, endDate, value, fixed } = req.body;
    const user = req.user_id;
    const date_range = [startDate, endDate];
    await fc.Insert({
      date_range,
      value,
      fixed,
      user,
    });
    res.send({ message: "success" });
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const patchDataController = async (req, res) => {
  try {
    console.log(req.body, "here");
    const { startDate, endDate, value, id } = req.body;

    const date_range = [startDate, endDate];
    await fc.patch({
      date_range,
      value,
      id,
    });

    res.send({ message: "success" });
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const testData = async (req, res) => {
  try {
    let a = await fc.findDate_range();
    res.send({ message: a });
  } catch (err) {
    throw err;
  }
};
