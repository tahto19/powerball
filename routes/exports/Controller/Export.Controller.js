import moment from "moment";
import ec from "../lib/Export.class.js";
export const exportDataController = async (req, res) => {
  try {
    const { type, dr, filter } = req.body;

    const dr_ = dr
      ? [
          new Date(moment(dr[0]).startOf("day").toISOString()),
          new Date(moment(dr[1]).add(2, "day").startOf("day").toISOString()),
        ]
      : [
          new Date(moment().startOf("year").toISOString()),
          new Date(moment().endOf("year").toISOString()),
        ];
    const dr_v2 = dr
      ? [
          moment(dr[0]).startOf("day").format("YYYY-MM-DD HH:mm:ss"),
          moment(dr[1]).add(2, "day").format("YYYY-MM-DD HH:mm:ss"),
        ]
      : [
          moment().startOf("year").format("YYYY-MM-DD HH:mm:ss"),
          moment().endOf("year").format("YYYY-MM-DD HH:mm:ss"),
        ];

    let dr__ = type === 14 ? dr_v2 : dr_;

    let _r = await ec.getData(type, dr_v2, filter, req, res);
    // if (type !== 14) res.send({ file: _r });
  } catch (err) {
    console.log(err);
    throw err;
  }
};
