import ec from "../lib/Export.class.js";
export const exportDataController = async (req, res) => {
  try {
    const { type, dr, filter } = req.body;
    console.log(req.body);
    let _r = await ec.getData(type, dr, filter);
    res.send({ file: _r });
  } catch (err) {
    console.log(err);
    throw err;
  }
};
