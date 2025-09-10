import moment from "moment";
import ec from "../lib/Export.class.js";
export const exportDataController = async (req, res) => {
  try {
    const { type, dr, filter } = req.body;
    console.log(type);
    const dr_ = [moment(dr[0]).startOf("day"), moment(dr[0]).endOf("day")] || [
      moment().startOf("year"),
      moment().endOf("year"),
    ];
    let _r = await ec.getData(type, dr_, filter);
    res.send({ file: _r });
  } catch (err) {
    console.log(err);
    throw err;
  }
};
