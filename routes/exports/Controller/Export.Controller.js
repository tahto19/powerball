import ec from "../lib/Export.class.js";
export const exportDataController = async (req, res) => {
  try {
    const { type, date_range, filter } = req.body;

    let _r = await ec.getData(type, date_range, filter);
    res.send({ file: _r });
  } catch (err) {
    console.log(err);
    throw err;
  }
};
