import moment from "moment";
import ec from "../lib/Export.class.js";
export const exportDataController = async (req, res) => {
  try {
    const { type, dr, filter } = req.body;

    const dr_ = dr
      ? [
          moment(dr[0]).startOf("day").toISOString(),
          moment(dr[1]).endOf("day").toISOString(),
        ]
      : [
          moment().startOf("year").toISOString(),
          moment().endOf("year").toISOString(),
        ];

    let _r = await ec.getData(type, dr_, filter);
    res.send({ file: _r });
  } catch (err) {
    console.log(err);
    throw err;
  }
};
