import moment from "moment";
import ec from "../lib/Export.class.js";
export const exportDataController = async (req, res) => {
  try {
    const { type, dr, filter } = req.body;
    console.log(dr);
    const dr_ = dr
      ? [
          new Date(moment(dr[0]).startOf("day").toISOString()),
          new Date(moment(dr[1]).endOf("day").toISOString()),
        ]
      : [
          new Date(moment().startOf("year").toISOString()),
          new Date(moment().endOf("year").toISOString()),
        ];

    let _r = await ec.getData(type, dr_, filter);
    res.send({ file: _r });
  } catch (err) {
    console.log(err);
    throw err;
  }
};
